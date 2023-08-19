import { Body, Controller, Get, Param, Post } from '@nestjs/common';

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
  authenticate(
    @Body() userDto: { email: string; password: string },
  ): Promise<UserEntity> {
    return this.userService.authenticate(userDto);
  }

  @Post()
  create(
    @Body() userDto: { name: string; email: string; password: string },
  ): Promise<UserEntity> {
    return this.userService.create(userDto);
  }

  @Get(':id')
  show(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.getById(id);
  }
}
