import { Injectable } from '@nestjs/common';
import {
  AppLoggerService,
  AuthRepository,
  UserDto,
  UserRepository,
} from '@app/commonlib';
import { JWTService } from './jwt.service';
import { v4 as uuid } from 'uuid';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import {
  GoogleAuthRequest,
  ValidationRequest,
  VerificationRequest,
} from '@app/commonlib/protos_output/auth.pb';
import { status as gRPCstatus } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import { GetUserRequest } from '@app/commonlib/protos_output/r8.pb';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: AppLoggerService,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JWTService,
  ) {}

  async getUser(payload: GetUserRequest) {
    try {
      const { id } = payload;
      if (!id) {
        throw new RpcException({
          code: gRPCstatus.INVALID_ARGUMENT,
          message: 'id must be provided',
        });
      }
      return await this.userRepository.findByIdOrThrow(id);
    } catch (error) {
      throw new RpcException({
        code: gRPCstatus.NOT_FOUND,
        message: error.message,
      });
    }
  }

  async google(user: GoogleAuthRequest) {
    try {
      const account = await this.findUserByEmail(user.email);
      if (!account) {
        const userAccount = await this.createUser(user);
        const tokens = await this.generateAccessAndRefreshToken({
          id: userAccount.id,
        });
        const createTokens = this.authRepository.create(tokens);
        return await this.authRepository
          .save(createTokens)
          .then(({ access_token, refresh_token }) => {
            return {
              access_token,
              refresh_token,
            };
          });
      } else {
        const tokens = await this.generateAccessAndRefreshToken({
          id: account.id,
        });
        const createTokens = this.authRepository.create(tokens);
        return await this.authRepository
          .save(createTokens)
          .then(({ access_token, refresh_token }) => {
            return {
              access_token,
              refresh_token,
            };
          });
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  async validation(payload: ValidationRequest) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: payload.id },
      });

      if (!user) {
        throw new RpcException({
          code: gRPCstatus.NOT_FOUND,
          message: 'User Not Found',
        });
      }
      return user;
    } catch (error) {
      this.logger.error({ error });
      throw error;
    }
  }

  async verifyToken(payload: VerificationRequest) {
    try {
      const { token } = payload;
      const decode = await this.jwtService.verify(token);
      if (!token) {
        throw new RpcException({
          code: gRPCstatus.PERMISSION_DENIED,
          message: 'Invalid Token',
        });
      }
      return await this.validation(decode);
    } catch (error) {
      this.logger.error({ error });
      throw error;
    }
  }

  private async createUser(user: any) {
    const userdto = plainToInstance(UserDto, user);
    await validateOrReject(userdto);
    const createUser = this.userRepository.create(userdto);
    return await this.userRepository.save(createUser);
  }

  private async findUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  private async generateAccessAndRefreshToken(payload: { id: string }) {
    const access_token = await this.jwtService.generateToken(payload);
    const refresh = uuid();
    const refresh_token = await this.jwtService.generateToken(
      { refresh },
      {
        expiresIn: '8h',
      },
    );
    return {
      access_token,
      refresh_token,
    };
  }
}
