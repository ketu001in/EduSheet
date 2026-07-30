import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from './Input';

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onSearch: (value: string) => void;
  debounceMs?: number;
  isLoading?: boolean;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className = '',
      onSearch,
      debounceMs = 300,
      isLoading = false,
      value: propValue,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const [localValue, setLocalValue] = useState((propValue || defaultValue || '') as string);
    const timeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
      if (propValue !== undefined) {
        setLocalValue(propValue as string);
      }
    }, [propValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setLocalValue(val);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        onSearch(val);
      }, debounceMs);
    };

    const handleClear = () => {
      setLocalValue('');
      onSearch('');
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };

    return (
      <div className="relative w-full">
        <Input
          ref={ref}
          value={localValue}
          onChange={handleChange}
          leftIcon={<Search className="w-5 h-5" />}
          className={`${isLoading || localValue ? 'pr-10' : ''} ${className}`}
          {...props}
        />
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
          ) : localValue ? (
            <button
              type="button"
              onClick={handleClear}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </div>
    );
  }
);
SearchInput.displayName = 'SearchInput';
