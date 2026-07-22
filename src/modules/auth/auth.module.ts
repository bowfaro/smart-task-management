import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordService } from 'src/helper/bcrypt.helper';
import { UserService } from '../users/user.service';
import { TokenService } from '../tokens/token.service';
import { UserEntity } from 'src/database/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { TokenModule } from '../tokens/token.module';
import { UserModule } from '../users/user.module';
import { TwilioService } from 'src/helper/twilio.helper';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), UserModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService, PasswordService, JwtService, TwilioService],
  exports: [AuthService],
})
export class AuthModule {}
