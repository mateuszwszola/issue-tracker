import { reduceArrToObj } from '@/utils/helpers';
import { useState, useCallback } from 'react';

function useQueryFilter(filterNames) {
  const [filters, setFilters] = useState(() => reduceArrToObj(filterNames, ''));

  const handleFilterChange = (filterName) => (value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value
    }));
  };

  const getFilters = useCallback(() => {
    return filterNames.reduce((obj, filterName) => {
      if (filters[filterName]) {
        obj[filterName] = filters[filterName];
      }
      return obj;
    }, {});
  }, [filterNames, filters]);

  return { filters, handleFilterChange, getFilters };
}

export { useQueryFilter };
