import usersRouter from './user/user.router';
import projectRouter from './project/project.router';
import authRouter from './auth/auth.router';
import ticketRouter from './ticket/ticket.router';

export default (router) => {
  router.use('/auth', authRouter);
  router.use('/users', usersRouter);
  router.use('/projects', projectRouter);
  router.use('/tickets', ticketRouter);
};
