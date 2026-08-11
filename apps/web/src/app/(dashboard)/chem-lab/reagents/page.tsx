'use client';
import Link from 'next/link';
import { ChevronLeft, FlaskConical, TestTube2 } from 'lucide-react';
import { CHEM_REAGENTS } from '@edusheets/content';
import { useContent } from '@/lib/useContent';
import { useDeepDives } from '@/lib/useDeepDives';
import DeepDiveTrigger from '@/components/labshared/DeepDiveTrigger';

// Reagents Studio -- a standalone reference for every reagent used across
// Chem Lab's experiments, mirroring Equipment Studio's structure (see that
// page's comment). Reagents previously only appeared as small draggable
// chips inside a live experiment, with no place of their own to click into
// and learn about -- this gives them one, same as equipment.
export default function ReagentsStudioPage() {
  const reagents = useContent('chem-reagent', CHEM_REAGENTS);
  const deepDives = useDeepDives();
  const deepDiveFor = (id: string) => deepDives.find((d) => d.id === `chem-reagent-${id}`);

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-6">
      <div className="sticky top-0 z-30 isolate px-3 py-2 rounded-xl bg-bg-light dark:bg-bg-dark border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
        <Link href="/chem-lab" className="text-sm font-medium text-slate-500 hover:text-primary-600 flex items-center gap-1.5">
          <ChevronLeft className="w-4 h-4" /> Back to Chem Lab
        </Link>
      </div>
      <div>
        <h1 className="font-display text-3xl font-semibold mb-2 flex items-center gap-2"><FlaskConical className="w-7 h-7 text-primary-600" /> Reagents Studio</h1>
        <p className="text-slate-500 text-sm">Every reagent used across Chem Lab's experiments, explained -- the same bottles you'll drag and drop with. Items marked "Explore" go much deeper.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reagents.map((item) => {
          const deepDive = deepDiveFor(item.id);
          return (
            <div key={item.id} className="glass-card rounded-2xl p-5 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center">
                <TestTube2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm">{item.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.formulaOrDescription}</p>
              {item.hazardNote && <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">{item.hazardNote}</p>}
              {deepDive && <DeepDiveTrigger id={deepDive.id} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
