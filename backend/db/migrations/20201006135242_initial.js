const tableNames = require('../../src/constants/tableNames');
const { createNameTable } = require('../../src/utils/tableHelpers');
const fn = require('../../src/utils/tableCreation');

exports.up = async (knex) => {
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

  await fn.createSprintTable(knex);
  await fn.createUserTable(knex);
  await fn.createProjectTable(knex);
  await Promise.all([
    fn.createProjectEngineerTable(knex),
    fn.createTicketTable(knex),
  ]);
  await fn.createAttachmentTable(knex);
  await fn.createTicketEngineerTable(knex);
  await fn.createSubTicketTable(knex);
  await fn.createTicketCommentTable(knex);
  await fn.createEpicTicketTable(knex);
  await fn.createSprintTicketTable(knex);
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists(tableNames.project_engineer);
  await knex.schema.dropTableIfExists(tableNames.ticket_engineer);
  await knex.schema.dropTableIfExists(tableNames.ticket_comment);
  await knex.schema.dropTableIfExists(tableNames.sub_ticket);
  await knex.schema.dropTableIfExists(tableNames.epic_ticket);
  await knex.schema.dropTableIfExists(tableNames.sprint_ticket);
  await knex.schema.dropTableIfExists(tableNames.epic);
  await knex.schema.dropTableIfExists(tableNames.sprint);
  await knex.schema.dropTableIfExists(tableNames.attachment);
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
    ].map((tableName) => knex.schema.dropTableIfExists(tableName))
  );
};
