import { Model } from 'objection';
import tableNames from '../../../constants/tableNames';

class TicketType extends Model {
  static get tableName() {
    return tableNames.ticket_type;
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],

      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
      },
    };
  }

  static get relationMappings() {
    const { Ticket } = require('../ticket.model');

    return {
      ticket: {
        relation: Model.HasManyRelation,
        modelClass: Ticket,
        join: {
          from: `${tableNames.ticket_type}.id`,
          to: `${tableNames.ticket}.type_id`,
        },
      },
    };
  }
}

export { TicketType };
