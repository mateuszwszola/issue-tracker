import knex from 'knex';
import config from './config';
const {
  isProd,
  db: { user, password, database, host, port },
} = config;

const connectionString = isProd
  ? process.env.DATABASE_URL
  : `postgresql://${user}:${password}@${host}:${port}/${database}`;

const pg = knex({
  client: 'pg',
  connection: connectionString,
});

export default pg;
