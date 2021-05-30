import * as controllers from './projectEngineer.controller';
import {
  authenticate,
  authorize,
  checkAdmin,
  checkProjectManager,
} from '../../../middlewares/auth';
import {
  parsePageQueryParam,
  validateOrderByParam,
} from '../../../middlewares/queryParams';
import { validUserOrders } from '../../../constants/user';
import { preloadProject } from '../../../middlewares/project';
import { preloadUser } from '../../../middlewares/user';
import { ROLES } from '../../../constants/roles';

export default (router) => {
  router.use('/:projectId/engineers', (req, res, next) => {
    const { projectId } = req.params;
    preloadProject({ projectId })(req, res, next);
  });

  /**
   * @route   GET /api/projects/:projectId/engineers
   * @desc    Get project engineers
   */
  router.get('/:projectId/engineers', [
    parsePageQueryParam(),
    validateOrderByParam(validUserOrders),
    controllers.getProjectEngineers,
  ]);

  /**
   * @route   GET /api/projects/:projectId/engineers/:userId
   * @desc    Get project engineer by user id
   */
  router.get('/:projectId/engineers/:userId', controllers.getProjectEngineer);

  /**
   * @route   POST / DELETE /api/projects/:projectId/engineers/:userId
   * @desc    Add or remove project engineer
   * @access  Admin, Project Manager
   */
  router.use('/:projectId/engineers/:userId', [
    ...authenticate(),
    (req, res, next) => {
      const { userId } = req.params;
      preloadUser({ userId })(req, res, next);
    },
    checkProjectManager(),
    checkAdmin(),
    authorize(ROLES.project_manager, ROLES.admin),
  ]);

  router
    .route('/:projectId/engineers/:userId')
    .post(controllers.addProjectEngineer)
    .delete(controllers.deleteProjectEngineer);
};
