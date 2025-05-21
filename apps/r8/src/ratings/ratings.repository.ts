import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@app/commonlib';
import { DataSource } from 'typeorm';
import { Rating } from '@app/commonlib';

@Injectable()
export class RatingRepository extends BaseRepository<Rating> {
  constructor(dataSource: DataSource) {
    super(Rating, dataSource);
  }
}
