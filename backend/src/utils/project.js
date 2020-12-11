import { createDefaultSelectsBuilder } from './objection';
import Joi from 'joi';
import { validateRequest } from './validateRequest';

function createProjectKey(projectName, projectId) {
  let acronym = projectName
    .match(/\b(\w)/g)
    .join('')
    .substr(0, 2);

  if (acronym.length < 2) {
    acronym = projectName.substr(0, 2);
  }

  return acronym.toUpperCase() + '-' + projectId;
}

function getProjectGraphQuery(query, withGraph) {
  const allowedGraphs = [
    'type',
    'createdBy',
    'manager',
    'engineers',
    'tickets',
  ];

  query.allowGraph(`[${allowedGraphs.join(', ')}]`).withGraphFetched(withGraph);

  allowedGraphs.forEach((graph) => {
    query.modifyGraph(graph, createDefaultSelectsBuilder);
  });

  return query;
}

const validProjectOrders = new Set([
  'id',
  'key',
  'name',
  'type_id',
  'manager_id',
  'created_by',
  'created_at',
  'updated_at',
]);

function createProjectSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().empty(''),
    type_id: Joi.number().required(),
    manager_id: Joi.number(),
  });

  validateRequest(req, next, schema);
}

function updateProjectSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().empty(''),
    description: Joi.string(),
    type_id: Joi.number().empty(''),
    manager_id: Joi.number().empty(''),
  });

  validateRequest(req, next, schema);
}

export {
  createProjectKey,
  getProjectGraphQuery,
  validProjectOrders,
  createProjectSchema,
  updateProjectSchema,
};
