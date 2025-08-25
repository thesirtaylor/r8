import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TheEntity } from '../entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class TheEntityRepository extends BaseRepository<TheEntity> {
  constructor(dataSource: DataSource) {
    super(TheEntity, dataSource);
  }
}
