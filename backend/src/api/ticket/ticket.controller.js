import { isEmpty } from 'lodash';
import { ErrorHandler } from '../../utils/error';
import { getTicketGraphQuery } from '../../utils/ticket';
import { Ticket } from './ticket.model';

const getTickets = async (req, res) => {
  const { projectId, select, withGraph, cursor, limit, orderBy } = req.query;

  if (projectId && !req.project) {
    throw new ErrorHandler(404, `Project with ${projectId} not found`);
  }

  let query = Ticket.query()
    .where('archived_at', null)
    .offset(cursor)
    .limit(limit);

  if (projectId) {
    query.where('project_id', projectId);
  }

  if (select) {
    query.select(select);
  }

  if (orderBy) {
    query.orderBy(orderBy);
  }

  if (withGraph) {
    query = getTicketGraphQuery(query, withGraph);
  }

  return res.status(200).json({ tickets: await query });
};

const getTicket = async (req, res) => {
  const { ticketId } = req.params;
  const { select, withGraph } = req.query;

  let query = Ticket.query().findById(ticketId);

  if (select) {
    query.select(select);
  }

  if (withGraph) {
    query = getTicketGraphQuery(query, withGraph);
  }

  const result = await query;

  if (isEmpty(result)) {
    throw new ErrorHandler(404, `Ticket with ${ticketId} id not found`);
  }

  return res.status(200).json({ ticket: result });
};

const addTicket = async (req, res) => {
  const { name, description, type_id, status_id, priority_id } = req.body;
  const { projectId } = req.query;
  const reporterId = req.api_user.id;

  const ticket = await Ticket.query()
    .insert({
      project_id: parseInt(projectId),
      reporter_id: parseInt(reporterId),
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
  const newTicketData = req.body;

  const ticket = await Ticket.query()
    .findById(req.ticket.id)
    .where('project_id', req.project.id)
    .patch(newTicketData)
    .returning('*');

  return res.status(200).json({ ticket });
};

const deleteTicket = async (req, res) => {
  if (req.ticket.reporter_id !== req.api_user.id) {
    throw new ErrorHandler(403, 'You are not the owner of the ticket');
  }

  const result = await Ticket.query()
    .findById(req.ticket.id)
    .where('project_id', req.project.id)
    .delete()
    .returning('*');

  if (typeof Number(result) === 'number' && Number(result) === 0) {
    throw new ErrorHandler(400, 'Invalid project id');
  }

  return res.status(200).json({ ticket: result });
};

export { getTickets, getTicket, addTicket, updateTicket, deleteTicket };
