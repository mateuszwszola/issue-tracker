import { Router } from 'express';
import {
  checkJwt,
  isProjectEngineer,
  isProjectManager,
} from '../../middlewares/auth';
import {
  parsePaginationQueryParams,
  validateOrderByParam,
} from '../../middlewares/queryParams';
import * as controllers from './ticket.controller';
import registerTicketEngineerRoutes from './ticketEngineer/ticketEngineer.routes';
import { preloadTicket } from '../../middlewares/ticket';
import { validTicketOrders } from '../../constants/ticket';
const router = Router();

/**
 * @route /api/v1/tickets/:ticketId/engineers?projectId=
 * @desc Manage ticket engineers
 */
registerTicketEngineerRoutes(router);

/**
 * @route /api/v1/tickets?projectId=
 * @desc Get and create tickets
 */
router
  .route('/')
  .get(
    parsePaginationQueryParams(),
    validateOrderByParam(validTicketOrders),
    controllers.getTickets
  )
  .post(checkJwt(), isProjectEngineer(), controllers.addTicket);

/**
 * @route /api/v1/tickets/:ticketId?projectId=
 * @desc Get, Update and Delete ticket
 */
router
  .route('/:ticketId')
  .get(controllers.getTicket)
  .patch(
    checkJwt(),
    isProjectEngineer(),
    preloadTicket(),
    controllers.updateTicket
  )
  .delete(
    checkJwt(),
    isProjectManager(),
    preloadTicket(),
    controllers.deleteTicket
  );

export default router;
