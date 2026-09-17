'use client';
import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';

interface HelpContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const HelpContext = createContext<HelpContextValue | null>(null);

// The app's first global keyboard shortcut -- F1 opens/closes the
// contextual help drawer from anywhere in the dashboard (Escape closes it
// too). preventDefault stops the OS/browser's own F1 help where applicable.
export function HelpProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        toggle();
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggle]);

  return <HelpContext.Provider value={{ isOpen, open, close, toggle }}>{children}</HelpContext.Provider>;
}

export function useHelp(): HelpContextValue {
  const ctx = useContext(HelpContext);
  if (!ctx) throw new Error('useHelp must be used within a HelpProvider');
  return ctx;
}
