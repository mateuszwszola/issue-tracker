import { Model } from 'objection';
import tableNames from '../../../constants/tableNames';

class Attachment extends Model {
  static get tableName() {
    return tableNames.attachment;
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['ticket_id', 'attachment_url'],

      properties: {
        id: { type: 'integer' },
        ticket_id: { type: 'integer' },
        attachment_url: { type: 'string' },
      },
    };
  }

  static get relationMappings() {
    const { Ticket } = require('../ticket.model');

    return {
      ticket: {
        relation: Model.BelongsToOneRelation,
        modelClass: Ticket,
        join: {
          from: `${tableNames.attachment}.ticket_id`,
          to: `${tableNames.ticket}.id`,
        },
      },
    };
  }
}

export { Attachment };
