import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'white' | 'slate';
  label?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  label,
  className = ''
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const variants = {
    primary: 'text-indigo-500',
    white: 'text-white',
    slate: 'text-slate-500 dark:text-slate-400'
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 className={`animate-spin ${sizes[size]} ${variants[variant]}`} />
      {label && (
        <span className={`text-sm font-medium ${variants[variant]}`}>
          {label}
        </span>
      )}
    </div>
  );
};
