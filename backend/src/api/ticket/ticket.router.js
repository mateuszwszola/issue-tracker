import { Router } from 'express';
import { checkJwt, isAdmin } from '../../middlewares/auth';
import * as controllers from './ticket.controller';

const router = Router();

router.use(checkJwt(), isAdmin());

// /api/v1/tickets
router.route('/').get(controllers.getTickets).post(controllers.createTicket);

// /api/v1/tickets/:ticketId
router
  .route('/:ticketId')
  .get(controllers.getTicket)
  .patch(controllers.updateTicket)
  .delete(controllers.deleteTicket);

export default router;
