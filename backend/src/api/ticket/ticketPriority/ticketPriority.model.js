import { Model } from 'objection';
import tableNames from '../../../constants/tableNames';

class TicketPriority extends Model {
  static get tableName() {
    return tableNames.ticket_priority;
  }

  static get modifiers() {
    return {
      defaultSelects(query) {
        const { ref } = TicketPriority;
        query.select(ref('id'), ref('name'));
      },
    };
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
          from: `${tableNames.ticket_priority}.id`,
          to: `${tableNames.ticket}.priority_id`,
        },
      },
    };
  }
}

export { TicketPriority };
