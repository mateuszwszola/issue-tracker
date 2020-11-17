import Joi from 'joi';
import { validateRequest } from './validateRequest';

function createTicketSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    type_id: Joi.number().required(),
    status_id: Joi.number().required(),
    priority_id: Joi.number().required(),
  });

  validateRequest(req, next, schema);
}

function updateTicketSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().empty(''),
    description: Joi.string(),
    type_id: Joi.number().empty(''),
    status_id: Joi.number().empty(''),
    priority_id: Joi.number().empty(''),
  });

  validateRequest(req, next, schema);
}

export { createTicketSchema, updateTicketSchema };
