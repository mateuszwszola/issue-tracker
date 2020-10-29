import usersRouter from './user/user.router';
import projectRouter from './project/project.router';
import ticketRouter from './ticket/ticket.router';

export default (router) => {
  router.use('/users', usersRouter);
  router.use('/projects', projectRouter);
  router.use('/tickets', ticketRouter);
};
