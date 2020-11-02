import { Router } from 'express';
import { checkJwt, isAdmin } from '../../middlewares/auth';
import * as controllers from './ticket.controller';

const router = Router();

// /api/v1/tickets
router
  .route('/')
  .get(controllers.getTickets)
  .post(checkJwt(), isAdmin(), controllers.createTicket);

// /api/v1/tickets/:ticketId
router
  .route('/:ticketId')
  .get(controllers.getTicket)
  .patch(checkJwt(), isAdmin(), controllers.updateTicket)
  .delete(checkJwt(), isAdmin(), controllers.deleteTicket);

export default router;
