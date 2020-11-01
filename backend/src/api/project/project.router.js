import { Router } from 'express';
import * as controllers from './project.controller';
import { checkJwt, isAdmin } from '../../middlewares/auth';
import registerProjectEngineerRoutes from './projectEngineer/projectEngineer.routes';
import registerProjectTicketRoutes from './projectTicket/projectTicket.routes';
const router = Router();

// /api/v1/projects/:projectId/engineers
registerProjectEngineerRoutes(router);

// /api/v1/projects/:projectId/tickets
registerProjectTicketRoutes(router);

// /api/v1/projects/:projectId/manager
// TODO

// /api/v1/projects
router
  .route('/')
  .get(controllers.getProjects)
  .post(checkJwt(), isAdmin(), controllers.createProject);

// /api/v1/projects/:projectId
router
  .route('/:projectId')
  .get(controllers.getProject)
  .patch(checkJwt(), isAdmin(), controllers.updateProject)
  .delete(checkJwt(), isAdmin(), controllers.deleteProject);

export default router;
