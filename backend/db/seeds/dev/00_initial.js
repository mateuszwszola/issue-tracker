import 'dotenv/config';
import tableNames from '../../../src/constants/tableNames';
import { projectTypes } from '../../../src/constants/project';
import {
  ticketTypes,
  ticketStatuses,
  ticketPriorities,
} from '../../../src/constants/ticket';

export async function seed(knex) {
  await Promise.all(
    Object.values(tableNames).map((tableName) => knex(tableName).del())
  );

  await Promise.all([
    knex(tableNames.project_type).insert(projectTypes),
    knex(tableNames.ticket_type).insert(ticketTypes),
    knex(tableNames.ticket_status).insert(ticketStatuses),
    knex(tableNames.ticket_priority).insert(ticketPriorities),
  ]);

  await knex(tableNames.user).returning('id').insert({
    name: process.env.ADMIN_USER_NAME,
    email: process.env.ADMIN_USER_EMAIL,
  });
}
