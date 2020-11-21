import Joi from 'joi';
import { validateRequest } from './validateRequest';

function createUserSchema(req, res, next) {
  const { api_user } = req;

  const schemaRules = {
    name: Joi.string(),
    email: Joi.string().email().required(),
    picture: Joi.string(),
  };

  if (api_user && api_user.is_admin) {
    schemaRules.is_admin = Joi.bool();
  }

  const schema = Joi.object(schemaRules);

  validateRequest(req, next, schema);
}

function updateUserSchema(req, res, next) {
  const { api_user } = req;

  const schemaRules = {
    name: Joi.string().empty(''),
    email: Joi.string().email().empty(''),
    picture: Joi.string().empty(''),
  };

  if (api_user && api_user.is_admin) {
    schemaRules.is_admin = Joi.bool().empty('');
    schemaRules.blocked = Joi.bool().empty('');
  }

  const schema = Joi.object(schemaRules);

  validateRequest(req, next, schema);
}

export { createUserSchema, updateUserSchema };
