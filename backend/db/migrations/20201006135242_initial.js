import tableNames from '../../src/constants/tableNames';
import { createNameTable } from '../../src/utils/tableHelpers';
import * as fn from '../../src/utils/tableCreation';

export async function up(knex) {
  await Promise.all([
    createNameTable(knex, tableNames.role),
    createNameTable(knex, tableNames.project_type),
    createNameTable(knex, tableNames.project_status),
    createNameTable(knex, tableNames.ticket_type),
    createNameTable(knex, tableNames.ticket_status),
    createNameTable(knex, tableNames.ticket_priority),
    createNameTable(knex, tableNames.goal, 'goal'),
    fn.createEpicTable(knex),
  ]);

  await fn.createUserTable(knex);
  await fn.createProjectTable(knex);
  await fn.createTicketTable(knex);

  await fn.createSprintTable(knex);

  await Promise.all([
    fn.createSprintTicketTable(knex),
    fn.createEpicTicketTable(knex),
  ]);

  await Promise.all([
    fn.createProjectEngineerTable(knex),
    fn.createTicketEngineerTable(knex),
    fn.createSubTicketTable(knex),
    fn.createTicketCommentTable(knex),
    fn.createAttachmentTable(knex),
  ]);
}

export async function down(knex) {
  await Promise.all(
    [
      tableNames.project_engineer,
      tableNames.ticket_engineer,
      tableNames.sub_ticket,
      tableNames.ticket_comment,
      tableNames.attachment,
    ].map((tableName) => knex.schema.dropTableIfExists(tableName))
  );

  await Promise.all(
    [tableNames.sprint_ticket, tableNames.epic_ticket].map((tableName) =>
      knex.schema.dropTableIfExists(tableName)
    )
  );

  await knex.schema.dropTableIfExists(tableNames.sprint);

  await knex.schema.dropTableIfExists(tableNames.ticket);
  await knex.schema.dropTableIfExists(tableNames.project);
  await knex.schema.dropTableIfExists(tableNames.user);

  await Promise.all(
    [
      tableNames.role,
      tableNames.project_type,
      tableNames.project_status,
      tableNames.ticket_type,
      tableNames.ticket_status,
      tableNames.ticket_priority,
      tableNames.goal,
      tableNames.epic,
    ].map((tableName) => knex.schema.dropTableIfExists(tableName))
  );
}
