import { Test, TestingModule } from '@nestjs/testing';
import { TheEntitiesController } from './the_entities.controller';
import { TheEntitiesService } from './the_entities.service';

describe('TheEntitiesController', () => {
  let controller: TheEntitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TheEntitiesController],
      providers: [TheEntitiesService],
    }).compile();

    controller = module.get<TheEntitiesController>(TheEntitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
