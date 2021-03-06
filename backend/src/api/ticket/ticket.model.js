import { Model } from 'objection';
import tableNames from '../../constants/tableNames';

class Ticket extends Model {
  static get tableName() {
    return tableNames.ticket;
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }

  async $afterInsert(context) {
    const { key: projectKey } = await Ticket.relatedQuery(
      'project',
      context.transaction
    )
      .for(this.id)
      .first()
      .select('key');

    if (projectKey) {
      await this.$query().patch({ key: projectKey + '-' + this.id });
    }
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
      required: ['project_id', 'name', 'type_id', 'status_id', 'created_by'],

      properties: {
        id: { type: 'integer' },
        project_id: { type: 'integer' },
        key: { type: 'string', minLength: 1, maxLength: 255 },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        description: { type: 'string', maxLength: 255 },
        parent_id: { type: ['integer', 'null'] },
        type_id: { type: 'integer' },
        status_id: { type: 'integer' },
        priority_id: { type: 'integer' },
        created_by: { type: 'integer' },
        updated_by: { type: ['integer', 'null'] },
        assignee_id: { type: ['integer', 'null'] },
        archived_at: { type: ['string', 'null'] },
      },
    };
  }

  static get modifiers() {
    return {
      search(query, name) {
        query.where((query) => {
          for (const column of ['name', 'key']) {
            query.orWhereRaw('lower(??) like ?', [
              column,
              name.toLowerCase() + '%',
            ]);
          }
        });
      },
    };
  }

  static get relationMappings() {
    const { User } = require('../user/user.model');
    const { Project } = require('../project/project.model');
    const { TicketType } = require('./ticketType/ticketType.model');
    const { TicketStatus } = require('./ticketStatus/ticketStatus.model');
    const { TicketPriority } = require('./ticketPriority/ticketPriority.model');
    const { Attachment } = require('./ticketAttachment/ticketAttachment.model');

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
      createdBy: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: `${tableNames.ticket}.created_by`,
          to: `${tableNames.user}.id`,
        },
      },
      updatedBy: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: `${tableNames.ticket}.updated_by`,
          to: `${tableNames.user}.id`,
        },
      },
      assignee: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: `${tableNames.ticket}.assignee_id`,
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
      comments: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: `${tableNames.ticket}.id`,
          through: {
            from: `${tableNames.ticket_comment}.ticket_id`,
            to: `${tableNames.ticket_comment}.user_id`,
            extra: ['comment'],
          },
          to: `${tableNames.user}.id`,
        },
      },
      attachments: {
        relation: Model.HasManyRelation,
        modelClass: Attachment,
        join: {
          from: `${tableNames.ticket}.id`,
          to: `${tableNames.attachment}.ticket_id`,
        },
      },
    };
  }
}

export { Ticket };
