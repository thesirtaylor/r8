import { RpcException } from '@nestjs/microservices';

export function ParseCatchResponse(status: number, error: any) {
  throw new RpcException({
    code: status,
    message: error.message,
    error,
    stack: error.stack,
  });
}
