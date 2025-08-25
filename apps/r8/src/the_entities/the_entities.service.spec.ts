import { Test, TestingModule } from '@nestjs/testing';
import { TheEntitiesService } from './the_entities.service';

describe('TheEntitiesService', () => {
  let service: TheEntitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TheEntitiesService],
    }).compile();

    service = module.get<TheEntitiesService>(TheEntitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
