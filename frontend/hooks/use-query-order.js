import { reduceArrToObj } from '@/utils/helpers';
import { useState, useCallback } from 'react';

function parseOrderByQueryObjToStr(orderByObj) {
  return Object.keys(orderByObj)
    .filter((order) => orderByObj[order])
    .map((order) => `${order}:${orderByObj[order]}`)
    .join(',');
}

function useQueryOrder(columns) {
  const [orderBy, setOrderBy] = useState(() => reduceArrToObj(columns, ''));

  const handleOrderByButtonClick = (column) => () => {
    setOrderBy((prev) => ({
      ...prev,
      [column]: prev[column] === '' ? 'asc' : prev[column] === 'asc' ? 'desc' : ''
    }));
  };

  const getOrderByQueryValue = useCallback(() => parseOrderByQueryObjToStr(orderBy), [orderBy]);

  return { orderBy, handleOrderByButtonClick, getOrderByQueryValue };
}

export { useQueryOrder };
