import { Expose } from 'class-transformer';
import { PaginationResponse } from 'src/common/types/pagination';

export class TagResponse {
  @Expose()
  id: string;
  @Expose()
  name: string;
  @Expose()
  user_id: string;
  @Expose()
  color_code: string;
  @Expose()
  created_at: Date;
}

export class TagListResponse extends PaginationResponse<TagResponse> {}
