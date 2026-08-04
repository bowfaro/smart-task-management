import { Expose } from 'class-transformer';
import { PaginationResponse } from 'src/common/types/pagination';

export class TaskResponse {
  @Expose()
  id: string;
  @Expose()
  title: string;
  @Expose()
  description: string;
  @Expose()
  status: string;
  @Expose()
  priority: number;
  @Expose()
  startAt: Date;
  @Expose()
  dueAt: Date;
  @Expose()
  estimatedHours: number;
  @Expose()
  smartScore: number;
  @Expose()
  doneAt: Date;
  @Expose()
  parentId: string;
  @Expose()
  userId: string;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}

export class TaskListResponse extends PaginationResponse<TaskResponse> {}
