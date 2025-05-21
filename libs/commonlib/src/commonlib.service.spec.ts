import { Test, TestingModule } from '@nestjs/testing';
import { CommonlibService } from './commonlib.service';

describe('CommonlibService', () => {
  let service: CommonlibService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommonlibService],
    }).compile();

    service = module.get<CommonlibService>(CommonlibService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
