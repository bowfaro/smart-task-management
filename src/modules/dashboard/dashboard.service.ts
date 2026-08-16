import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from 'src/database/entities/task.entity';
import { Repository } from 'typeorm';
import {
  UserStats,
  WeeklyActivityItem,
  TaskCounters,
} from './types/user_stats.type';
import { TaskStatus } from 'src/common/constants/enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { TaskListResponse } from '../tasks/types/task-res.type';

@Injectable()
export class DashboardService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async getStats(userId: string): Promise<UserStats> {
    const cacheKey = `dashboard:stats:${userId}`;
    const cachedStats = await this.cacheManager.get<UserStats>(cacheKey);
    if (cachedStats) {
      return cachedStats;
    }

    const [countersRow, weeklyRows] = await Promise.all([
      this.taskRepository
        .createQueryBuilder('task')
        .select('COUNT(*)', 'total')
        .addSelect(
          'SUM(CASE WHEN task.status = :todo THEN 1 ELSE 0 END)',
          'todo',
        )
        .addSelect(
          'SUM(CASE WHEN task.status = :inProgress THEN 1 ELSE 0 END)',
          'inProgress',
        )
        .addSelect(
          'SUM(CASE WHEN task.status = :done THEN 1 ELSE 0 END)',
          'done',
        )
        .where('task.userId = :userId', { userId })
        .andWhere('task.deletedAt IS NULL')
        .setParameters({
          todo: TaskStatus.TODO,
          inProgress: TaskStatus.IN_PROGRESS,
          done: TaskStatus.DONE,
        })
        .getRawOne<{
          total: string;
          todo: string;
          inProgress: string;
          done: string;
        }>(),
      this.taskRepository
        .createQueryBuilder('task')
        .select("DATE_FORMAT(task.startAt, '%Y-%m-%d')", 'dayKey')
        .addSelect('COUNT(*)', 'count')
        .where('task.userId = :userId', { userId })
        .andWhere('task.deletedAt IS NULL')
        .andWhere('task.startAt IS NOT NULL')
        .andWhere('task.startAt >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)')
        .groupBy("DATE_FORMAT(task.startAt, '%Y-%m-%d')")
        .orderBy('dayKey', 'ASC')
        .getRawMany<{ dayKey: string; count: string }>(),
    ]);

    const counters: TaskCounters = {
      todo: Number(countersRow?.todo ?? 0),
      inProgress: Number(countersRow?.inProgress ?? 0),
      done: Number(countersRow?.done ?? 0),
    };

    const totalTrackedTasks = Number(countersRow?.total ?? 0);
    const completionRate = totalTrackedTasks
      ? Math.round((counters.done / totalTrackedTasks) * 100)
      : 0;

    const activityByDate = new Map(
      weeklyRows.map((row) => [row.dayKey, Number(row.count)]),
    );
    const dayOrder = new Map([
      ['MON', 1],
      ['TUE', 2],
      ['WED', 3],
      ['THU', 4],
      ['FRI', 5],
      ['SAT', 6],
      ['SUN', 7],
    ]);

    const weeklyActivity: WeeklyActivityItem[] = Array.from(
      { length: 7 },
      (_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - index));

        const day = date
          .toLocaleDateString('en-US', { weekday: 'short' })
          .toUpperCase();
        const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

        return {
          day,
          count: activityByDate.get(dateKey) ?? 0,
        };
      },
    ).sort(
      (left, right) =>
        (dayOrder.get(left.day) ?? 0) - (dayOrder.get(right.day) ?? 0),
    );

    const result = {
      completionRate,
      counters,
      weeklyActivity,
    };

    await this.cacheManager.set(cacheKey, result, 300000);

    return result;
  }

  async getUpcomingTasks(userId: string): Promise<TaskListResponse> {
    const cacheKey = `dashboard:upcoming-tasks:${userId}`;
    const cachedTasks = await this.cacheManager.get<TaskListResponse>(cacheKey);
    if (cachedTasks) {
      return cachedTasks;
    }

    const tasks = await this.taskRepository
      .createQueryBuilder('task')
      .where('task.userId = :userId', { userId })
      .andWhere('task.deletedAt IS NULL')
      .andWhere('task.status != :doneStatus')
      .andWhere('(task.startAt IS NOT NULL OR task.dueAt IS NOT NULL)')
      .andWhere('COALESCE(task.startAt, task.dueAt) >= CURDATE()')
      .setParameter('doneStatus', TaskStatus.DONE)
      .orderBy('COALESCE(task.startAt, task.dueAt)', 'ASC')
      .take(6)
      .getMany();

    const result: TaskListResponse = {
      items: tasks,
      total: tasks.length,
    };

    await this.cacheManager.set(cacheKey, result, 120000);

    return result;
  }
}
