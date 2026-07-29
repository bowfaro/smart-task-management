import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tag')
export class TagEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', length: 100 })
  name: string;
  @Column({ type: 'varchar', length: 36 })
  user_id: string;
  @Column({ type: 'varchar', length: 36, nullable: true })
  color_code: string;
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
