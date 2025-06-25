import {
  AppLoggerService,
  RatingRepository,
  IFindEntitysRatingsWithCursor,
  RedisService,
  getCompression,
  setCompression,
  ICreateRating,
  deleteCache,
  IGlobalRatingStats,
  IRatingStats,
} from '@app/commonlib';
import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

@Injectable()
export class RatingsService {
  constructor(
    private readonly ratingRepository: RatingRepository,
    private readonly logger: AppLoggerService,
    private readonly cache: RedisService,
  ) {
    this.logger.setContext(RatingsService.name);
  }

  async GetRatingsOfEntity(payload: IFindEntitysRatingsWithCursor) {
    const { entityId, cursor_id } = payload;
    payload.limit = payload.limit ?? 20;

    const cacheKeyParts = [
      'entity_rating',
      entityId,
      `limit:${payload.limit}`,
      cursor_id ?? 'none',
    ];

    const cacheKey = cacheKeyParts.join('|');

    try {
      const cache = await getCompression(this.cache, cacheKey);
      if (cache) {
        return cache;
      } else {
        const result =
          await this.ratingRepository.findRatingsOfEntityWithCursor(payload);

        await setCompression(this.cache, cacheKey, result, 300);
        return result;
      }
    } catch (error) {
      this.logger.error({ error });
      throw error;
    }
  }

  async RateEntity(payload: ICreateRating) {
    try {
      const ratingData = {
        user: { id: payload.userId },
        entity: { id: payload.entityId },
        score: payload.score,
        comment: payload.comment,
        tags: payload.tags,
        anonymous: payload.anonymous ?? false,
      };
      const createRating = this.ratingRepository.create(ratingData);
      const saveRating = await this.ratingRepository.save(createRating);
      const cacheKeyPattern = `entity_rating|${payload.entityId}|*`;
      await deleteCache(cacheKeyPattern, this.cache);
      return saveRating;
    } catch (error) {
      this.logger.error({ error });
      throw error;
    }
  }

  async GlobalRatingStat(payload: IGlobalRatingStats) {
    const { from, to, cursor, locationFilter, keyword } = payload;
    const limit: number = payload.limit ?? 20;
    const interval: string = !payload.interval ? 'day' : payload.interval;
    const from_ = from ?? '';
    const to_ = to ?? '';
    const cursorVal = cursor ?? '';

    const cacheKeyParts = [
      'global_stats',
      `interval:${interval}`,
      `from:${from_}`,
      `to:${to_}`,
      `cursor:${cursorVal}`,
      `limit:${limit}`,
      `city:${locationFilter.city ?? ''}`,
      `state:${locationFilter.state ?? ''}`,
      `country:${locationFilter.country ?? ''}`,
      `keyword:${keyword ?? ''}`,
    ].join('|');

    const hash = createHash('sha256').update(cacheKeyParts).digest('hex');
    const finalkey = `global_stats_hash:${hash}`;
    try {
      const cache = await getCompression(this.cache, finalkey);
      if (cache) {
        return cache;
      } else {
        const result =
          await this.ratingRepository.getGlobalRatingStats(payload);
        await setCompression(this.cache, finalkey, result, 300);
        return result;
      }
    } catch (error) {
      this.logger.error({ error });
      throw error;
    }
  }

  async GetRatingStatistic(payload: IRatingStats) {
    const { id } = payload;
    const cacheKeyParts = ['rating_stats', `id:${id}`].join('|');

    const hash = createHash('sha256').update(cacheKeyParts).digest('hex');
    const finalkey = `global_stats_hash:${hash}`;
    try {
      const cache = await getCompression(this.cache, finalkey);
      if (cache) {
        return cache;
      } else {
        const result = await this.ratingRepository.getEntityRatingStat(id);
        await setCompression(this.cache, finalkey, result, 300);
        return result;
      }
    } catch (error) {
      this.logger.error({ error });
      throw error;
    }
  }
}
