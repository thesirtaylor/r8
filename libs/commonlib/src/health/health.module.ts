import {
  ConflictException,
  DynamicModule,
  Logger,
  Module,
  Provider,
} from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';
import { LoggerModule } from '../logger';
import { RedisModule } from '../redis';

import {
  ElasticsearchModule,
  ElasticsearchModuleOptions,
} from '@nestjs/elasticsearch';

const nodeUrl = process.env.ELASTICSEARCH_NODE;

if (!nodeUrl) {
  throw new ConflictException('ELASTICSEARCH_NODE not set');
}

export interface HealthModuleOptions {
  elasticsearchConfig: ElasticsearchModuleOptions;
}

@Module({})
export class HealthModule {
  static register(options: HealthModuleOptions): DynamicModule {
    if (!options.elasticsearchConfig || !options.elasticsearchConfig.node) {
      throw new Error(
        'HealthModule: Elasticsearch node URL must be provided in healthModuleOptions.elasticsearchConfig.node',
      );
    }

    const moduleLogger = new Logger('HealthModule');
    moduleLogger.log(
      `HealthModule registered with Elasticsearch node: ${options.elasticsearchConfig.node}`,
    );

    const providers: Provider[] = [HealthService];

    const imports: any[] = [
      LoggerModule,
      RedisModule,
      ElasticsearchModule.register(options.elasticsearchConfig),
    ];

    return {
      module: HealthModule,
      imports,
      providers,
      controllers: [HealthController],
      exports: [HealthService],
    };
  }
}
