import { resolve } from 'path';
import {
  Auth,
  Outbox,
  TheEntity,
  Rating,
  User,
  MediaOutbox,
  Media,
  MediaBatch,
} from '../entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const runningTs = __filename.endsWith('.ts');
const MIG_TS = resolve(__dirname, '../migrations/*.ts');
const MIG_JS = resolve(__dirname, '../migrations/*.js');

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [
    User,
    TheEntity,
    Rating,
    Outbox,
    Auth,
    MediaOutbox,
    Media,
    MediaBatch,
  ],
  migrations: [runningTs ? MIG_TS : MIG_JS],
  synchronize: true,
  // logging: !!process.env.DB_LOG,
};

export const AppDataSource = new DataSource(dataSourceOptions);
