import { ConflictException, Module } from '@nestjs/common';
import { AppDataSource, LoggerModule, HealthModule } from '@app/commonlib';
import { SearchengineModule } from './searchengine/searchengine.module';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

const nodeUrl = process.env.ELASTICSEARCH_NODE;

if (!nodeUrl) {
  throw new ConflictException('ELASTICSEARCH_NODE not set');
}

@Module({
  imports: [
    LoggerModule,
    SearchengineModule,
    TypeOrmModule.forRoot(AppDataSource.options),
    HealthModule,
    HealthModule.register({
      elasticsearchConfig: {
        node: process.env.ELASTICSEARCH_NODE,
      },
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
