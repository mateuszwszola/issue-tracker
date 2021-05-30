import Joi from 'joi';
import { ROLES } from '../constants/roles';
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

function createTicketSchema(req, _res, next) {
  const { api_user } = req;

  const schemaRules = {
    project_id: Joi.number().required(),
    name: Joi.string().required(),
    description: Joi.string().allow(''),
    type_id: Joi.number().required(),
    parent_id: Joi.number(),
  };

  if (
    [ROLES.project_engineer, ROLES.project_manager, ROLES.admin].includes(
      api_user.role
    )
  ) {
    schemaRules.priority_id = Joi.number().empty('');
    schemaRules.assignee_id = Joi.number().empty('');
    schemaRules.status_id = Joi.number().empty('');
  }

  const schema = Joi.object(schemaRules);

  validateRequest(req, next, schema);
}

function updateTicketSchema(req, _res, next) {
  const schemaRules = {
    name: Joi.string().empty(''),
    description: Joi.string().allow(''),
    type_id: Joi.number().empty(''),
    parent_id: Joi.number().empty(''),
  };

  if (
    [ROLES.project_engineer, ROLES.project_manager, ROLES.admin].includes(
      req.api_user.role
    )
  ) {
    schemaRules.priority_id = Joi.number().empty('');
    schemaRules.assignee_id = Joi.number().empty('');
    schemaRules.status_id = Joi.number().empty('');
  }

  const schema = Joi.object(schemaRules);

  validateRequest(req, next, schema);
}

function createTicketAttachmentSchema(req, res, next) {
  const schema = Joi.object({
    attachment_url: Joi.string().required(),
  });

  validateRequest(req, next, schema);
}

export {
  createTicketSchema,
  updateTicketSchema,
  createTicketAttachmentSchema,
  getTicketGraphQuery,
};
