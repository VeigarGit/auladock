import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

export type SafeUser = Omit<User, 'passwordHash'>;

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async create(input: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<SafeUser> {
    const existingUser = await this.findByEmail(input.email);
    if (existingUser) {
      throw new BadRequestException('E-mail já cadastrado');
    }

    const user = this.repo.create({
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      passwordHash: input.passwordHash,
    });

    const savedUser = await this.repo.save(user);
    return this.toSafeUser(savedUser);
  }

  async findByEmail(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    return this.repo.findOne({
      where: { email: normalizedEmail },
    });
  }

  toSafeUser(user: User): SafeUser {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}
