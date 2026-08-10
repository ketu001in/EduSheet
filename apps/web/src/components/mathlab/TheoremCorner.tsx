'use client';
import { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { MathTheorem } from '@edusheets/content';
import SpeakButton from '@/components/labshared/SpeakButton';

// A gallery of curated CBSE/ICSE theorems -- statement first, then a
// step-by-step visual-proof walk-through (one step revealed at a time via
// Next/Back, not dumped all at once), matching the "never hide the math"
// precedent set by Physics Lab's live formula panel. Distinct from
// GeometryExplorer: this is READ + step through, not drag-and-verify.
export default function TheoremCorner({ theorems }: { theorems: MathTheorem[] }) {
  const [activeId, setActiveId] = useState(theorems[0]?.id);
  const [stepIndex, setStepIndex] = useState(0);
  const active = theorems.find((t) => t.id === activeId) || theorems[0];
  if (!active) return null;

  const selectTheorem = (id: string) => {
    setActiveId(id);
    setStepIndex(0);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4">
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
        {theorems.map((t) => (
          <button
            key={t.id}
            onClick={() => selectTheorem(t.id)}
            className={`shrink-0 md:shrink text-left px-3.5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all whitespace-nowrap md:whitespace-normal ${
              activeId === t.id ? 'border-slate-900 bg-primary-600 text-white shadow-[3px_3px_0_var(--color-ink)]' : 'border-slate-900 dark:border-slate-700 bg-surface-light dark:bg-surface-dark hover:shadow-[3px_3px_0_var(--color-ink)]'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div className="glass-card rounded-3xl p-5 md:p-7 space-y-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <h3 className="font-display text-xl font-semibold">{active.name}</h3>
          <SpeakButton
            label="Listen to All"
            text={`${active.name}. ${active.statement} ${active.whyItMatters} Here's why it's true. ${active.proofSteps.join(' ')} ${active.realLifeNote}`}
          />
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">
          <p className="text-sm font-medium leading-relaxed">{active.statement}</p>
        </div>

        <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
          <p>{active.whyItMatters}</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm">Why is it true? Step {stepIndex + 1} of {active.proofSteps.length}</h4>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setStepIndex((s) => Math.max(0, s - 1))}
                disabled={stepIndex === 0}
                className="p-1.5 rounded-lg border-2 border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:border-primary-400"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setStepIndex((s) => Math.min(active.proofSteps.length - 1, s + 1))}
                disabled={stepIndex === active.proofSteps.length - 1}
                className="p-1.5 rounded-lg border-2 border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:border-primary-400"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex gap-1.5">
            {active.proofSteps.map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= stepIndex ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-800'}`} />
            ))}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4">
            {active.proofSteps[stepIndex]}
          </p>
        </div>

        <details className="group">
          <summary className="cursor-pointer text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 list-none">
            Real-Life Note <ChevronDown className="w-3.5 h-3.5 transition-transform group-open:rotate-180" />
          </summary>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-amber-50 dark:bg-amber-950/20 rounded-xl p-3">{active.realLifeNote}</p>
        </details>
      </div>
    </div>
  );
}
