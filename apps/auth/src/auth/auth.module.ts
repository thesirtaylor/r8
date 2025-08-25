import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth, AuthRepository, User, UserRepository } from '@app/commonlib';
import { JwtModule } from '@nestjs/jwt';
import { JWTService } from './services/jwt.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Auth]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '4h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, AuthRepository, JWTService],
  exports: [UserRepository],
})
export class AuthModule {}
