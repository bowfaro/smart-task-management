import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from 'src/database/entities/task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { MessageResponse } from 'src/common/types/response';
import { UserService } from '../users/user.service';
import { MESSAGE } from 'src/common/constants/message';
import { TaskListResponse, TaskResponse } from './types/task-res.type';
import { TaskStatus } from 'src/common/constants/enum';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    private readonly userService: UserService,
  ) {}

  async getTasks(userId: string): Promise<TaskListResponse> {
    const tasks = await this.taskRepository.find({
      where: { user_id: userId },
    });
    return {
      items: tasks,
      total: tasks.length,
    };
  }

  async getTaskById(taskId: string): Promise<TaskResponse> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(MESSAGE.TASK_NOT_FOUND);
    }
    return task;
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    userId: string,
  ): Promise<MessageResponse> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException(MESSAGE.USER_NOT_FOUND);
    }

    const task = this.taskRepository.create({
      ...createTaskDto,
      user_id: userId,
    });
    this.taskRepository.save(task);
    return {
      statusCode: 201,
      message: MESSAGE.TASK_CREATED,
    };
  }

  async updateTask(
    taskId: string,
    updateTaskDto: CreateTaskDto,
  ): Promise<MessageResponse> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(MESSAGE.TASK_NOT_FOUND);
    }
    Object.assign(task, updateTaskDto);
    await this.taskRepository.save(task);
    return {
      statusCode: 200,
      message: MESSAGE.TASK_UPDATED,
    };
  }

  async updateTaskStatus(
    taskId: string,
    status: TaskStatus,
  ): Promise<MessageResponse> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(MESSAGE.TASK_NOT_FOUND);
    }
    task.status = status;
    await this.taskRepository.save(task);
    return {
      statusCode: 200,
      message: MESSAGE.TASK_STATUS_UPDATED,
    };
  }
}
