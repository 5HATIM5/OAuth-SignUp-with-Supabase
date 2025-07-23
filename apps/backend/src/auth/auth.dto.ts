import { IsDate, IsEmail, IsEnum, IsNumber, IsObject, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    id: string;
    @IsEmail()
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
    id: string;
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
    id: string;
    email: string;
    @IsString()
    name: string;
    @IsString()
    surname: string;
    @IsDate()
    createdAt: Date;
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