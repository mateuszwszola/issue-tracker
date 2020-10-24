import * as controllers from './projectEngineer.controller';
import { checkJwt } from '../../../utils/auth';

export default async (router) => {
  // /api/v1/projects/:projectId/engineers
  router.route('/:projectId/engineers').get(controllers.getProjectEngineers);

  // /api/v1/projects/:projectId/engineers/:userId
  router
    .route('/:projectId/engineers/:userId')
    .post(checkJwt(), controllers.addProjectEngineer)
    .delete(checkJwt(), controllers.deleteProjectEnginner);
};
