'use client';
import { useState } from 'react';
import { MathFormula, MathBranch } from '@edusheets/content';
import SpeakButton from '@/components/labshared/SpeakButton';

const BRANCH_LABEL: Partial<Record<MathBranch, string>> = {
  'number-systems': 'Number Systems',
  algebra: 'Algebra',
  geometry: 'Geometry',
  mensuration: 'Mensuration',
  trigonometry: 'Trigonometry',
  'statistics-probability': 'Statistics & Probability',
  calculus: 'Calculus',
};

// A quick-lookup formula gallery, grouped by branch -- every card shows the
// formula, what each symbol means, and one real worked example with the
// actual numbers plugged in, so the formula is never just an abstract
// string. Same "live substitution" precedent as Physics Lab.
export default function FormulaReference({ formulas }: { formulas: MathFormula[] }) {
  const branches = Array.from(new Set(formulas.map((f) => f.branch)));
  const [activeBranch, setActiveBranch] = useState<MathBranch | 'all'>('all');
  const shown = activeBranch === 'all' ? formulas : formulas.filter((f) => f.branch === activeBranch);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl w-fit">
        <button
          onClick={() => setActiveBranch('all')}
          className={`px-3.5 py-2 rounded-lg text-sm font-bold transition-all ${activeBranch === 'all' ? 'bg-white dark:bg-slate-900 shadow-sm text-primary-600' : 'text-slate-500'}`}
        >
          All
        </button>
        {branches.map((b) => (
          <button
            key={b}
            onClick={() => setActiveBranch(b)}
            className={`px-3.5 py-2 rounded-lg text-sm font-bold transition-all ${activeBranch === b ? 'bg-white dark:bg-slate-900 shadow-sm text-primary-600' : 'text-slate-500'}`}
          >
            {BRANCH_LABEL[b] || b}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {shown.map((f) => (
          <div key={f.id} className="glass-card rounded-2xl p-5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wide">{BRANCH_LABEL[f.branch] || f.branch}</span>
                <h4 className="font-bold text-sm leading-tight">{f.name}</h4>
              </div>
              <SpeakButton text={`${f.name}. The formula is: ${f.formula.replace(/\|/g, ',')}. For example, ${f.example.result}. ${f.note}`} />
            </div>
            <p className="font-mono text-sm bg-slate-900 text-slate-50 dark:bg-slate-950 rounded-xl px-3 py-2.5 overflow-x-auto whitespace-pre">{f.formula}</p>
            <div className="space-y-1">
              {f.variables.map((v) => (
                <p key={v.symbol} className="text-xs text-slate-500"><span className="font-mono font-bold text-slate-700 dark:text-slate-300">{v.symbol}</span> = {v.meaning}</p>
              ))}
            </div>
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-3">
              <p className="text-[10px] font-bold text-primary-600 uppercase tracking-wide mb-1">Worked Example</p>
              <p className="text-sm text-slate-700 dark:text-slate-200">{f.example.result}</p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{f.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
