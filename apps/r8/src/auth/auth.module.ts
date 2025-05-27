import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './strategies/google.strategy';
import { JWTService } from './jwt.service';
import { Auth, User, AuthRepository, UserRepository } from '@app/commonlib';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from './guards/jwt.oauth-guard';
import { JWTStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    JWTService,
    UserRepository,
    AuthRepository,
    JwtAuthGuard,
    JWTStrategy,
  ],
  imports: [
    TypeOrmModule.forFeature([Auth, User]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '4h' },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [JwtAuthGuard, AuthService],
})
export class AuthModule {}
