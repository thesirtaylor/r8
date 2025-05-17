import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/repository/base.repository';
import { DataSource } from 'typeorm';
import { Rating } from '../entity';

@Injectable()
export class RatingRepository extends BaseRepository<Rating> {
  constructor(dataSource: DataSource) {
    super(Rating, dataSource);
  }
}
