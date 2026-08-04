import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('token')
export class TokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'refresh_token', length: 4096 })
  refreshToken: string;

  @Column({ name: 'refresh_public_key', length: 4096 })
  refreshPublicKey: string;

  @Column({ name: 'access_public_key', length: 4096 })
  accessPublicKey: string;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column({ name: 'user_id' })
  userId: string;

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
}
