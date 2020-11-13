import { isEmpty } from 'lodash';
import { pickExistingProperties } from '../../utils/helpers';
import { ErrorHandler } from '../../utils/error';
import { Ticket } from './ticket.model';
import { validTicketOrders } from '../../constants/ticket';

export function getDefaultTicketGraphQuery(query, withGraph) {
  return query
    .allowGraph('[project, type, status, priority, reporter, parentTicket]')
    .withGraphFetched(withGraph);
}

const getTickets = async (req, res) => {
  const { projectId, select, withGraph, cursor, limit } = req.query;
  let { orderBy } = req.query;

  orderBy = orderBy ? orderBy.toLowerCase() : 'id';

  if (!validTicketOrders.has(orderBy)) {
    throw new ErrorHandler(400, 'Invalid orderBy param');
  }

  const query = Ticket.query()
    .where('project_id', projectId)
    .where('archived_at', null)
    .offset(cursor)
    .limit(limit)
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
  const { ticketId } = req.params;
  const { select, withGraph } = req.query;

  const query = Ticket.query().findById(ticketId);

  if (select) {
    query.select(select);
  }

  if (withGraph) {
    getDefaultTicketGraphQuery(query, withGraph);
  }

  const result = await query;

  if (isEmpty(result)) {
    throw new ErrorHandler(404, `Ticket with ${ticketId} id not found`);
  }

  return res.status(200).json({ ticket: result });
};

const addTicket = async (req, res) => {
  const { projectId } = req.query;
  const { name, description, type_id, status_id, priority_id } = req.body;

  const reporterId = req.api_user.id;

  const ticket = await Ticket.query()
    .insert({
      project_id: projectId,
      reporter_id: reporterId,
      name,
      description,
      type_id,
      status_id,
      priority_id,
    })
    .returning('*');

  return res.status(200).json({ ticket });
};

const updateTicket = async (req, res) => {
  const properties = [
    'name',
    'description',
    'type_id',
    'status_id',
    'priority_id',
    'parent_id',
  ];

  const newTicketData = pickExistingProperties(properties, req.body);

  let updatedTicket;

  if (!isEmpty(newTicketData)) {
    updatedTicket = await req.ticket.$query.patch(newTicketData).returning('*');
  }

  return res.status(200).json({ ticket: updatedTicket || req.ticket });
};

const deleteTicket = async (req, res) => {
  if (req.ticket.reporter_id !== req.api_user.id) {
    throw new ErrorHandler(403, 'You are not the owner of the ticket');
  }

  const result = await req.ticket.$query.delete().returning('*');

  return res.status(200).json({ ticket: result });
};

export { getTickets, getTicket, addTicket, updateTicket, deleteTicket };
