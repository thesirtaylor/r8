import { Test, TestingModule } from '@nestjs/testing';
import { SearchengineController } from './searchengine.controller';
import { SearchengineService } from './searchengine.service';

describe('SearchengineController', () => {
  let controller: SearchengineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchengineController],
      providers: [SearchengineService],
    }).compile();

    controller = module.get<SearchengineController>(SearchengineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
