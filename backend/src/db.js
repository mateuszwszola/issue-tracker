import { Pool } from 'pg';
import config from './config';
const {
  db: { user, host, database, password, port },
} = config;

const pool = new Pool({
  user,
  host,
  database,
  password,
  port,
});

export default pool;
