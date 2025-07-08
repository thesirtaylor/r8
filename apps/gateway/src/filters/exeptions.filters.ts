import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status as GrpcStatus } from '@grpc/grpc-js';
import type { Request, Response } from 'express';

@Catch(HttpException, RpcException, Error)
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const timestamp = new Date().toISOString();
    const path = req.url;

    let status: number;
    let message: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody = exception.getResponse();
      message = this.extractHttpMessage(responseBody);
    } else if (exception instanceof RpcException) {
      const error = exception.getError() as any;

      const grpcCode =
        typeof error.code === 'number' ? error.code : GrpcStatus.UNKNOWN;
      status = this.mapGrpcStatusToHttpStatus(grpcCode);
      message = error.message || error.details || 'gRPC Error';
    } else {
      const e = exception as any;
      const grpcCode = typeof e.code === 'number' ? e.code : GrpcStatus.UNKNOWN;
      status =
        this.mapGrpcStatusToHttpStatus(grpcCode) ||
        e.code ||
        HttpStatus.INTERNAL_SERVER_ERROR;
      message = e.details || e.message || 'Internal server error';
    }

    this.logger.error(
      `Exception @ ${req.method} ${path} --- [${status}] ${message}`,
      (exception as any).stack,
    );

    res.status(status).json({
      statusCode: status,
      message,
      timestamp,
      path,
    });
  }

  private mapGrpcStatusToHttpStatus(grpcCode: number): HttpStatus {
    const map: Record<number, HttpStatus> = {
      [GrpcStatus.OK]: HttpStatus.OK,
      [GrpcStatus.CANCELLED]: HttpStatus.REQUEST_TIMEOUT,
      [GrpcStatus.UNKNOWN]: HttpStatus.INTERNAL_SERVER_ERROR,
      [GrpcStatus.INVALID_ARGUMENT]: HttpStatus.BAD_REQUEST,
      [GrpcStatus.DEADLINE_EXCEEDED]: HttpStatus.GATEWAY_TIMEOUT,
      [GrpcStatus.NOT_FOUND]: HttpStatus.NOT_FOUND,
      [GrpcStatus.ALREADY_EXISTS]: HttpStatus.CONFLICT,
      [GrpcStatus.PERMISSION_DENIED]: HttpStatus.FORBIDDEN,
      [GrpcStatus.RESOURCE_EXHAUSTED]: HttpStatus.TOO_MANY_REQUESTS,
      [GrpcStatus.FAILED_PRECONDITION]: HttpStatus.PRECONDITION_FAILED,
      [GrpcStatus.ABORTED]: HttpStatus.CONFLICT,
      [GrpcStatus.OUT_OF_RANGE]: HttpStatus.BAD_REQUEST,
      [GrpcStatus.UNIMPLEMENTED]: HttpStatus.NOT_IMPLEMENTED,
      [GrpcStatus.INTERNAL]: HttpStatus.INTERNAL_SERVER_ERROR,
      [GrpcStatus.UNAVAILABLE]: HttpStatus.SERVICE_UNAVAILABLE,
      [GrpcStatus.DATA_LOSS]: HttpStatus.INTERNAL_SERVER_ERROR,
      [GrpcStatus.UNAUTHENTICATED]: HttpStatus.UNAUTHORIZED,
    };
    return map[grpcCode] ?? HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private extractHttpMessage(responseBody: any): string {
    if (typeof responseBody === 'string') return responseBody;
    if (typeof responseBody?.message === 'string') return responseBody.message;
    if (Array.isArray(responseBody?.message))
      return responseBody.message.join('; ');
    return 'Unexpected error';
  }
}
