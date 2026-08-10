import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { MessageResponse } from 'src/common/types/response';
import { ApiOperation } from 'node_modules/@nestjs/swagger/dist/decorators/api-operation.decorator';
import { TagListResponse } from './types/tag.type';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuth } from 'src/common/decorators/jwt-auth.decorator';

@JwtAuth()
@ApiBearerAuth()
@ApiTags('Tags')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tag của người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách tag',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy tag',
  })
  @ApiResponse({
    status: 401,
    description: 'Không có quyền truy cập',
  })
  getTags(@Request() req): Promise<TagListResponse> {
    const userId = req.userLogged.id;
    return this.tagService.getTags(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo tag mới' })
  @ApiResponse({
    status: 201,
    description: 'Tag được tạo thành công',
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu không hợp lệ',
  })
  createTag(
    @Body() createTagDto: CreateTagDto,
    @Request() req,
  ): Promise<MessageResponse> {
    const userId = req.userLogged.id;
    return this.tagService.createTag(createTagDto, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật tag' })
  @ApiResponse({
    status: 200,
    description: 'Tag được cập nhật thành công',
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu không hợp lệ',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy tag',
  })
  updateTag(
    @Param('id') tagId: string,
    @Body() updateTagDto: CreateTagDto,
  ): Promise<MessageResponse> {
    return this.tagService.updateTag(updateTagDto, tagId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa tag' })
  @ApiResponse({
    status: 200,
    description: 'Tag được xóa thành công',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy tag',
  })
  deleteTag(@Param('id') tagId: string): Promise<MessageResponse> {
    return this.tagService.deleteTag(tagId);
  }
}
