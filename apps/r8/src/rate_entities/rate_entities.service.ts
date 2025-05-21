import { BadRequestException, Injectable } from '@nestjs/common';
import { RateEntityRepository } from './rating_entities.repository';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import {
  CreateRateEntityDto,
  EntityType,
  RateEntity,
  RedisService,
} from '@app/commonlib';
import { ILike, In } from 'typeorm';
import { SearchRateEntityDto } from '@app/commonlib';
import { faker } from '@faker-js/faker';

@Injectable()
export class RateEntitiesService {
  constructor(
    private readonly repository: RateEntityRepository,
    private readonly esService: ElasticsearchService,
    private readonly cache: RedisService,
  ) {}

  async search(dto: SearchRateEntityDto): Promise<RateEntity[]> {
    const { q, type } = dto;

    if (!q) throw new BadRequestException('`q` (query) must be provided');

    const cachekey = `entities:search:${type || 'all'}:${q}`;

    const cached = await this.cache.get(cachekey);
    if (cached) return JSON.parse(cached);

    const must: any[] = [
      {
        multi_match: {
          query: q,
          fields: [
            'name^3',
            'street^2',
            'city',
            'state',
            'country',
            'socials.*',
          ],
          fuzziness: 'auto',
        },
      },
    ];

    if (type) must.push({ term: { type } });

    const esResp = await this.esService.search<RateEntity>({
      index: 'entities',
      body: { query: { bool: { must } } },
    });

    console.log({ esResp });

    const ids = esResp.hits.hits.map((h) => h._source.id);
    let entities: RateEntity[];

    if (ids.length) {
      entities = await this.repository.find({ where: { id: In(ids) } });

      const orderMap = ids.reduce(
        (m, id, i) => ((m[id] = i), m),
        {} as Record<string, number>,
      );
      entities.sort((a, b) => orderMap[a.id] - orderMap[b.id]);
    } else {
      console.log('just here');

      const where: any = { name: ILike(`%${q}%`) };
      if (type) where.type = type;
      entities = await this.repository.find({ where, take: 10 });
    }

    await this.cache.set(cachekey, JSON.stringify(entities), 300);
    return entities;
  }

  // temp

  async reindexAll(entities: RateEntity[]) {
    const body = entities.flatMap((ent) => [
      { index: { _index: 'entities', _id: ent.id } },
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

  async fakerGenerate() {
    const fakedata = [];

    for (let i = 0; i < 500; i++) {
      const googlePlaceId = faker.string.uuid();
      const code = faker.string.alphanumeric(6);
      const username = faker.internet.username();
      const name = faker.person.fullName();
      const socials = {
        facebook: `https://facebook.com/${username}`,
        twitter: `https://twitter.com/${username}`,
        linkedin: `https://linkedin.com/in/${username}`,
        instagram: `https://instagram.com/${username}`,
        youtube: `https://youtube.com/${username}`,
        wechat: `https://wechat.com/${username}`,
        telegram: `https://t.me/${username}`,
        url: faker.internet.url(),
        truth_socials: `https://truthsocial.com/${username}`,
        tiktok: `https://www.tiktok.com/@${username}`,
        threads: `https://threads.net/@${username}`,
        twitch: `https://twitch.tv/${username}`,
        snapchat: `https://www.snapchat.com/add/${username}`,
        reddit: `https://www.reddit.com/user/${username}`,
        quora: `https://www.quora.com/profile/${username}`,
        discord: `https://discord.gg/${code}`,
      };
      const street = faker.location.streetAddress();
      const country = faker.location.country();
      const city = faker.location.city();
      const state = faker.location.state();
      const entityTypes = Object.values(EntityType) as EntityType[];
      const type = entityTypes[Math.floor(Math.random() * entityTypes.length)];
      const data: CreateRateEntityDto = {
        type,
        name,
        socials,
        googlePlaceId,
        street,
        country,
        city,
        state,
      };

      fakedata.push(data);
    }
    const save = await this.repository.save(fakedata);
    await this.reindexAll(save);
    return this.repository.save(fakedata);
  }
}
