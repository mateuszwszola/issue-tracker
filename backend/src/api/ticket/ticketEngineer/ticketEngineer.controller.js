import tableNames from '../../../constants/tableNames';
import { ErrorHandler } from '../../../utils/error';
import { User } from '../../user/user.model';
import { Ticket } from '../ticket.model';

const getTicketEngineers = async (req, res) => {
  const { ticketId } = req.params;
  const { cursor, limit, orderBy } = req.query;

  const query = Ticket.relatedQuery('engineers')
    .for(ticketId)
    .modify('defaultSelects')
    .offset(cursor)
    .limit(limit);

  if (orderBy) {
    query.orderBy(orderBy);
  }

  return res.status(200).json({ engineers: await query });
};

const addTicketEngineer = async (req, res) => {
  const { ticketId, userId } = req.params;

  const engineer = await User.query().findById(userId);

  if (!engineer) {
    throw new ErrorHandler(404, `User with ${userId} id not found`);
  }

  if (req.ticket.project_id !== req.project.id) {
    throw new ErrorHandler(400, 'Invalid project id provided');
  }

  const numRelated = await Ticket.relatedQuery('engineers')
    .for(ticketId)
    .where(`${tableNames.ticket}.project_id`, req.project.id)
    .relate(userId);

  return res.status(200).json({ message: numRelated });
};

const removeTicketEngineer = async (req, res) => {
  const { userId } = req.params;

  const engineer = await User.query().findById(userId);

  if (!engineer) {
    throw new ErrorHandler(404, `User with ${userId} id not found`);
  }

  if (req.ticket.project_id !== req.project.id) {
    throw new ErrorHandler(400, 'Invalid project id provided');
  }

  const numRelated = await Ticket.relatedQuery('engineers')
    .for(req.ticket.id)
    .unrelate()
    .where(`${tableNames.user}.id`, userId);

  return res.status(200).json({ message: numRelated });
};

export { getTicketEngineers, addTicketEngineer, removeTicketEngineer };
