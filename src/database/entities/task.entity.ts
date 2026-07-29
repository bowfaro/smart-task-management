import { TaskStatus } from 'src/common/constants/enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('task')
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'varchar', length: 36 })
  user_id: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TODO })
  status: TaskStatus;

  @Column({ type: 'int', default: 1 })
  priority: number;

  @Column({ type: 'date', nullable: true })
  start_at: Date;

  @Column({ type: 'date', nullable: true })
  due_at: Date;

  @Column({ type: 'int', default: 0 })
  estimated_hours: number;

  @Column({ type: 'float', precision: 10, scale: 2, default: 0 })
  smart_score: number;

  @Column({ type: 'datetime', nullable: true })
  done_at: Date;

  @Column({ type: 'varchar', length: 36, nullable: true })
  parent_id: string;

  @ManyToOne(() => TaskEntity, (task) => task.sub_tasks, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: TaskEntity;

  @OneToMany(() => TaskEntity, (task) => task.parent)
  sub_tasks: TaskEntity[];
}
