import { Router } from 'express';
import * as controllers from './project.controller';
import { checkJwt } from '../../middlewares/auth';
import registerProjectEngineerRoutes from './projectEngineer/projectEngineer.routes';
const router = Router();

// /api/v1/projects/:projectId/engineers
registerProjectEngineerRoutes(router);

// /api/v1/projects
router
  .route('/')
  .get(controllers.getProjects)
  .post(checkJwt(), controllers.createProject);

// /api/v1/projects/:projectId
router
  .route('/:projectId')
  .get(controllers.getProject)
  .patch(checkJwt(), controllers.updateProject)
  .delete(checkJwt(), controllers.deleteProject);

export default router;
