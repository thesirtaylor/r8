import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { RateEntity } from './rate_entity.entity';
import { User } from './user.entity';
import { BaseEntity } from './base_entity.entity';

@Entity({ name: 'rating' })
@Index('IDX_RATING_ENTITY', ['entity'])
@Index('IDX_RATINGS_ENTITY_DATE', ['entity', 'createdAt'])
export class Rating extends BaseEntity {
  @ManyToOne(() => RateEntity, (entity) => entity.ratings, {
    onDelete: 'CASCADE',
  })
  entity: RateEntity;

  @ManyToOne(() => User, (user) => user.ratings, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'smallint' })
  score: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'text', array: true, nullable: true })
  tags: string[];
}
