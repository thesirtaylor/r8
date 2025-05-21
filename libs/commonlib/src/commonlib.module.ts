import { Module } from '@nestjs/common';
import { CommonlibService } from './commonlib.service';
import { RedisModule } from './redis/redis.module';
import { RedisService } from './redis';

@Module({
  imports: [RedisModule],
  providers: [CommonlibService, RedisService],
  exports: [CommonlibService],
})
export class CommonlibModule {}
