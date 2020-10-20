import { Model } from 'objection';
import tableNames from '../../constants/tableNames';

class ProjectModel extends Model {
  static get tableName() {
    return tableNames.project;
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['key', 'name', 'owner_id'],

      properties: {
        id: { type: 'integer' },
        key: { type: 'string', minLength: 1, maxLength: 255 },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        description: { type: 'string', minLength: 1, maxLength: 255 },
      },
    };
  }
}

export { ProjectModel };
