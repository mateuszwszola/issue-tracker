import * as controllers from './projectTicket.controller';
import { checkJwt } from '../../../middlewares/auth';

export default async (router) => {
  // /api/v1/projects/:projectId/tickets
  router
    .route('/:projectId/tickets')
    .get(controllers.getProjectTickets)
    .post(checkJwt(), controllers.addProjectTicket);
};
