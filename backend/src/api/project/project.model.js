import { Model } from 'objection';
import tableNames from '../../constants/tableNames';
import { createBelongsToOneRelation } from '../../utils/objection';
import { createProjectKey } from '../../utils/project';

class Project extends Model {
  static get tableName() {
    return tableNames.project;
  }

  async $afterInsert() {
    await this.$query().patch({ key: createProjectKey(this.name, this.id) });
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
      required: ['name', 'type_id', 'created_by'],

      properties: {
        id: { type: 'integer' },
        key: { type: 'string', minLength: 1, maxLength: 255 },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        description: { type: 'string', minLength: 1, maxLength: 255 },
        type_id: { type: 'integer' },
        manager_id: { type: ['integer', 'null'] },
        created_by: { type: 'integer' },
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
    const { Ticket } = require('../ticket/ticket.model');
    const { ProjectType } = require('./projectType/projectType.model');

    return {
      type: createBelongsToOneRelation(
        ProjectType,
        tableNames.project,
        tableNames.project_type,
        'type_id'
      ),
      createdBy: createBelongsToOneRelation(
        User,
        tableNames.project,
        tableNames.user,
        'created_by'
      ),
      manager: createBelongsToOneRelation(
        User,
        tableNames.project,
        tableNames.user,
        'manager_id'
      ),
      engineers: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: `${tableNames.project}.id`,
          through: {
            from: `${tableNames.project_engineer}.project_id`,
            to: `${tableNames.project_engineer}.user_id`,
          },
          to: `${tableNames.user}.id`,
        },
      },
      tickets: {
        relation: Model.HasManyRelation,
        modelClass: Ticket,
        join: {
          from: `${tableNames.project}.id`,
          to: `${tableNames.ticket}.project_id`,
        },
      },
    };
  }
}

export { Project };
