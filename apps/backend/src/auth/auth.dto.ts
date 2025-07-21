export class RegisterDto {
    id: string;
    email: string;
    password: string;
    name: string;
    surname: string;
    dateOfBirth: string;
    phoneNo: string;
}

export class OAuthLoginDto {    
    id: string;
    email: string;
    fullName: string;
    provider: string;
}

export class LoginDto {
    email: string;
    password: string;
}
 
export class UserDto {
    id: string;
    email: string;
    name: string;
    surname: string;
    createdAt: Date;
    updatedAt: Date;
}

export class AuthResponseDto {
    accessToken: string;
    expiresIn: number;
    user: UserDto;
}