import { ErrorHandler } from './error';

function validateRequest(req, next, schema) {
  const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  };

  const { error, value } = schema.validate(req.body, options);

  if (error) {
    next(
      new ErrorHandler(422, error.details.map((err) => err.message).join(', '))
    );
  } else {
    req.body = value;
    next();
  }
}

export { validateRequest };
