import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { DataSource } from 'typeorm';
import {
  IFindEntitysRatingsWithCursor,
  IGlobalRatingStats,
} from '../interfaces';
import { Rating } from '../entity';

@Injectable()
export class RatingRepository extends BaseRepository<Rating> {
  constructor(dataSource: DataSource) {
    super(Rating, dataSource);
  }

  async findRatingsOfEntityWithCursor(payload: IFindEntitysRatingsWithCursor) {
    const { entityId, limit, cursor_id } = payload;
    const query = this.createQueryBuilder('r')
      .innerJoin('r.user', 'u')
      .select([
        'r.id AS id',
        'r.score AS score ',
        'r.comment AS comment',
        'r.tags AS tags',
        'r.anonymous AS anonymous',
        'r.createdAt AS "createdAt"',
        `CASE WHEN r.anonymous THEN 'Anonymous' ELSE u.name END AS name`,
        `CASE WHEN r.anonymous THEN 'Anonymous' ELSE u.email END AS email`,
        `CASE WHEN r.anonymous THEN '' ELSE u.avatar END AS avatar`,
      ])
      .where('r.entity.id = :entityId', { entityId })
      .orderBy('r.id', 'DESC')
      .limit(limit + 1);

    if (cursor_id) {
      query.andWhere('(r.id <= :id)', {
        id: cursor_id,
      });
    }
    const results = await query.getRawMany();

    const hasNextPage = results.length > limit;
    const data = results.slice(0, limit) ?? [];

    let nextCursor = null;
    if (hasNextPage) {
      const next = results[limit];
      nextCursor = {
        id: next.id,
      };
    }

    return {
      data,
      nextCursor: nextCursor.id,
      hasNextPage,
    };
  }

  async getGlobalRatingStats(payload: IGlobalRatingStats) {
    const { interval: rawInterval, cursor, locationFilter, keyword } = payload;
    let { from, to } = payload;
    const limit = payload.limit ?? 10;

    const now = new Date();
    const interval = rawInterval ?? 'day';

    if (!from && !to && interval) {
      switch (interval) {
        case 'day': {
          const start = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
          );
          const end = new Date(start);
          end.setDate(end.getDate() + 1);
          from = start.toISOString();
          to = end.toISOString();
          break;
        }
        case 'week': {
          const day = now.getDay();
          const diffToMonday = (day + 6) % 7;
          const start = new Date(now);
          start.setDate(now.getDate() - diffToMonday);
          start.setHours(0, 0, 0, 0);
          const end = new Date(start);
          end.setDate(end.getDate() + 7);
          from = start.toISOString();
          to = end.toISOString();
          break;
        }
        case 'month': {
          const start = new Date(now.getFullYear(), now.getMonth(), 1);
          const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          from = start.toISOString();
          to = end.toISOString();
          break;
        }
        case 'year': {
          const start = new Date(now.getFullYear(), 0, 1);
          const end = new Date(now.getFullYear() + 1, 0, 1);
          from = start.toISOString();
          to = end.toISOString();
          break;
        }
        default:
          throw new BadRequestException('Unsupported interval');
      }
    }

    if (interval === 'day' && (!from || !to)) {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const end = new Date(now);
      from = start.toISOString();
      to = end.toISOString();
    }

    if (from && to && new Date(from) > new Date(to)) {
      throw new ConflictException('Incorrect date arrangement');
    }

    const timeField = `DATE_TRUNC('${interval}', r."createdAt")`;
    const groupFields = `${timeField}, r."entityId"`;
    const selectFields = `${timeField} AS "interval", r."entityId"`;
    const intervalField = `f.interval`;

    const whereConditions: string[] = [];
    const params: any[] = [];

    if (cursor) {
      whereConditions.push(`${timeField} < $${params.length + 1}`);
      params.push(cursor);
    }

    if (from) {
      whereConditions.push(`r."createdAt" >= $${params.length + 1}`);
      params.push(from);
    }

    if (to) {
      whereConditions.push(`r."createdAt" <= $${params.length + 1}`);
      params.push(to);
    }

    if (locationFilter?.city) {
      whereConditions.push(`e."city" ILIKE $${params.length + 1}`);
      params.push(`%${locationFilter.city}%`);
    }

    if (locationFilter?.state) {
      whereConditions.push(`e."state" ILIKE $${params.length + 1}`);
      params.push(`%${locationFilter.state}%`);
    }

    if (locationFilter?.country) {
      whereConditions.push(`e."country" ILIKE $${params.length + 1}`);
      params.push(`%${locationFilter.country}%`);
    }

    if (keyword) {
      whereConditions.push(`e."name" ILIKE $${params.length + 1}`);
      params.push(`%${keyword}%`);
    }

    const whereSql = whereConditions.length
      ? `AND ${whereConditions.join(' AND ')}`
      : '';

    const sql = `
    WITH user_interval_avg AS (
      SELECT
        ${selectFields},
        r."userId",
        AVG(r.score) AS user_avg
      FROM rating r
      JOIN entities e ON e.id = r."entityId"
      WHERE TRUE ${whereSql}
      GROUP BY ${groupFields}, r."userId"
    ),
    score_counts AS (
      SELECT
        ${selectFields},
        r.score,
        COUNT(*) AS count
      FROM rating r
      JOIN entities e ON e.id = r."entityId"
      WHERE TRUE ${whereSql}
      GROUP BY ${groupFields}, r.score
    ),
    score_agg AS (
      SELECT
        interval,
        r."entityId",
        jsonb_object_agg(score, count) AS score_counts
      FROM score_counts r
      GROUP BY interval, r."entityId"
    ),
    final_stats AS (
      SELECT
        ${selectFields},
        COUNT(*) AS total_ratings,
        MIN(r."createdAt") AS "minCreatedAt",
        MAX(r."createdAt") AS "maxCreatedAt"
      FROM rating r
      JOIN entities e ON e.id = r."entityId"
      WHERE TRUE ${whereSql}
      GROUP BY ${groupFields}
    )
    SELECT
      ${intervalField},
      f."entityId",
      f.total_ratings,
      f."minCreatedAt",
      f."maxCreatedAt",
      ROUND(AVG(u.user_avg)::numeric, 2) AS normalized_mean_score,
      s.score_counts,
      json_build_object('id', e.id, 'name', e.name) AS entity
    FROM final_stats f
    JOIN user_interval_avg u ON u.interval = f.interval AND u."entityId" = f."entityId"
    JOIN score_agg s ON s.interval = f.interval AND s."entityId" = f."entityId"
    JOIN entities e ON e.id = f."entityId"
    GROUP BY f.interval, f."entityId", f.total_ratings, f."minCreatedAt", f."maxCreatedAt", s.score_counts, e.id, e.name
    ORDER BY f.interval DESC
    LIMIT ${limit + 1};
  `;

    const result = await this.query(sql, params);

    const hasNextPage = result.length > limit;
    const data = hasNextPage ? result.slice(0, limit) : result;

    let nextCursor = null;
    if (hasNextPage) {
      const last = data[data.length - 1];
      nextCursor = { cursor: last.interval };
    }

    return {
      data,
      nextCursor,
      hasNextPage,
    };
  }

  async getEntityRatingStat(entityId: string) {
    const query = `   
    WITH user_avg AS (
      SELECT
        "userId",
        AVG(score) AS user_mean
      FROM rating
      WHERE "entityId" = $1
      GROUP BY "userId"
    ),
    score_counts AS (
      SELECT
        score,
        COUNT(*) AS count
      FROM rating
      WHERE "entityId" = $1
      GROUP BY score
    )
    SELECT
      (SELECT COUNT(*) FROM rating WHERE "entityId" = $1) AS total_ratings,
      (SELECT ROUND(AVG(user_mean)::numeric, 2) FROM user_avg) AS normalized_mean_score,
      jsonb_object_agg(score, count) AS score_counts
    FROM score_counts;
    `;
    const result = await this.query(query, [entityId]);
    return result[0];
  }
}
