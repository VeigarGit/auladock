import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { PasswordService } from './password.service';
import { AuthRepository } from './auth.repository';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const name = createUserDto.name?.trim();
    const email = createUserDto.email?.trim().toLowerCase();
    const password = createUserDto.password;

    if (!name || !email || !password) {
      throw new BadRequestException('Nome, e-mail e senha são obrigatórios');
    }

    const passwordHash = this.passwordService.hash(password);
    const user = await this.authRepository.create({
      name,
      email,
      passwordHash,
    });

    return {
      user,
      accessToken: this.tokenService.sign({
        sub: user.id as number,
        email: user.email as string,
        name: user.name as string,
      }),
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const email = loginUserDto.email?.trim().toLowerCase();
    const password = loginUserDto.password;

    if (!email || !password) {
      throw new BadRequestException('E-mail e senha são obrigatórios');
    }

    const user = await this.authRepository.findByEmail(email);

    if (!user?.passwordHash) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const passwordMatches = this.passwordService.verify(
      password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const safeUser = this.authRepository.toSafeUser(user);

    return {
      user: safeUser,
      accessToken: this.tokenService.sign({
        sub: safeUser.id as number,
        email: safeUser.email as string,
        name: safeUser.name as string,
      }),
    };
  }
}
