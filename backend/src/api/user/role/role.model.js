import { Model } from 'objection';
import tableNames from '../../../constants/tableNames';

class Role extends Model {
  static get tableName() {
    return tableNames.role;
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
    const { User } = require('../user/user.model');

    return {
      user: {
        relation: Model.HasManyRelation,
        modelClass: User,
        join: {
          from: `${tableNames.role}.id`,
          to: `${tableNames.user}.role_id`,
        },
      },
    };
  }
}

export { Role };
