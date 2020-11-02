import { isEmpty } from 'lodash';
import { ErrorHandler } from '../../utils/error';
import { Ticket } from './ticket.model';

export function getDefaultTicketGraphQuery(query, withGraph) {
  return query
    .allowGraph('[project, type, status, priority, reporter, parentTicket]')
    .withGraphFetched(withGraph);
}

const getTickets = async (req, res) => {
  const {
    cursor = 0,
    limit = 100,
    select,
    withGraph,
    parentId,
    projectId,
    orderBy = 'id',
  } = req.query;

  const query = Ticket.query()
    .offset(parseInt(cursor))
    .limit(parseInt(limit))
    .where('archived_at', null)
    .orderBy(orderBy);

  if (select) {
    query.select(select);
  }

  if (projectId) {
    query.where('project_id', projectId);
  }

  if (parentId) {
    query.where('parent_id', parentId);
  } else {
    query.whereNull('parent_id');
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
    throw new ErrorHandler(404, 'Ticket not found');
  }

  return res.status(200).json({ ticket: result });
};

const createTicket = async (req, res) => {
  const result = await Ticket.query().insert(req.body).returning('*');

  return res.status(201).json({ ticket: result });
};

const updateTicket = async (req, res) => {
  const { ticketId } = req.params;

  const result = await Ticket.query()
    .findById(ticketId)
    .patch(req.body)
    .returning('*');

  if (isEmpty(result)) {
    throw new ErrorHandler('404', 'Ticket not found');
  }

  return res.status(200).json({ ticket: result });
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

export { getTickets, getTicket, createTicket, updateTicket, deleteTicket };
