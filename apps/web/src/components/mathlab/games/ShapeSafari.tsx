'use client';
import { useCallback, useState } from 'react';
import { GameHeader, OptionGrid } from './GameHeader';
import { useGameScore } from '@/lib/useGameScore';
import { generateShapeQuestion, ShapeName } from '@/lib/mathGamesEngine';

// Hand-computed regular-polygon coordinates (centered at 80,80 in a 160x160
// viewBox) -- geometry, not guesswork, so every shape actually looks right.
function ShapeSvg({ shape }: { shape: ShapeName }) {
  const common = 'fill-primary-500/20 stroke-primary-600';
  switch (shape) {
    case 'Circle': return <circle cx={80} cy={80} r={55} strokeWidth={4} className={common} />;
    case 'Square': return <rect x={25} y={25} width={110} height={110} rx={6} strokeWidth={4} className={common} />;
    case 'Rectangle': return <rect x={15} y={40} width={130} height={80} rx={6} strokeWidth={4} className={common} />;
    case 'Triangle': return <polygon points="80,20 20,140 140,140" strokeWidth={4} className={common} strokeLinejoin="round" />;
    case 'Pentagon': return <polygon points="80,20 137.06,61.46 115.26,128.54 44.74,128.54 22.94,61.46" strokeWidth={4} className={common} strokeLinejoin="round" />;
    case 'Hexagon': return <polygon points="140,80 110,131.96 50,131.96 20,80 50,28.04 110,28.04" strokeWidth={4} className={common} strokeLinejoin="round" />;
    case 'Star': return <polygon points="80,20 94.11,60.58 137.06,61.46 102.83,87.42 115.26,128.54 80,104 44.74,128.54 57.17,87.42 22.94,61.46 65.89,60.58" strokeWidth={4} className={common} strokeLinejoin="round" />;
    case 'Oval': return <ellipse cx={80} cy={80} rx={65} ry={40} strokeWidth={4} className={common} />;
  }
}

// Class 1-2 level shape recognition -- matches early-band chapters like
// "What is Long? What is Round?" and "Shapes Around Us".
export default function ShapeSafari() {
  const { score, streak, best, recordAnswer, reset } = useGameScore();
  const [q, setQ] = useState(() => generateShapeQuestion());
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const next = useCallback(() => { setQ(generateShapeQuestion()); setSelectedIndex(null); }, []);
  const select = (i: number) => {
    if (selectedIndex !== null) return;
    setSelectedIndex(i);
    recordAnswer(i === q.correctIndex);
    setTimeout(next, 900);
  };
  const restart = () => { reset(); next(); };

  return (
    <div className="space-y-5">
      <GameHeader title="Shape Safari" score={score} streak={streak} best={best} onRestart={restart} />
      <div className="glass-card rounded-3xl p-6 text-center space-y-6">
        <p className="text-sm font-bold text-slate-500">What shape is this?</p>
        <svg viewBox="0 0 160 160" className="w-40 h-40 mx-auto">
          <ShapeSvg shape={q.shape} />
        </svg>
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
