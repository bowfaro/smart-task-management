import { ApiProperty } from 'node_modules/@nestjs/swagger/dist/decorators/api-property.decorator';

export class CreateTaskDto {
  @ApiProperty()
  title: string;
  @ApiProperty({ required: false })
  description?: string;
  @ApiProperty({ required: false })
  startAt?: Date;
  @ApiProperty({ required: false })
  estimatedHours?: number;
  @ApiProperty({ required: false })
  priority?: number;
}
