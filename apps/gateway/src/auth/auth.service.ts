import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  AUTH_SERVICE_NAME,
  AuthServiceClient,
  GoogleAuthRequest,
  ValidationRequest,
  VerificationRequest,
  GetUserRequest,
} from '@app/commonlib/protos_output/auth.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService implements OnModuleInit {
  private service: AuthServiceClient;

  constructor(@Inject(AUTH_SERVICE_NAME) private readonly client: ClientGrpc) {}

  onModuleInit(): void {
    this.service = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  async getUser(payload: GetUserRequest) {
    return await firstValueFrom(this.service.getUser(payload));
  }

  async google(payload: GoogleAuthRequest) {
    return await firstValueFrom(this.service.googleAuth(payload));
  }

  async validation(payload: ValidationRequest) {
    return await firstValueFrom(this.service.validation(payload));
  }

  async verifyToken(payload: VerificationRequest) {
    return await firstValueFrom(this.service.verification(payload));
  }
}
