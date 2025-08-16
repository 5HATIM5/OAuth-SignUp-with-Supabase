import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

import { Provider } from '../../generated/prisma';
import { PrismaService } from '@prisma/prisma.service';
import { parseDate } from '@lib/helperFunctions/parseDate';
import {
  RegisterDto,
  LoginDto,
  AuthResponseDto,
  OAuthLoginDto,
  UserDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from '@auth/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    @InjectPinoLogger(AuthService.name) private readonly logger: PinoLogger,
  ) {}

  async register(dto: RegisterDto) {
    this.logger.info({ email: dto.email }, 'Register attempt');

    //check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { phoneNo: dto.phoneNo }],
      },
    });
    if (existingUser) {
      if (existingUser.email === dto.email) {
        this.logger.warn(
          { email: dto.email },
          'Registration failed: Email already registered',
        );
        throw new UnauthorizedException('Email already registered');
      }
      if (existingUser.phoneNo === dto.phoneNo) {
        this.logger.warn(
          { phoneNo: dto.phoneNo },
          'Registration failed: Phone number already registered',
        );
        throw new UnauthorizedException('Phone number already registered');
      }
    }

    const hash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        name: dto.name,
        surname: dto.surname,
        dateOfBirth: parseDate(dto.dateOfBirth),
        phoneNo: dto.phoneNo,
        provider: Provider.EMAIL,
      },
    });

    let authResponse: AuthResponseDto;
    try {
      authResponse = this.generateAuthResponse(user);
      if (!authResponse.accessToken) {
        this.logger.error('Token generation failed');
        throw new Error('Token generation failed');
      }
    } catch (err) {
      this.logger.error('Registration failed: ' + err.message);
      throw new UnauthorizedException('Registration failed: ' + err.message);
    }

    return authResponse;
  }

  async login(dto: LoginDto) {
    this.logger.info({ email: dto.email }, 'Login attempt');

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user || !user.password) {
      this.logger.warn(
        { email: dto.email },
        'Login failed: Invalid credentials',
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) {
      this.logger.warn(
        { email: dto.email },
        'Login failed: Invalid credentials',
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.info({ email: dto.email }, 'Login successful');
    return this.generateAuthResponse(user);
  }

  async oauthLogin(dto: OAuthLoginDto) {
    this.logger.info({ email: dto.email }, 'OAuth login attempt');

    const user = await this.prisma.oAuthUser.findUnique({
      where: { email: dto.email },
    });

    if (user) {
      this.logger.info({ email: dto.email }, 'OAuth login successful');
      return this.generateAuthResponse({
        id: user.id,
        email: user.email,
        name: user.fullName.split(' ')[0],
        surname: user.fullName.split(' ')[1],
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    }

    const newUser = await this.prisma.oAuthUser.create({
      data: {
        email: dto.email,
        fullName: dto.fullName,
        provider: dto.provider as Provider,
      },
    });

    return this.generateAuthResponse({
      id: newUser.id,
      email: newUser.email,
      name: newUser.fullName.split(' ')[0],
      surname: newUser.fullName.split(' ')[1],
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    });
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    this.logger.info({ email: dto.email }, 'Forgot password attempt');

    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (!user) {
        this.logger.warn(
          { email: dto.email },
          'Forgot password failed: User not found',
        );
        throw new UnauthorizedException('User not found');
      }

      this.logger.info({ email: dto.email, userId: user.id }, 'User found, sending reset link');
      
      await this.sendResetPasswordLink(user.id, dto.email);
      
      return { message: 'Password reset link sent to your email' };
    } catch (error) {
      this.logger.error({ 
        email: dto.email, 
        error: error.message, 
        stack: error.stack 
      }, 'Forgot password error');
      throw error;
    }
  }

  async resetPassword(dto: ResetPasswordDto) {
    this.logger.info('Password reset attempt');

    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token: dto.token },
    });

    if (!resetToken) {
      this.logger.warn('Password reset failed: Invalid token');
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (resetToken.used) {
      this.logger.warn('Password reset failed: Token already used');
      throw new BadRequestException('Reset token has already been used');
    }

    if (resetToken.expiresAt < new Date()) {
      this.logger.warn('Password reset failed: Token expired');
      throw new BadRequestException('Reset token has expired');
    }

    const user = await this.prisma.user.findUnique({
      where: { email: resetToken.email },
    });

    if (!user) {
      this.logger.warn('Password reset failed: User not found');
      throw new BadRequestException('User not found');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    // Update user password and mark token as used
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
    ]);

    this.logger.info({ email: user.email }, 'Password reset successful');

    return { message: 'Password reset successful' };
  }

  private async sendResetPasswordLink(
    userId: string,
    email: string,
  ): Promise<void> {
    try {
      this.logger.info({ email, userId }, 'Starting password reset link generation');
      
      // Generate a secure random token
      const token = this.generateToken(userId, email).accessToken;
      
      // Set expiration to 1 hour from now
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      this.logger.info({ email, token: token.substring(0, 8) + '...' }, 'Generated reset token');

      // Save the reset token to database
      await this.prisma.passwordResetToken.create({
        data: {
          email,
          token,
          expiresAt,
        },
      });

      this.logger.info({ email }, 'Reset token saved to database');

      // Create reset URL
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

      const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <title>Password Reset</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
              }
              .header {
                  background-color: #4CAF50;
                  color: white;
                  padding: 20px;
                  text-align: center;
                  border-radius: 5px 5px 0 0;
              }
              .content {
                  background-color: #f9f9f9;
                  padding: 20px;
                  border-radius: 0 0 5px 5px;
              }
              .button {
                  display: inline-block;
                  background-color: #4CAF50;
                  color: white;
                  padding: 12px 24px;
                  text-decoration: none;
                  border-radius: 4px;
                  margin: 20px 0;
              }
              .footer {
                  margin-top: 20px;
                  font-size: 12px;
                  color: #666;
                  text-align: center;
              }
          </style>
      </head>
      <body>
          <div class="header">
              <h1>Password Reset Request</h1>
          </div>
          <div class="content">
              <p>Hello,</p>
              <p>You have requested to reset your password. Click the button below to reset your password:</p>
              
              <a href="${resetUrl}" class="button">Reset Password</a>
              
              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p>${resetUrl}</p>
              
              <p><strong>This link will expire in 1 hour for security reasons.</strong></p>
              
              <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
              
              <p>Best regards,<br>Your Application Team</p>
          </div>
          <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
          </div>
      </body>
      </html>
    `;
      this.logger.info({ email }, 'Sending password reset email');

      await this.mailerService.sendMail({
        to: email,
        subject: 'Password Reset Request',
        text: htmlContent,
      });

      this.logger.info({ email }, 'Password reset email sent successfully');
    } catch (error) {
      this.logger.error({ 
        email, 
        userId, 
        error: error.message, 
        stack: error.stack 
      }, 'Error sending password reset link');
      throw error;
    }
  }

  private generateToken(userId: string, email: string) {
    const payload = { sub: userId, email };
    return {
      accessToken: this.jwtService.sign(payload),
      expiresIn: 3600,
    };
  }

  private generateAuthResponse(user: UserDto): AuthResponseDto {
    const token = this.generateToken(user.id, user.email);
    return {
      ...token,
      user: user,
    };
  }
}
