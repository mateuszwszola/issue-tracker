import tableNames from '../../../../constants/tableNames';
import { ErrorHandler } from '../../../../utils/error';
import { validTicketOrders } from '../../../../utils/ticket';
import { Ticket } from '../ticket.model';

const getTicketEngineers = async (req, res) => {
  const { ticketId } = req.params;
  const { cursor, limit } = req.query;
  let { orderBy } = req.query;

  orderBy = orderBy ? String(orderBy).toLowerCase() : 'id';

  if (!validTicketOrders.has(orderBy)) {
    throw new ErrorHandler(400, 'Invalid orderBy param');
  }

  const query = Ticket.relatedQuery('engineers')
    .for(ticketId)
    .modify('defaultSelects')
    .offset(cursor)
    .limit(limit)
    .orderBy(orderBy);

  return res.status(200).json({ engineers: await query });
};

const addTicketEngineer = async (req, res) => {
  const { ticketId, userId } = req.params;

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
