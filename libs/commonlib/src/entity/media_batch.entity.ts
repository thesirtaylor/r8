import { Column, Entity, Index, OneToMany, OneToOne, Unique } from 'typeorm';
import { Media } from './media.entity';
import { MediaOutbox } from './media_outbox.entity';
import { BaseEntity } from './base_entity.entity';

export enum MediaBatchStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('media_batch')
@Index('IDX_MEDIA_BATCH_ENTITY_ID', ['entityId'])
@Index('IDX_MEDIA_BATCH_PROCESSED_AT', ['processedAt'])
@Unique('IDX_MEDIA_BATCH_ENTITY_ID_IDEMKEY', ['entityId', 'idempotencyKey'])
export class MediaBatch extends BaseEntity {
  @Column({ type: 'text', nullable: false })
  entityId!: string;

  @Column({ type: 'text', nullable: false })
  idempotencyKey!: string;

  @Column({
    type: 'enum',
    enum: MediaBatchStatus,
    default: MediaBatchStatus.PENDING,
  })
  status!: 'pending' | 'completed' | 'failed';

  @Column({ type: 'timestamptz', nullable: true })
  processedAt!: Date | null;

  @OneToMany(() => Media, (item) => item.batch)
  items: Media[];

  @OneToOne(() => MediaOutbox, (item) => item.batch)
  outbox: MediaOutbox;
}
