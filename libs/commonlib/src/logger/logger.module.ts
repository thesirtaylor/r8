import { Global, Module } from '@nestjs/common';
import { AppLoggerService } from './logger.service';

@Global()
@Module({
  controllers: [],
  providers: [AppLoggerService],
  exports: [AppLoggerService],
})
export class LoggerModule {}
