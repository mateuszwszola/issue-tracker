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
      [column]: prev[column] === '' ? 'asc' : prev[column] === 'asc' ? 'desc' : ''
    }));
  };

  const getOrderByQueryValue = useCallback(() => parseOrderByQueryObject(orderBy), [orderBy]);

  return { orderBy, handleOrderByButtonClick, getOrderByQueryValue };
}

export { useOrderBy };
