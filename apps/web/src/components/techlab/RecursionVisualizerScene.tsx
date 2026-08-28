'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { RECURSION_FNS, RecursiveFn, stackAtStep } from '@/lib/recursionEngine';

// Deliberately a 2D stacked-frame diagram, not a 3D scene -- a call
// stack IS a literal vertical stack in every real debugger, so this is
// the honest, already-standard way to show it. Every event here comes
// from a real recursive function that actually ran (see
// recursionEngine.ts) -- stepping forward replays real calls and returns
// in the exact order they genuinely happened, not a scripted sequence.
const MAX_N: Record<RecursiveFn, number> = { factorial: 10, fibonacci: 8 };
const STEP_MS = 550;

export default function RecursionVisualizerScene() {
  const [fn, setFn] = useState<RecursiveFn>('factorial');
  const [n, setN] = useState(5);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const trace = useMemo(() => RECURSION_FNS[fn](n), [fn, n]);
  const maxIdx = trace.events.length - 1;

  useEffect(() => { setIdx(0); setPlaying(false); if (intervalRef.current) clearInterval(intervalRef.current); }, [fn, n]);

  useEffect(() => {
    if (!playing) return undefined;
    intervalRef.current = setInterval(() => {
      setIdx((i) => {
        if (i >= maxIdx) { setPlaying(false); return i; }
        return i + 1;
      });
    }, STEP_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, maxIdx]);

  const { stack, lastReturn } = stackAtStep(trace.events, idx);
  const currentEvent = trace.events[idx];
  const finished = idx === maxIdx;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
          <button onClick={() => setFn('factorial')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${fn === 'factorial' ? 'bg-white dark:bg-slate-900 shadow-sm text-primary-600' : 'text-slate-500'}`}>factorial(n)</button>
          <button onClick={() => setFn('fibonacci')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${fn === 'fibonacci' ? 'bg-white dark:bg-slate-900 shadow-sm text-primary-600' : 'text-slate-500'}`}>fib(n)</button>
        </div>
        <label className="flex items-center gap-2 text-xs font-bold text-slate-500">
          n = {n}
          <input type="range" min={1} max={MAX_N[fn]} value={n} onChange={(e) => setN(parseInt(e.target.value, 10))} className="w-28 accent-primary-600" />
        </label>
      </div>
      {fn === 'fibonacci' && <p className="text-center text-[10px] text-slate-400">Naive recursive Fibonacci re-solves the same smaller calls repeatedly -- watch how many real calls fib({n}) actually makes.</p>}

      <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-3 min-h-[220px] flex flex-col-reverse items-center gap-1.5">
        {stack.map((frame, i) => (
          <div
            key={frame.callId}
            style={{ marginLeft: frame.depth * 14 }}
            className={`w-full max-w-xs px-3 py-1.5 rounded-lg border-2 text-xs font-mono font-bold transition-all ${i === stack.length - 1 ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500'}`}
          >
            {frame.functionName}({frame.arg})
          </div>
        ))}
        {stack.length === 0 && <p className="text-xs text-slate-400">{idx === 0 ? 'Press Play or Step to begin.' : 'Call stack empty -- finished.'}</p>}
      </div>

      {currentEvent && (
        <p className="text-center text-xs font-mono">
          {currentEvent.type === 'call'
            ? <span className="text-primary-600">→ calling {currentEvent.functionName}({currentEvent.arg})</span>
            : <span className="text-accent-600">← {currentEvent.functionName}({currentEvent.arg}) returns {currentEvent.returnValue}</span>}
        </p>
      )}
      {!currentEvent && lastReturn && <p className="text-center text-xs font-mono text-accent-600">← {lastReturn.functionName}({lastReturn.arg}) returns {lastReturn.returnValue}</p>}

      <div className="flex justify-center gap-2">
        <button onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0} className="p-2 rounded-lg border-2 border-slate-200 dark:border-slate-800 hover:scale-105 active:scale-95 transition-all disabled:opacity-40"><SkipBack className="w-4 h-4" /></button>
        <button onClick={() => setPlaying((p) => !p)} disabled={finished && !playing} className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold text-sm flex items-center gap-1.5 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50">
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />} {playing ? 'Pause' : 'Play'}
        </button>
        <button onClick={() => setIdx((i) => Math.min(maxIdx, i + 1))} disabled={idx === maxIdx} className="p-2 rounded-lg border-2 border-slate-200 dark:border-slate-800 hover:scale-105 active:scale-95 transition-all disabled:opacity-40"><SkipForward className="w-4 h-4" /></button>
        <button onClick={() => { setIdx(0); setPlaying(false); }} className="p-2 rounded-lg border-2 border-slate-200 dark:border-slate-800 hover:scale-105 active:scale-95 transition-all"><RotateCcw className="w-4 h-4" /></button>
      </div>

      <p className="text-center text-xs text-slate-500">Step {idx + 1} of {trace.events.length} &middot; {trace.events.filter((e) => e.type === 'call').length} real calls total{finished && <> &middot; <span className="font-bold text-accent-600">Final result: {trace.result}</span></>}</p>
    </div>
  );
}
