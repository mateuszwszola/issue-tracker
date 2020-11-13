import { ErrorHandler } from '../utils/error';

const parsePaginationQueryParams = (defaultLimit = 100) => (req, res, next) => {
  let { cursor, limit } = req.query;

  cursor = cursor ? Number(cursor) : 0;
  limit = cursor ? Number(limit) : defaultLimit;

  if (Number.isNaN(cursor) || Number.isNaN(limit)) {
    throw new ErrorHandler(400, 'Cursor and limit params must be a number');
  } else {
    req.query.cursor = cursor;
    req.query.limit = limit;
    next();
  }
};

const validateOrderByParam = (validOrders, defaultOrder = 'id') => (
  req,
  res,
  next
) => {
  let { orderBy } = req.query;

  orderBy = orderBy && String(orderBy).toLowerCase();

  if (orderBy && !validOrders.has(orderBy)) {
    next(new ErrorHandler(400, 'Invalid orderBy param'));
  } else {
    req.query.orderBy = orderBy;
  }

  next();
};

export { parsePaginationQueryParams, validateOrderByParam };
