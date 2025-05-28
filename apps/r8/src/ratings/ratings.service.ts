import {
  AppLoggerService,
  RatingRepository,
  FindEntitysRatingsWithCursor,
  RedisService,
  getCompression,
  setCompression,
  CreateRating,
  deleteCache,
} from '@app/commonlib';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RatingsService {
  constructor(
    private readonly ratingRepository: RatingRepository,
    private readonly logger: AppLoggerService,
    private readonly cache: RedisService,
  ) {
    this.logger.setContext(RatingsService.name);
  }

  async GetRatingsOfEntity(payload: FindEntitysRatingsWithCursor) {
    const { entityId, cursor } = payload;
    if (!payload.limit) payload.limit = 10;

    const cacheKeyParts = [
      'entity_rating',
      entityId,
      `limit:${payload.limit}`,
      cursor?.createdAt?.toISOString() ?? 'start',
      cursor?.id ?? 'none',
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

  async RateEntity(payload: CreateRating) {
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
}
