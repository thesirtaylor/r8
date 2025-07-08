import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserResponseDto } from '../../../gateway/src/openAPI';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('user')
  // @ApiSecurity('access-token')
  @ApiOperation({ summary: 'Fetch User by id' })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async GetUser(@Query('id') id: string) {
    return this.usersService.findOneOrFail(id);
  }
}
