import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { TokenService } from '../tokens/token.service';
import { PasswordService } from 'src/helper/bcrypt.helper';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './types/login.type';
import { MESSAGE } from 'src/common/constants/message';
import { RegisterDto } from './dto/register.dto';
import { MessageResponse } from 'src/common/types/response';
import { generateUserId } from 'src/utils/functions';
import { TwilioService } from 'src/helper/twilio.helper';
import { ResendOtpDto, VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly passwordService: PasswordService,
    private readonly twilioService: TwilioService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.userService.findByPhone(loginDto.phone);
    try {
      if (!user) {
        throw new NotFoundException(MESSAGE.USER_NOT_FOUND);
      }

      if (user.isVerified === false) {
        throw new NotFoundException(MESSAGE.ACCOUNT_LOGIN_FAILED);
      }

      if (
        !this.passwordService.comparePassword(loginDto.password, user.password)
      ) {
        throw new NotFoundException(MESSAGE.ACCOUNT_INCORRECT_PASSWORD);
      }

      const payload = {
        userId: user.id,
        phone: user.phone,
      };

      const { accessToken, refreshToken } = await this.tokenService.createOne(
        payload,
        false,
      );

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async register(registerDto: RegisterDto): Promise<MessageResponse> {
    try {
      const user = await this.userService.findByPhone(registerDto.phone);
      if (user) {
        throw new NotFoundException(MESSAGE.PHONE_EXISTED);
      }
      const hashedPassword = await this.passwordService.encryptPassword(
        registerDto.password,
      );
      const userId = generateUserId();
      const email = registerDto.email;
      await this.userService.save({
        id: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        email,
        phone: registerDto.phone,
        username: email.substring(0, email.indexOf('@')),
        password: hashedPassword,
        name: registerDto.name,
      });
      this.twilioService.sendOtp(registerDto.phone);
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.ACCOUNT_REGISTER_SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }
  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<MessageResponse> {
    try {
      const { phone, otp } = verifyOtpDto;
      const isVerified = await this.twilioService.verifyOtp(phone, otp);
      if (!isVerified) {
        throw new NotFoundException(MESSAGE.OTP_INCORRECT);
      }
      const user = await this.userService.findByPhone(phone);
      if (!user) {
        throw new NotFoundException(MESSAGE.USER_NOT_FOUND);
      }
      await this.userService.save({
        ...user,
        isVerified: true,
      });

      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.ACCOUNT_VERIFIED_SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }
  async resendOtp(resendOtpDto: ResendOtpDto): Promise<MessageResponse> {
    try {
      const { phone } = resendOtpDto;
      await this.twilioService.sendOtp(phone);
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.ACCOUNT_VERIFIED_SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }
  async sendResetPassword(
    sendResetPasswordDto: ResendOtpDto,
  ): Promise<MessageResponse> {
    try {
      const { phone } = sendResetPasswordDto;
      await this.twilioService.sendOtp(phone);
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.OTP_RESEND_SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }
}
