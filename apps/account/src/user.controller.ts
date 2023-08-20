import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { validate } from 'class-validator';

import { CreateUserDto, AuthenticateUserDto } from './user.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  index(): Promise<UserEntity[]> {
    return this.userService.list();
  }

  @Post('authenticate')
  async authenticate(
    @Body() userDto: AuthenticateUserDto,
  ): Promise<UserEntity> {
    const errors = await validate(userDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return this.userService.authenticate(userDto);
  }

  @Post()
  async create(@Body() userDto: CreateUserDto): Promise<UserEntity> {
    const errors = await validate(userDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return this.userService.create(userDto);
  }

  @Get(':id')
  show(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.getById(id);
  }
}
