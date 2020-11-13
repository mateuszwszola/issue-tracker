import { Ticket } from '../api/ticket/ticket.model';
import { ErrorHandler } from '../utils/error';

const preloadTicket = () => async (req, res, next) => {
  const { ticketId } = req.params;

  const ticket = await Ticket.query().findById(ticketId);

  if (!ticket) {
    throw new ErrorHandler(404, `Ticket with ${ticketId} id not found`);
  }

  req.ticket = ticket;

  next();
};

export { preloadTicket };
