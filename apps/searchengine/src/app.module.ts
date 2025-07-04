import { Module } from '@nestjs/common';
import { LoggerModule } from '@app/commonlib';
import { SearchengineModule } from './searchengine/searchengine.module';
import { AppController } from './app.controller';

@Module({
  imports: [LoggerModule, SearchengineModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
