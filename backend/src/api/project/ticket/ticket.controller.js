import { isEmpty } from 'lodash';
import { pickExistingProperties } from '../../../utils/helpers';
import { validTicketOrders } from '../../../utils/ticket';
import { ErrorHandler } from '../../../utils/error';
import { User } from '../../user/user.model';
import { Project } from '../project.model';
import { Ticket } from './ticket.model';

export function getDefaultTicketGraphQuery(query, withGraph) {
  return query
    .allowGraph('[project, type, status, priority, reporter, parentTicket]')
    .withGraphFetched(withGraph);
}

const getTickets = async (req, res) => {
  const { projectId } = req.params;
  const { cursor, limit, select, withGraph } = req.query;
  let { orderBy } = req.query;

  orderBy = orderBy ? orderBy.toLowerCase() : 'id';

  if (!validTicketOrders.has(orderBy)) {
    throw new ErrorHandler(400, 'Invalid orderBy param');
  }

  const query = Project.relatedQuery('tickets')
    .for(projectId)
    .offset(cursor)
    .limit(limit)
    .where('archived_at', null)
    .orderBy(orderBy);

  if (select) {
    query.select(select);
  }

  if (withGraph) {
    getDefaultTicketGraphQuery(query, withGraph);
  }

  return res.status(200).json({ tickets: await query });
};

const getTicket = async (req, res) => {
  const { projectId, ticketId } = req.params;
  const { select, withGraph } = req.query;

  const query = Project.relatedQuery('tickets')
    .for(projectId)
    .findById(ticketId);

  if (select) {
    query.select(select);
  }

  if (withGraph) {
    getDefaultTicketGraphQuery(query, withGraph);
  }

  const result = await query;

  if (isEmpty(result)) {
    throw new ErrorHandler(404, 'Ticket not found');
  }

  return res.status(200).json({ ticket: result });
};

const addTicket = async (req, res) => {
  const { projectId } = req.params;
  const { name, description, type_id, status_id, priority_id } = req.body;

  const reporter = await User.query()
    .findOne({ sub: req.user.sub })
    .select('id');

  const ticket = await Project.relatedQuery('tickets')
    .for(projectId)
    .insert({
      name,
      description,
      reporter_id: reporter.id,
      type_id,
      status_id,
      priority_id,
    })
    .returning('*');

  return res.status(200).json({ ticket });
};

const updateTicket = async (req, res) => {
  const { ticketId } = req.params;

  const properties = [
    'name',
    'description',
    'type_id',
    'status_id',
    'priority_id',
  ];

  const newTicketData = pickExistingProperties(properties, req.body);

  let query = Ticket.query().findById(ticketId);

  if (!isEmpty(newTicketData)) {
    query = query.patch(newTicketData).returning('*');
  }

  return res.status(200).json({ ticket: await query });
};

const deleteTicket = async (req, res) => {
  const { ticketId } = req.params;

  const result = await Ticket.query()
    .findById(ticketId)
    .delete()
    .returning('*');

  if (isEmpty(result)) {
    throw new ErrorHandler('404', 'Ticket not found');
  }

  return res.status(200).json({ ticket: result });
};

export { getTickets, getTicket, addTicket, updateTicket, deleteTicket };
