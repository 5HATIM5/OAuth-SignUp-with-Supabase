import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from '@auth/auth.module';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [
    LoggerModule.forRoot(), 
    AuthModule, UsersModule],
})
export class AppModule {} 