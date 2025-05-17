import { Module } from '@nestjs/common';
import { RateEntitiesService } from './rate_entities.service';
import { RateEntitiesController } from './rate_entities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RateEntity } from '../entity';
import { RateEntityRepository } from './rating_entities.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RateEntity])],
  controllers: [RateEntitiesController],
  providers: [RateEntitiesService, RateEntityRepository],
})
export class RateEntitiesModule {}
