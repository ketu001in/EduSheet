'use client';
import { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { MathTheorem, MathBranch } from '@edusheets/content';
import SpeakButton from '@/components/labshared/SpeakButton';
import Tilt3DCard from '@/components/labshared/Tilt3DCard';
import { playSelectChime } from '@/lib/uiSoundEngine';
import { useDeepDives } from '@/lib/useDeepDives';
import DeepDiveTrigger from '@/components/labshared/DeepDiveTrigger';
import TheoremVisualProof from './TheoremVisualProof';

const BRANCH_LABEL: Partial<Record<MathBranch, string>> = {
  'number-systems': 'Number Systems',
  algebra: 'Algebra',
  geometry: 'Geometry',
  mensuration: 'Mensuration',
  trigonometry: 'Trigonometry',
  'statistics-probability': 'Statistics & Probability',
  calculus: 'Calculus',
};

// Theorem Corner Phase 2 -- a branch-organized gallery (not one flat list)
// where every theorem still shows the statement + step-through proof text,
// but now ALSO renders a bespoke interactive proof visual wherever one
// exists (13 of 20 do -- see TheoremVisualProof.tsx for which and why),
// plus several real, concrete applications instead of one collapsed note.
export default function TheoremCorner({ theorems }: { theorems: MathTheorem[] }) {
  const branches = Array.from(new Set(theorems.map((t) => t.branch)));
  const [branch, setBranch] = useState<MathBranch>(branches[0]);
  const inBranch = theorems.filter((t) => t.branch === branch);
  const [activeId, setActiveId] = useState(inBranch[0]?.id);
  const [stepIndex, setStepIndex] = useState(0);
  const active = theorems.find((t) => t.id === activeId) || inBranch[0];
  const deepDives = useDeepDives();
  if (!active) return null;
  const deepDiveId = `math-theorem-${active.id}`;
  const hasDeepDive = deepDives.some((d) => d.id === deepDiveId);

  const switchBranch = (b: MathBranch) => {
    setBranch(b);
    const first = theorems.find((t) => t.branch === b);
    if (first) setActiveId(first.id);
    setStepIndex(0);
    playSelectChime();
  };
  const selectTheorem = (id: string) => {
    setActiveId(id);
    setStepIndex(0);
    playSelectChime();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2.5">
        {branches.map((b) => (
          <Tilt3DCard
            key={b}
            active={branch === b}
            onClick={() => switchBranch(b)}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold ${branch === b ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}`}
          >
            {BRANCH_LABEL[b] || b} <span className="opacity-60 font-normal">({theorems.filter((t) => t.branch === b).length})</span>
          </Tilt3DCard>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4">
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          {inBranch.map((t) => (
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
              text={`${active.name}. ${active.statement} ${active.whyItMatters} Here's why it's true. ${active.proofSteps.join(' ')} ${active.realWorldApplications.join(' ')}`}
            />
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">
            <p className="text-sm font-medium leading-relaxed">{active.statement}</p>
          </div>

          <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Sparkles className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
            <p>{active.whyItMatters}</p>
          </div>

          {active.visualProofId && (
            <div className="bg-white/50 dark:bg-slate-900/30 rounded-2xl p-4">
              <TheoremVisualProof visualProofId={active.visualProofId} step={stepIndex} />
            </div>
          )}

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

          {hasDeepDive && <DeepDiveTrigger id={deepDiveId} label="Explore This Theorem Further" />}

          <details className="group" open>
            <summary className="cursor-pointer text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 list-none">
              Real-World Applications <ChevronDown className="w-3.5 h-3.5 transition-transform group-open:rotate-180" />
            </summary>
            <ul className="mt-2 space-y-1.5">
              {active.realWorldApplications.map((app, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-amber-50 dark:bg-amber-950/20 rounded-xl p-3">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{app}</span>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </div>
  );
}
