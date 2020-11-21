import { Router } from 'express';
import * as controllers from './project.controller';
import { isAdmin } from '../../middlewares/auth';
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
const router = Router();

/**
 * @route /api/v1/projects/:projectId/engineers
 * @desc  Get, add and remove engineers from a project
 */
registerProjectEngineerRoutes(router);

/**
 * @route /api/v1/projects
 */
router
  .route('/')
  .get(
    parsePageQueryParam(),
    validateOrderByParam(validProjectOrders),
    controllers.getProjects
  )
  .post(isAdmin(), createProjectSchema, controllers.createProject);

/**
 * @route /api/v1/projects/:projectId
 */
router
  .route('/:projectId')
  .get(controllers.getProject)
  .patch(
    isAdmin(),
    preloadProject(),
    updateProjectSchema,
    controllers.updateProject
  )
  .delete(isAdmin(), preloadProject(), controllers.deleteProject);

export default router;
