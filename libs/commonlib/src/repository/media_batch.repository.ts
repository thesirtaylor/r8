import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { MediaBatch } from '../entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class MediaBatchRepository extends BaseRepository<MediaBatch> {
  constructor(dataSource: DataSource) {
    super(MediaBatch, dataSource);
  }
}
