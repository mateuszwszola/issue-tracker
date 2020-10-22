import { Router } from 'express';
import * as controllers from './project.controller';
import { checkJwt } from '../../utils/auth';
const router = Router();

// /api/v1/projects
router
  .route('/')
  .get(controllers.getProjects)
  .post(checkJwt(), controllers.createProject);

// /api/v1/users/:id
// router
//   .route('/:id')
//   .get(controllers.getProjectById)
//   .put(controllers.updateProject)
//   .delete(controllers.deleteProject);

export default router;
