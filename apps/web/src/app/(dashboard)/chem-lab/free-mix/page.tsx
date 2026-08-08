'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Beaker, FlaskConical, Info } from 'lucide-react';
import { FREE_MIX_CHEMICALS, FREE_MIX_REACTIONS } from '@edusheets/content';
import { ReactionStage } from '@/components/chemlab/ReactionStage';

export default function FreeMixPage() {
  const [chemA, setChemA] = useState<string | null>(null);
  const [chemB, setChemB] = useState<string | null>(null);
  const [tried, setTried] = useState(false);

  const reaction = chemA && chemB
    ? FREE_MIX_REACTIONS.find((r) => (r.chemicalIds[0] === chemA && r.chemicalIds[1] === chemB) || (r.chemicalIds[0] === chemB && r.chemicalIds[1] === chemA))
    : undefined;

  const pick = (id: string) => {
    setTried(false);
    if (chemA === id) { setChemA(null); return; }
    if (chemB === id) { setChemB(null); return; }
    if (!chemA) { setChemA(id); return; }
    if (!chemB) { setChemB(id); return; }
    setChemA(id);
    setChemB(null);
  };

  const nameOf = (id: string | null) => FREE_MIX_CHEMICALS.find((c) => c.id === id)?.name;

  return (
    <div className="max-w-3xl mx-auto pb-16 space-y-6">
      <div className="sticky top-0 z-30 isolate px-3 py-2 rounded-xl bg-bg-light dark:bg-bg-dark border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
        <Link href="/chem-lab" className="text-sm font-medium text-slate-500 hover:text-primary-600 flex items-center gap-1.5">
          <ChevronLeft className="w-4 h-4" /> Back to Chem Lab
        </Link>
      </div>
      <div>
        <h1 className="font-display text-3xl font-semibold mb-2 flex items-center gap-2"><Beaker className="w-7 h-7 text-primary-600" /> Free Mix Sandbox</h1>
        <p className="text-slate-500 text-sm">Pick any two safe household chemicals and see what really happens -- a small, hand-checked set, on purpose.</p>
      </div>

      <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        Everything here is a common, genuinely safe kitchen ingredient -- this is not a real chemistry lab sandbox, so results are limited to this small, verified list on purpose.
      </div>

      <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6">
        <div>
          <h2 className="font-bold text-sm mb-3">Pick two chemicals (tap to select/deselect)</h2>
          <div className="flex flex-wrap gap-2">
            {FREE_MIX_CHEMICALS.map((c) => {
              const selected = chemA === c.id || chemB === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => pick(c.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                    selected
                      ? 'border-slate-900 bg-primary-600 text-white shadow-[3px_3px_0_var(--color-ink)]'
                      : 'border-slate-900 dark:border-slate-700 bg-surface-light dark:bg-surface-dark hover:shadow-[3px_3px_0_var(--color-ink)]'
                  }`}
                  title={c.description}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 text-sm font-medium text-slate-500">
          <span>{nameOf(chemA) || '?'}</span>
          <FlaskConical className="w-4 h-4" />
          <span>{nameOf(chemB) || '?'}</span>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => setTried(true)}
            disabled={!chemA || !chemB}
            className="btn-brutal px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold disabled:opacity-50"
          >
            Mix Them!
          </button>
        </div>

        {tried && chemA && chemB && (
          <div className="space-y-4 border-t-2 border-dashed border-slate-200 dark:border-slate-800 pt-6">
            <div className="flex justify-center">
              <ReactionStage reaction={reaction?.result} idle={!reaction} />
            </div>
            {reaction ? (
              <div className="text-center space-y-2">
                <p className="font-bold">{reaction.result.description}</p>
                {reaction.equation && <p className="text-xs font-mono bg-slate-900 text-slate-100 rounded-lg px-3 py-2 inline-block">{reaction.equation}</p>}
                <p className="text-sm text-slate-500 max-w-md mx-auto">{reaction.explanation}</p>
              </div>
            ) : (
              <p className="text-center text-sm text-slate-500">No visible reaction between {nameOf(chemA)} and {nameOf(chemB)} -- not every pair of chemicals reacts, and that's useful information too.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
