import { Model } from 'objection';
import tableNames from '../../constants/tableNames';
import { createBelongsToOneRelation } from '../../utils/objection';

class Project extends Model {
  static get tableName() {
    return tableNames.project;
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['key', 'name', 'owner_id', 'type_id'],

      properties: {
        id: { type: 'integer' },
        key: { type: 'string', minLength: 1, maxLength: 100 },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        description: { type: 'string', minLength: 1, maxLength: 255 },
        owner_id: { type: 'integer' },
        manager_id: { type: 'integer' },
        type_id: { type: 'integer' },
        archived_at: { type: ['date', 'null'] },
      },
    };
  }

  static get relationMappings() {
    const { User } = require('../user/user.model');
    const { ProjectType } = require('./projectType/projectType.model');

    return {
      owner: createBelongsToOneRelation(
        User,
        tableNames.project,
        tableNames.user,
        'owner_id'
      ),
      manager: createBelongsToOneRelation(
        User,
        tableNames.project,
        tableNames.user,
        'manager_id'
      ),
      type: createBelongsToOneRelation(
        ProjectType,
        tableNames.project,
        tableNames.project_type,
        'type_id'
      ),
    };
  }
}

export { Project };
