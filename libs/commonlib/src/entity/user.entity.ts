import { Column, Entity, OneToMany } from 'typeorm';
import { Rating } from './rating.entity';
import { BaseEntity } from './base_entity.entity';
import { Auth } from './auth.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  username: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'text' })
  avatar: string;

  @OneToMany(() => Rating, (rating) => rating.user)
  ratings: Rating[];

  @OneToMany(() => Auth, (auth) => auth.user)
  auths: Auth[];
}
