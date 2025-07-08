import { Controller, Get } from '@nestjs/common';

@Controller()
export class GatewayController {
  @Get('/health')
  async HealthCheck() {
    return { status: 'ok' };
  }
}
