import { Expose } from 'class-transformer';
export class UserResponse {
  @Expose()
  id: string;
  @Expose()
  name: string;
  @Expose()
  phone: string;
  @Expose()
  isVerified: boolean;
  @Expose()
  email: string;
  @Expose()
  createdAt: Date;
}
