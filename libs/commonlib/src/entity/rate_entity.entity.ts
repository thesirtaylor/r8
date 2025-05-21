import { IsEnum } from 'class-validator';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Rating } from './rating.entity';
import { BaseEntity } from './base_entity.entity';

export enum EntityType {
  PRODUCT = 'product',
  PERSON = 'person',
  SERVICE = 'service',
  EXPEREINCE = 'experience',
  EVENT = 'event',
}

@Entity({ name: 'entities' })
@Index('IDX_ENTITIES_TYPE', ['type'])
@Index('IDX_ENTITIES_NAME', ['name'])
export class RateEntity extends BaseEntity {
  @IsEnum(EntityType)
  @Column({ type: 'enum', enum: EntityType })
  type: EntityType;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'varchar', length: 225, nullable: true })
  street: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  state: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  googlePlaceId: string;

  @Column('double precision', { nullable: true })
  latitude: number;

  @Column('double precision', { nullable: true })
  longitude: number;

  @Column({ type: 'jsonb', nullable: true })
  socials: Record<string, any>;

  @OneToMany(() => Rating, (rating) => rating.entity)
  ratings: Rating[];
}
