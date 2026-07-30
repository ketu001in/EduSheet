import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circle' | 'rectangle' | 'card';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
  style,
  ...props
}) => {
  const baseClasses = 'animate-pulse bg-slate-200 dark:bg-slate-800';
  
  const variants = {
    text: 'h-4 w-full rounded',
    circle: 'rounded-full',
    rectangle: 'rounded-lg',
    card: 'rounded-2xl h-48 w-full'
  };

  return (
    <div
      className={`${baseClasses} ${variants[variant]} ${className}`}
      style={{
        width: width ?? (variant === 'circle' ? '3rem' : undefined),
        height: height ?? (variant === 'circle' ? '3rem' : undefined),
        ...style
      }}
      {...props}
    />
  );
};
