import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from './base.repository';
import { Outbox } from '@app/commonlib';

@Injectable()
export class OutboxRepository extends BaseRepository<Outbox> {
  constructor(dataSource: DataSource) {
    super(Outbox, dataSource);
  }
}
