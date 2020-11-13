import { Router } from 'express';
import {
  checkJwt,
  isProjectEngineer,
  isProjectManager,
  preloadProject,
} from '../../middlewares/auth';
import { parsePaginationQueryParams } from '../../middlewares/queryParams';
import { ErrorHandler } from '../../utils/error';
import * as controllers from './ticket.controller';
import { Ticket } from './ticket.model';
import registerTicketEngineerRoutes from './ticketEngineer/ticketEngineer.routes';
const router = Router();

const preloadTicket = () => async (req, res, next) => {
  const { ticketId } = req.params;

  const ticket = await Ticket.query().findById(ticketId);

  if (!ticket) {
    throw new ErrorHandler(404, `Ticket with ${ticketId} id not found`);
  }

  req.ticket = ticket;

  next();
};

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
  .get(parsePaginationQueryParams(), preloadProject(), controllers.getTickets)
  .post(checkJwt(), isProjectEngineer(), controllers.addTicket);

/**
 * @route /api/v1/tickets/:ticketId?projectId=
 * @desc Update and delete tickets
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
