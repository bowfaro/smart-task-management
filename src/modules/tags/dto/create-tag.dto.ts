import { IsNotEmpty } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({ description: 'Tên tag', example: 'Công việc' })
  @IsNotEmpty()
  name: string;
  @ApiProperty({ description: 'Mã màu tag', example: '#FF5733' })
  @IsNotEmpty()
  color_code: string;
}
