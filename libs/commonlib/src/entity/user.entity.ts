import { Column, Entity, OneToMany } from 'typeorm';
import { Rating } from './rating.entity';
import { BaseEntity } from './base_entity.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @OneToMany(() => Rating, (rating) => rating.user)
  ratings: Rating[];
}
