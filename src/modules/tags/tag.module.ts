import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from 'src/database/entities/tag.entity';
import { TokenModule } from '../tokens/token.module';
import { UserModule } from '../users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity]), TokenModule, UserModule],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
