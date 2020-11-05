import { isEmpty } from 'lodash';
import {
  ForeignKeyViolationError,
  NotFoundError,
  ValidationError,
} from 'objection';
import config from '../config';

class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.status = statusCode;
    this.message = message;
  }
}

const handleNotFound = (req, res, next) => {
  const error = new ErrorHandler(404, `Route ${req.originalUrl} Not Found`);
  next(error);
};

const handleError = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  } else {
    const customError = {};

    if (err instanceof ValidationError) {
      customError.type = 'ValidationError';
      customError.errors = err.data;
    } else if (err instanceof ForeignKeyViolationError) {
      customError.type = 'ForeignKeyViolationError';
    } else if (err instanceof NotFoundError) {
      customError.type = 'NotFound';
    }

    const statusCode = err.statusCode || err.status || 500;

    res.status(statusCode);
    res.json({
      message: err.message || 'Internal Server Error',
      ...(isEmpty(customError) ? null : customError),
      ...(config.isProd ? null : { stack: err.stack }),
    });
  }
};

export { ErrorHandler, handleError, handleNotFound };
