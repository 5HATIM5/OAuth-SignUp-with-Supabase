import { Body, Controller, Post, Get, HttpCode, HttpStatus } from '@nestjs/common';

import { RegisterDto, LoginDto, OAuthLoginDto, ForgotPasswordDto, ResetPasswordDto } from '@auth/auth.dto';
import { AuthService } from '@auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('oauth-login')
  @HttpCode(HttpStatus.OK)
  async oauthLogin(@Body() oauthLoginDto: OAuthLoginDto) {
    return this.authService.oauthLogin(oauthLoginDto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
