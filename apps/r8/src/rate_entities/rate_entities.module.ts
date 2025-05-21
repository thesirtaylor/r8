import { Module } from '@nestjs/common';
import { RateEntitiesService } from './rate_entities.service';
import { RateEntitiesController } from './rate_entities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RateEntity, RedisModule, RedisService } from '@app/commonlib';
import { RateEntityRepository } from './rating_entities.repository';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([RateEntity]),
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        node: configService.get<string>('ELASTICSEARCH_NODE'),
      }),
      inject: [ConfigService],
    }),
    RedisModule,
  ],
  controllers: [RateEntitiesController],
  providers: [RateEntitiesService, RateEntityRepository, RedisService],
})
export class RateEntitiesModule {}
