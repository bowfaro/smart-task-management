import { Expose } from 'class-transformer';
import { PaginationResponse } from 'src/common/types/pagination';

export class TagResponse {
  @Expose()
  id: string;
  @Expose()
  name: string;
  @Expose()
  userId: string;
  @Expose()
  colorCode: string;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}

export class TagListResponse extends PaginationResponse<TagResponse> {}
