import usersRouter from './user/user.router';
import projectRouter from './project/project.router';
import authRouter from './auth/auth.router';

export default (router) => {
  router.use('/users', usersRouter);
  router.use('/projects', projectRouter);
  router.use('/auth', authRouter);
};
