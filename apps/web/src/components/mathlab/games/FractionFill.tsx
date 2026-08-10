'use client';
import { useCallback, useState } from 'react';
import { GameHeader, OptionGrid } from './GameHeader';
import { useGameScore } from '@/lib/useGameScore';
import { generateFractionQuestion } from '@/lib/mathGamesEngine';

// Class 4-5 level fraction recognition -- matches chapters like "Halves
// and Quarters" and "Fractions". The bar is genuinely divided into `total`
// equal segments with `shaded` of them coloured in, computed live rather
// than a fixed image, so every round looks different.
export default function FractionFill() {
  const { score, streak, best, recordAnswer, reset } = useGameScore();
  const [q, setQ] = useState(() => generateFractionQuestion());
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const next = useCallback(() => { setQ(generateFractionQuestion()); setSelectedIndex(null); }, []);
  const select = (i: number) => {
    if (selectedIndex !== null) return;
    setSelectedIndex(i);
    recordAnswer(i === q.correctIndex);
    setTimeout(next, 900);
  };
  const restart = () => { reset(); next(); };

  return (
    <div className="space-y-5">
      <GameHeader title="Fraction Fill" score={score} streak={streak} best={best} onRestart={restart} />
      <div className="glass-card rounded-3xl p-6 text-center space-y-6">
        <p className="text-sm font-bold text-slate-500">What fraction of the bar is shaded?</p>
        <div className="flex gap-1 max-w-sm mx-auto h-20">
          {Array.from({ length: q.total }).map((_, i) => (
            <div key={i} className={`flex-1 rounded-lg border-2 border-slate-900 dark:border-slate-700 ${i < q.shaded ? 'bg-primary-600' : 'bg-transparent'}`} />
          ))}
        </div>
        <OptionGrid
          options={q.options}
          selectedIndex={selectedIndex}
          correctIndex={q.correctIndex}
          disabled={selectedIndex !== null}
          onSelect={select}
        />
      </div>
    </div>
  );
}
