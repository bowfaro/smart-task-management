import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from 'src/database/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { PasswordService } from 'src/helper/bcrypt.helper';
import { TokenModule } from '../tokens/token.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), TokenModule],
  controllers: [UserController],
  providers: [UserService, PasswordService],
  exports: [UserService],
})
export class UserModule {}
