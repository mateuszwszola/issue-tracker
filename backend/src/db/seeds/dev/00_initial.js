import 'dotenv/config';
import tableNames from '../../../constants/tableNames';
import { ROLES, roles } from '../../../constants/roles';
import { projectTypes, projectStatuses } from '../../../constants/project';
import {
  ticketTypes,
  ticketStatuses,
  ticketPriorities,
} from '../../../constants/ticket';

export async function seed(knex) {
  await Promise.all(
    Object.values(tableNames).map((tableName) => knex(tableName).del())
  );

  await Promise.all([
    knex(tableNames.project_type).insert(projectTypes),
    knex(tableNames.project_status).insert(projectStatuses),
    knex(tableNames.ticket_type).insert(ticketTypes),
    knex(tableNames.ticket_status).insert(ticketStatuses),
    knex(tableNames.ticket_priority).insert(ticketPriorities),
  ]);

  const rolesResult = await knex(tableNames.role)
    .returning(['name', 'id'])
    .insert(roles);

  const adminRoleId = rolesResult.find((entry) => entry.name === ROLES.admin)
    .id;

  await knex(tableNames.user).insert({
    name: process.env.ADMIN_USER_NAME,
    email: process.env.ADMIN_USER_EMAIL,
    role_id: adminRoleId,
  });
}
