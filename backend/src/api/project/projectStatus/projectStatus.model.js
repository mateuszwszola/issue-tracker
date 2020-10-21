import { Model } from 'objection';
import tableNames from '../../../constants/tableNames';

class ProjectStatus extends Model {
  static get tableName() {
    return tableNames.project_status;
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
}

export { ProjectStatus };
