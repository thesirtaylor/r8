import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

export type OutboxStatus = 'pending' | 'published';

@Entity('outbox')
export class Outbox {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('UQ_OUTBOX_IDEMPOTENCY_KEY', { unique: true })
  @Column()
  idempotencyKey: string;

  @Column()
  eventType: string;

  @Column('text')
  payload: string;

  @Index('IDX_OUTBOX_STATUS')
  @Column({ type: 'enum', enum: ['pending', 'published'], default: 'pending' })
  status: OutboxStatus;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date | null;
}
