import { Pool } from 'pg';
import config from './config';
const {
  isProd,
  db: { user, host, database, password, port },
} = config;

const connectionString = isProd
  ? process.env.DATABASE_URL
  : `postgresql://${user}:${password}@${host}:${port}/${database}`;

const pool = new Pool({
  connectionString,
  ssl: isProd,
});

export default pool;
