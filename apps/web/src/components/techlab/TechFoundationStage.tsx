'use client';
import { useEffect, useRef, useState } from 'react';
import { Zap, Play, RotateCcw } from 'lucide-react';
import { TechFoundationPlaygroundType } from '@edusheets/content';
import { linearSearch, binarySearch } from '@/lib/aiCodingEngine';

// Coding Lab's playground dispatcher -- AI Lab's playgrounds (perceptron
// trainer, XOR demo, activation functions) moved to their own dedicated
// AIFoundationStage.tsx once AI Lab got promoted to its own content
// system (see aiTypes.ts's header).
export default function TechFoundationStage({ type }: { type: TechFoundationPlaygroundType }) {
  switch (type) {
    case 'search-race': return <SearchRaceScene />;
    default: return null;
  }
}

function StageCard({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border-2 border-dashed border-primary-300 dark:border-primary-800 bg-primary-50/40 dark:bg-primary-950/10 p-4 md:p-5 space-y-3">{children}</div>;
}

// -- Linear vs Binary Search race, on a real sorted array --------------------
const SORTED_ARRAY = Array.from({ length: 31 }, (_, i) => i * 2); // 0,2,4,...,60

function SearchRaceScene() {
  const [target, setTarget] = useState(42);
  const [revealLinear, setRevealLinear] = useState<number[]>([]);
  const [revealBinary, setRevealBinary] = useState<number[]>([]);
  const [racing, setRacing] = useState(false);
  const [done, setDone] = useState(false);
  const linearRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const binaryRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const linearResult = linearSearch(SORTED_ARRAY, target);
  const binaryResult = binarySearch(SORTED_ARRAY, target);

  const race = () => {
    setRevealLinear([]); setRevealBinary([]); setDone(false); setRacing(true);
    let li = 0, bi = 0;
    linearRef.current = setInterval(() => {
      li++;
      setRevealLinear(linearResult.steps.slice(0, li));
      if (li >= linearResult.steps.length) { if (linearRef.current) clearInterval(linearRef.current); }
    }, 120);
    binaryRef.current = setInterval(() => {
      bi++;
      setRevealBinary(binaryResult.steps.slice(0, bi));
      if (bi >= binaryResult.steps.length) {
        if (binaryRef.current) clearInterval(binaryRef.current);
        setTimeout(() => setDone(true), 200);
      }
    }, 500);
  };

  useEffect(() => () => { if (linearRef.current) clearInterval(linearRef.current); if (binaryRef.current) clearInterval(binaryRef.current); }, []);

  const randomTarget = () => { setTarget(SORTED_ARRAY[Math.floor(Math.random() * SORTED_ARRAY.length)]); setRevealLinear([]); setRevealBinary([]); setDone(false); setRacing(false); };

  return (
    <StageCard>
      <div className="flex items-center gap-2 text-sm font-bold text-primary-700 dark:text-primary-300">
        <Zap className="w-4 h-4" /> Try It Yourself
      </div>
      <p className="text-center text-xs text-slate-500">Both algorithms search this real sorted array of 31 numbers for <span className="font-bold">{target}</span> -- watch how many comparisons each actually needs.</p>

      <SearchRow label="Linear Search" array={SORTED_ARRAY} revealed={revealLinear} target={target} />
      <SearchRow label="Binary Search" array={SORTED_ARRAY} revealed={revealBinary} target={target} />

      <div className="flex justify-center gap-2">
        <button onClick={race} disabled={racing && !done} className="px-4 py-2 rounded-lg bg-primary-600 text-white font-bold text-sm flex items-center gap-1.5 disabled:opacity-50"><Play className="w-4 h-4" /> Race!</button>
        <button onClick={randomTarget} className="px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-800 font-bold text-sm flex items-center gap-1.5"><RotateCcw className="w-4 h-4" /> New Target</button>
      </div>

      {done && (
        <div className="rounded-xl p-3 text-center text-sm font-bold bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-300">
          Linear search took {linearResult.comparisons} comparisons -- binary search took only {binaryResult.comparisons}.
        </div>
      )}
    </StageCard>
  );
}

function SearchRow({ label, array, revealed, target }: { label: string; array: number[]; revealed: number[]; target: number }) {
  const lastChecked = revealed[revealed.length - 1];
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-bold text-slate-500">{label} -- {revealed.length} comparison{revealed.length === 1 ? '' : 's'}</p>
      <div className="flex flex-wrap gap-[3px]">
        {array.map((v, i) => {
          const checked = revealed.includes(i);
          const isCurrent = i === lastChecked;
          const isMatch = checked && v === target && isCurrent;
          return (
            <span key={i} className={`w-5 h-5 rounded text-[8px] font-bold flex items-center justify-center ${
              isMatch ? 'bg-accent-500 text-white' : isCurrent ? 'bg-primary-500 text-white' : checked ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}>{v}</span>
          );
        })}
      </div>
    </div>
  );
}
