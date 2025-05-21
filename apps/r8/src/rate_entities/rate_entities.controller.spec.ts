import { Test, TestingModule } from '@nestjs/testing';
import { RateEntitiesController } from './rate_entities.controller';
import { RateEntitiesService } from './rate_entities.service';

describe('RateEntitiesController', () => {
  let controller: RateEntitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RateEntitiesController],
      providers: [RateEntitiesService],
    }).compile();

    controller = module.get<RateEntitiesController>(RateEntitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
