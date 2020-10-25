import { Model } from 'objection';
import tableNames from '../../constants/tableNames';

class User extends Model {
  static get tableName() {
    return tableNames.user;
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'email'],

      properties: {
        id: { type: 'integer' },
        auth0_user_id: { type: 'string' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        email: { type: 'string', minLength: 1, maxLength: 255 },
        picture: { type: 'string' },
        is_admin: { type: 'boolean' },
        blocked: { type: 'boolean' },
      },
    };
  }

  static get relationMappings() {
    const { Project } = require('../project/project.model');

    return {
      managedProjects: {
        relation: Model.HasManyRelation,
        modelClass: Project,
        join: {
          from: `${tableNames.user}.id`,
          to: `${tableNames.project}.manager_id`,
        },
      },
      engineeredProjects: {
        relation: Model.ManyToManyRelation,
        modelClass: Project,
        join: {
          from: `${tableNames.user}.id`,
          through: {
            from: `${tableNames.project_engineer}.user_id`,
            to: `${tableNames.project_engineer}.project_id`,
          },
          to: `${tableNames.project}.id`,
        },
      },
    };
  }
}

export { User };
