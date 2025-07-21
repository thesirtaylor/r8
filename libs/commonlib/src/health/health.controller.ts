import { Controller } from '@nestjs/common';
import { HealthService } from './health.service';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import {
  HEALTH_SERVICE_NAME,
  HealthCheckRequest,
  HealthCheckResponse,
  HealthCheckResponse_ServingStatus,
} from '@app/commonlib/protos_output/health.pb';
import { Observable } from 'rxjs';

@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @GrpcMethod(HEALTH_SERVICE_NAME, 'check')
  check(payload: HealthCheckRequest): HealthCheckResponse {
    const status = this.healthService.getStatus(payload.service);
    return { status };
  }

  @GrpcStreamMethod(HEALTH_SERVICE_NAME, 'watch')
  watch(
    payload: HealthCheckRequest,
  ): Observable<HealthCheckResponse_ServingStatus> {
    const status = this.healthService.watch(payload.service);
    return status;
  }
}
