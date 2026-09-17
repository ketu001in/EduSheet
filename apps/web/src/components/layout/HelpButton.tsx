'use client';
import { HelpCircle } from 'lucide-react';
import { useHelp } from './HelpProvider';

export default function HelpButton() {
  const { toggle } = useHelp();
  return (
    <button
      onClick={toggle}
      title="Help (F1)"
      aria-label="Help"
      className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
    >
      <HelpCircle className="w-5 h-5" />
    </button>
  );
}
