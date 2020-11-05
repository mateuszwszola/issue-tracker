import * as controllers from './projectTicket.controller';
import {
  checkJwt,
  isProjectEngineer,
  isProjectManager,
} from '../../../middlewares/auth';
import * as ticketControllers from '../../ticket/ticket.controller';
import { parsePaginationQueryParams } from '../../../middlewares/queryParams';

export default async (router) => {
  // /api/v1/projects/:projectId/tickets
  router
    .route('/:projectId/tickets')
    .get(parsePaginationQueryParams(), controllers.getProjectTickets)
    .post(checkJwt(), isProjectEngineer(), controllers.addProjectTicket);

  // /api/v1/projects/:projectId/tickets/:ticketId
  router
    .route('/:projectId/tickets/:ticketId')
    .patch(checkJwt(), isProjectEngineer(), controllers.updateProjectTicket)
    .delete(checkJwt(), isProjectManager(), ticketControllers.deleteTicket);
};
