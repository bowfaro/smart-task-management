import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { TaskEntity } from './task.entity';

@Index(['userId', 'name'], { unique: true })
@Entity('tag')
export class TagEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', length: 100 })
  name: string;
  @Column({ name: 'user_id', type: 'varchar', length: 36 })
  userId: string;
  @Column({ name: 'color_code', type: 'varchar', length: 36 })
  colorCode: string;
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

  @ManyToOne(() => UserEntity, (user) => user.tags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToMany(() => TaskEntity, (task) => task.tags)
  tasks: TaskEntity[];
}
