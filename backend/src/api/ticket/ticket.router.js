import { Router } from 'express';
import { checkJwt } from '../../utils/auth';
import * as controllers from './ticket.controller';

const router = Router();

// /api/v1/tickets
router
  .route('/')
  .get(controllers.getTickets)
  .post(checkJwt(), controllers.createTicket);

// /api/v1/tickets/:ticketId
router
  .route('/:ticketId')
  .get(controllers.getTicket)
  .patch(checkJwt(), controllers.updateTicket)
  .delete(checkJwt(), controllers.deleteTicket);

export default router;
