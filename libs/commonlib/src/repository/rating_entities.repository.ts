import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RateEntity } from '../entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class RateEntityRepository extends BaseRepository<RateEntity> {
  constructor(dataSource: DataSource) {
    super(RateEntity, dataSource);
  }
}
