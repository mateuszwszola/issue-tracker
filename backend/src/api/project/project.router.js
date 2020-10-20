import { Router } from 'express';
import * as controllers from './project.controller';
const router = Router();

// /api/v1/projects
router.route('/').get(controllers.getProjects).post(controllers.createProject);

// /api/v1/users/:id
// router
//   .route('/:id')
//   .get(controllers.getProjectById)
//   .put(controllers.updateProject)
//   .delete(controllers.deleteProject);

export default router;
