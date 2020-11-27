import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

function useDebouncedSearchKey(initialValue = '') {
  const [inputValue, setInputValue] = useState(initialValue);
  const [searchKey, setSearchKey] = useState('');

  const handleInputValueChange = useCallback(
    (e) => {
      setInputValue(e.target.value);
    },
    [setInputValue]
  );

  const debouncedSearchKeyUpdate = debounce(() => {
    setSearchKey(inputValue);
  }, 500);

  useEffect(() => {
    debouncedSearchKeyUpdate();
    return () => {
      debouncedSearchKeyUpdate.cancel();
    };
  }, [inputValue, debouncedSearchKeyUpdate]);

  return { inputValue, handleInputValueChange, searchKey };
}

export { useDebouncedSearchKey };
