import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly baseRepository: Repository<UserEntity>,
  ) {}

  async save(user: UserEntity): Promise<UserEntity> {
    return this.baseRepository.save(user);
  }

  async findAll(): Promise<UserEntity[]> {
    return this.baseRepository.find();
  }

  async findOne(id: uuidv4): Promise<UserEntity | undefined> {
    return this.baseRepository.findOne(id);
  }

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    return this.baseRepository.findOne({ where: { email: email } });
  }
}
