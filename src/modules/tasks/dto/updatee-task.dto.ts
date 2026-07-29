import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from 'src/common/constants/enum';

export class UpdateTaskDto {
  @ApiProperty()
  title: string;
  @ApiProperty({ required: false })
  description?: string;
  @ApiProperty({ required: false })
  start_at?: Date;
  @ApiProperty({ required: false })
  estimated_hours?: number;
}

export class UpdateTaskStatusDto {
  @ApiProperty({ enum: ['todo', 'pending', 'in_progress', 'completed'] })
  status: TaskStatus;
}
