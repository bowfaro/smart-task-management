import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtAuth } from 'src/common/decorators/jwt-auth.decorator';
import { ApiTags } from 'node_modules/@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MessageResponse } from 'src/common/types/response';
import { TaskListResponse, TaskResponse } from './types/task-res.type';
import { UpdateTaskStatusDto } from './dto/updatee-task.dto';

@JwtAuth()
@ApiBearerAuth()
@ApiTags('Tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách task của người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách task',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy task',
  })
  @ApiResponse({
    status: 401,
    description: 'Không có quyền truy cập',
  })
  getTasks(
    @Request() req,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ): Promise<TaskListResponse> {
    const userId = req.userLogged.id;
    const pagination = { page: page || 1, limit: limit || 10 };
    return this.taskService.getTasks(userId, pagination, status, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết task' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin chi tiết task',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy task',
  })
  @ApiResponse({
    status: 401,
    description: 'Không có quyền truy cập',
  })
  getTaskById(@Param('id') taskId: string): Promise<TaskResponse> {
    return this.taskService.getTaskById(taskId);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo task mới' })
  @ApiResponse({
    status: 201,
    description: 'Task được tạo thành công',
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu không hợp lệ',
  })
  @ApiResponse({
    status: 401,
    description: 'Không có quyền truy cập',
  })
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Request() req,
  ): Promise<MessageResponse> {
    const userId = req.userLogged.id;
    return this.taskService.createTask(createTaskDto, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật task' })
  @ApiResponse({
    status: 200,
    description: 'Task được cập nhật thành công',
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu không hợp lệ',
  })
  @ApiResponse({
    status: 401,
    description: 'Không có quyền truy cập',
  })
  updateTask(
    @Body() updateTaskDto: CreateTaskDto,
    @Param('id') taskId: string,
  ): Promise<MessageResponse> {
    return this.taskService.updateTask(taskId, updateTaskDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Cập nhật trạng thái task' })
  @ApiResponse({
    status: 200,
    description: 'Trạng thái task được cập nhật thành công',
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu không hợp lệ',
  })
  @ApiResponse({
    status: 401,
    description: 'Không có quyền truy cập',
  })
  updateTaskStatus(
    @Param('id') taskId: string,
    @Body() statusDto: UpdateTaskStatusDto,
  ): Promise<MessageResponse> {
    return this.taskService.updateTaskStatus(taskId, statusDto.status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa task' })
  @ApiResponse({
    status: 200,
    description: 'Task được xóa thành công',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy task',
  })
  @ApiResponse({
    status: 401,
    description: 'Không có quyền truy cập',
  })
  deleteTask(@Param('id') taskId: string): Promise<MessageResponse> {
    return this.taskService.deleteTask(taskId);
  }
}
