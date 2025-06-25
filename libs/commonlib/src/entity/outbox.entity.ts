import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base_entity.entity';

export type OutboxStatus = 'pending' | 'published';

@Entity('outbox')
export class Outbox extends BaseEntity {
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

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date | null;
}
