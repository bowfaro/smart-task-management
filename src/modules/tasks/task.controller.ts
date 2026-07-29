import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtAuth } from 'src/common/decorators/jwt-auth.decorator';
import { ApiTags } from 'node_modules/@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { MessageResponse } from 'src/common/types/response';
import { TaskResponse } from './types/task-res.type';
import { TaskStatus } from 'src/common/constants/enum';
import { UpdateTaskStatusDto } from './dto/updatee-task.dto';

@JwtAuth()
@ApiBearerAuth()
@ApiTags('Tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  @Get()
  getTasks(@Request() req) {
    const userId = req.userLogged.id;
    return this.taskService.getTasks(userId);
  }

  @Get(':id')
  getTaskById(@Param('id') taskId: string): Promise<TaskResponse> {
    return this.taskService.getTaskById(taskId);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Request() req,
  ): Promise<MessageResponse> {
    const userId = req.userLogged.id;
    return this.taskService.createTask(createTaskDto, userId);
  }

  @Patch(':id')
  updateTask(
    @Body() updateTaskDto: CreateTaskDto,
    @Param('id') taskId: string,
  ): Promise<MessageResponse> {
    return this.taskService.updateTask(taskId, updateTaskDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Cập nhật trạng thái task' })
  updateTaskStatus(
    @Param('id') taskId: string,
    @Body() statusDto: UpdateTaskStatusDto,
  ): Promise<MessageResponse> {
    return this.taskService.updateTaskStatus(taskId, statusDto.status);
  }
}
