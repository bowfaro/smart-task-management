import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class TwilioService {
  private readonly logger = new Logger(TwilioService.name);
  private readonly client: Twilio;
  private readonly verifyServiceSid: string;

  constructor(private readonly configService: ConfigService) {
    const accountSid = this.configService.get<string>('twilio.accountSid');
    const authToken = this.configService.get<string>('twilio.authToken');
    this.verifyServiceSid =
      this.configService.get<string>('twilio.verifyServiceSid') || '';
    this.client = new Twilio(accountSid, authToken);
  }

  async sendOtp(phoneNumber: string): Promise<{ status: string }> {
    try {
      const verification = await this.client.verify.v2
        .services(this.verifyServiceSid)
        .verifications.create({ to: phoneNumber, channel: 'sms' });
      this.logger.log(`OTP sent to ${phoneNumber}: ${verification.sid}`);
      return { status: verification.status };
    } catch (error) {
      this.logger.error(
        `Failed to send OTP to ${phoneNumber}: ${error.message}`,
      );
      throw new BadRequestException(`Failed to send OTP: ${error.message}`);
    }
  }

  async verifyOtp(phoneNumber: string, code: string): Promise<boolean> {
    try {
      const check = await this.client.verify.v2
        .services(this.verifyServiceSid)
        .verificationChecks.create({ to: phoneNumber, code });

      if (check.status !== 'approved') {
        throw new BadRequestException('OTP verification failed');
      }
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to verify OTP for ${phoneNumber}: ${error.message}`,
      );
      throw new BadRequestException(`Failed to verify OTP: ${error.message}`);
    }
  }
}
