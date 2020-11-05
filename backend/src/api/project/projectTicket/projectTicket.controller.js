import { isEmpty } from 'lodash';
import { ErrorHandler } from '../../../utils/error';
import { pickExistingProperties } from '../../../utils/helpers';
import { validTicketOrders } from '../../../utils/ticket';
import { getDefaultTicketGraphQuery } from '../../ticket/ticket.controller';
import { Ticket } from '../../ticket/ticket.model';
import { User } from '../../user/user.model';
import { Project } from '../project.model';

const getProjectTickets = async (req, res) => {
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

const addProjectTicket = async (req, res) => {
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

const updateProjectTicket = async (req, res) => {
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

export { getProjectTickets, addProjectTicket, updateProjectTicket };
