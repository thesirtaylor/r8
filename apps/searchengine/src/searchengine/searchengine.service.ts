import {
  RedisService,
  AppLoggerService,
  setCompression,
  getCompression,
} from '@app/commonlib';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchengineService implements OnModuleDestroy, OnModuleInit {
  private readonly INDEX = 'entities';
  constructor(
    private readonly es: ElasticsearchService,
    private readonly cache: RedisService,
    readonly logger: AppLoggerService,
  ) {
    this.logger.setContext(SearchengineService.name);
  }
  async onModuleDestroy() {
    await this.cache.quit();
  }

  private async waitForElasticSearch(retries = 10, interrvalMs = 3000) {
    for (let attempts = 1; attempts < retries; attempts++) {
      try {
        const isUp = await this.es.ping();
        if (isUp) {
          this.logger.log(`Elasticsearch is up!`);
          return;
        }
      } catch (error) {
        this.logger.warn(
          `Waiting for ElasticSearch... attempting ${attempts}/${retries}`,
        );
        this.logger.error({ error });
      }
      await new Promise((res) => setTimeout(res, interrvalMs));
    }
    throw new Error(`Elasticsearch not reachable after retries`);
  }

  async onModuleInit() {
    await this.waitForElasticSearch();
    let exists: boolean;
    try {
      exists = await this.es.indices.exists({ index: this.INDEX });
    } catch (error) {
      this.logger.error(`Elasticsearch unable to check index...`);
      this.logger.error({ error });
    }
    if (!exists) {
      this.logger.log(`Creating Elasticseearch ${this.INDEX}`);
      await this.es.indices.create({
        index: this.INDEX,

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
      this.logger.log(`Index ${this.INDEX} created.`);
    } else {
      this.logger.log(`Index ${this.INDEX} already exists.`);
    }
  }

  async search(q: string): Promise<any[]> {
    if (!q) return [];

    const key = `autosuggest:${q}`;
    const hit = (await getCompression(this.cache, key)) as any[];

    if (hit) {
      return hit;
    }

    const resp = await this.es.search({
      index: 'entities',
      body: {
        query: {
          multi_match: {
            query: q,
            fields: [
              'name^3',
              'street',
              'city',
              'state',
              'country',
              'socials.*',
            ],
            fuzziness: 'auto',
          },
        },
      } as any,
    });

    const results = resp.hits.hits.map((h) => h._source);
    await setCompression(this.cache, key, results, 300);
    return results;
  }
}
