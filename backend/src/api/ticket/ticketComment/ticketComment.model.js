import { Model } from 'objection';
import tableNames from '../../../constants/tableNames';

class TicketComment extends Model {
  static get tableName() {
    return tableNames.ticket_comment;
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['comment', 'ticket_id', 'user_id'],

      properties: {
        id: { type: 'integer' },
        ticket_id: { type: 'integer' },
        user_id: { type: 'integer' },
        comment: { type: 'string', minLength: 1, maxLength: 255 },
      },
    };
  }

  static get relationMappings() {
    const { Ticket } = require('../ticket.model');
    const { User } = require('../../user/user.model');

    return {
      ticket: {
        relation: Model.BelongsToOneRelation,
        modelClass: Ticket,
        join: {
          from: `${tableNames.ticket_comment}.ticket_id`,
          to: `${tableNames.ticket}.id`,
        },
      },
      author: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: `${tableNames.ticket_comment}.user_id`,
          to: `${tableNames.user}.id`,
        },
      },
    };
  }
}

export { TicketComment };
