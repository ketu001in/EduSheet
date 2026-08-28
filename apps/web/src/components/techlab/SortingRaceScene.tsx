'use client';
import { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Shuffle, Trophy } from 'lucide-react';
import { SORT_FNS, SORT_LABELS, SortAlgorithm, SortTrace } from '@/lib/sortingEngine';

// Deliberately a 2D bar chart, not a 3D scene -- this is the real,
// standard way sorting algorithms are visualized (bar height = value),
// and it's genuinely the clearest medium for "watch relative heights
// settle into order": a 3D version would add depth with no real
// information in it. All four algorithms run for real on the identical
// random array (see sortingEngine.ts) and are stepped through their real
// recorded comparison/swap trace in lockstep -- the "race" outcome is a
// genuine consequence of each algorithm's real efficiency, not scripted.
const ALGORITHMS: SortAlgorithm[] = ['bubble', 'insertion', 'merge', 'quick'];
const ARRAY_SIZE = 16;
const STEP_MS = 90;

function randomArray(size: number): number[] {
  return Array.from({ length: size }, () => 5 + Math.floor(Math.random() * 95));
}

export default function SortingRaceScene() {
  const [source, setSource] = useState<number[]>(() => randomArray(ARRAY_SIZE));
  const [traces, setTraces] = useState<Record<SortAlgorithm, SortTrace>>(() => (
    Object.fromEntries(ALGORITHMS.map((a) => [a, SORT_FNS[a](source)])) as Record<SortAlgorithm, SortTrace>
  ));
  const [stepIndex, setStepIndex] = useState<Record<SortAlgorithm, number>>(() => (
    Object.fromEntries(ALGORITHMS.map((a) => [a, 0])) as Record<SortAlgorithm, number>
  ));
  const [finishOrder, setFinishOrder] = useState<SortAlgorithm[]>([]);
  const [racing, setRacing] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const shuffle = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRacing(false);
    const next = randomArray(ARRAY_SIZE);
    setSource(next);
    setTraces(Object.fromEntries(ALGORITHMS.map((a) => [a, SORT_FNS[a](next)])) as Record<SortAlgorithm, SortTrace>);
    setStepIndex(Object.fromEntries(ALGORITHMS.map((a) => [a, 0])) as Record<SortAlgorithm, number>);
    setFinishOrder([]);
  };

  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRacing(false);
    setStepIndex(Object.fromEntries(ALGORITHMS.map((a) => [a, 0])) as Record<SortAlgorithm, number>);
    setFinishOrder([]);
  };

  const start = () => {
    reset();
    setRacing(true);
    intervalRef.current = setInterval(() => {
      setStepIndex((prev) => {
        const next = { ...prev };
        for (const alg of ALGORITHMS) {
          const maxIdx = traces[alg].steps.length - 1;
          if (next[alg] < maxIdx) next[alg] = next[alg] + 1;
        }
        return next;
      });
    }, STEP_MS);
  };

  useEffect(() => {
    for (const alg of ALGORITHMS) {
      const maxIdx = traces[alg].steps.length - 1;
      if (stepIndex[alg] === maxIdx && !finishOrder.includes(alg)) {
        setFinishOrder((prev) => [...prev, alg]);
      }
    }
    if (finishOrder.length === ALGORITHMS.length && intervalRef.current) {
      clearInterval(intervalRef.current);
      setRacing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex]);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const maxVal = Math.max(...source);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ALGORITHMS.map((alg) => {
          const trace = traces[alg];
          const idx = Math.min(stepIndex[alg], trace.steps.length - 1);
          const step = trace.steps[idx];
          const finished = idx === trace.steps.length - 1;
          const rank = finishOrder.indexOf(alg);
          return (
            <div key={alg} className={`rounded-xl border-2 p-2.5 space-y-1.5 ${finished ? 'border-accent-400 bg-accent-50/40 dark:bg-accent-900/10' : 'border-slate-200 dark:border-slate-800'}`}>
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold">{SORT_LABELS[alg]}</p>
                {finished && rank >= 0 && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent-600">
                    {rank === 0 && <Trophy className="w-3 h-3" />} #{rank + 1}
                  </span>
                )}
              </div>
              <div className="flex items-end gap-[2px] h-24">
                {step.array.map((v, i) => {
                  const isComparing = step.comparingIndices.includes(i);
                  const isSwapped = step.swappedIndices.includes(i);
                  const color = finished ? '#237A4C' : isSwapped ? '#dc2626' : isComparing ? '#f59e0b' : '#2F5FE0';
                  return <div key={i} style={{ height: `${(v / maxVal) * 100}%`, backgroundColor: color, width: `${100 / step.array.length}%` }} className="rounded-t-sm transition-colors" />;
                })}
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>Compares: {step.comparisonsSoFar} &middot; Swaps: {step.swapsSoFar}</span>
                <span>Step {idx}/{trace.steps.length - 1}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center gap-2">
        <button onClick={start} disabled={racing} className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold text-sm flex items-center gap-1.5 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"><Play className="w-4 h-4" /> Start Race</button>
        <button onClick={shuffle} className="px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-800 font-bold text-sm flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"><Shuffle className="w-4 h-4" /> New Array</button>
        <button onClick={reset} className="px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-800 font-bold text-sm flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"><RotateCcw className="w-4 h-4" /> Reset</button>
      </div>
      {finishOrder.length === ALGORITHMS.length && (
        <p className="text-center text-xs text-slate-500">
          Final comparisons -- {ALGORITHMS.map((a) => `${SORT_LABELS[a]}: ${traces[a].comparisons}`).join(' · ')}
        </p>
      )}
    </div>
  );
}
