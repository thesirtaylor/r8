import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base_entity.entity';
import { User } from './user.entity';

// export type Provider = 'google' | 'apple' | 'twitter';
@Entity({ name: 'auth' })
export class Auth extends BaseEntity {
  @Column({ type: 'text' })
  access_token: string;

  @Column({ type: 'text' })
  refresh_token: string;

  //   @Column({ type: 'enum', enum: ['google', 'twitter', 'apple'] })
  //   provider: Provider;

  @ManyToOne(() => User, (user) => user.auths, { onDelete: 'CASCADE' })
  user: User;
}
