import { Test, TestingModule } from '@nestjs/testing';
import { SearchengineService } from './searchengine.service';

describe('SearchengineService', () => {
  let service: SearchengineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchengineService],
    }).compile();

    service = module.get<SearchengineService>(SearchengineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
