import { Controller, Logger } from '@nestjs/common';
import { SearchengineService } from './searchengine.service';
import {
  Outbox,
  OutboxRepository,
  TheEntity,
  RedisService,
  MediaOutboxRepository,
} from '@app/commonlib';
import { EventPattern, GrpcMethod, Payload } from '@nestjs/microservices';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import {
  SEARCH_ENGINE_SERVICE_NAME,
  SearchRequest,
} from '@app/commonlib/protos_output/searchengine.pb';
import { MediaUpdatePayload } from '@app/commonlib/interfaces';

@Controller('auto-suggest')
export class SearchengineController {
  private readonly logger = new Logger(SearchengineController.name);
  private readonly INDEX = 'entities';
  constructor(
    private readonly outboxRepo: OutboxRepository,
    private readonly mediaOutboxRepo: MediaOutboxRepository,
    private readonly searchengineService: SearchengineService,
    private readonly cache: RedisService,
    private readonly esService: ElasticsearchService,
  ) {}

  @GrpcMethod(SEARCH_ENGINE_SERVICE_NAME, 'search')
  async Search(payload: SearchRequest) {
    const { q } = payload;
    return this.searchengineService.search({ q });
  }

  @EventPattern('rate-entity-created')
  async indexEntity(
    @Payload() entities: Array<TheEntity & { eventId: string }>,
  ) {
    for (const entity of entities) {
      const key = `indexed:entity-created:${entity.id}`;
      const wasSet = await this.cache.setOnce(key, '1', 600);

      if (!wasSet) {
        //prevents unnecessary immediate multiple elastic indexing attempts
        this.logger.log(`Duplicate rate-entity ${entity.id}, skipping.`);
        continue;
      }

      try {
        const { result } = await this.indexEntityOnES(entity);
        if (result === 'created' || result === 'updated') {
          await this.updateOutBoxTableForIndex(entity.eventId);
          this.logger.log({
            entityId: entity.id,
            result,
            message: 'Entity indexed successfully',
          });
        } else {
          this.logger.warn({
            entityId: entity.id,
            result,
            message: 'Unexpected ES index result',
          });
        }
      } catch (error) {
        this.logger.error(
          {
            entityId: entity.id,
            error: error.message,
          },
          'Failed to index entity',
        );
      }
    }
  }

  private async updateOutBoxTableForIndex(eventId: string) {
    return await this.outboxRepo
      .createQueryBuilder()
      .update(Outbox)
      .set({ status: 'published', publishedAt: () => 'CURRENT_TIMESTAMP' })
      .where('id = :id', { id: eventId })
      .execute();
  }

  private async indexEntityOnES(entity: TheEntity & { eventId: string }) {
    try {
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
        hasMedia: false,
        mediaCount: 0,
      };
      return await this.esService.index({
        index: this.INDEX,
        id: entity.id,
        document: doc,
      });
    } catch (error) {
      this.logger.error(
        `elastic search indexing error for ${entity.id}`,
        error,
      );
      throw error;
    }
  }

  @EventPattern('rate-entity-media-updated')
  async updateMediaEntity(
    @Payload()
    updates: MediaUpdatePayload[],
  ) {
    this.logger.log(`Received ${updates.length} media update events`);

    for (const update of updates) {
      this.logger.log({ update });

      const key = `indexed:entity-updated:${update.entityId}:${update.batchId}`;
      const wasSet = await this.cache.setOnce(key, '1', 600);
      this.logger.log({ wasSet });

      if (!wasSet) {
        this.logger.log(
          `Duplicate media update for entity ${update.entityId}, batch ${update.batchId}, skipping.`,
        );
        continue;
      }

      try {
        await this.updateEntityIndexOnESWithMedia(update);
        await this.updateMediaOutBoxTableForESIndex(update.eventId);

        this.logger.log({
          entityId: update.entityId,
          batchId: update.batchId,
          mediaCount: update.count,
          message: 'Entity media updated in Elasticsearch',
        });
      } catch (error) {
        this.logger.error(
          {
            entityId: update.entityId,
            batchId: update.batchId,
            error: error.message,
          },
          'Failed to update entity media in Elasticsearch',
        );
      }
    }
  }
  private async updateMediaOutBoxTableForESIndex(eventId: string) {
    return await this.mediaOutboxRepo
      .createQueryBuilder()
      .update('MediaOutBox')
      .set({ status: 'published', publishedAt: () => 'CURRENT_TIMESTAMP' })
      .where('id = :id', { id: eventId })
      .execute();
  }

  private async updateEntityIndexOnESWithMedia(update: MediaUpdatePayload) {
    const exists = await this.esService.exists({
      index: this.INDEX,
      id: update.entityId,
    });

    if (!exists) {
      this.logger.warn(
        `Entity ${update.entityId} not found in Elasticsearch, cannot update media`,
      );
      return;
    }

    await this.esService.update({
      index: this.INDEX,
      id: update.entityId,
      body: {
        doc: {
          media: {
            urls: update.urls,
            cfIds: update.cfIds,
            count: update.count,
            lastUpdated: update.at,
          },
          hasMedia: true,
          mediaCount: update.count,
        },
      },
    });
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

  //do rate-entity-updated after uploading media successfully
}
