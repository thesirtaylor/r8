import { Test, TestingModule } from '@nestjs/testing';
import { RateEntitiesService } from './rate_entities.service';

describe('RateEntitiesService', () => {
  let service: RateEntitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RateEntitiesService],
    }).compile();

    service = module.get<RateEntitiesService>(RateEntitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
