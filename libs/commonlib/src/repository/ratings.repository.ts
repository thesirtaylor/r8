import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { DataSource } from 'typeorm';
import { Rating, FindEntitysRatingsWithCursor } from '@app/commonlib';

@Injectable()
export class RatingRepository extends BaseRepository<Rating> {
  constructor(dataSource: DataSource) {
    super(Rating, dataSource);
  }

  async findRatingsOfEntityWithCursor(payload: FindEntitysRatingsWithCursor) {
    const { entityId, limit, cursor } = payload;
    const query = this.createQueryBuilder('r')
      .innerJoin('r.user', 'u')
      .select([
        'r.id AS id',
        'r.score AS score ',
        'r.comment AS comment',
        'r.tags AS tags',
        'r.anonymous AS anonymous',
        `CASE WHEN r.anonymous THEN 'Anonymous' ELSE u.name END AS name`,
        `CASE WHEN r.anonymous THEN 'Anonymous' ELSE u.email END AS email`,
        `CASE WHEN r.anonymous THEN '' ELSE u.avatar END AS avatar`,
      ])
      .where('r.entity.id = :entityId', { entityId })
      .orderBy('r.createdAt', 'DESC')
      .addOrderBy('r.id', 'DESC')
      .limit(limit);

    if (cursor) {
      query.andWhere('(r.createdAt, r.id) < (:createdAt, :id)', {
        createdAt: cursor.createdAt,
        id: cursor.id,
      });
    }
    return await query.getRawMany();
  }
}
