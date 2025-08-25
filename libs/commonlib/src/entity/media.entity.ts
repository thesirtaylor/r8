import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { BaseEntity } from './base_entity.entity';
import { TheEntity } from './the_entity.entity';
import { MediaBatch } from './media_batch.entity';

export enum MediaStatus {
  PENDING_UPLOAD = 'pending_upload',
  READY = 'ready',
  REJECTED = 'rejected',
  FAILED = 'failed',
}
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

@Entity({ name: 'media' })
@Index('IDX_MEDIA_ENTITY', ['entity'])
@Index('IDX_MEDIA_URL', ['url'])
@Index('IDX_MEDIA_ENTITY_TYPE', ['entityType'])
@Index('IDX_MEDIA_STATUS', ['status'])
export class Media extends BaseEntity {
  @ManyToOne(() => TheEntity, (entity) => entity.media, {
    onDelete: 'CASCADE',
  })
  entity: TheEntity;

  @ManyToOne(() => MediaBatch, (batch) => batch.items, {
    onDelete: 'CASCADE',
  })
  batch: MediaBatch;

  @Column({ type: 'uuid', nullable: false })
  batchId: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  url: string;

  @Column({ type: 'varchar', length: 50, nullable: false, name: 'entity_type' })
  entityType: string; // e.g., 'image', 'video'

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text' })
  cfId: string; //cloudflareid

  @Column({ type: 'text' })
  mime: string;

  @Column({ type: 'bigint' })
  size: string;

  @Column({
    type: 'enum',
    enum: MediaStatus,
    default: MediaStatus.PENDING_UPLOAD,
  })
  status: MediaStatus;

  @Column({ type: 'text', nullable: false })
  idempotencyKey!: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  expiresAt!: Date | null;
}
