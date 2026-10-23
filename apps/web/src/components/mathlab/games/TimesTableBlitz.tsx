'use client';
import { useCallback, useEffect, useState } from 'react';
import { Timer } from 'lucide-react';
import { GameHeader, OptionGrid } from './GameHeader';
import { useGameScore } from '@/lib/useGameScore';
import { generateMultiplicationQuestion } from '@/lib/mathGamesEngine';

const ROUND_SECONDS = 10;

// Class 3-4 level: rapid-fire multiplication facts against a countdown --
// matches chapters like "Tables and Shares". Running out of time counts as
// a wrong answer (streak resets), matching the real "blitz" feel.
export default function TimesTableBlitz() {
  const { score, streak, best, recordAnswer, reset } = useGameScore();
  const [q, setQ] = useState(() => generateMultiplicationQuestion());
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(ROUND_SECONDS);

  const next = useCallback(() => {
    setQ(generateMultiplicationQuestion());
    setSelectedIndex(null);
    setSecondsLeft(ROUND_SECONDS);
  }, []);

  const select = useCallback((i: number | null) => {
    setSelectedIndex((prev) => {
      if (prev !== null) return prev;
      recordAnswer(i === q.correctIndex);
      setTimeout(next, 900);
      return i ?? -1; // -1 marks "timed out, nothing selected" for the flash logic
    });
  }, [q.correctIndex, recordAnswer, next]);

  useEffect(() => {
    if (selectedIndex !== null) return;
    if (secondsLeft <= 0) { select(null); return; }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, selectedIndex, select]);

  const restart = () => { reset(); next(); };

  return (
    <div className="space-y-5">
      <GameHeader title="Times Table Blitz" score={score} streak={streak} best={best} onRestart={restart} />
      <div className="glass-card rounded-3xl p-6 text-center space-y-6">
        <div className="flex items-center justify-center gap-2 text-sm font-bold text-amber-600">
          <Timer className="w-4 h-4" /> {secondsLeft}s
        </div>
        <p className="font-display text-4xl font-bold">{q.a} &times; {q.b} = ?</p>
        <OptionGrid
          options={q.options.map(String)}
          selectedIndex={selectedIndex}
          correctIndex={q.correctIndex}
          disabled={selectedIndex !== null}
          onSelect={select}
        />
        {selectedIndex === -1 && <p className="text-sm font-bold text-red-500">Time's up! The answer was {q.product}.</p>}
      </div>
    </div>
  );
}
