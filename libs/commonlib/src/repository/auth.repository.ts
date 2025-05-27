import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { DataSource } from 'typeorm';
import { Auth } from '@app/commonlib';

@Injectable()
export class AuthRepository extends BaseRepository<Auth> {
  constructor(dataSource: DataSource) {
    super(Auth, dataSource);
  }
}
