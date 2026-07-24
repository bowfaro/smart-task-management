import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ResendOtpDto, VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginResponse } from './types/login.type';
import { MessageResponse } from 'src/common/types/response';
import { RegisterDto } from './dto/register.dto';
import { ApiOperation } from 'node_modules/@nestjs/swagger/dist/decorators/api-operation.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập' })
  @ApiResponse({
    status: 200,
    description: 'Đăng nhập thành công',
  })
  @ApiResponse({
    status: 404,
    description: 'Khong tìm thấy người dùng',
  })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký' })
  @ApiResponse({
    status: 201,
    description: 'Đăng ký thành công',
  })
  @ApiResponse({
    status: 400,
    description: 'Số điện thoại đã tồn tại',
  })
  async register(@Body() registerDto: RegisterDto): Promise<MessageResponse> {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Xác minh OTP' })
  @Post('verify-otp')
  @ApiResponse({
    status: 200,
    description: 'Xác minh OTP thành công',
  })
  @ApiResponse({
    status: 400,
    description: 'OTP không hợp lệ',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy người dùng',
  })
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
  ): Promise<MessageResponse> {
    return this.authService.verifyOtp(verifyOtpDto);
  }
  @ApiOperation({ summary: 'Gửi lại OTP' })
  @Post('resend-otp')
  @ApiResponse({
    status: 200,
    description: 'Gửi lại OTP thành công',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy người dùng',
  })
  async resendOtp(
    @Body() resendOtpDto: ResendOtpDto,
  ): Promise<MessageResponse> {
    return this.authService.resendOtp(resendOtpDto);
  }
  @ApiOperation({ summary: 'Gửi lại OTP để reset password' })
  @Post('send-reset-password')
  @ApiResponse({
    status: 200,
    description: 'Gửi lại OTP để reset password thành công',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy người dùng',
  })
  async sendResetPassword(
    @Body() resetPasswordDto: ResendOtpDto,
  ): Promise<MessageResponse> {
    return this.authService.sendResetPassword(resetPasswordDto);
  }
}
