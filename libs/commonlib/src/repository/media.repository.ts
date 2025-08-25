import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Media } from '../entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class MediaRepository extends BaseRepository<Media> {
  constructor(dataSource: DataSource) {
    super(Media, dataSource);
  }
}
