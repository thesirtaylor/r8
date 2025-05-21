import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RateEntity, BaseRepository } from '@app/commonlib';

@Injectable()
export class RateEntityRepository extends BaseRepository<RateEntity> {
  constructor(dataSource: DataSource) {
    super(RateEntity, dataSource);
  }
}
