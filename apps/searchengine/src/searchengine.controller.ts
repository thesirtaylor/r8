import { Controller, Get, Logger, Query } from '@nestjs/common';
import { SearchengineService } from './searchengine.service';
import { RateEntity, SearchRateEntityDto } from '@app/commonlib';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Controller('auto-suggest')
export class SearchengineController {
  private readonly logger = new Logger(SearchengineController.name);
  private readonly INDEX = 'entities';
  constructor(
    private readonly searchengineService: SearchengineService,
    private readonly esService: ElasticsearchService,
  ) {}

  @Get('search')
  async Search(@Query() dto: SearchRateEntityDto) {
    return this.searchengineService.search(dto.q);
  }

  @EventPattern('rate-entity-created')
  async indexEntity(@Payload() entities: RateEntity[]) {
    await Promise.all(entities.map((entity) => this.indexOne(entity)));
  }

  private async indexOne(entity: RateEntity) {
    const doc = {
      id: entity.id,
      type: entity.type,
      name: entity.name,
      street: entity.street,
      city: entity.city,
      state: entity.state,
      country: entity.country,
      socials: entity.socials,
      location:
        entity.latitude && entity.longitude
          ? { lat: entity.latitude, lon: entity.longitude }
          : undefined,
    };
    await this.esService.index({
      index: this.INDEX,
      id: entity.id,
      document: doc,
    });
    this.logger.log(`'Indexed: ' ${entity.id}`);
  }

  //   async removeEntity(id: string) {
  //     await this.esService.delete({ index: this.INDEX, id });
  //   }

  //   //bulk reindexing
  //   async reindexAll(entities: RateEntity[]) {
  //     const body = entities.flatMap((ent) => [
  //       { index: { _index: this.INDEX, _id: ent.id } },
  //       {
  //         id: ent.id,
  //         type: ent.type,
  //         name: ent.name,
  //         street: ent.street,
  //         city: ent.city,
  //         state: ent.state,
  //         country: ent.country,
  //         socials: ent.socials,
  //         location:
  //           ent.latitude && ent.longitude
  //             ? { lat: ent.latitude, lon: ent.longitude }
  //             : undefined,
  //       },
  //     ]);
  //     await this.esService.bulk({ refresh: true, body });
  //   }
  // }
}
