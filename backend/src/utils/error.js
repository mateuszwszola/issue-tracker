import { isProd } from '../config';

class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
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
    res.status(err.statusCode || 500);
    res.json({
      message: err.message || 'Internal Server Error',
      ...(isProd ? null : { stack: err.stack }),
    });
  }
};

export { ErrorHandler, handleError, handleNotFound };
