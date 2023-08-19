import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async list(): Promise<UserEntity[]> {
    return this.userRepository.findAll();
  }

  async authenticate(userDto: {
    email: string;
    password: string;
  }): Promise<UserEntity | null> {
    const user = await this.userRepository.findByEmail(userDto.email);

    if (user) {
      const isPasswordValid = await bcrypt.compare(
        userDto.password,
        user.password,
      );
      if (isPasswordValid) {
        return user;
      }
    }

    return null;
  }

  async create(userDto: { name: string; email: string; password: string }) {
    const user = new UserEntity();
    user.id = uuidv4();
    user.name = userDto.name;
    user.email = userDto.email;

    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    user.password = hashedPassword;

    return this.userRepository.save(user);
  }

  getById(id: uuidv4): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { id } });
  }
}
