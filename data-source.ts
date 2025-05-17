import { join } from 'path';
import { RateEntity, Rating, User } from './src/entity';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User, RateEntity, Rating],
  migrations: [join(__dirname, 'src/migrations/*.{ts,js}')],
  synchronize: false,
  logging: !!process.env.DB_LOG,
});
