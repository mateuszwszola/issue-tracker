import { Model } from 'objection';
import tableNames from '../../constants/tableNames';
import { createBelongsToOneRelation } from '../../utils/objection';
import { createProjectKey } from '../../utils/project';

class Project extends Model {
  static get tableName() {
    return tableNames.project;
  }

  $afterInsert() {
    this.key = createProjectKey(this.name, this.id);
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
      required: ['name', 'type_id'],

      properties: {
        id: { type: 'integer' },
        key: { type: 'string', minLength: 3, maxLength: 255 },
        name: { type: 'string', minLength: 5, maxLength: 255 },
        type_id: { type: 'integer' },
        manager_id: { type: ['integer', 'null'] },
        archived_at: { type: ['string', 'null'] },
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