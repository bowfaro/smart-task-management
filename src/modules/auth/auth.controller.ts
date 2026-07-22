import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ResendOtpDto, VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginResponse } from './types/login.type';
import { MessageResponse } from 'src/common/types/response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: any): Promise<MessageResponse> {
    return this.authService.register(registerDto);
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
  ): Promise<MessageResponse> {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @Post('resend-otp')
  async resendOtp(
    @Body() resendOtpDto: ResendOtpDto,
  ): Promise<MessageResponse> {
    return this.authService.resendOtp(resendOtpDto);
  }

  @Post('send-reset-password')
  async sendResetPassword(
    @Body() resetPasswordDto: ResendOtpDto,
  ): Promise<MessageResponse> {
    return this.authService.sendResetPassword(resetPasswordDto);
  }
}
