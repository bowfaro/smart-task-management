import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from 'src/database/entities/task.entity';
import {
  Between,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { MessageResponse } from 'src/common/types/response';
import { UserService } from '../users/user.service';
import { MESSAGE } from 'src/common/constants/message';
import { TaskListResponse, TaskResponse } from './types/task-res.type';
import { TaskStatus } from 'src/common/constants/enum';
import { Pagination } from 'src/common/types/pagination';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    private readonly userService: UserService,
  ) {}

  async getTasks(
    userId: string,
    pagination: Pagination,
    status?: string,
    search?: string,
    fromDate?: string,
    toDate?: string,
  ): Promise<TaskListResponse> {
    const parsedFromDate = fromDate ? new Date(fromDate) : undefined;
    const parsedToDate = toDate ? new Date(toDate) : undefined;

    if (fromDate && Number.isNaN(parsedFromDate?.getTime())) {
      throw new BadRequestException(
        'fromDate is invalid. Use ISO date format.',
      );
    }

    if (toDate && Number.isNaN(parsedToDate?.getTime())) {
      throw new BadRequestException('toDate is invalid. Use ISO date format.');
    }

    if (parsedFromDate && parsedToDate && parsedFromDate > parsedToDate) {
      throw new BadRequestException(
        'fromDate must be less than or equal to toDate.',
      );
    }

    const page = Number(pagination.page) || 1;
    const limit = Number(pagination.limit) || 10;

    const query = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.tags', 'tags')
      .where('task.userId = :userId', { userId })
      .orderBy('task.createdAt', 'DESC');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere('task.title LIKE :search', {
        search: `%${search.trim()}%`,
      });
    }

    if (parsedFromDate && parsedToDate) {
      query.andWhere('task.startAt BETWEEN :fromDate AND :toDate', {
        fromDate: parsedFromDate,
        toDate: parsedToDate,
      });
    } else if (parsedFromDate) {
      query.andWhere('task.startAt >= :fromDate', {
        fromDate: parsedFromDate,
      });
    } else if (parsedToDate) {
      query.andWhere('task.startAt <= :toDate', {
        toDate: parsedToDate,
      });
    }

    const [tasks, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items: tasks,
      total,
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
    const existingTask = await this.taskRepository.findOne({
      where: { title: createTaskDto.title, userId },
    });

    if (existingTask) {
      throw new NotFoundException(MESSAGE.TASK_EXISTS);
    }

    const task = this.taskRepository.create({
      ...createTaskDto,
      userId,
    });
    await this.taskRepository.save(task);
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

  async deleteTask(taskId: string): Promise<MessageResponse> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(MESSAGE.TASK_NOT_FOUND);
    }
    await this.taskRepository.remove(task);
    return {
      statusCode: 200,
      message: MESSAGE.TASK_DELETED,
    };
  }

  async addTagsToTask(
    taskId: string,
    tagIds: string[],
  ): Promise<MessageResponse> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: { tags: true },
    });

    if (!task) {
      throw new NotFoundException(MESSAGE.TASK_NOT_FOUND);
    }

    const existingTagIds = task.tags.map((tag) => tag.id);
    const newTagIds = tagIds.filter((tagId) => !existingTagIds.includes(tagId));

    if (newTagIds.length > 0) {
      await this.taskRepository
        .createQueryBuilder()
        .relation('tags')
        .of(taskId)
        .add(newTagIds);
    }

    return { message: MESSAGE.TASK_TAGS_ADDED };
  }
}
