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
        location: { type: 'string', minLength: 1, maxLength: 50 },
        picture: { type: 'string' },
        blocked: { type: 'boolean' },
      },
    };
  }

  static get relationMappings() {
    const { Project } = require('../project/project.model');

    return {
      ownedProjects: {
        relation: Model.HasManyRelation,
        modelClass: Project,
        join: {
          from: `${tableNames.user}.id`,
          to: `${tableNames.project}.owner_id`,
        },
      },
      managedProjects: {
        relation: Model.HasManyRelation,
        modelClass: Project,
        join: {
          from: `${tableNames.user}.id`,
          to: `${tableNames.project}.manager_id`,
        },
      },
    };
  }
}

export { User };
