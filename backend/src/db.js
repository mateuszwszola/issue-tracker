import knex from 'knex';
import config from './config';
import knexConfig from '../knexfile';

const connectionConfig = knexConfig[config.env];

const connection = knex(connectionConfig);

export default connection;
