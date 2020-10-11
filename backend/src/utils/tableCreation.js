import {
  addTimestamps,
  addUrl,
  referenceTable,
  createNameTable,
} from './tableHelpers';
import tableNames from '../constants/tableNames';

const createRoleTable = (knex) => createNameTable(knex, tableNames.role);

const createProjectTypeTable = (knex) =>
  createNameTable(knex, tableNames.project_type);

const createProjectStatusTable = (knex) =>
  createNameTable(knex, tableNames.project_status);

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
    table.increments().notNullable();
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('location', 50);
    table.boolean('blocked');
    addUrl(table, 'avatar_url');
    referenceTable(table, 'role_id', tableNames.role);
    addTimestamps(table);
  });

const createProjectTable = (knex) =>
  knex.schema.createTable(tableNames.project, (table) => {
    table.increments().notNullable();
    table.string('key', 100).notNullable().unique();
    table.string('name').notNullable().unique();
    table.string('description');
    referenceTable(table, 'owner_id', tableNames.user);
    referenceTable(table, 'manager_id', tableNames.user);
    referenceTable(table, 'type_id', tableNames.project_type);
    referenceTable(table, 'status_id', tableNames.project_status);
    addTimestamps(table);
    table.datetime('deleted_at');
  });

const createProjectEngineerTable = (knex) =>
  knex.schema.createTable(tableNames.project_engineer, (table) => {
    table.increments().notNullable();
    referenceTable(table, 'project_id', tableNames.project);
    referenceTable(table, 'user_id', tableNames.user);
    addTimestamps(table);
  });

const createTicketTable = (knex) =>
  knex.schema.createTable(tableNames.ticket, (table) => {
    table.increments().notNullable();
    table.string('key', 100).notNullable().unique();
    table.string('name').notNullable();
    table.string('description');
    referenceTable(table, 'type_id', tableNames.ticket_type);
    referenceTable(table, 'status_id', tableNames.ticket_status);
    referenceTable(table, 'priority_id', tableNames.ticket_priority);
    referenceTable(table, 'project_id', tableNames.project);
    referenceTable(table, 'reporter_id', tableNames.user);
    addTimestamps(table);
    table.datetime('deleted_at');
  });

const createTicketEngineerTable = (knex) =>
  knex.schema.createTable(tableNames.ticket_engineer, (table) => {
    table.increments().notNullable();
    referenceTable(table, 'ticket_id', tableNames.ticket);
    referenceTable(table, 'user_id', tableNames.user);
    addTimestamps(table);
  });

const createSubTicketTable = (knex) =>
  knex.schema.createTable(tableNames.sub_ticket, (table) => {
    table.increments().notNullable();
    referenceTable(table, 'parent_ticket_id', tableNames.ticket);
    referenceTable(table, 'sub_ticket_id', tableNames.ticket);
    addTimestamps(table);
  });

const createTicketCommentTable = (knex) =>
  knex.schema.createTable(tableNames.ticket_comment, (table) => {
    table.increments().notNullable();
    table.string('comment').notNullable();
    referenceTable(table, 'ticket_id', tableNames.ticket);
    referenceTable(table, 'user_id', tableNames.user);
    addTimestamps(table);
  });

const createEpicTicketTable = (knex) =>
  knex.schema.createTable(tableNames.epic_ticket, (table) => {
    table.increments().notNullable();
    referenceTable(table, 'epic_id', tableNames.epic);
    referenceTable(table, 'ticket_id', tableNames.ticket);
  });

const createSprintTicketTable = (knex) =>
  knex.schema.createTable(tableNames.sprint_ticket, (table) => {
    table.increments().notNullable();
    referenceTable(table, 'sprint_id', tableNames.sprint);
    referenceTable(table, 'ticket_id', tableNames.ticket);
  });

const createEpicTable = (knex) =>
  knex.schema.createTable(tableNames.epic, (table) => {
    table.increments().notNullable();
    table.datetime('start_date');
    table.datetime('end_date');
  });

const createSprintTable = (knex) =>
  knex.schema.createTable(tableNames.sprint, (table) => {
    table.increments().notNullable();
    table.string('name').notNullable();
    table.datetime('start_date');
    table.datetime('end_date');
    referenceTable(table, 'goal_id', tableNames.goal);
  });

const createAttachmentTable = (knex) =>
  knex.schema.createTable(tableNames.attachment, (table) => {
    table.increments().notNullable();
    referenceTable(table, 'ticket_id', tableNames.ticket);
    addUrl(table, 'attachment_url');
    addTimestamps(table);
  });

export default {
  [tableNames.user]: createUserTable,
  [tableNames.role]: createRoleTable,
  [tableNames.project]: createProjectTable,
  [tableNames.project_type]: createProjectTypeTable,
  [tableNames.project_status]: createProjectStatusTable,
  [tableNames.project_engineer]: createProjectEngineerTable,
  [tableNames.ticket]: createTicketTable,
  [tableNames.sub_ticket]: createSubTicketTable,
  [tableNames.ticket_type]: createTicketTypeTable,
  [tableNames.ticket_status]: createTicketStatusTable,
  [tableNames.ticket_priority]: createTicketPriorityTable,
  [tableNames.ticket_comment]: createTicketCommentTable,
  [tableNames.ticket_engineer]: createTicketEngineerTable,
  [tableNames.epic]: createEpicTable,
  [tableNames.epic_ticket]: createEpicTicketTable,
  [tableNames.sprint]: createSprintTable,
  [tableNames.sprint_ticket]: createSprintTicketTable,
  [tableNames.goal]: createGoalTable,
  [tableNames.attachment]: createAttachmentTable,
};
