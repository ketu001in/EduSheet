'use client';
import { Flame, RotateCcw, Trophy } from 'lucide-react';

export function GameHeader({ title, score, streak, best, onRestart }: {
  title: string;
  score: number;
  streak: number;
  best: number;
  onRestart: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <div className="flex items-center gap-3 text-sm font-bold">
        <span className="flex items-center gap-1.5 text-primary-600" title="Score"><Trophy className="w-4 h-4" /> {score}</span>
        <span className="flex items-center gap-1.5 text-amber-600" title="Current streak"><Flame className="w-4 h-4" /> {streak}</span>
        <span className="text-slate-400 text-xs font-medium hidden sm:inline">Best: {best}</span>
        <button onClick={onRestart} title="Restart" className="p-1.5 rounded-lg border-2 border-slate-200 dark:border-slate-800 hover:border-primary-400">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Shared "pick one of 4 options" button grid with correct/wrong flash
// feedback -- every arcade game uses this same interaction so the whole
// arcade feels like one coherent thing, not five different UIs bolted
// together.
export function OptionGrid({ options, selectedIndex, correctIndex, disabled, onSelect }: {
  options: string[];
  selectedIndex: number | null;
  correctIndex: number;
  disabled: boolean;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((opt, i) => {
        const isSelected = selectedIndex === i;
        const showCorrect = selectedIndex !== null && i === correctIndex;
        const showWrong = isSelected && i !== correctIndex;
        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            disabled={disabled}
            className={`py-4 px-3 rounded-2xl text-lg font-bold border-2 transition-all ${
              showCorrect
                ? 'border-accent-600 bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-300'
                : showWrong
                ? 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-600'
                : 'border-slate-900 dark:border-slate-700 bg-surface-light dark:bg-surface-dark hover:shadow-[3px_3px_0_var(--color-ink)] disabled:opacity-60'
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
