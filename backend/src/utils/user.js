import Joi from 'joi';
import { validateRequest } from './validateRequest';

function createUserSchema(req, res, next) {
  const schemaRules = {
    name: Joi.string(),
    email: Joi.string().email().required(),
  };

  if (req.api_user && req.api_user.is_admin) {
    schemaRules.is_admin = Joi.bool();
    schemaRules.blocked = Joi.bool();
  }

  const schema = Joi.object(schemaRules);

  validateRequest(req, next, schema);
}

function updateUserSchema(req, res, next) {
  const schemaRules = {
    name: Joi.string().empty(''),
    email: Joi.string().email().empty(''),
  };

  if (req.api_user && req.api_user.is_admin) {
    schemaRules.is_admin = Joi.bool().empty('');
    schemaRules.blocked = Joi.bool().empty('');
  }

  const schema = Joi.object(schemaRules);

  validateRequest(req, next, schema);
}

export { createUserSchema, updateUserSchema };
