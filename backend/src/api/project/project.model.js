import { Model } from 'objection';
import tableNames from '../../constants/tableNames';
import { createBelongsToOneRelation } from '../../utils/objection';

class Project extends Model {
  static get tableName() {
    return tableNames.project;
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
      required: ['key', 'name', 'type_id'],

      properties: {
        id: { type: 'integer' },
        key: { type: 'string', minLength: 1, maxLength: 100 },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        type_id: { type: 'integer' },
        manager_id: { type: 'integer' },
        archived_at: { type: ['string', 'null'] },
      },
    };
  }

  static get relationMappings() {
    const { User } = require('../user/user.model');
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
    };
  }
}

export { Project };
