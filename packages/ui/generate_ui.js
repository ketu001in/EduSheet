const fs = require('fs');
const path = require('path');

const dir = "C:/Users/Ketul Shah/.gemini/antigravity/scratch/edusheets/packages/ui";
fs.mkdirSync(path.join(dir, 'src'), { recursive: true });

const files = {
  "package.json": `{
  "name": "@edusheets/ui",
  "version": "0.0.0",
  "private": true,
  "sideEffects": false,
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "check-types": "tsc --noEmit",
    "lint": "echo 'no linting configured'"
  },
  "dependencies": {
    "lucide-react": "^0.468.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@edusheets/config": "workspace:*",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.7.0"
  }
}
`,
  "tsconfig.json": `{
  "extends": "@edusheets/config/tsconfig/react-library.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
`,
  "src/index.ts": `export * from './Button';
export * from './Card';
export * from './Input';
export * from './Select';
export * from './Badge';
export * from './Modal';
export * from './Toast';
export * from './Stepper';
export * from './Skeleton';
export * from './ThemeToggle';
export * from './LoadingSpinner';
export * from './EmptyState';
export * from './Avatar';
export * from './SearchInput';
`,
  "src/Button.tsx": `import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none active:scale-95';
    
    const variants = {
      primary: 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02]',
      secondary: 'border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100',
      ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300',
      danger: 'bg-red-500 text-white hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/25'
    };

    const sizes = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-11 px-6 text-base',
      lg: 'h-14 px-8 text-lg'
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={\`\${baseStyles} \${variants[variant]} \${sizes[size]} \${className}\`}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = 'Button';
`,
  "src/Card.tsx": `import React from 'react';

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
        <div className={\`p-[1px] rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 \${hoverStyles}\`}>
          <div ref={ref} className={\`h-full rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl \${paddings[padding]} \${className}\`} {...props}>
            {children}
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={\`\${baseStyles} \${hoverStyles} \${paddings[padding]} \${className}\`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';
`,
  "src/Input.tsx": `import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  inputSize?: 'sm' | 'md' | 'lg';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = '',
      label,
      error,
      leftIcon,
      inputSize = 'md',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\\s+/g, '-') : undefined);
    
    const sizes = {
      sm: 'h-9 text-sm',
      md: 'h-11 text-base',
      lg: 'h-14 text-lg'
    };

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={\`
              w-full rounded-xl border bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm
              transition-all duration-200 outline-none
              focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500
              disabled:opacity-50 disabled:cursor-not-allowed
              \${error ? 'border-red-500 focus:ring-red-500/50' : 'border-slate-200 dark:border-slate-700'}
              \${leftIcon ? 'pl-10' : 'pl-4'}
              pr-4
              \${sizes[inputSize]}
              \${className}
            \`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-red-500 mt-1">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
`,
  "src/Select.tsx": `import React from 'react';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  leftIcon?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className = '',
      label,
      error,
      options,
      leftIcon,
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <select
            id={selectId}
            ref={ref}
            className={\`
              w-full h-11 rounded-xl border bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm
              transition-all duration-200 outline-none appearance-none
              focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500
              disabled:opacity-50 disabled:cursor-not-allowed
              \${error ? 'border-red-500 focus:ring-red-500/50' : 'border-slate-200 dark:border-slate-700'}
              \${leftIcon ? 'pl-10' : 'pl-4'}
              pr-10
              \${className}
            \`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && (
          <p className="text-sm text-red-500 mt-1">{error}</p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';
`,
  "src/Badge.tsx": `import React from 'react';

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
      className={\`inline-flex items-center gap-1.5 rounded-full font-medium transition-colors \${variants[variant]} \${sizes[size]} \${className}\`}
      {...props}
    >
      {dot && (
        <span className={\`h-1.5 w-1.5 rounded-full \${dotColors[variant]}\`} />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
`,
  "src/Modal.tsx": `import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className = ''
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div 
        className={\`
          relative w-full max-w-lg rounded-2xl bg-white/90 dark:bg-slate-900/90 
          backdrop-blur-xl shadow-2xl border border-white/20 dark:border-slate-700/50
          transform transition-all duration-300 animate-in fade-in zoom-in-95
          flex flex-col max-h-[90vh]
          \${className}
        \`}
      >
        {(title || onClose) && (
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
            {title && (
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {title}
              </h2>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        
        <div className="p-6 overflow-y-auto">
          {children}
        </div>

        {footer && (
          <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
`,
  "src/Toast.tsx": `import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextType {
  toast: (props: Omit<ToastProps, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const icons = {
  success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
  error: <XCircle className="w-5 h-5 text-red-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = useCallback(({ duration = 5000, ...props }: Omit<ToastProps, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, duration, ...props }]);

    if (duration !== Infinity) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {typeof window !== 'undefined' && createPortal(
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
          {toasts.map((t) => (
            <div
              key={t.id}
              className="pointer-events-auto flex items-start gap-3 w-80 p-4 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 animate-in slide-in-from-top-2 fade-in duration-300"
            >
              <div className="shrink-0 mt-0.5">{icons[t.variant || 'info']}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {t.title}
                </p>
                {t.description && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {t.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};
`,
  "src/Stepper.tsx": `import React from 'react';
import { Check } from 'lucide-react';

export interface Step {
  label: string;
  description?: string;
}

export interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep, className = '' }) => {
  return (
    <div className={\`w-full \${className}\`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > index;
          const isCurrent = currentStep === index;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.label} className={\`flex items-center \${isLast ? '' : 'flex-1'}\`}>
              <div className="relative flex flex-col items-center group">
                <div 
                  className={\`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 z-10
                    \${isCompleted ? 'bg-indigo-500 border-indigo-500 text-white' : ''}
                    \${isCurrent ? 'bg-white dark:bg-slate-900 border-indigo-500 text-indigo-500' : ''}
                    \${!isCompleted && !isCurrent ? 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-500' : ''}
                  \`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : <span>{index + 1}</span>}
                </div>
                
                <div className="absolute top-12 w-32 text-center">
                  <p className={\`text-sm font-medium \${isCurrent || isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-500'}\`}>
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-slate-500 mt-1 hidden sm:block">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {!isLast && (
                <div className="flex-1 h-0.5 mx-4 relative overflow-hidden bg-slate-200 dark:bg-slate-700">
                  <div 
                    className="absolute inset-y-0 left-0 bg-indigo-500 transition-all duration-500 ease-in-out"
                    style={{ width: isCompleted ? '100%' : '0%' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
`,
  "src/Skeleton.tsx": `import React from 'react';

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
      className={\`\${baseClasses} \${variants[variant]} \${className}\`}
      style={{
        width: width ?? (variant === 'circle' ? '3rem' : undefined),
        height: height ?? (variant === 'circle' ? '3rem' : undefined),
        ...style
      }}
      {...props}
    />
  );
};
`,
  "src/ThemeToggle.tsx": `import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial
    const isDarkMode = document.documentElement.classList.contains('dark') || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors relative overflow-hidden flex items-center justify-center w-10 h-10"
      aria-label="Toggle theme"
    >
      <div className={\`transform transition-transform duration-500 \${isDark ? '-rotate-90 scale-0' : 'rotate-0 scale-100'}\`}>
        <Sun className="w-5 h-5" />
      </div>
      <div className={\`absolute transform transition-transform duration-500 \${isDark ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}\`}>
        <Moon className="w-5 h-5" />
      </div>
    </button>
  );
};
`,
  "src/LoadingSpinner.tsx": `import React from 'react';
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
    <div className={\`flex flex-col items-center justify-center gap-3 \${className}\`}>
      <Loader2 className={\`animate-spin \${sizes[size]} \${variants[variant]}\`} />
      {label && (
        <span className={\`text-sm font-medium \${variants[variant]}\`}>
          {label}
        </span>
      )}
    </div>
  );
};
`,
  "src/EmptyState.tsx": `import React from 'react';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = ''
}) => {
  return (
    <div className={\`flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-700 \${className}\`}>
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};
`,
  "src/Avatar.tsx": `import React, { useState } from 'react';

export interface AvatarProps {
  src?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  withRing?: boolean;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  initials,
  size = 'md',
  isOnline,
  withRing = false,
  className = ''
}) => {
  const [imgError, setImgError] = useState(false);

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  };

  const ringStyles = withRing ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900' : '';

  return (
    <div className="relative inline-block">
      <div 
        className={\`
          rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-pink-100 dark:from-indigo-900/50 dark:to-pink-900/50
          text-indigo-700 dark:text-indigo-300 font-semibold overflow-hidden
          \${sizes[size]} \${ringStyles} \${className}
        \`}
      >
        {src && !imgError ? (
          <img 
            src={src} 
            alt={initials || 'Avatar'} 
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          initials?.slice(0, 2).toUpperCase()
        )}
      </div>
      
      {isOnline !== undefined && (
        <span 
          className={\`
            absolute bottom-0 right-0 block rounded-full border-2 border-white dark:border-slate-900
            \${isOnline ? 'bg-emerald-500' : 'bg-slate-400'}
            \${size === 'sm' ? 'w-2.5 h-2.5' : size === 'xl' ? 'w-4 h-4' : 'w-3 h-3'}
          \`}
        />
      )}
    </div>
  );
};
`,
  "src/SearchInput.tsx": `import React, { useState, useEffect, useRef } from 'react';
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
          className={\`\${isLoading || localValue ? 'pr-10' : ''} \${className}\`}
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
`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(dir, filepath), content);
}
console.log('Successfully created all UI components.');
