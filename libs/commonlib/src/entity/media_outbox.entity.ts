import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base_entity.entity';
import { OutboxStatus } from './outbox.entity';
import { MediaBatch } from './media_batch.entity';

@Entity('media_outbox')
@Index('IDX_MEDIA_OUTBOX_STATUS', ['status'])
@Index('IDX_MEDIA_OUTBOX_IDEMPOTENCY_KEY', ['idempotencyKey'], { unique: true })
export class MediaOutbox extends BaseEntity {
  @Column({ type: 'text', nullable: false })
  idempotencyKey!: string;

  @Column({ type: 'enum', enum: ['pending', 'published'], default: 'pending' })
  status: OutboxStatus;

  @Column()
  eventType: string;

  @Column('text')
  payload: string;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date | null;

  @OneToOne(() => MediaBatch, (batch) => batch.outbox)
  @JoinColumn()
  batch: MediaBatch;

  @Column({ name: 'batch_id', type: 'uuid', unique: true })
  batchId!: string;

  @Column({ type: 'int', default: 0 })
  attempts!: number;

  @Column({ type: 'timestamptz', nullable: true })
  nextAttemptAt!: Date | null;
}
//outbox for elasticsearch media events
//this entity is used to store media events that need to be processed by the search engine
