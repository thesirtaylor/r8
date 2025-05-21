import { RateEntity } from '@app/commonlib';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

const INDEX = 'entities';

@Injectable()
export class SearchengineService implements OnModuleInit {
  private readonly logger = new Logger(SearchengineService.name);
  constructor(private readonly esService: ElasticsearchService) {}

  async onModuleInit() {
    const exists = await this.esService.indices.exists({ index: INDEX });

    if (!exists) {
      this.logger.log(`Creating Elasticseearch ${INDEX}`);
      await this.esService.indices.create({
        index: INDEX,

        settings: {
          analysis: {
            analyzer: {
              autocomplete_analyzer: {
                type: 'custom',
                tokenizer: 'autocomplete_tokenizer',
                filter: ['lowercase'],
              },
            },
            tokenizer: {
              autocomplete_tokenizer: {
                type: 'edge_ngram',
                min_gram: 2,
                max_gram: 20,
                token_chars: ['letter', 'digit'],
              },
            },
          },
        } as any,

        mappings: {
          properties: {
            id: { type: 'keyword' },
            type: { type: 'keyword' },
            name: {
              type: 'text',
              analyzer: 'autocomplete_analyzer',
              search_analyzer: 'standard',
            },
            street: {
              type: 'text',
              analyzer: 'autocomplete_analyzer',
              search_analyzer: 'standard',
            },
            city: {
              type: 'text',
              analyzer: 'autocomplete_analyzer',
              search_analyzer: 'standard',
            },
            state: {
              type: 'text',
              analyzer: 'autocomplete_analyzer',
              search_analyzer: 'standard',
            },
            country: {
              type: 'text',
              analyzer: 'autocomplete_analyzer',
              search_analyzer: 'standard',
            },
            socials: { type: 'object', dynamic: true },
            location: { type: 'geo_point' },
          } as any,
        },
      });
      this.logger.log(`Index ${INDEX} created.`);
    } else {
      this.logger.log(`Index ${INDEX} already exists.`);
    }
  }

  //upsert a RatedEntity document
  async indexEntity(entity: RateEntity) {
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

    await this.esService.index({ index: INDEX, id: entity.id, document: doc });
  }

  async removeEntity(id: string) {
    await this.esService.delete({ index: INDEX, id });
  }

  //bulk reindexing
  async reindexAll(entities: RateEntity[]) {
    const body = entities.flatMap((ent) => [
      { index: { _index: INDEX, _id: ent.id } },
      {
        id: ent.id,
        type: ent.type,
        name: ent.name,
        street: ent.street,
        city: ent.city,
        state: ent.state,
        country: ent.country,
        socials: ent.socials,
        location:
          ent.latitude && ent.longitude
            ? { lat: ent.latitude, lon: ent.longitude }
            : undefined,
      },
    ]);
    await this.esService.bulk({ refresh: true, body });
  }
}
