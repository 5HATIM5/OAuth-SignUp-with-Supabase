export class RegisterDto {
    email: string;
    password: string;
    name: string;
    surname: string;
    dateOfBirth: string;
    phoneNo: string;
}

export class LoginDto {
    email: string;
    password: string;
}
 
export class NewUserDto {
    id: string;
    email: string;
    password: string | null;
    name: string;
    surname: string;
    dateOfBirth: Date;
    phoneNo: string;
    provider: string;
    createdAt: Date;
    updatedAt: Date;
}

export class AuthResponseDto {
    accessToken: string;
    expiresIn: number;
    user: {
        id: string;
        email: string;
        name: string;
        surname: string;
        createdAt: Date;
        updatedAt: Date;
    };
}