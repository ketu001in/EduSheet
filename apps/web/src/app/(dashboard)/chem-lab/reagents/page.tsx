'use client';
import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ChevronLeft, FlaskConical, X } from 'lucide-react';
import { CHEM_REAGENTS, ChemReagent } from '@edusheets/content';
import { useContent } from '@/lib/useContent';
import { useDeepDives } from '@/lib/useDeepDives';
import DeepDiveTrigger from '@/components/labshared/DeepDiveTrigger';
import Tilt3DCard from '@/components/labshared/Tilt3DCard';
import ReagentBottleIcon from '@/components/chemlab/ReagentBottleIcon';
import { reagentVisual } from '@/lib/reagentVisuals';

const ReagentBottle3DScene = dynamic(() => import('@/components/chemlab/ReagentBottle3DScene'), {
  ssr: false,
  loading: () => <div className="w-full h-[220px] rounded-2xl bg-slate-50 dark:bg-slate-900/40 animate-pulse" />,
});

// Reagents Studio -- every card is now a real pointer-driven 3D tilt
// card with a real per-reagent bottle/sample icon (colored from real,
// stated facts -- CuSO4's real pale blue, the real flame-test colors,
// etc., never a fabricated palette), and clicking opens a real 3D
// bottle/crystal/metal-strip scene -- direct response to feedback that
// every card previously carried the exact same generic test-tube icon.
export default function ReagentsStudioPage() {
  const reagents = useContent('chem-reagent', CHEM_REAGENTS);
  const deepDives = useDeepDives();
  const deepDiveFor = (id: string) => deepDives.find((d) => d.id === `chem-reagent-${id}`);
  const [selected, setSelected] = useState<ChemReagent | null>(null);

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-6">
      <div className="px-3 py-2 rounded-xl bg-bg-light dark:bg-bg-dark border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
        <Link href="/chem-lab" className="text-sm font-medium text-slate-500 hover:text-primary-600 flex items-center gap-1.5">
          <ChevronLeft className="w-4 h-4" /> Back to Chem Lab
        </Link>
      </div>
      <div>
        <h1 className="font-display text-3xl font-semibold mb-2 flex items-center gap-2"><FlaskConical className="w-7 h-7 text-primary-600" /> Reagents Studio</h1>
        <p className="text-slate-500 text-sm">Every reagent used across Chem Lab's experiments, explained -- the same bottles you'll drag and drop with. Tap any card for a real 3D look.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reagents.map((item) => {
          const deepDive = deepDiveFor(item.id);
          const visual = reagentVisual(item.id, item.formulaOrDescription);
          return (
            <Tilt3DCard key={item.id} onClick={() => setSelected(item)} className="text-left glass-card rounded-2xl p-5 space-y-3 block w-full">
              <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900/40 flex items-center justify-center">
                <ReagentBottleIcon color={visual.color} state={visual.state} />
              </div>
              <h3 className="font-bold text-sm">{item.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.formulaOrDescription}</p>
              {item.hazardNote && <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">{item.hazardNote}</p>}
            </Tilt3DCard>
          );
        })}
      </div>

      {selected && (
        <ReagentDetailModal
          item={selected}
          deepDive={deepDiveFor(selected.id)}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

function ReagentDetailModal({ item, deepDive, onClose }: { item: ChemReagent; deepDive: ReturnType<typeof useDeepDives>[number] | undefined; onClose: () => void }) {
  const visual = reagentVisual(item.id, item.formulaOrDescription);
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg max-h-[92vh] sm:max-h-[88vh] overflow-y-auto bg-surface-light dark:bg-surface-dark rounded-t-3xl sm:rounded-3xl border-2 border-slate-900 dark:border-slate-700 shadow-2xl p-5 md:p-7 space-y-4">
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700">
          <X className="w-4 h-4" />
        </button>

        <h2 className="font-display text-2xl font-bold pr-8">{item.name}</h2>

        <ReagentBottle3DScene color={visual.color} state={visual.state} />

        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">{item.formulaOrDescription}</p>
        {item.hazardNote && (
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 rounded-2xl p-4">{item.hazardNote}</p>
        )}

        {deepDive && <DeepDiveTrigger id={deepDive.id} />}
      </div>
    </div>
  );
}
