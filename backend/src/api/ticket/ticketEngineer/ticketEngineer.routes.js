import * as controllers from './ticketEngineer.controller';
import { checkJwt } from '../../../middlewares/auth';
import { parsePaginationQueryParams } from '../../../middlewares/queryParams';

export default (router) => {
  router.get(
    '/:ticketId/engineers',
    parsePaginationQueryParams(),
    controllers.getTicketEngineers
  );

  router.post(
    '/:ticketId/engineers/:userId',
    checkJwt(),
    controllers.addTicketEngineer
  );

  router.delete(
    '/:ticketId/engineers/:userId',
    checkJwt(),
    controllers.removeTicketEngineer
  );
};
