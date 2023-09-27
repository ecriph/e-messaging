/* eslint-disable prettier/prettier */
import {useEffect, useState} from 'react';

type Debounce = {
  input: string;
  delay: number;
};

export const useDebounce = ({input, delay}: Debounce) => {
  const [debouncedValue, setDebouncedValue] = useState(input);
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedValue(input);
    }, delay);

    return () => clearTimeout(debounceTimer);
  }, [input, delay]);

  return debouncedValue;
};
