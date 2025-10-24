import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { MediaOutbox } from '../entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class MediaOutboxRepository extends BaseRepository<MediaOutbox> {
  constructor(dataSource: DataSource) {
    super(MediaOutbox, dataSource);
  }
}
