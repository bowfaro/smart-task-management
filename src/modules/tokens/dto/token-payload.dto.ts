import { IsNotEmpty } from '@nestjs/class-validator';

export class TokenPayloadDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  phone: string;
}
