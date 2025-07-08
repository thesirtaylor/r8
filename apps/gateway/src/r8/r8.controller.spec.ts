import { Test, TestingModule } from '@nestjs/testing';
import { R8Controller } from './r8.controller';
import { R8Service } from './r8.service';

describe('R8Controller', () => {
  let controller: R8Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [R8Controller],
      providers: [R8Service],
    }).compile();

    controller = module.get<R8Controller>(R8Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
