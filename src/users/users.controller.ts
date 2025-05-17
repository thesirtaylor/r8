import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async GetUser(@Query('id') id: string) {
    return this.usersService.findOneOrFail(id);
  }
}
