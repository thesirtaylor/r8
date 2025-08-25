import { Module } from '@nestjs/common';
import { TheEntitiesModule } from './the_entities/the_entities.module';
import { RatingsModule } from './ratings/ratings.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  LoggerModule,
  MessagingModule,
  RedisModule,
  dataSourceOptions,
  // HealthModule,
} from '@app/commonlib';

// const nodeUrl = process.env.ELASTICSEARCH_NODE;

// if (!nodeUrl) {
//   throw new ConflictException('ELASTICSEARCH_NODE not set');
// }

@Module({
  imports: [
    LoggerModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    TheEntitiesModule,
    RatingsModule,
    RedisModule,
    MessagingModule,
    // HealthModule.register({
    //   elasticsearchConfig: {
    //     node: process.env.ELASTICSEARCH_NODE,
    //   },
    // }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
