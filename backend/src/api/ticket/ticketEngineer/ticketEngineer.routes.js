import * as controllers from './ticketEngineer.controller';
import { isProjectManager } from '../../../middlewares/auth';
import {
  parsePaginationQueryParams,
  validateOrderByParam,
} from '../../../middlewares/queryParams';
import { preloadTicket } from '../../../middlewares/ticket';
import { validUserOrders } from '../../../constants/user';

export default (router) => {
  router.get(
    '/:ticketId/engineers',
    parsePaginationQueryParams(),
    validateOrderByParam(validUserOrders),
    preloadTicket(),
    controllers.getTicketEngineers
  );

  router.post(
    '/:ticketId/engineers/:userId',
    isProjectManager(),
    preloadTicket(),
    controllers.addTicketEngineer
  );

  router.delete(
    '/:ticketId/engineers/:userId',
    isProjectManager(),
    preloadTicket(),
    controllers.removeTicketEngineer
  );
};
