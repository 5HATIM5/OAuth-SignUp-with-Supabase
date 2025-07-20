export class RegisterDto {
    email: string;
    password: string;
    name: string;
    surname: string;
    nickname: string;
    dateOfBirth: string;
    referralCode?: string;
}

export class LoginDto {
    email: string;
    password: string;
}
  