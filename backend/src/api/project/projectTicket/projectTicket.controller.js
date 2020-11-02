import { isEmpty } from 'lodash';
import { getDefaultTicketGraphQuery } from '../../ticket/ticket.controller';
import { Ticket } from '../../ticket/ticket.model';
import { Project } from '../project.model';

function pickExistingProperties(values, srcObject) {
  const newObj = {};
  values.forEach((value) => {
    if (srcObject[value]) {
      newObj[value] = srcObject[value];
    }
  });
  return newObj;
}

const getProjectTickets = async (req, res) => {
  const {
    cursor = 0,
    limit = 100,
    select,
    orderBy = 'id',
    withGraph,
  } = req.query;
  const { projectId } = req.params;

  const query = Project.relatedQuery('tickets')
    .for(projectId)
    .offset(parseInt(cursor))
    .limit(parseInt(limit))
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

  const ticket = await Project.relatedQuery('tickets')
    .for(projectId)
    .insert(req.body);

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
    'parent_id',
  ];

  const newTicketData = pickExistingProperties(properties, req.body);

  let query = Ticket.query().findById(ticketId);

  if (!isEmpty(newTicketData)) {
    query = query.patch(newTicketData).returning('*');
  }

  return res.status(200).json({ ticket: await query });
};

export { getProjectTickets, addProjectTicket, updateProjectTicket };
