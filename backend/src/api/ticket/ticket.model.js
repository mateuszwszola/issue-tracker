import { Model } from 'objection';
import tableNames from '../../constants/tableNames';

class Ticket extends Model {
  static get tableName() {
    return tableNames.ticket;
  }

  static async beforeDelete({ asFindQuery, cancelQuery }) {
    const [numAffectedRows] = await asFindQuery().patch({
      archived_at: new Date().toISOString(),
    });

    cancelQuery(numAffectedRows);
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['key', 'name', 'type_id', 'status_id', 'priority_id'],

      properties: {
        id: { type: 'integer' },
        project_id: { type: ['integer', 'null'] },
        key: { type: 'string', minLength: 1, maxLength: 100 },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        description: { type: 'string', minLength: 1, maxLength: 255 },
        parent_id: { type: ['integer', 'null'] },
        type_id: { type: 'integer' },
        status_id: { type: 'integer' },
        priority_id: { type: 'integer' },
        reporter_id: { type: ['integer', 'null'] },
        archived_at: { type: ['string', 'null'] },
      },
    };
  }

  static get relationMappings() {
    const { User } = require('../user/user.model');
    const { Project } = require('../project/project.model');
    const { TicketType } = require('./ticketType/ticketType.model');
    const { TicketStatus } = require('./ticketStatus/ticketStatus.model');
    const { TicketPriority } = require('./ticketPriority/ticketPriority.model');

    return {
      project: {
        relation: Model.BelongsToOneRelation,
        modelClass: Project,
        join: {
          from: `${tableNames.ticket}.project_id`,
          to: `${tableNames.project}.id`,
        },
      },
      parentTicket: {
        relation: Model.BelongsToOneRelation,
        modelClass: Ticket,
        join: {
          from: `${tableNames.ticket}.parent_id`,
          to: `${tableNames.ticket}.id`,
        },
      },
      subTicket: {
        relation: Model.HasManyRelation,
        modelClass: Ticket,
        join: {
          from: `${tableNames.ticket}.id`,
          to: `${tableNames.ticket}.parent_id`,
        },
      },
      reporter: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: `${tableNames.ticket}.reporter_id`,
          to: `${tableNames.user}.id`,
        },
      },
      type: {
        relation: Model.BelongsToOneRelation,
        modelClass: TicketType,
        join: {
          from: `${tableNames.ticket}.type_id`,
          to: `${tableNames.ticket_type}.id`,
        },
      },
      status: {
        relation: Model.BelongsToOneRelation,
        modelClass: TicketStatus,
        join: {
          from: `${tableNames.ticket}.status_id`,
          to: `${tableNames.ticket_status}.id`,
        },
      },
      priority: {
        relation: Model.BelongsToOneRelation,
        modelClass: TicketPriority,
        join: {
          from: `${tableNames.ticket}.priority_id`,
          to: `${tableNames.ticket_priority}.id`,
        },
      },
    };
  }
}

export { Ticket };