import {
  addTimestamps,
  addUrl,
  referenceTable,
  createNameTable,
} from './tableHelpers';
import tableNames from '../constants/tableNames';

const createProjectTypeTable = (knex) =>
  createNameTable(knex, tableNames.project_type);

const createTicketTypeTable = (knex) =>
  createNameTable(knex, tableNames.ticket_type);

const createTicketStatusTable = (knex) =>
  createNameTable(knex, tableNames.ticket_status);

const createTicketPriorityTable = (knex) =>
  createNameTable(knex, tableNames.ticket_priority);

const createGoalTable = (knex) =>
  createNameTable(knex, tableNames.goal, 'goal');

const createUserTable = (knex) =>
  knex.schema.createTable(tableNames.user, (table) => {
    table.increments().primary();
    table.string('sub').unique();
    table.string('name');
    table.string('email').unique().notNullable();
    addUrl(table, 'picture');
    table.boolean('is_admin').defaultTo(false);
    table.boolean('blocked').defaultTo(false);
    addTimestamps(table);
  });

const createProjectTable = (knex) =>
  knex.schema.createTable(tableNames.project, (table) => {
    table.increments().primary();
    table.string('key').unique();
    table.string('name').notNullable();
    referenceTable(table, 'type_id', tableNames.project_type, false).onDelete(
      'SET NULL'
    );
    referenceTable(table, 'manager_id', tableNames.user, false).onDelete(
      'SET NULL'
    );
    referenceTable(table, 'creator_id', tableNames.user, false).onDelete(
      'SET NULL'
    );
    table.datetime('archived_at');
    addTimestamps(table);
  });

const createProjectEngineerTable = (knex) =>
  knex.schema.createTable(tableNames.project_engineer, (table) => {
    table.increments().primary();
    referenceTable(table, 'project_id', tableNames.project).onDelete('CASCADE');
    referenceTable(table, 'user_id', tableNames.user).onDelete('CASCADE');
    addTimestamps(table);
  });

const createTicketTable = (knex) =>
  knex.schema.createTable(tableNames.ticket, (table) => {
    table.increments().primary();
    table.string('key', 100).unique();
    table.string('name').notNullable();
    table.string('description');
    referenceTable(table, 'type_id', tableNames.ticket_type, false).onDelete(
      'SET NULL'
    );
    referenceTable(
      table,
      'status_id',
      tableNames.ticket_status,
      false
    ).onDelete('SET NULL');
    referenceTable(
      table,
      'priority_id',
      tableNames.ticket_priority,
      false
    ).onDelete('SET NULL');
    referenceTable(table, 'parent_id', tableNames.ticket, false).onDelete(
      'CASCADE'
    );
    referenceTable(table, 'project_id', tableNames.project).onDelete('CASCADE');
    referenceTable(table, 'reporter_id', tableNames.user, false).onDelete(
      'SET NULL'
    );
    referenceTable(table, 'assignee_id', tableNames.user, false).onDelete(
      'SET NULL'
    );
    table.datetime('archived_at');
    addTimestamps(table);
  });

const createTicketCommentTable = (knex) =>
  knex.schema.createTable(tableNames.ticket_comment, (table) => {
    table.increments().primary();
    table.string('comment').notNullable();
    referenceTable(table, 'ticket_id', tableNames.ticket).onDelete('CASCADE');
    referenceTable(table, 'user_id', tableNames.user, false).onDelete(
      'SET NULL'
    );
    addTimestamps(table);
  });

const createEpicTicketTable = (knex) =>
  knex.schema.createTable(tableNames.epic_ticket, (table) => {
    table.increments().primary();
    referenceTable(table, 'epic_id', tableNames.epic).onDelete('CASCADE');
    referenceTable(table, 'ticket_id', tableNames.ticket).onDelete('CASCADE');
  });

const createSprintTicketTable = (knex) =>
  knex.schema.createTable(tableNames.sprint_ticket, (table) => {
    table.increments().primary();
    referenceTable(table, 'sprint_id', tableNames.sprint).onDelete('CASCADE');
    referenceTable(table, 'ticket_id', tableNames.ticket).onDelete('CASCADE');
  });

const createEpicTable = (knex) =>
  knex.schema.createTable(tableNames.epic, (table) => {
    table.increments().primary();
    table.datetime('start_date');
    table.datetime('end_date');
    addTimestamps(table);
  });

const createSprintTable = (knex) =>
  knex.schema.createTable(tableNames.sprint, (table) => {
    table.increments().primary();
    table.string('name').notNullable();
    table.datetime('start_date');
    table.datetime('end_date');
    referenceTable(table, 'goal_id', tableNames.goal, false).onDelete(
      'SET NULL'
    );
    addTimestamps(table);
  });

const createAttachmentTable = (knex) =>
  knex.schema.createTable(tableNames.attachment, (table) => {
    table.increments().primary();
    referenceTable(table, 'ticket_id', tableNames.ticket, false).onDelete(
      'SET NULL'
    );
    addUrl(table, 'attachment_url');
    addTimestamps(table);
  });

export default {
  [tableNames.user]: createUserTable,
  [tableNames.project]: createProjectTable,
  [tableNames.project_type]: createProjectTypeTable,
  [tableNames.project_engineer]: createProjectEngineerTable,
  [tableNames.ticket]: createTicketTable,
  [tableNames.ticket_type]: createTicketTypeTable,
  [tableNames.ticket_status]: createTicketStatusTable,
  [tableNames.ticket_priority]: createTicketPriorityTable,
  [tableNames.ticket_comment]: createTicketCommentTable,
  [tableNames.epic]: createEpicTable,
  [tableNames.epic_ticket]: createEpicTicketTable,
  [tableNames.sprint]: createSprintTable,
  [tableNames.sprint_ticket]: createSprintTicketTable,
  [tableNames.goal]: createGoalTable,
  [tableNames.attachment]: createAttachmentTable,
};
