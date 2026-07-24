import { IsNotEmpty, IsPhoneNumber } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: '+84xxxxxxxxx',
  })
  @IsNotEmpty()
  @IsPhoneNumber('VN', { message: 'Phone number is not valid' })
  phone: string;
  @ApiProperty()
  @IsNotEmpty()
  password: string;
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  email: string;
}
