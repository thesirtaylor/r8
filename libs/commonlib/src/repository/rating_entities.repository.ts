import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RateEntity } from '@app/commonlib';
import { BaseRepository } from './base.repository';

@Injectable()
export class RateEntityRepository extends BaseRepository<RateEntity> {
  constructor(dataSource: DataSource) {
    super(RateEntity, dataSource);
  }
}
