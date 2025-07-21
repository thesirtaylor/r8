import { Controller, Logger } from '@nestjs/common';
import { SearchengineService } from './searchengine.service';
import {
  Outbox,
  OutboxRepository,
  RateEntity,
  RedisService,
} from '@app/commonlib';
import { EventPattern, GrpcMethod, Payload } from '@nestjs/microservices';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import {
  SEARCH_ENGINE_SERVICE_NAME,
  SearchRequest,
} from '@app/commonlib/protos_output/searchengine.pb';

@Controller('auto-suggest')
export class SearchengineController {
  private readonly logger = new Logger(SearchengineController.name);
  private readonly INDEX = 'entities';
  constructor(
    private readonly outboxRepo: OutboxRepository,
    private readonly searchengineService: SearchengineService,
    private readonly cache: RedisService,
    private readonly esService: ElasticsearchService,
  ) {}

  @GrpcMethod(SEARCH_ENGINE_SERVICE_NAME, 'search')
  async Search(payload: SearchRequest) {
    const { q } = payload;
    return this.searchengineService.search(q);
  }

  @EventPattern('rate-entity-created')
  async indexEntity(
    @Payload() entities: Array<RateEntity & { eventId: string }>,
  ) {
    for (const entity of entities) {
      const key = `indexed:rate-entity:${entity.eventId}`;
      const wasSet = await this.cache.setOnce(key, '1', 600);

      if (!wasSet) {
        //prevents unnecessary immediate multiple elastic indexing attempts
        this.logger.log(`Duplicate rate-entity ${entity.eventId}, skipping.`);
        continue;
      }

      const { result } = await this.indexOne(entity);
      if (result === 'created' || result === 'updated') {
        await this.onIndexed(entity.eventId);
      }
    }
  }

  async onIndexed(eventId: string) {
    return await this.outboxRepo
      .createQueryBuilder()
      .update(Outbox)
      .set({ status: 'published', publishedAt: () => 'CURRENT_TIMESTAMP' })
      .where('id = :id', { id: eventId })
      .execute();
  }

  private async indexOne(entity: RateEntity & { eventId: string }) {
    try {
      const doc = {
        id: entity.eventId,
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
      return await this.esService.index({
        index: this.INDEX,
        id: entity.eventId,
        document: doc,
      });
    } catch (error) {
      this.logger.error(
        `elastic search indexing error for ${entity.id}`,
        error,
      );
    }
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
