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

const validateOrderByParam = (
  validOrderColumns,
  defaultColumn = 'id',
  defaultOrder = 'asc'
) => (req, res, next) => {
  const { orderBy: orderByParam } = req.query;

  const validOrders = new Set(['asc', 'desc']);

  const orderBy = [];

  if (orderByParam) {
    const entries = orderByParam.toLowerCase().split(',');

    entries.forEach((entry) => {
      const [column, order = 'asc'] = entry.split(':');
      if (!validOrderColumns.has(column) || !validOrders.has(order)) {
        throw new ErrorHandler(
          400,
          `Invalid orderBy argument: ${column}:${order}`
        );
      }

      orderBy.push({ column, order });
    });
  } else {
    orderBy.push({ column: defaultColumn, order: defaultOrder });
  }

  req.query.orderBy = orderBy;

  next();
};

export {
  parsePaginationQueryParams,
  validateOrderByParam,
  parsePageQueryParam,
};
