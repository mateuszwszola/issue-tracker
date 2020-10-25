import 'dotenv/config';
import path from 'path';

export default {
  development: {
    client: 'pg',
    connection: {
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    },
    migrations: {
      directory: path.join(__dirname, 'db', 'migrations'),
    },
    seeds: {
      directory: path.join(__dirname, 'db', 'seeds', 'dev'),
    },
  },
  test: {
    client: 'pg',
    connection: {
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      port: 5430,
    },
    migrations: {
      directory: path.join(__dirname, 'db', 'migrations'),
    },
    seeds: {
      directory: path.join(__dirname, 'db', 'seeds', 'test'),
    },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, 'db', 'migrations'),
    },
    seeds: {
      directory: path.join(__dirname, 'db', 'seeds', 'prod'),
    },
  },
};
