'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Beaker, FlaskConical, Info, ShieldAlert, TriangleAlert } from 'lucide-react';
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
        <p className="text-slate-500 text-sm">Pick any two household chemicals and see what really happens -- a small, hand-checked set, on purpose.</p>
      </div>

      <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        This is a simulation, not a real chemistry lab sandbox -- results are limited to this small, verified list on purpose. A couple of pairs are marked <ShieldAlert className="w-3.5 h-3.5 inline text-red-600" /> on purpose too -- real household chemicals that are genuinely dangerous to mix, included here so you can safely learn <em>why</em> without any real risk.
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
                  className={`px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all flex items-center gap-1.5 ${
                    c.hazardOnly && !selected
                      ? 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 hover:shadow-[3px_3px_0_var(--color-ink)]'
                      : selected
                      ? 'border-slate-900 bg-primary-600 text-white shadow-[3px_3px_0_var(--color-ink)]'
                      : 'border-slate-900 dark:border-slate-700 bg-surface-light dark:bg-surface-dark hover:shadow-[3px_3px_0_var(--color-ink)]'
                  }`}
                  title={c.description}
                >
                  {c.hazardOnly && <ShieldAlert className="w-3.5 h-3.5 shrink-0" />}
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
            {reaction?.hazard ? (
              <div className="bg-red-50 dark:bg-red-950/30 border-2 border-red-400 dark:border-red-800 rounded-2xl p-5 space-y-3">
                <p className="flex items-center justify-center gap-2 text-red-700 dark:text-red-400 font-bold text-sm uppercase tracking-wide">
                  <TriangleAlert className="w-5 h-5" /> Real-Life Hazard -- Never Try This For Real
                </p>
                <div className="flex justify-center">
                  <ReactionStage reaction={reaction.result} idle={false} />
                </div>
                <p className="text-center font-bold text-red-700 dark:text-red-400">{reaction.result.description}</p>
                <p className="text-sm text-red-700/90 dark:text-red-300/90 max-w-md mx-auto text-center">{reaction.explanation}</p>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
