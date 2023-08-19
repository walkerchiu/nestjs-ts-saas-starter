import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { DatabaseModule } from '../../common/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([UserEntity, UserRepository]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
