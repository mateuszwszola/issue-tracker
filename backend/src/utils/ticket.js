import Joi from 'joi';
import { createBuilder } from './objection';
import { validateRequest } from './validateRequest';

function getTicketGraphQuery(query, withGraph) {
  return query
    .allowGraph(
      '[project, parentTicket, subTicket, createdBy, updatedBy, assignee, type, status, priority, comments]'
    )
    .withGraphFetched(withGraph)
    .modifyGraph('type', createBuilder(['name']))
    .modifyGraph('status', createBuilder(['name']))
    .modifyGraph('priority', createBuilder(['name']))
    .modifyGraph('createdBy', createBuilder(['id', 'sub', 'name', 'picture']))
    .modifyGraph('updatedBy', createBuilder(['id', 'sub', 'name', 'picture']))
    .modifyGraph('assignee', createBuilder(['id', 'sub', 'name', 'picture']));
}

function createTicketSchema(req, res, next) {
  const schema = Joi.object({
    project_id: Joi.number().required(),
    name: Joi.string().required(),
    description: Joi.string().allow(''),
    parent_id: Joi.number(),
    type_id: Joi.number().required(),
    priority_id: Joi.number().required(),
    assignee_id: Joi.number(),
  });

  validateRequest(req, next, schema);
}

function updateTicketSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().empty(''),
    description: Joi.string().allow(''),
    parent_id: Joi.number().empty(''),
    type_id: Joi.number().empty(''),
    status_id: Joi.number().empty(''),
    priority_id: Joi.number().empty(''),
    assignee_id: Joi.number().empty(''),
  });

  validateRequest(req, next, schema);
}

export { createTicketSchema, updateTicketSchema, getTicketGraphQuery };
