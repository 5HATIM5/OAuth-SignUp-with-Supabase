import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot(), 
    AuthModule],
})
export class AppModule {} 