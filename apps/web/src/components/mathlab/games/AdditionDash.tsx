'use client';
import { useCallback, useEffect, useState } from 'react';
import { Timer } from 'lucide-react';
import { GameHeader, OptionGrid } from './GameHeader';
import GenerateWorksheetLink from '../GenerateWorksheetLink';
import { useGameScore } from '@/lib/useGameScore';
import { generateAdditionQuestion } from '@/lib/mathGamesEngine';

const ROUND_SECONDS = 12;

// Class 1-3 level: rapid-fire addition facts against a countdown -- same
// "timed MCQ" shape as Times Table Blitz, just addition instead of
// multiplication. Running out of time counts as a wrong answer.
export default function AdditionDash() {
  const { score, streak, best, recordAnswer, reset } = useGameScore();
  const [q, setQ] = useState(() => generateAdditionQuestion());
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(ROUND_SECONDS);

  const next = useCallback(() => {
    setQ(generateAdditionQuestion());
    setSelectedIndex(null);
    setSecondsLeft(ROUND_SECONDS);
  }, []);

  const select = useCallback((i: number | null) => {
    setSelectedIndex((prev) => {
      if (prev !== null) return prev;
      recordAnswer(i === q.correctIndex);
      setTimeout(next, 900);
      return i ?? -1;
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
      <GameHeader title="Addition Dash" score={score} streak={streak} best={best} onRestart={restart} />
      <div className="glass-card rounded-3xl p-6 text-center space-y-6">
        <div className="flex items-center justify-center gap-2 text-sm font-bold text-amber-600">
          <Timer className="w-4 h-4" /> {secondsLeft}s
        </div>
        <p className="font-display text-4xl font-bold">{q.a} + {q.b} = ?</p>
        <OptionGrid
          options={q.options.map(String)}
          selectedIndex={selectedIndex}
          correctIndex={q.correctIndex}
          disabled={selectedIndex !== null}
          onSelect={select}
        />
        {selectedIndex === -1 && <p className="text-sm font-bold text-red-500">Time's up! The answer was {q.sum}.</p>}
        <GenerateWorksheetLink chapterTags={['Addition', 'Numbers']} gradeBand="early" board="both" className="flex justify-center" />
      </div>
    </div>
  );
}
