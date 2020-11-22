import { Router } from 'express';
import * as controllers from './project.controller';
import { authenticate, authorize, checkAdmin } from '../../middlewares/auth';
import registerProjectEngineerRoutes from './projectEngineer/projectEngineer.routes';
import {
  parsePageQueryParam,
  validateOrderByParam,
} from '../../middlewares/queryParams';
import {
  createProjectSchema,
  updateProjectSchema,
  validProjectOrders,
} from '../../utils/project';
import { preloadProject } from '../../middlewares/project';
import { ROLES } from '../../constants/roles';
const router = Router();

/**
 * @route /api/v1/projects/:projectId/engineers
 * @desc  Get, add and remove engineers from a project
 */
registerProjectEngineerRoutes(router);

/**
 * @route GET /api/v1/projects
 * @desc Get projects
 * @access Public
 */
router.get('/', [
  parsePageQueryParam(),
  validateOrderByParam(validProjectOrders),
  controllers.getProjects,
]);

/**
 * @route POST /api/v1/projects
 * @desc Create a project
 * @access Admin
 */
router.post('/', [
  ...authenticate(),
  checkAdmin(),
  authorize(ROLES.admin),
  createProjectSchema,
  controllers.createProject,
]);

/**
 * @route /api/v1/projects/:projectId
 */
router.use('/:projectId', (req, res, next) => {
  const { projectId } = req.params;
  preloadProject({ projectId, required: true })(req, res, next);
});

/**
 * @route GET /api/v1/projects/:projectId
 * @desc Get project by Id
 * @access Public
 */
router.get('/:projectId', controllers.getProject);

/**
 * @route PATCH / DELETE /api/v1/projects/:projectId
 */
router.use('/:projectId', [
  ...authenticate(),
  checkAdmin(),
  authorize(ROLES.admin),
]);

/**
 * @route PATCH /api/v1/projects/:projectId
 * @desc Update project
 * @access Admin
 */
router.patch('/:projectId', updateProjectSchema, controllers.updateProject);

/**
 * @route DELETE /api/v1/projects/:projectId
 * @desc Delete project
 * @access Admin
 */
router.delete('/:projectId', controllers.deleteProject);

export default router;
