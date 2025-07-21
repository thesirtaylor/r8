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

  async keys(key: string) {
    return await this.redis.keys(key);
  }

  async setOnce(key: string, value: any, expiry: number) {
    const result = await this.redis.set(key, value, 'EX', expiry, 'NX');
    return result === 'OK';
  }

  async ping() {
    return await this.redis.ping();
  }
}
