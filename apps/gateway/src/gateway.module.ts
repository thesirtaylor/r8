import { Module } from '@nestjs/common';
import { R8Module } from './r8/r8.module';
import { SearchengineModule } from './searchengine/searchengine.module';
import { LoggerModule } from '@app/commonlib';
import { GatewayController } from './gateway.controller';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/exeptions.filters';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    R8Module,
    SearchengineModule,
    LoggerModule,
    AuthModule,
    MediaModule,
  ],
  controllers: [GatewayController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  exports: [LoggerModule],
})
export class GatewayModule {}
