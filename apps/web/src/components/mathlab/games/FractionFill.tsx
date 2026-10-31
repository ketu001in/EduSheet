'use client';
import { useCallback, useState } from 'react';
import { GameHeader, OptionGrid } from './GameHeader';
import GenerateWorksheetLink from '../GenerateWorksheetLink';
import { useGameScore } from '@/lib/useGameScore';
import { generateFractionQuestion, generateFractionArithmeticQuestion } from '@/lib/mathGamesEngine';

type FractionQuestion =
  | { mode: 'recognition'; data: ReturnType<typeof generateFractionQuestion> }
  | { mode: 'arithmetic'; data: ReturnType<typeof generateFractionArithmeticQuestion> };

function generateRound(): FractionQuestion {
  return Math.random() < 0.5
    ? { mode: 'recognition', data: generateFractionQuestion() }
    : { mode: 'arithmetic', data: generateFractionArithmeticQuestion() };
}

// Class 4-5 level -- alternates between fraction RECOGNITION ("what
// fraction of the bar is shaded", matching chapters like "Halves and
// Quarters") and same-denominator fraction ADDITION, so the game practices
// both reading a fraction and actually operating on one, not just the
// former. Every bar is genuinely divided and shaded live, never a fixed
// image.
export default function FractionFill() {
  const { score, streak, best, recordAnswer, reset } = useGameScore();
  const [q, setQ] = useState<FractionQuestion>(() => generateRound());
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const next = useCallback(() => { setQ(generateRound()); setSelectedIndex(null); }, []);
  const select = (i: number) => {
    if (selectedIndex !== null) return;
    setSelectedIndex(i);
    recordAnswer(i === q.data.correctIndex);
    setTimeout(next, 900);
  };
  const restart = () => { reset(); next(); };

  return (
    <div className="space-y-5">
      <GameHeader title="Fraction Fill" score={score} streak={streak} best={best} onRestart={restart} />
      <div className="glass-card rounded-3xl p-6 text-center space-y-6">
        {q.mode === 'recognition' ? (
          <>
            <p className="text-sm font-bold text-slate-500">What fraction of the bar is shaded?</p>
            <div className="flex gap-1 max-w-sm mx-auto h-20">
              {Array.from({ length: q.data.total }).map((_, i) => (
                <div key={i} className={`flex-1 rounded-lg border-2 border-slate-900 dark:border-slate-700 ${i < q.data.shaded ? 'bg-primary-600' : 'bg-transparent'}`} />
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="text-sm font-bold text-slate-500">Add the two fractions (same denominator)</p>
            <p className="font-display text-3xl font-bold">{q.data.a}/{q.data.total} + {q.data.b}/{q.data.total} = ?</p>
            <div className="flex justify-center gap-1.5">
              <div className="flex gap-0.5 h-14 w-24">
                {Array.from({ length: q.data.total }).map((_, i) => (
                  <div key={i} className={`flex-1 rounded border border-slate-900 dark:border-slate-700 ${i < q.data.a ? 'bg-primary-600' : 'bg-transparent'}`} />
                ))}
              </div>
              <div className="flex gap-0.5 h-14 w-24">
                {Array.from({ length: q.data.total }).map((_, i) => (
                  <div key={i} className={`flex-1 rounded border border-slate-900 dark:border-slate-700 ${i < q.data.b ? 'bg-accent-600' : 'bg-transparent'}`} />
                ))}
              </div>
            </div>
          </>
        )}
        <OptionGrid
          options={q.data.options}
          selectedIndex={selectedIndex}
          correctIndex={q.data.correctIndex}
          disabled={selectedIndex !== null}
          onSelect={select}
        />
        <GenerateWorksheetLink chapterTags={['Fractions', 'Fractions and Decimals']} gradeBand="junior" board="both" className="flex justify-center" />
      </div>
    </div>
  );
}
