import { Router } from 'express';
import * as controllers from './project.controller';
import { checkJwt, isAdmin } from '../../middlewares/auth';
import registerProjectEngineerRoutes from './projectEngineer/projectEngineer.routes';
import registerProjectTicketRoutes from './projectTicket/projectTicket.routes';
import { parsePaginationQueryParams } from '../../middlewares/queryParams';
const router = Router();

/**
 * @route /api/v1/projects/:projectId/engineers
 * @desc  Get, add and remove enginners from a project
 */
registerProjectEngineerRoutes(router);

/**
 * @route /api/v1/projects/:projectId/tickets
 * @desc  Get and add project tickets
 */
registerProjectTicketRoutes(router);

// /api/v1/projects
router
  .route('/')
  .get(parsePaginationQueryParams(), controllers.getProjects)
  .post(checkJwt(), isAdmin(), controllers.createProject);

// /api/v1/projects/:projectId
router
  .route('/:projectId')
  .get(controllers.getProject)
  .patch(checkJwt(), isAdmin(), controllers.updateProject)
  .delete(checkJwt(), isAdmin(), controllers.deleteProject);

export default router;
