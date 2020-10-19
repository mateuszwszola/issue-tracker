import { Router } from 'express';
import usersRouter from './user/user.router';
import projectRouter from './project/project.router';
const router = Router();

router.use('/users', usersRouter);
router.use('/projects', projectRouter);

export default router;
