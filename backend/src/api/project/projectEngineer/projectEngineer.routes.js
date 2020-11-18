import * as controllers from './projectEngineer.controller';
import { checkJwt, isProjectManager } from '../../../middlewares/auth';
import { parsePaginationQueryParams } from '../../../middlewares/queryParams';

export default (router) => {
  /**
   * @route   GET /api/v1/projects/:projectId/engineers
   * @desc    get project engineers
   * @access  Public
   */
  router.get(
    '/:projectId/engineers',
    parsePaginationQueryParams(),
    controllers.getProjectEngineers
  );

  /**
   * @route   POST / DELETE /api/v1/projects/:projectId/engineers/:userId
   * @desc    Add or remove project engineers
   * @access  Admin and project manager
   */
  router
    .route('/:projectId/engineers/:userId')
    .post(checkJwt(), isProjectManager(), controllers.addProjectEngineer)
    .delete(checkJwt(), isProjectManager(), controllers.deleteProjectEngineer);
};
