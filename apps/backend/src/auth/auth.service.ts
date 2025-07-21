import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto, NewUserDto, AuthResponseDto } from './auth.dto';
import { parseDate } from 'src/lib/helpers/helperFunctions';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(dto: RegisterDto) {    
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingUser) throw new UnauthorizedException('Email already registered');

    const hash = await bcrypt.hash(dto.password, 10);
  
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        name: dto.name,
        surname: dto.surname,
        dateOfBirth: parseDate(dto.dateOfBirth),
        phoneNo: dto.phoneNo,
        provider: 'email',
      }
    });

     let authResponse: AuthResponseDto;
     try {
       authResponse = this.generateAuthResponse(user);
       if (!authResponse.accessToken) throw new Error('Token generation failed');
     } catch (err) {
       // Throwing here will rollback the transaction
       throw new UnauthorizedException('Registration failed: ' + err.message);
     }
 
     return authResponse;
  }

  async login(dto: LoginDto) {    
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const match = await bcrypt.compare(dto.password, user.password);    
    if (!match) throw new UnauthorizedException('Invalid credentials');

    return this.generateAuthResponse(user);
  }

  async oauthLogin({ email, name, phoneNo, provider }: any) {
    const user = await this.prisma.user.findUnique({ where: { email } });
  
    if (user) {
      return this.generateAuthResponse(user);
    }
  
    const newUser = await this.prisma.user.create({
      data: {
        email,
        name,
        surname: '',
        dateOfBirth: new Date('2000-01-01'), // default
        password: null,
        phoneNo,
        provider,
      },
    });
  
    return this.generateAuthResponse(newUser);
  }
  
  private generateToken(userId: string, email: string) {
    const payload = { sub: userId, email };
    return {
      accessToken: this.jwtService.sign(payload),
      expiresIn: 3600, 
    };
  }

  private generateAuthResponse(user: NewUserDto): AuthResponseDto {
    const token = this.generateToken(user.id, user.email);
    return {
      ...token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        surname: user.surname,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    };
  }
}
