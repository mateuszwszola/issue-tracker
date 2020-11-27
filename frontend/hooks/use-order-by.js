import { useState, useCallback } from 'react';

function parseOrderByQueryObject(orderByObj) {
  return Object.keys(orderByObj)
    .filter((order) => orderByObj[order])
    .map((order) => `${order}:${orderByObj[order]}`)
    .join(',');
}

function useOrderBy(columns) {
  const [orderBy, setOrderBy] = useState(() => {
    // Create an object with keys from an array, and set them to an empty string
    return columns.reduce((obj, column) => {
      obj[column] = '';
      return obj;
    }, {});
  });

  const handleOrderByButtonClick = (column) => () => {
    setOrderBy((prev) => ({
      ...prev,
      [column]: prev[column] === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getOrderByQueryString = useCallback(() => {
    const orders = parseOrderByQueryObject(orderBy);
    return orders ? `orderBy=${orders}` : '';
  }, [orderBy]);

  return { orderBy, handleOrderByButtonClick, getOrderByQueryString };
}

export { useOrderBy };
