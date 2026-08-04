import { IsNotEmpty } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNewAcDto {
  @IsNotEmpty()
  @ApiProperty()
  refreshToken: string;
}
