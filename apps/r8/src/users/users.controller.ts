import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  GetUserRequest,
  R8_SERVICE_NAME,
  UserResponse,
} from '@app/commonlib/protos_output/r8.pb';
import { Observable } from 'rxjs';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @GrpcMethod(R8_SERVICE_NAME, 'getUser')
  async getUser(
    payload: GetUserRequest,
  ): Promise<UserResponse | Observable<UserResponse>> {
    const { id } = payload;
    const result = await this.usersService.findOneOrFail(id);
    return {
      id: result.id,
      createdAt: result.createdAt.toDateString(),
      updatedAt: result.updatedAt.toDateString(),
      username: result?.username,
      name: result.name,
      email: result.email,
      avatar: result?.avatar,
    };
  }
}
