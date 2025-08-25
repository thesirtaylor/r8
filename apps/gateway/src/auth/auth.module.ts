import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtAuthGuard } from './guards/jwt.oauth-guard';
import { JWTStrategy } from './strategies/jwt.strategy';
import { AuthService } from './auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  AUTH_PACKAGE_NAME,
  AUTH_SERVICE_NAME,
} from '@app/commonlib/protos_output/auth.pb';
import { protoPath } from '@app/commonlib';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTH_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: process.env.AUTH_GRPC,
          package: AUTH_PACKAGE_NAME,
          protoPath: protoPath('auth.proto'),
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, JwtAuthGuard, JWTStrategy],
  exports: [JwtAuthGuard, AuthService],
})
export class AuthModule {}
