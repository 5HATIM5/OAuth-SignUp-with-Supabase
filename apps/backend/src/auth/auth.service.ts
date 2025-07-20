import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './auth.dto';
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
    
    const referralCode = Math.random().toString(36).substring(2, 8);

  
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        name: dto.name,
        surname: dto.surname,
        nickname: dto.nickname,
        dateOfBirth: parseDate(dto.dateOfBirth),
        referredBy: dto.referralCode || null,
        referralCode,
        role: 'seller',
        provider: 'email',
      }
    });

    console.log('User created successfully:', user.id);
    return this.generateAuthResponse(user);
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

  async oauthLogin({ email, name, nickname, provider }: any) {
    const user = await this.prisma.user.findUnique({ where: { email } });
  
    if (user) {
      return this.generateAuthResponse(user);
    }
  
    const newUser = await this.prisma.user.create({
      data: {
        email,
        name,
        surname: '',
        nickname,
        dateOfBirth: new Date('2000-01-01'), // default
        password: null,
        referralCode: Math.random().toString(36).substring(2, 8),
        role: 'seller',
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

  private generateAuthResponse(user: any) {
    const token = this.generateToken(user.id, user.email);
    return {
      ...token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        surname: user.surname,
        nickname: user.nickname,
        role: user.role,
      }
    };
  }
}
