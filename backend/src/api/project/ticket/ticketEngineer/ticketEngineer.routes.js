import * as controllers from './ticketEngineer.controller';
import { checkJwt, isProjectManager } from '../../../../middlewares/auth';
import { parsePaginationQueryParams } from '../../../../middlewares/queryParams';

export default (router) => {
  router.get(
    '/:projectId/tickets/:ticketId/engineers',
    parsePaginationQueryParams(),
    controllers.getTicketEngineers
  );

  router.post(
    '/:projectId/tickets/:ticketId/engineers/:userId',
    checkJwt(),
    isProjectManager(),
    controllers.addTicketEngineer
  );

  router.delete(
    '/:projectId/tickets/:ticketId/engineers/:userId',
    checkJwt(),
    isProjectManager(),
    controllers.removeTicketEngineer
  );
};
