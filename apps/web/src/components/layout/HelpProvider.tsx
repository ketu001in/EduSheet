'use client';
import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';

interface HelpContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const HelpContext = createContext<HelpContextValue | null>(null);

// True while the keydown's target is somewhere the user is actively typing
// -- '?' is a printable character (Shift+/), so without this guard the
// shortcut would fire on every "?" typed into the search box, a form field,
// etc. instead of just being typed.
function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}

// The app's global keyboard shortcut -- "?" (Shift+/) opens/closes the
// contextual help drawer from anywhere in the dashboard (Escape closes it
// too), the same convention used by GitHub, Slack, Linear, and Notion.
export function HelpProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '?' && !isTypingTarget(e.target)) {
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
