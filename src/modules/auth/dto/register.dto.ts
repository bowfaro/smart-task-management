import { IsNotEmpty, IsPhoneNumber } from '@nestjs/class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsPhoneNumber('VN', { message: 'Phone number is not valid' })
  phone: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  email: string;
}
