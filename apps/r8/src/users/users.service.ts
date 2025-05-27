import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../../libs/commonlib/src/repository/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UserRepository) {}

  findOneOrFail(id: string) {
    return this.usersRepo.findByIdOrThrow(id);
  }
}
