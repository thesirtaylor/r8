import { Controller } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { GrpcMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  AUTH_SERVICE_NAME,
  GetUserRequest,
  GoogleAuthRequest,
  GoogleAuthResponse,
  UserResponse,
  ValidationRequest,
  VerificationRequest,
} from '@app/commonlib/protos_output/auth.pb';
import { User } from '@app/commonlib';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod(AUTH_SERVICE_NAME, 'getUser')
  async getUser(
    payload: GetUserRequest,
  ): Promise<UserResponse | Observable<UserResponse>> {
    const result = await this.authService.getUser(payload);
    return this.user_data(result);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'googleAuth')
  async googleAuth(
    payload: GoogleAuthRequest,
  ): Promise<GoogleAuthResponse | Observable<GoogleAuthResponse>> {
    const result = await this.authService.google(payload);
    return {
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
    };
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'validation')
  async validation(
    payload: ValidationRequest,
  ): Promise<UserResponse | Observable<UserResponse>> {
    const result = await this.authService.validation(payload);
    return this.user_data(result);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'verification')
  async verification(
    payload: VerificationRequest,
  ): Promise<UserResponse | Observable<UserResponse>> {
    const result = await this.authService.verifyToken(payload);
    return this.user_data(result);
  }

  private user_data(payload: User) {
    return {
      id: payload.id,
      createdAt: payload.createdAt.toDateString(),
      updatedAt: payload.updatedAt.toDateString(),
      username: payload?.username,
      name: payload.name,
      email: payload.email,
      avatar: payload?.avatar,
    };
  }
}
