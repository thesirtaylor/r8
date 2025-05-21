import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from './logger.module';
import { AppLoggerService } from './logger.service';

describe('LoggerService => AppLoggerService', () => {
  let logger: AppLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [AppLoggerService],
    }).compile();

    logger = await module.resolve(AppLoggerService);
  });

  it('should be defined', () => {
    expect(logger).toBeDefined();
  });

  it('#setContext - should set the context logger logs with', () => {
    const setContext = jest.spyOn(logger, 'setContext');
    const context = 'AppLoggerServiceUnitTest';

    logger.setContext(context);

    expect(setContext).toHaveBeenNthCalledWith(1, context);
  });

  describe('core methods', () => {
    beforeEach(() => logger.setContext('AppLoggerServiceUnitTest'));

    it('#log - should log to console', () => {
      const log = jest.spyOn(logger, 'log');
      const text = 'some info text logged to console';

      logger.log(text);

      expect(log).toHaveBeenNthCalledWith(1, text);
    });

    it('#warn - should log to console', () => {
      const warn = jest.spyOn(logger, 'warn');
      const message = 'some warning message logged to console';

      logger.warn(message);

      expect(warn).toHaveBeenNthCalledWith(1, message);
    });

    it('#debug - should log to console', () => {
      const debug = jest.spyOn(logger, 'debug');
      const message = 'some debugging message logged to console';

      logger.debug(message);

      expect(debug).toHaveBeenNthCalledWith(1, message);
    });

    it('#error - should log to console', () => {
      const error = jest.spyOn(logger, 'error');
      const message = 'some error message logged to console';

      logger.error(message);

      expect(error).toHaveBeenNthCalledWith(1, message);
    });
  });
});
