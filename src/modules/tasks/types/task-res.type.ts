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
  start_at: Date;
  @Expose()
  due_at: Date;
  @Expose()
  estimated_hours: number;
  @Expose()
  smart_score: number;
  @Expose()
  done_at: Date;
  @Expose()
  parent_id: string;
}

export class TaskListResponse extends PaginationResponse<TaskResponse> {}
