import { Model } from 'objection';
import tableNames from '../../../constants/tableNames';

class ProjectType extends Model {
  static get tableName() {
    return tableNames.project_type;
  }

  static get modifiers() {
    return {
      defaultSelects(query) {
        const { ref } = ProjectType;
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
    const { Project } = require('../project.model');

    return {
      project: {
        relation: Model.HasManyRelation,
        modelClass: Project,
        join: {
          from: `${tableNames.project_type}.id`,
          to: `${tableNames.project}.type_id`,
        },
      },
    };
  }
}

export { ProjectType };
