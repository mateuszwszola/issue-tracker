import userRouter from './user/user.router';
import projectRouter from './project/project.router';
import authRouter from './auth/auth.router';
import ticketRouter from './ticket/ticket.router';
import profileRouter from './profile/profile.router';

export default (router) => {
  router.use('/auth', authRouter);
  router.use('/users', userRouter);
  router.use('/projects', projectRouter);
  router.use('/tickets', ticketRouter);
  router.use('/profiles', profileRouter);
};
