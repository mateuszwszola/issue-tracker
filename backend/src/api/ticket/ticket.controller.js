import { getTicketGraphQuery } from '../../utils/ticket';
import { Ticket } from './ticket.model';

const getTickets = async (req, res) => {
  const { withGraph, skip, limit, orderBy } = req.query;
  const { project } = req;

  const query = Ticket.query()
    .where('archived_at', null)
    .offset(skip)
    .limit(limit)
    .orderBy(orderBy);

  if (project) {
    query.where('project_id', project.id);
  }

  if (withGraph) {
    getTicketGraphQuery(query, withGraph);
  }

  return res.status(200).json({ tickets: await query });
};

const getTicket = async (req, res) => {
  const { ticketId } = req.params;
  const { withGraph } = req.query;
  const { ticket: preloadedTicket } = req;

  let ticket;

  if (withGraph) {
    const query = Ticket.query().findById(ticketId);

    getTicketGraphQuery(query, withGraph);

    ticket = await query;
  } else {
    ticket = preloadedTicket;
  }

  return res.status(200).json({ ticket });
};

const createTicket = async (req, res) => {
  const ticketData = req.body;
  const { id: createdById } = req.api_user;

  const ticket = await Ticket.query()
    .insert({
      ...ticketData,
      created_by: createdById,
    })
    .returning('*');

  return res.status(200).json({ ticket });
};

const updateTicket = async (req, res) => {
  const newTicketData = req.body;
  const { id: apiUserId } = req.api_user;
  const { id: ticketId } = req.ticket;

  const ticket = await Ticket.query()
    .findById(ticketId)
    .patch({ ...newTicketData, updated_by: apiUserId })
    .returning('*');

  return res.status(200).json({ ticket });
};

const deleteTicket = async (req, res) => {
  const { id: ticketId } = req.ticket;

  const ticket = await Ticket.query()
    .findById(ticketId)
    .delete()
    .returning('*');

  return res.status(200).json({ ticket });
};

export { getTickets, getTicket, createTicket, updateTicket, deleteTicket };
