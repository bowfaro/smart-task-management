import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from 'src/database/entities/task.entity';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { UserModule } from '../users/user.module';
import { TokenModule } from '../tokens/token.module';
@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity]), TokenModule, UserModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
