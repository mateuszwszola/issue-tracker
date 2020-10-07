const { addTimestamps, addUrl, referenceTable } = require('./tableHelpers');
const tableNames = require('../constants/tableNames');

function createUserTable(knex) {
  return knex.schema.createTable(tableNames.user, (table) => {
    table.increments().notNullable();
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('location', 50);
    table.boolean('blocked');
    addUrl(table, 'avatar_url');
    referenceTable(table, 'role_id', tableNames.role);
    addTimestamps(table);
  });
}

function createProjectTable(knex) {
  return knex.schema.createTable(tableNames.project, (table) => {
    table.increments().notNullable();
    table.string('key', 100).notNullable().unique();
    table.string('name').notNullable().unique();
    table.string('description');
    referenceTable(table, 'owner_id', tableNames.user);
    referenceTable(table, 'manager_id', tableNames.user);
    referenceTable(table, 'type_id', tableNames.project_type);
    referenceTable(table, 'status_id', tableNames.project_status);
    addTimestamps(table);
  });
}

function createProjectEngineerTable(knex) {
  return knex.schema.createTable(tableNames.project_engineer, (table) => {
    table.increments().notNullable();
    referenceTable(table, 'project_id', tableNames.project);
    referenceTable(table, 'user_id', tableNames.user);
    addTimestamps(table);
  });
}

function createTicketTable(knex) {
  return knex.schema.createTable(tableNames.ticket, (table) => {
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
  });
}

function createTicketEngineerTable(knex) {
  return knex.schema.createTable(tableNames.ticket_engineer, (table) => {
    table.increments().notNullable();
    referenceTable(table, 'ticket_id', tableNames.ticket);
    referenceTable(table, 'user_id', tableNames.user);
    addTimestamps(table);
  });
}

function createSubTicketTable(knex) {
  return knex.schema.createTable(tableNames.sub_ticket, (table) => {
    table.increments().notNullable();
    referenceTable(table, 'parent_ticket_id', tableNames.ticket);
    referenceTable(table, 'sub_ticket_id', tableNames.ticket);
    addTimestamps(table);
  });
}

function createTicketCommentTable(knex) {
  return knex.schema.createTable(tableNames.ticket_comment, (table) => {
    table.increments().notNullable();
    table.string('comment').notNullable();
    referenceTable(table, 'ticket_id', tableNames.ticket);
    referenceTable(table, 'user_id', tableNames.user);
    addTimestamps(table);
  });
}

function createEpicTicketTable(knex) {
  return knex.schema.createTable(tableNames.epic_ticket, (table) => {
    table.increments().notNullable();
    referenceTable(table, 'epic_id', tableNames.epic);
    referenceTable(table, 'ticket_id', tableNames.ticket);
  });
}

function createSprintTicketTable(knex) {
  return knex.schema.createTable(tableNames.sprint_ticket, (table) => {
    table.increments().notNullable();
    referenceTable(table, 'sprint_id', tableNames.sprint);
    referenceTable(table, 'ticket_id', tableNames.ticket);
  });
}

function createEpicTable(knex) {
  return knex.schema.createTable(tableNames.epic, (table) => {
    table.increments().notNullable();
    table.datetime('start_date');
    table.datetime('end_date');
  });
}

function createSprintTable(knex) {
  return knex.schema.createTable(tableNames.sprint, (table) => {
    table.increments().notNullable();
    table.string('name').notNullable();
    table.datetime('start_date');
    table.datetime('end_date');
    referenceTable(table, 'goal_id', tableNames.goal);
  });
}

function createAttachmentTable(knex) {
  return knex.schema.createTable(tableNames.attachment, (table) => {
    table.increments().notNullable();
    referenceTable(table, 'ticket_id', tableNames.ticket);
    addUrl(table, 'attachment_url');
    addTimestamps(table);
  });
}

module.exports = {
  createUserTable,
  createProjectTable,
  createProjectEngineerTable,
  createTicketTable,
  createTicketEngineerTable,
  createSubTicketTable,
  createTicketCommentTable,
  createEpicTicketTable,
  createSprintTicketTable,
  createEpicTable,
  createSprintTable,
  createAttachmentTable,
};
