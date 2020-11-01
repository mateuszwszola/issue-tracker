import { isProd } from '../config';
import { ValidationError, NotFoundError } from 'objection';

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
    next(err);
  } else {
    let statusCode = err.status || 500;

    if (err instanceof ValidationError) {
      statusCode = 400;
    } else if (err instanceof NotFoundError) {
      statusCode = 404;
    }

    res.status(statusCode);
    res.json({
      message: err.message || 'Internal Server Error',
      data: err.data || {},
      ...(isProd ? null : { stack: err.stack }),
    });
  }
};

export { ErrorHandler, handleError, handleNotFound };
