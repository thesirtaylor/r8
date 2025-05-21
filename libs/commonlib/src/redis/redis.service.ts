import { Injectable } from '@nestjs/common';
import { RedisService as RedisServiceFromLia } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redis: Redis;
  constructor(private readonly redisService: RedisServiceFromLia) {
    this.redis = this.redisService.getOrNil();
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.redis.set(key, value, 'EX', ttl);
  }

  async get(key: string): Promise<string> {
    return await this.redis.get(key);
  }

  async del(key: string): Promise<number> {
    return await this.redis.del(key);
  }

  async quit() {
    return await this.redis.quit();
  }
}
