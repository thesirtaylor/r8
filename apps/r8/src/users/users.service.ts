import { Injectable } from '@nestjs/common';
import { UserRepository } from '@app/commonlib';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UserRepository) {}

  findOneOrFail(id: string) {
    return this.usersRepo.findByIdOrThrow(id);
  }
}
