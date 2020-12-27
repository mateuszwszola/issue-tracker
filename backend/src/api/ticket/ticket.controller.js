import { getTicketGraphQuery } from '../../utils/ticket';
import { Ticket } from './ticket.model';
import { TicketPriority } from './ticketPriority/ticketPriority.model';
import { TicketType } from './ticketType/ticketType.model';
import { TicketStatus } from './ticketStatus/ticketStatus.model';
import { forEach, pick } from 'lodash';
import {
  TICKET_STATUSES,
  ticketSearchProps,
  validTicketState,
} from '../../constants/ticket';

const getTickets = async (req, res) => {
  const {
    skip,
    limit,
    orderBy,
    withGraph,
    search,
    state = 'active',
  } = req.query;

  if (state && !validTicketState.has(state)) {
    return res.status(400).json({ message: `Invalid ticket state: ${state}` });
  }

  const query = Ticket.query().offset(skip).limit(limit).orderBy(orderBy);

  const whereProps = pick(req.query, ticketSearchProps);

  forEach(whereProps, (value, key) => {
    query.where(key, value);
  });

  if (state === 'archived') {
    query.whereNotNull('archived_at');
  } else if (state === 'active') {
    query.whereNull('archived_at');
  }

  if (withGraph) {
    getTicketGraphQuery(query, withGraph);
  }

  if (search) {
    query.modify('search', search);
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

  const { id: submittedStatusId } = await TicketStatus.query()
    .findOne({
      name: TICKET_STATUSES.submitted,
    })
    .select('id');

  const ticket = await Ticket.query()
    .insert({
      ...ticketData,
      status_id: submittedStatusId,
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

const getTicketTypes = async (req, res) => {
  const types = await TicketType.query().modify('defaultSelects');

  return res.status(200).json({ types });
};

const getTicketStatuses = async (req, res) => {
  const statuses = await TicketStatus.query().modify('defaultSelects');

  return res.status(200).json({ statuses });
};

const getTicketPriorities = async (req, res) => {
  const priorities = await TicketPriority.query().modify('defaultSelects');

  return res.status(200).json({ priorities });
};

export {
  getTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket,
  getTicketTypes,
  getTicketStatuses,
  getTicketPriorities,
};
