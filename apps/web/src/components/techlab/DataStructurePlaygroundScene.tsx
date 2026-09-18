'use client';
import { useState } from 'react';
import { Plus, Minus, RotateCcw, ArrowRight, ArrowDown } from 'lucide-react';
import {
  stackPush, stackPop, queueEnqueue, queueDequeue, arrayInsertAt, arrayRemoveAt,
} from '@/lib/dataStructureEngine';

// Deliberately flat rows/columns of real boxes, not a 3D scene -- a
// stack, queue, and array all have one genuinely correct visual
// representation (LIFO tower, FIFO line, indexed row), and every
// operation below runs the real, verified functions in
// dataStructureEngine.ts, not a fake animation of what push/pop "would"
// do.
type Mode = 'stack' | 'queue' | 'array';

export default function DataStructurePlaygroundScene() {
  const [mode, setMode] = useState<Mode>('stack');
  const [stackItems, setStackItems] = useState<number[]>([4, 8, 15]);
  const [queueItems, setQueueItems] = useState<number[]>([16, 23, 42]);
  const [arrayItems, setArrayItems] = useState<number[]>([1, 2, 3, 4]);
  const [inputValue, setInputValue] = useState('7');
  const [indexValue, setIndexValue] = useState('0');
  const [lastOp, setLastOp] = useState<string | null>(null);
  const [accessedIndex, setAccessedIndex] = useState<number | null>(null);

  const parsedValue = Number(inputValue) || 0;
  const parsedIndex = Math.max(0, Math.min(Number(indexValue) || 0, 999));

  const doPush = () => { setStackItems((s) => stackPush(s, parsedValue)); setLastOp(`Pushed ${parsedValue}`); };
  const doPop = () => { const { next, popped } = stackPop(stackItems); setStackItems(next); setLastOp(popped === undefined ? 'Stack is empty' : `Popped ${popped}`); };
  const doEnqueue = () => { setQueueItems((q) => queueEnqueue(q, parsedValue)); setLastOp(`Enqueued ${parsedValue}`); };
  const doDequeue = () => { const { next, dequeued } = queueDequeue(queueItems); setQueueItems(next); setLastOp(dequeued === undefined ? 'Queue is empty' : `Dequeued ${dequeued}`); };
  const doArrayPush = () => { setArrayItems((a) => [...a, parsedValue]); setLastOp(`Appended ${parsedValue}`); };
  const doArrayPop = () => { setArrayItems((a) => { if (a.length === 0) { setLastOp('Array is empty'); return a; } setLastOp(`Removed last element (${a[a.length - 1]})`); return a.slice(0, -1); }); };
  const doInsertAt = () => { setArrayItems((a) => arrayInsertAt(a, parsedIndex, parsedValue)); setLastOp(`Inserted ${parsedValue} at index ${parsedIndex}`); setAccessedIndex(null); };
  const doRemoveAt = () => { const { next, removed } = arrayRemoveAt(arrayItems, parsedIndex); setArrayItems(next); setLastOp(removed === undefined ? `No element at index ${parsedIndex}` : `Removed ${removed} from index ${parsedIndex}`); setAccessedIndex(null); };
  const doAccess = () => { setAccessedIndex(parsedIndex); setLastOp(parsedIndex < arrayItems.length ? `array[${parsedIndex}] = ${arrayItems[parsedIndex]}` : `No element at index ${parsedIndex}`); };
  const doReset = () => {
    setStackItems([4, 8, 15]); setQueueItems([16, 23, 42]); setArrayItems([1, 2, 3, 4]);
    setLastOp(null); setAccessedIndex(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-lg w-fit mx-auto">
        {(['stack', 'queue', 'array'] as Mode[]).map((m) => (
          <button key={m} onClick={() => { setMode(m); setLastOp(null); setAccessedIndex(null); }} className={`px-3 py-1.5 rounded-md text-xs font-bold capitalize transition-all ${mode === m ? 'bg-white dark:bg-slate-900 shadow-sm text-primary-600' : 'text-slate-500'}`}>{m}</button>
        ))}
      </div>

      <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-4 min-h-[180px] flex items-center justify-center">
        {mode === 'stack' && (
          <div className="flex flex-col-reverse items-center gap-1">
            <p className="text-[10px] font-bold text-slate-400 mt-1">bottom</p>
            {stackItems.map((v, i) => (
              <div key={i} className={`w-24 py-2 text-center rounded-lg border-2 font-mono font-bold text-sm ${i === stackItems.length - 1 ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'}`}>{v}</div>
            ))}
            <p className="text-[10px] font-bold text-primary-500">{stackItems.length > 0 ? 'top →' : ''}</p>
            {stackItems.length === 0 && <p className="text-xs text-slate-400">empty stack</p>}
          </div>
        )}
        {mode === 'queue' && (
          <div className="flex items-center gap-1 overflow-x-auto max-w-full py-2">
            <span className="text-[10px] font-bold text-primary-500 shrink-0">front</span>
            <ArrowRight className="w-3 h-3 text-primary-500 shrink-0" />
            {queueItems.map((v, i) => (
              <div key={i} className={`w-16 py-2 text-center rounded-lg border-2 font-mono font-bold text-sm shrink-0 ${i === 0 ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'}`}>{v}</div>
            ))}
            {queueItems.length === 0 && <p className="text-xs text-slate-400 mx-4">empty queue</p>}
            <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="text-[10px] font-bold text-slate-400 shrink-0">back</span>
          </div>
        )}
        {mode === 'array' && (
          <div className="flex items-start gap-1 overflow-x-auto max-w-full py-2">
            {arrayItems.map((v, i) => (
              <div key={i} className="flex flex-col items-center gap-1 shrink-0">
                <div className={`w-14 py-2 text-center rounded-lg border-2 font-mono font-bold text-sm ${accessedIndex === i ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'}`}>{v}</div>
                <span className="text-[9px] text-slate-400 font-mono">{i}</span>
              </div>
            ))}
            {arrayItems.length === 0 && <p className="text-xs text-slate-400">empty array</p>}
          </div>
        )}
      </div>

      {lastOp && <p className="text-center text-xs font-mono text-primary-600">{lastOp}</p>}

      <div className="flex flex-wrap items-center justify-center gap-2">
        <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="w-16 px-2 py-1.5 rounded-lg border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono text-center" aria-label="Value" />
        {mode === 'array' && (
          <input type="number" value={indexValue} onChange={(e) => setIndexValue(e.target.value)} className="w-14 px-2 py-1.5 rounded-lg border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono text-center" aria-label="Index" placeholder="idx" />
        )}

        {mode === 'stack' && <>
          <OpButton icon={<ArrowDown className="w-3.5 h-3.5" />} label="Push" onClick={doPush} />
          <OpButton icon={<Minus className="w-3.5 h-3.5" />} label="Pop" onClick={doPop} />
        </>}
        {mode === 'queue' && <>
          <OpButton icon={<Plus className="w-3.5 h-3.5" />} label="Enqueue" onClick={doEnqueue} />
          <OpButton icon={<Minus className="w-3.5 h-3.5" />} label="Dequeue" onClick={doDequeue} />
        </>}
        {mode === 'array' && <>
          <OpButton icon={<Plus className="w-3.5 h-3.5" />} label="Push" onClick={doArrayPush} />
          <OpButton icon={<Minus className="w-3.5 h-3.5" />} label="Pop" onClick={doArrayPop} />
          <OpButton label="Insert at idx" onClick={doInsertAt} />
          <OpButton label="Remove at idx" onClick={doRemoveAt} />
          <OpButton label="Access idx" onClick={doAccess} />
        </>}
        <button onClick={doReset} className="px-3 py-1.5 rounded-lg border-2 border-slate-200 dark:border-slate-800 font-bold text-xs flex items-center gap-1 hover:scale-105 active:scale-95 transition-all"><RotateCcw className="w-3.5 h-3.5" /> Reset</button>
      </div>
    </div>
  );
}

function OpButton({ icon, label, onClick }: { icon?: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all">
      {icon}{label}
    </button>
  );
}
