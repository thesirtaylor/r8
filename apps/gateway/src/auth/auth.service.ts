import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AppLoggerService,
  AuthRepository,
  UserRepository,
} from '@app/commonlib';
import { JWTService } from './jwt.service';
import { v4 as uuid } from 'uuid';
import { UserDto } from '@app/commonlib';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { ValidationPayload } from './interface/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private logger: AppLoggerService,
    private authRepository: AuthRepository,
    private jwtService: JWTService,
  ) {}
  async google(user: any) {
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

  async createUser(user: any) {
    const userdto = plainToInstance(UserDto, user);
    await validateOrReject(userdto);
    const createUser = this.userRepository.create(userdto);
    return await this.userRepository.save(createUser);
  }

  async validation(decode: ValidationPayload) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: decode.id },
      });

      if (!user) {
        throw new NotFoundException('User Not Found');
      }
      return user;
    } catch (error) {
      this.logger.error({ error });
      throw error;
    }
  }

  async verifyToken(token: string) {
    try {
      const decode = await this.jwtService.verify(token);
      if (!token) {
        throw new UnauthorizedException('Invalid Token');
      }
      return await this.validation(decode);
    } catch (error) {
      this.logger.error({ error });
      throw error;
    }
  }
}
