import { Module } from '@nestjs/common';
import { AppDataSource, LoggerModule } from '@app/commonlib';
import { SearchengineModule } from './searchengine/searchengine.module';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    LoggerModule,
    SearchengineModule,
    TypeOrmModule.forRoot(AppDataSource.options),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
