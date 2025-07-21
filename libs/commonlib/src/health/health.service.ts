import { AppLoggerService } from '../logger';
import { HealthCheckResponse_ServingStatus } from '../protos_output/health.pb';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { map, Observable, Subject } from 'rxjs';
import { DataSource } from 'typeorm';
import { RedisService } from '../redis';

@Injectable()
export class HealthService implements OnModuleInit, OnModuleDestroy {
  private healthStatus: Map<string, HealthCheckResponse_ServingStatus> =
    new Map();
  private watchers: Map<string, Subject<HealthCheckResponse_ServingStatus>> =
    new Map();
  private healthCheckInterval: any;

  constructor(
    private readonly logger: AppLoggerService,
    private readonly cache: RedisService,
    private readonly esService: ElasticsearchService,
    private readonly dataSource: DataSource,
  ) {}

  onModuleInit() {
    this.logger.log('HealthService.onModuleInit() called by NestJS');
    this.setStatus('', HealthCheckResponse_ServingStatus.SERVING);
    this.startHealthMonitoring();
  }

  onModuleDestroy() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    this.watchers.forEach((subject) => subject.complete());
    this.watchers.clear();
  }

  getStatus(service: string): HealthCheckResponse_ServingStatus {
    return (
      this.healthStatus.get(service) ??
      HealthCheckResponse_ServingStatus.SERVICE_UNKNOWN
    );
  }

  setStatus(service: string, status: HealthCheckResponse_ServingStatus) {
    const oldStatus = this.healthStatus.get(service);
    this.healthStatus.set(service, status);

    if (oldStatus !== status) {
      const watcher = this.watchers.get(service);
      if (watcher) {
        watcher.next(status);
      }
    }
  }

  watch(service: string): Observable<HealthCheckResponse_ServingStatus> {
    if (!this.watchers.has(service)) {
      this.watchers.set(
        service,
        new Subject<HealthCheckResponse_ServingStatus>(),
      );
    }

    const subject = this.watchers.get(service);

    const currentStatus = this.getStatus(service);
    setTimeout(() => subject.next(currentStatus), 0);

    return subject.asObservable().pipe(map((status) => status));
  }

  private startHealthMonitoring(): void {
    this.healthCheckInterval = setInterval(async () => {
      try {
        const isHealthy = await this.performHealthChecks();

        if (isHealthy) {
          this.setStatus('', HealthCheckResponse_ServingStatus.SERVING);
        } else {
          this.setStatus('', HealthCheckResponse_ServingStatus.NOT_SERVING);
        }
      } catch (error) {
        this.logger.error({ error });
        this.setStatus('', HealthCheckResponse_ServingStatus.NOT_SERVING);
      }
    }, 10000);
  }
  private async performHealthChecks(): Promise<boolean> {
    const checks = [];

    checks.push(
      (async () => {
        try {
          await this.cache.ping();
          this.logger.debug('Redis is healthy');
          return true;
        } catch (error) {
          this.logger.error(`Redis health check failed: ${error.message}`);
          return false;
        }
      })(),
    );

    checks.push(
      (async () => {
        try {
          await this.esService.ping();
          this.logger.debug('Elasticsearch is healthy');
          return true;
        } catch (error) {
          this.logger.error(
            `Elasticsearch health check failed: ${error.message}`,
          );
          return false;
        }
      })(),
    );

    checks.push(
      (async () => {
        try {
          if (!this.dataSource.isInitialized) {
            this.logger.warn('TypeORM DataSource is not initialized.');
            return false;
          }
          await this.dataSource.query('SELECT 1');
          this.logger.debug('Database (TypeORM) is healthy');
          return true;
        } catch (error) {
          this.logger.error(`Database health check failed: ${error.message}`);
          return false;
        }
      })(),
    );

    const results = await Promise.all(checks);
    return results.every((result) => result === true);
  }
}
