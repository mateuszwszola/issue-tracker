import {
  checkJwt,
  isProjectEngineer,
  isProjectManager,
} from '../../../middlewares/auth';
import { parsePaginationQueryParams } from '../../../middlewares/queryParams';
import * as controllers from './ticket.controller';

export default (router) => {
  // /api/v1/projects/:projectId/tickets
  router
    .route('/:projectId/tickets')
    .get(parsePaginationQueryParams(), controllers.getTickets)
    .post(checkJwt(), isProjectEngineer(), controllers.addTicket);

  // /api/v1/projects/:projectId/tickets/:ticketId
  router
    .route('/:projectId/tickets/:ticketId')
    .get(controllers.getTicket)
    .patch(checkJwt(), isProjectEngineer(), controllers.updateTicket)
    .delete(checkJwt(), isProjectManager(), controllers.deleteTicket);
};
