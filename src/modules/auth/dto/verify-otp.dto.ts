import { IsNotEmpty, IsPhoneNumber } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class VerifyOtpDto {
  @IsNotEmpty()
  @IsPhoneNumber('VN', { message: 'Phone number is not valid' })
  phone: string;
  @ApiProperty()
  @IsNotEmpty()
  otp: string;
}

export class ResendOtpDto {
  @IsNotEmpty()
  @IsPhoneNumber('VN', { message: 'Phone number is not valid' })
  phone: string;
}
