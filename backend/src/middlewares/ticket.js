import { Ticket } from '../api/ticket/ticket.model';
import { ErrorHandler } from '../utils/error';

const preloadTicket = (required = true) => async (req, res, next) => {
  const { ticketId } = req.params;

  if (!ticketId && required) {
    throw new ErrorHandler(400, 'Ticket id is required');
  }

  let ticket;

  if (ticketId) {
    ticket = await Ticket.query().findById(ticketId);
  }

  if (!ticket && required) {
    throw new ErrorHandler(404, `Ticket with ${ticketId} id not found`);
  }

  if (ticket) {
    req.ticket = ticket;
  }

  next();
};

export { preloadTicket };
