import { Router } from 'express';
import * as controllers from './project.controller';
import { checkJwt } from '../../utils/auth';
const router = Router();

// /api/v1/projects
router
  .route('/')
  .get(controllers.getProjects)
  .post(checkJwt(), controllers.createProject);

// /api/v1/projects/:id
router
  .route('/:id')
  .get(controllers.getProject)
  .patch(checkJwt(), controllers.updateProject)
  .delete(checkJwt(), controllers.deleteProject);

export default router;
