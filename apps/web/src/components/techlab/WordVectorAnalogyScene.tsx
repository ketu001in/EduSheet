'use client';
import { useMemo, useState } from 'react';
import { cosineSimilarity, WORD_VECTORS } from '@/lib/aiExperimentsEngine';

// Deliberately a 2D plane, not a 3D scatter -- these word vectors are
// genuinely 2-dimensional (chosen small and honest on purpose, see
// aiExperimentsEngine.ts's header), so a flat plane IS the real, honest
// coordinate space they live in. Adding a fake third axis would misrepresent
// the actual vectors being shown, not add real clarity.
const WORDS = Object.keys(WORD_VECTORS);
const SIZE = 280;
const PAD = 30;

function toSvg([x, y]: [number, number]): [number, number] {
  return [PAD + ((x + 1) / 2) * (SIZE - 2 * PAD), SIZE - PAD - ((y + 1) / 2) * (SIZE - 2 * PAD)];
}

export default function WordVectorAnalogyScene() {
  const [base, setBase] = useState('king');
  const [subtract, setSubtract] = useState('man');
  const [add, setAdd] = useState('woman');

  const target = useMemo((): [number, number] => {
    const b = WORD_VECTORS[base], s = WORD_VECTORS[subtract], a = WORD_VECTORS[add];
    return [b[0] - s[0] + a[0], b[1] - s[1] + a[1]];
  }, [base, subtract, add]);

  const ranked = useMemo(() => WORDS
    .filter((w) => w !== base && w !== subtract && w !== add)
    .map((w) => ({ word: w, sim: cosineSimilarity(target, WORD_VECTORS[w]) }))
    .sort((x, y) => y.sim - x.sim), [target, base, subtract, add]);

  const best = ranked[0];
  const [tx, ty] = toSvg(target);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-bold">
        <WordSelect value={base} onChange={setBase} />
        <span className="text-slate-400">&minus;</span>
        <WordSelect value={subtract} onChange={setSubtract} />
        <span className="text-slate-400">+</span>
        <WordSelect value={add} onChange={setAdd} />
        <span className="text-slate-400">=</span>
        <span className="px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300">?</span>
      </div>

      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto w-full max-w-xs rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
        <line x1={PAD} y1={SIZE / 2} x2={SIZE - PAD} y2={SIZE / 2} stroke="#cbd5e1" strokeWidth={1} />
        <line x1={SIZE / 2} y1={PAD} x2={SIZE / 2} y2={SIZE - PAD} stroke="#cbd5e1" strokeWidth={1} />
        {WORDS.map((w) => {
          const [x, y] = toSvg(WORD_VECTORS[w]);
          const isPart = w === base || w === subtract || w === add;
          const isBest = w === best?.word;
          return (
            <g key={w}>
              <circle cx={x} cy={y} r={isPart || isBest ? 5 : 3.5} fill={isBest ? '#237A4C' : isPart ? '#2F5FE0' : '#94a3b8'} />
              <text x={x + 7} y={y + 3} fontSize={9} fontWeight={isPart || isBest ? 700 : 500} fill={isBest ? '#237A4C' : isPart ? '#2F5FE0' : '#64748b'}>{w}</text>
            </g>
          );
        })}
        <circle cx={tx} cy={ty} r={7} fill="none" stroke="#f59e0b" strokeWidth={2} strokeDasharray="3 2" />
        <text x={tx + 9} y={ty - 6} fontSize={9} fontWeight={700} fill="#f59e0b">target</text>
      </svg>

      <div className="space-y-1 max-w-xs mx-auto">
        {ranked.slice(0, 5).map((r, i) => (
          <div key={r.word} className={`flex items-center justify-between text-xs px-2.5 py-1 rounded-lg ${i === 0 ? 'bg-accent-50 dark:bg-accent-900/20 font-black' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
            <span>{i === 0 ? '\u{1F3C6} ' : ''}{r.word}</span>
            <span className="text-slate-400">cos = {r.sim.toFixed(3)}</span>
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-slate-500 max-w-sm mx-auto">
        {base} &minus; {subtract} + {add} lands closest to <strong>{best?.word}</strong> -- the real analogy property discovered in word2vec (Mikolov et al., 2013).
      </p>
    </div>
  );
}

function WordSelect({ value, onChange }: { value: string; onChange: (w: string) => void }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="px-2.5 py-1.5 rounded-lg border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold">
      {WORDS.map((w) => <option key={w} value={w}>{w}</option>)}
    </select>
  );
}
