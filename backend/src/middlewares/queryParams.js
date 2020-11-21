import { ErrorHandler } from '../utils/error';

const parsePageQueryParam = (pageSize = 20) => (req, res, next) => {
  let { page } = req.query;

  page = page ? parseInt(page) : 1;

  if (Number.isNaN(page)) {
    throw new ErrorHandler(400, 'Invalid page query param');
  }

  if (page < 1) {
    throw new ErrorHandler(400, 'Invalid page number');
  }

  const skip = (page - 1) * pageSize;

  req.query.limit = pageSize;
  req.query.skip = skip;

  next();
};

const parsePaginationQueryParams = (defaultLimit = 100) => (req, res, next) => {
  let { cursor, limit } = req.query;

  cursor = cursor ? Number(cursor) : 0;
  limit = cursor ? Number(limit) : defaultLimit;

  if (Number.isNaN(cursor) || Number.isNaN(limit)) {
    next(new ErrorHandler(400, 'Invalid pagination query params'));
  } else {
    req.query.cursor = cursor;
    req.query.limit = limit;
    next();
  }
};

const validateOrderByParam = (validOrders) => (req, res, next) => {
  let { orderBy } = req.query;

  if (orderBy) {
    orderBy = orderBy.toLowerCase();
    if (!validOrders.has(orderBy)) {
      throw new ErrorHandler(400, `Invalid orderBy param: ${orderBy}`);
    }

    req.query.orderBy = orderBy;
  }

  next();
};

export {
  parsePaginationQueryParams,
  validateOrderByParam,
  parsePageQueryParam,
};
