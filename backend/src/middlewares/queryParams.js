import { ErrorHandler } from '../utils/error';

const parsePageQueryParam = (defaultPageSize = 20) => (req, res, next) => {
  let { page, limit } = req.query;

  page = page ? parseInt(page) : 0;
  limit = limit ? parseInt(limit) : defaultPageSize;

  if (Number.isNaN(page) || Number.isNaN(limit) || page < 0 || limit < 1) {
    return next(new ErrorHandler(400, 'Invalid page query params'));
  }

  req.query.skip = page * limit;
  req.query.limit = limit;

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
    const errors = [];

    entries.forEach((entry) => {
      const [column, order = 'asc'] = entry.split(':');
      if (!validOrderColumns.has(column) || !validOrders.has(order)) {
        errors.push(`${column}:${order}`);
      } else {
        orderBy.push({ column, order });
      }
    });

    if (errors.length > 0) {
      return next(
        new ErrorHandler(400, `Invalid orderBy arguments: ${errors.join(', ')}`)
      );
    }
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
