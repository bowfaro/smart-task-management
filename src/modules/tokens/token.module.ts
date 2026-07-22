import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenEntity } from 'src/database/entities/token.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([TokenEntity])],
  controllers: [TokenController],
  providers: [TokenService, JwtService],
  exports: [TokenService],
})
export class TokenModule {}
