import { Transform } from 'class-transformer';
import { IsDate, IsEmail, IsEnum, IsNumber, IsObject, IsString, IsUUID, MinLength } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    @Transform(({ value }) => value.trim().toLowerCase())
    email: string;
    @IsString()
    @MinLength(8)
    password: string;
    @IsString()
    name: string;
    @IsString()
    surname: string;
    @IsString()
    dateOfBirth: string;
    @IsString()
    phoneNo: string;
}

export class OAuthLoginDto {    
    @IsEmail()
    email: string;
    @IsString()
    fullName: string;
    @IsEnum(['FACEBOOK', 'GOOGLE', 'GITHUB', 'LINKEDIN'])
    provider: string;
}

export class LoginDto {
    @IsEmail()
    email: string;
    @IsString()
    @MinLength(8)
    password: string;
}
 
export class UserDto {
    @IsUUID()
    id: string;
    @IsEmail()
    email: string;
    @IsString()
    name: string;
    @IsString()
    surname: string;
    @IsDate()
    createdAt: Date;
    @IsDate()
    updatedAt: Date;
}

export class AuthResponseDto {
    @IsString()
    accessToken: string;
    @IsNumber()
    expiresIn: number;
    @IsObject()
    user: UserDto;
}