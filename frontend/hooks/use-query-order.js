import { useState, useCallback } from 'react';

function parseOrderByQueryObjToStr(orderByObj) {
  return Object.keys(orderByObj)
    .filter((order) => orderByObj[order])
    .map((order) => `${order}:${orderByObj[order]}`)
    .join(',');
}

function useQueryOrder(columns) {
  const [orderBy, setOrderBy] = useState(columns);

  const handleOrderByButtonClick = useCallback(
    (column) => () => {
      setOrderBy((prev) => ({
        ...prev,
        [column]: prev[column] === '' ? 'asc' : prev[column] === 'asc' ? 'desc' : ''
      }));
    },
    [setOrderBy]
  );

  const getOrderByQueryValue = useCallback(() => parseOrderByQueryObjToStr(orderBy), [orderBy]);

  return { orderBy, handleOrderByButtonClick, getOrderByQueryValue };
}

export { useQueryOrder };
