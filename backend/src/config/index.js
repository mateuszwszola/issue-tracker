import { merge } from 'lodash';
import dotenv from 'dotenv';
dotenv.config();
const env = process.env.NODE_ENV || 'development';

const baseConfig = {
  env,
  isDev: env === 'development',
  isTest: env === 'testing',
  isProd: env === 'production',
  port: process.env.PORT || 3001,
  secrets: {},
  db: {
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
  },
};

let envConfig = {};

switch (env) {
  case 'dev':
  case 'development':
    envConfig = require('./dev').config;
    break;
  case 'test':
  case 'testing':
    envConfig = require('./testing').config;
    break;
  default:
    envConfig = require('./dev').config;
}

export default merge(baseConfig, envConfig);
