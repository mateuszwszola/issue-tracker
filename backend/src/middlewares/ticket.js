import { Ticket } from '../api/ticket/ticket.model';
import { ErrorHandler } from '../utils/error';

const preloadTicket = ({ ticketId }) => async (req, res, next) => {
  try {
    if (!ticketId) {
      return next(new ErrorHandler(400, 'Ticket id is required'));
    }

    const ticket = await Ticket.query().findById(ticketId);

    if (!ticket) {
      return next(new ErrorHandler(404, `Ticket not found`));
    }

    req.ticket = ticket;
    next();
  } catch (err) {
    next(new ErrorHandler(404, `Ticket not found`));
  }
};

export { preloadTicket };
