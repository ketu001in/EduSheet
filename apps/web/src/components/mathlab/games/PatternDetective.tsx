'use client';
import { useCallback, useState } from 'react';
import { GameHeader, OptionGrid } from './GameHeader';
import { useGameScore } from '@/lib/useGameScore';
import { generatePatternQuestion } from '@/lib/mathGamesEngine';

// Class 3-4 level pattern recognition -- matches chapters like "Play with
// Patterns". Each round is a real arithmetic sequence (add, subtract, or
// double), not a made-up one, so the "why" always holds up under scrutiny.
export default function PatternDetective() {
  const { score, streak, best, recordAnswer, reset } = useGameScore();
  const [q, setQ] = useState(() => generatePatternQuestion());
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const next = useCallback(() => { setQ(generatePatternQuestion()); setSelectedIndex(null); }, []);
  const select = (i: number) => {
    if (selectedIndex !== null) return;
    setSelectedIndex(i);
    recordAnswer(i === q.correctIndex);
    setTimeout(next, 900);
  };
  const restart = () => { reset(); next(); };

  return (
    <div className="space-y-5">
      <GameHeader title="Pattern Detective" score={score} streak={streak} best={best} onRestart={restart} />
      <div className="glass-card rounded-3xl p-6 text-center space-y-6">
        <p className="text-sm font-bold text-slate-500">What comes next in the pattern?</p>
        <div className="flex items-center justify-center gap-3 font-display text-2xl font-bold flex-wrap">
          {q.sequence.map((n, i) => (
            <span key={i} className="px-4 py-2 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300">{n}</span>
          ))}
          <span className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400">?</span>
        </div>
        <OptionGrid
          options={q.options.map(String)}
          selectedIndex={selectedIndex}
          correctIndex={q.correctIndex}
          disabled={selectedIndex !== null}
          onSelect={select}
        />
      </div>
    </div>
  );
}
