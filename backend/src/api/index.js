import usersRouter from './user/user.router';
import projectRouter from './project/project.router';

export default (router) => {
  router.use('/users', usersRouter);
  router.use('/projects', projectRouter);
};
