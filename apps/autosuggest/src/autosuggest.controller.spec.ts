import { Test, TestingModule } from '@nestjs/testing';
import { AutosuggestController } from './autosuggest.controller';
import { AutosuggestService } from './autosuggest.service';

describe('AutosuggestController', () => {
  let autosuggestController: AutosuggestController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AutosuggestController],
      providers: [AutosuggestService],
    }).compile();

    autosuggestController = app.get<AutosuggestController>(
      AutosuggestController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(autosuggestController.getHello()).toBe('Hello World!');
    });
  });
});
