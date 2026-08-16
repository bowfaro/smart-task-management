import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TaskEntity } from 'src/database/entities/task.entity';
import { TokenModule } from '../tokens/token.module';
import { UserModule } from '../users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity]), TokenModule, UserModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
