import tableNames from '../../../constants/tableNames';
import { ErrorHandler } from '../../../utils/error';
import { validTicketOrders } from '../../../utils/ticket';
import { User } from '../../user/user.model';
import { hasProjectManagerPermissions } from '../ticket.controller';
import { Ticket } from '../ticket.model';

const getTicketEngineers = async (req, res) => {
  const { ticketId } = req.params;
  const { cursor, limit } = req.query;
  let { orderBy } = req.query;

  orderBy = orderBy ? String(orderBy).toLowerCase() : 'id';

  if (!validTicketOrders.has(orderBy)) {
    throw new ErrorHandler(400, 'Invalid orderBy param');
  }

  const ticket = await Ticket.query().findById(ticketId);

  if (!ticket) {
    throw new ErrorHandler(404, `Ticket with ${ticketId} id not found`);
  }

  const engineers = await Ticket.relatedQuery('engineers')
    .for(ticketId)
    .modify('defaultSelects')
    .offset(cursor)
    .limit(limit)
    .orderBy(orderBy);

  return res.status(200).json({ engineers });
};

const addTicketEngineer = async (req, res) => {
  const { ticketId, userId } = req.params;

  const [ticket, project, engineer, authUser] = await Promise.all([
    Ticket.query().findById(ticketId),
    Ticket.relatedQuery('project'),
    User.query().findById(userId),
    User.query().findOne({ sub: req.user.sub }),
  ]);

  if (!ticket) {
    throw new ErrorHandler(404, `Ticket with ${ticketId} id not found`);
  }

  if (!engineer) {
    throw new ErrorHandler(404, `User with ${userId} id not found`);
  }

  if (!hasProjectManagerPermissions(authUser, project)) {
    throw new ErrorHandler(
      403,
      'You are not authorized to access this resource'
    );
  }

  const numRelated = await Ticket.relatedQuery('engineers')
    .for(ticketId)
    .relate(userId);

  return res.status(200).json({ message: numRelated });
};

const removeTicketEngineer = async (req, res) => {
  const { ticketId, userId } = req.params;

  const numRelated = await Ticket.relatedQuery('engineers')
    .for(ticketId)
    .unrelate()
    .where(`${tableNames.user}.id`, userId);

  return res.status(200).json({ message: numRelated });
};

export { getTicketEngineers, addTicketEngineer, removeTicketEngineer };
