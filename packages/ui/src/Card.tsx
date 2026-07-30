import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  withGradientBorder?: boolean;
  isHoverable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className = '',
      padding = 'md',
      withGradientBorder = false,
      isHoverable = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'rounded-2xl backdrop-blur-xl bg-white/80 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50';
    const hoverStyles = isHoverable ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-xl' : '';
    
    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8'
    };

    if (withGradientBorder) {
      return (
        <div className={`p-[1px] rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 ${hoverStyles}`}>
          <div ref={ref} className={`h-full rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl ${paddings[padding]} ${className}`} {...props}>
            {children}
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${hoverStyles} ${paddings[padding]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';
