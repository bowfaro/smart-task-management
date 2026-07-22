import { IsNotEmpty } from '@nestjs/class-validator';

export class LoginDto {
  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  password: string;
}
