import { RedisService, AppLoggerService } from '@app/commonlib';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class AutosuggestService implements OnModuleDestroy {
  constructor(
    private readonly es: ElasticsearchService,
    private readonly cache: RedisService,
    readonly logger: AppLoggerService,
  ) {
    this.logger.setContext(AutosuggestService.name);
  }
  async onModuleDestroy() {
    await this.cache.quit();
  }

  getHello(): string {
    return 'Hello World!';
  }

  async search(q: string): Promise<any[]> {
    console.log('started');

    if (!q) return [];

    const key = `autosuggest:${q}`;
    console.log({ key });

    const hit = await this.cache.get(key);

    if (hit) {
      console.log({ hit: JSON.parse(hit) });

      return JSON.parse(hit);
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
    await this.cache.set(key, JSON.stringify(results), 300);
    console.log({ results });

    return results;
  }
}
