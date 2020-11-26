import { Ticket } from '../api/ticket/ticket.model';
import { ErrorHandler } from '../utils/error';

const preloadTicket = ({ ticketId, required = false }) => async (
  req,
  res,
  next
) => {
  if (!ticketId && required) {
    return next(new ErrorHandler(400, 'Ticket id is required'));
  }

  let ticket;

  if (ticketId) {
    ticket = await Ticket.query().findById(ticketId);
  }

  if (!ticket && required) {
    return next(new ErrorHandler(404, `Ticket with ${ticketId} id not found`));
  }

  if (ticket) {
    req.ticket = ticket;
  }

  next();
};

export { preloadTicket };
