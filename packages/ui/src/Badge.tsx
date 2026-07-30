import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  dot?: boolean;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  className = '',
  variant = 'primary',
  size = 'sm',
  dot = false,
  icon,
  children,
  ...props
}) => {
  const variants = {
    primary: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300',
    secondary: 'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300',
    accent: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
    danger: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300'
  };

  const dotColors = {
    primary: 'bg-indigo-500',
    secondary: 'bg-pink-500',
    accent: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500'
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {dot && (
        <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
