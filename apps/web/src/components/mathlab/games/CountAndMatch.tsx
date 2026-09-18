'use client';
import { useCallback, useState } from 'react';
import { GameHeader, OptionGrid } from './GameHeader';
import { useGameScore } from '@/lib/useGameScore';
import { generateCountingQuestion } from '@/lib/mathGamesEngine';

const ICONS = ['⭐', '🍎', '🐸', '🎈', '🌸', '🐳', '🍪', '🚗'];

// Class 1-2 level: "how many?" -- counting practice with a random emoji
// each round, matching real early-band chapters like "How Many?" and "Fun
// with Numbers".
export default function CountAndMatch() {
  const { score, streak, best, recordAnswer, reset } = useGameScore();
  const [icon, setIcon] = useState(ICONS[0]);
  const [q, setQ] = useState(() => generateCountingQuestion());
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const next = useCallback(() => {
    setIcon(ICONS[Math.floor(Math.random() * ICONS.length)]);
    setQ(generateCountingQuestion());
    setSelectedIndex(null);
  }, []);

  const select = (i: number) => {
    if (selectedIndex !== null) return;
    setSelectedIndex(i);
    recordAnswer(i === q.correctIndex);
    setTimeout(next, 900);
  };
  const restart = () => { reset(); next(); };

  return (
    <div className="space-y-5">
      <GameHeader title="Count & Match" score={score} streak={streak} best={best} onRestart={restart} />
      <div className="glass-card rounded-3xl p-6 text-center space-y-6">
        <p className="text-sm font-bold text-slate-500">How many are there?</p>
        <div className="flex flex-wrap justify-center gap-2 max-w-sm mx-auto text-3xl">
          {Array.from({ length: q.count }).map((_, i) => <span key={i}>{icon}</span>)}
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
