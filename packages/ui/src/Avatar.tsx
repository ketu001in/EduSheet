import React, { useState } from 'react';

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
        className={`
          rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-pink-100 dark:from-indigo-900/50 dark:to-pink-900/50
          text-indigo-700 dark:text-indigo-300 font-semibold overflow-hidden
          ${sizes[size]} ${ringStyles} ${className}
        `}
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
          className={`
            absolute bottom-0 right-0 block rounded-full border-2 border-white dark:border-slate-900
            ${isOnline ? 'bg-emerald-500' : 'bg-slate-400'}
            ${size === 'sm' ? 'w-2.5 h-2.5' : size === 'xl' ? 'w-4 h-4' : 'w-3 h-3'}
          `}
        />
      )}
    </div>
  );
};
