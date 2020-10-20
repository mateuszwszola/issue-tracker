import { Model } from 'objection';
import tableNames from '../../constants/tableNames';

class ProjectModel extends Model {
  static get tableName() {
    return tableNames.project;
  }
}

export { ProjectModel };
