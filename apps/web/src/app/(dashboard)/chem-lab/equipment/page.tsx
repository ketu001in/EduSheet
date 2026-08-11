'use client';
import Link from 'next/link';
import { ChevronLeft, Wrench, Beaker } from 'lucide-react';
import { CHEM_EQUIPMENT } from '@edusheets/content';
import { useContent } from '@/lib/useContent';
import { useDeepDives } from '@/lib/useDeepDives';
import DeepDiveTrigger from '@/components/labshared/DeepDiveTrigger';

// Equipment Studio -- the concrete example the user pointed at when asking
// for the whole tool to go deeper: this used to be a flat icon + one-line
// description per item. Every item that has a Deep Dive authored (see
// deepDiveChem.ts) now shows its real photo right on the card and an
// Explore button that opens the full hold-and-rotate view plus everything
// worth knowing. Items without a Deep Dive yet (most of the 28) keep the
// original text-only card -- see deepDiveChem.ts's header for the ongoing
// coverage plan.
export default function EquipmentStudioPage() {
  const equipment = useContent('chem-equipment', CHEM_EQUIPMENT);
  const deepDives = useDeepDives();
  const deepDiveFor = (id: string) => deepDives.find((d) => d.id === `chem-equip-${id}`);

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-6">
      <div className="sticky top-0 z-30 isolate px-3 py-2 rounded-xl bg-bg-light dark:bg-bg-dark border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
        <Link href="/chem-lab" className="text-sm font-medium text-slate-500 hover:text-primary-600 flex items-center gap-1.5">
          <ChevronLeft className="w-4 h-4" /> Back to Chem Lab
        </Link>
      </div>
      <div>
        <h1 className="font-display text-3xl font-semibold mb-2 flex items-center gap-2"><Wrench className="w-7 h-7 text-primary-600" /> Equipment Studio</h1>
        <p className="text-slate-500 text-sm">Every apparatus used across Chem Lab's experiments, explained -- the same set you'll drag and drop with. Items marked "Explore" go much deeper: a real photo you can hold and spin, full background, and hands-on practice.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipment.map((item) => {
          const deepDive = deepDiveFor(item.id);
          return (
            <div key={item.id} className="glass-card rounded-2xl p-5 space-y-3">
              {deepDive?.imageSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={deepDive.imageSrc} alt={deepDive.imageAlt || item.name} className="w-full h-32 object-cover rounded-xl border-2 border-slate-900 dark:border-slate-700" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center">
                  <Beaker className="w-6 h-6" />
                </div>
              )}
              <h3 className="font-bold text-sm">{item.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
              {deepDive && <DeepDiveTrigger id={deepDive.id} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
