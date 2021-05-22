import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

function useDebouncedSearchKey(initialValue = '') {
  const [inputValue, setInputValue] = useState(initialValue);
  const [searchKey, setSearchKey] = useState('');

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  const handleInputValueChange = useCallback(
    (e) => {
      setInputValue(e.target.value);
    },
    [setInputValue]
  );

  useEffect(() => {
    const debouncedSearchKeyUpdate = debounce(() => {
      setSearchKey(inputValue);
    }, 500);

    debouncedSearchKeyUpdate();
    return () => {
      debouncedSearchKeyUpdate.cancel();
    };
  }, [inputValue]);

  return { inputValue, handleInputValueChange, searchKey };
}

export { useDebouncedSearchKey };
