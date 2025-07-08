import { Test, TestingModule } from '@nestjs/testing';
import { R8Service } from './r8.service';

describe('R8Service', () => {
  let service: R8Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [R8Service],
    }).compile();

    service = module.get<R8Service>(R8Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
