import { join } from 'path';
import { Auth, Outbox, RateEntity, Rating, User } from '../entity';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User, RateEntity, Rating, Outbox, Auth],
  migrations: [join(__dirname, 'apps/migrations/*.{ts,js}')],
  synchronize: true,
  // logging: !!process.env.DB_LOG,
});
