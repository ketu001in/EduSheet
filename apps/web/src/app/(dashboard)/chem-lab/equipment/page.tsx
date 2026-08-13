'use client';
import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ChevronLeft, Wrench, Beaker, Box, X } from 'lucide-react';
import { CHEM_EQUIPMENT, ChemApparatus } from '@edusheets/content';
import { useContent } from '@/lib/useContent';
import { useDeepDives } from '@/lib/useDeepDives';
import DeepDiveTrigger from '@/components/labshared/DeepDiveTrigger';

// Dynamically imported (ssr:false) so Three.js -- a genuinely large
// library -- only loads for a visitor who actually opens an item's 3D
// view, not on every Equipment Studio page view. Crucially, this is also
// only ever mounted for the single currently-open modal item (see
// EquipmentDetailModal below), never for the whole grid at once --
// mounting one live WebGL canvas per grid card (28 of them) is what
// caused the page to load slowly and hang on interaction; browsers cap
// how many concurrent WebGL contexts can exist, and creating that many
// at once starves and eventually crashes the GPU process. Robotics Lab
// already used this click-to-open-one pattern; this page originally
// didn't, which was the bug.
const Model3DViewer = dynamic(() => import('@/components/labshared/Model3DViewer'), {
  ssr: false,
  loading: () => <div className="w-full h-56 rounded-2xl bg-slate-50 dark:bg-slate-900/40 animate-pulse" />,
});

// Equipment Studio -- the concrete example the user pointed at when asking
// for the whole tool to go deeper: this used to be a flat icon + one-line
// description per item. Cards show a static preview only (a real photo
// via Deep Dive, a "3D" badge, or the original icon) -- tapping a card
// opens a detail modal, and that's the only place the actual 3D model or
// full write-up loads.
export default function EquipmentStudioPage() {
  const equipment = useContent('chem-equipment', CHEM_EQUIPMENT);
  const deepDives = useDeepDives();
  const deepDiveFor = (id: string) => deepDives.find((d) => d.id === `chem-equip-${id}`);
  const [selected, setSelected] = useState<ChemApparatus | null>(null);

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-6">
      <div className="sticky top-0 z-30 isolate px-3 py-2 rounded-xl bg-bg-light dark:bg-bg-dark border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
        <Link href="/chem-lab" className="text-sm font-medium text-slate-500 hover:text-primary-600 flex items-center gap-1.5">
          <ChevronLeft className="w-4 h-4" /> Back to Chem Lab
        </Link>
      </div>
      <div>
        <h1 className="font-display text-3xl font-semibold mb-2 flex items-center gap-2"><Wrench className="w-7 h-7 text-primary-600" /> Equipment Studio</h1>
        <p className="text-slate-500 text-sm">Every apparatus used across Chem Lab's experiments, explained -- the same set you'll drag and drop with. Items marked 3D can be picked up and turned in your hand; others marked "Explore" show a real photo and full background.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipment.map((item) => {
          const deepDive = deepDiveFor(item.id);
          return (
            <button key={item.id} onClick={() => setSelected(item)} className="text-left glass-card rounded-2xl p-5 space-y-3 hover:border-primary-400 hover:-translate-y-0.5 transition-all">
              {item.model3d ? (
                <div className="w-full h-28 rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 flex flex-col items-center justify-center gap-1.5 text-slate-400">
                  <Box className="w-7 h-7" />
                  <span className="text-[10px] font-bold text-primary-600">Tap to view in 3D</span>
                </div>
              ) : deepDive?.imageSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={deepDive.imageSrc} alt={deepDive.imageAlt || item.name} className="w-full h-28 object-cover rounded-xl border-2 border-slate-900 dark:border-slate-700" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center">
                  <Beaker className="w-6 h-6" />
                </div>
              )}
              <h3 className="font-bold text-sm">{item.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
            </button>
          );
        })}
      </div>

      {selected && (
        <EquipmentDetailModal
          item={selected}
          deepDive={deepDiveFor(selected.id)}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

function EquipmentDetailModal({ item, deepDive, onClose }: { item: ChemApparatus; deepDive: ReturnType<typeof useDeepDives>[number] | undefined; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg max-h-[92vh] sm:max-h-[88vh] overflow-y-auto bg-surface-light dark:bg-surface-dark rounded-t-3xl sm:rounded-3xl border-2 border-slate-900 dark:border-slate-700 shadow-2xl p-5 md:p-7 space-y-4">
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700">
          <X className="w-4 h-4" />
        </button>

        <h2 className="font-display text-2xl font-bold pr-8">{item.name}</h2>

        {item.model3d ? (
          <div className="space-y-1">
            <Model3DViewer src={item.model3d.src} alt={item.name} height={280} />
            <p className="text-center text-[10px] text-slate-400">
              3D model: {item.model3d.credit.author} &middot; {item.model3d.credit.license} &middot;{' '}
              <a href={item.model3d.credit.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary-600">Source</a>
            </p>
          </div>
        ) : deepDive?.imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={deepDive.imageSrc} alt={deepDive.imageAlt || item.name} className="w-full h-56 object-cover rounded-2xl border-2 border-slate-900 dark:border-slate-700" />
        ) : null}

        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">{item.description}</p>

        {deepDive && <DeepDiveTrigger id={deepDive.id} />}
      </div>
    </div>
  );
}
