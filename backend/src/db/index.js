import Knex from 'knex';
import { Model } from 'objection';
import config from '../config';
import knexConfig from '../knexfile';

const knex = Knex(knexConfig[config.env]);

Model.knex(knex);

export default knex;
