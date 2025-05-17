import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../repository/base.repository';
import { User } from '../entity';
import { DataSource } from 'typeorm';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource);
  }
}
