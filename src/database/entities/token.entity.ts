import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('token')
export class TokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 4096 })
  refreshToken: string;

  @Column({ length: 4096 })
  refreshPublicKey: string;

  @Column({ length: 4096 })
  accessPublicKey: string;

  @Column()
  expiresAt: Date;

  @Column()
  userId: string;
}
