import React, { useEffect, useState } from 'react';
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
      <div className={`transform transition-transform duration-500 ${isDark ? '-rotate-90 scale-0' : 'rotate-0 scale-100'}`}>
        <Sun className="w-5 h-5" />
      </div>
      <div className={`absolute transform transition-transform duration-500 ${isDark ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`}>
        <Moon className="w-5 h-5" />
      </div>
    </button>
  );
};
