import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { TaskEntity } from './task.entity';
import { TagEntity } from './tag.entity';

@Entity('user')
export class UserEntity {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ name: 'is_verified', type: 'boolean', default: false })
  isVerified: boolean;

  @Column({
    name: 'role',
    type: 'enum',
    enum: ['user', 'admin'],
    default: 'user',
  })
  role: string;

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
    nullable: true,
    type: 'datetime',
    default: () => 'NULL',
  })
  deletedAt: Date;

  @OneToMany(() => TaskEntity, (task) => task.user)
  tasks: TaskEntity[];

  @OneToMany(() => TagEntity, (tag) => tag.user)
  tags: TagEntity[];
}
