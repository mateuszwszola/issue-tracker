import * as controllers from './projectEngineer.controller';
import { checkJwt, isUserProjectManager } from '../../../middlewares/auth';

export default async (router) => {
  /**
   * @route   GET /api/v1/projects/:projectId/engineers
   * @desc    get project engineers
   * @access  Public
   */
  router.get('/:projectId/engineers', controllers.getProjectEngineers);

  /**
   * @route   POST / DELETE /api/v1/projects/:projectId/engineers/:userId
   * @desc    Add or remove project enginners
   * @access  Admin and project manager
   */
  router
    .route('/:projectId/engineers/:userId')
    .post(checkJwt(), isUserProjectManager(), controllers.addProjectEngineer)
    .delete(
      checkJwt(),
      isUserProjectManager(),
      controllers.deleteProjectEnginner
    );
};
