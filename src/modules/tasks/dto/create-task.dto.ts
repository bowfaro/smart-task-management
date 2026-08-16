import { IsDate, IsOptional } from '@nestjs/class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from 'node_modules/@nestjs/swagger/dist/decorators/api-property.decorator';

export class CreateTaskDto {
  @ApiProperty()
  title: string;
  @ApiProperty({ required: false })
  description?: string;
  @ApiProperty({
    required: false,
    example: '2026-08-14T22:00:00.000Z',
    format: 'date-time',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startAt?: Date;
  @ApiProperty({ required: false })
  estimatedHours?: number;
  @ApiProperty({ required: false })
  priority?: number;
}
