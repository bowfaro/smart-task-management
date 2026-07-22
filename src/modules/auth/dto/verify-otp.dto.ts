import { IsNotEmpty, IsPhoneNumber } from '@nestjs/class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsPhoneNumber('VN', { message: 'Phone number is not valid' })
  phone: string;
  @IsNotEmpty()
  otp: string;
}

export class ResendOtpDto {
  @IsNotEmpty()
  @IsPhoneNumber('VN', { message: 'Phone number is not valid' })
  phone: string;
}
