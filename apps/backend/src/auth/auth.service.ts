@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async registerUser(dto: SignupDto) {
    const hash = await bcrypt.hash(dto.password, 10);
    const referralCode = Math.random().toString(36).substring(2, 8);

    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        name: dto.name,
        surname: dto.surname,
        nickname: dto.nickname,
        dateOfBirth: new Date(dto.dateOfBirth),
        referredBy: dto.referralCode || null,
        referralCode,
        role: 'seller',
        provider: 'email',
      }
    });
  }
}
