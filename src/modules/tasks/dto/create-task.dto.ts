import { ApiProperty } from 'node_modules/@nestjs/swagger/dist/decorators/api-property.decorator';

export class CreateTaskDto {
  @ApiProperty()
  title: string;
  @ApiProperty({ required: false })
  description?: string;
  @ApiProperty({ required: false })
  start_at?: Date;
  @ApiProperty({ required: false })
  estimated_hours?: number;
}
