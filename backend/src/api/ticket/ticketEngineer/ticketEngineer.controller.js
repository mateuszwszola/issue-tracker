import tableNames from '../../../constants/tableNames';
import { ErrorHandler } from '../../../utils/error';
import { User } from '../../user/user.model';
import { Ticket } from '../ticket.model';

const getTicketEngineers = async (req, res) => {
  const { ticketId } = req.params;
  const { cursor, limit, orderBy } = req.query;

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

  const engineer = await User.query().findById(userId);

  if (!engineer) {
    throw new ErrorHandler(404, `User with ${userId} id not found`);
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
