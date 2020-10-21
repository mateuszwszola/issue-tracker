import { Model } from 'objection';
import tableNames from '../../../constants/tableNames';

class ProjectType extends Model {
  static get tableName() {
    return tableNames.project_type;
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

export { ProjectType };
