import { Injectable } from '@nestjs/common';
import { BaseRepository, User } from '@app/commonlib';
import { DataSource } from 'typeorm';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource);
  }
}
