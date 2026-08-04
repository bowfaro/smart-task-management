import { TaskStatus } from 'src/common/constants/enum';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { TagEntity } from './tag.entity';
import { Max, Min } from '@nestjs/class-validator';

@Index(['userId', 'smartScore'])
@Entity('task')
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'varchar', length: 36 })
  userId: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TODO })
  status: TaskStatus;

  @Column({ type: 'int', default: 1 })
  @Min(1)
  @Max(5)
  priority: number;

  @Column({ name: 'start_at', type: 'date', nullable: true })
  startAt: Date;

  @Column({ name: 'due_at', type: 'date', nullable: true })
  dueAt: Date;

  @Column({
    name: 'estimated_hours',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  estimatedHours: number;

  @Column({
    name: 'smart_score',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  smartScore: number;

  @Column({ name: 'done_at', type: 'datetime', nullable: true })
  doneAt: Date;

  @Column({ name: 'parent_id', type: 'varchar', length: 36, nullable: true })
  parentId: string;

  @Column({
    name: 'created_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
  @Column({
    name: 'updated_at',
    type: 'datetime',
    nullable: true,
    default: () => 'NULL',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({
    name: 'deleted_at',
    type: 'datetime',
    nullable: true,
    default: () => 'NULL',
  })
  deletedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => TaskEntity, (task) => task.subTasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_id' })
  parentTask: TaskEntity;

  @OneToMany(() => TaskEntity, (task) => task.parentTask)
  subTasks: TaskEntity[];

  @ManyToMany(() => TagEntity, (tag) => tag.tasks)
  @JoinTable({
    name: 'task_tags',
    joinColumn: { name: 'task_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: TagEntity[];
}
