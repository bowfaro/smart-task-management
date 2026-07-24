import { IsNotEmpty } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Số điện thoại', example: '+84xxxxxxxxx' })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: 'Mật khẩu', example: 'Password123' })
  @IsNotEmpty()
  password: string;
}
