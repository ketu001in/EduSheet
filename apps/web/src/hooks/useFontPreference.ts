'use client';
import { useEffect, useState } from 'react';

export const FONT_OPTIONS = [
  { id: 'inter', label: 'Inter', hint: 'Default — clean and neutral', cssVar: '--font-inter' },
  { id: 'poppins', label: 'Poppins', hint: 'Rounded and friendly', cssVar: '--font-poppins' },
  { id: 'nunito', label: 'Nunito', hint: 'Soft and approachable', cssVar: '--font-nunito' },
  { id: 'lexend', label: 'Lexend', hint: 'Designed for reading proficiency', cssVar: '--font-lexend' },
  { id: 'atkinson', label: 'Atkinson Hyperlegible', hint: 'Built for maximum legibility', cssVar: '--font-atkinson' },
  { id: 'merriweather', label: 'Merriweather', hint: 'Classic serif, book-like', cssVar: '--font-merriweather' },
] as const;

export type FontId = (typeof FONT_OPTIONS)[number]['id'];

export function useFontPreference() {
  const [font, setFontState] = useState<FontId>('inter');

  useEffect(() => {
    const saved = localStorage.getItem('font') as FontId | null;
    if (saved && FONT_OPTIONS.some((f) => f.id === saved)) {
      setFontState(saved);
    }
  }, []);

  const setFont = (next: FontId) => {
    setFontState(next);
    if (next === 'inter') {
      localStorage.removeItem('font');
      document.documentElement.removeAttribute('data-font');
    } else {
      localStorage.setItem('font', next);
      document.documentElement.setAttribute('data-font', next);
    }
  };

  return { font, setFont };
}
