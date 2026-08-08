'use client';
import Link from 'next/link';
import { ChevronLeft, Wrench, Beaker } from 'lucide-react';
import { CHEM_EQUIPMENT } from '@edusheets/content';

export default function EquipmentStudioPage() {
  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-6">
      <div className="sticky top-0 z-30 isolate px-3 py-2 rounded-xl bg-bg-light dark:bg-bg-dark border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
        <Link href="/chem-lab" className="text-sm font-medium text-slate-500 hover:text-primary-600 flex items-center gap-1.5">
          <ChevronLeft className="w-4 h-4" /> Back to Chem Lab
        </Link>
      </div>
      <div>
        <h1 className="font-display text-3xl font-semibold mb-2 flex items-center gap-2"><Wrench className="w-7 h-7 text-primary-600" /> Equipment Studio</h1>
        <p className="text-slate-500 text-sm">Every apparatus used across Chem Lab's experiments, explained -- the same set you'll drag and drop with.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CHEM_EQUIPMENT.map((item) => (
          <div key={item.id} className="glass-card rounded-2xl p-5 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center">
              <Beaker className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm">{item.name}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
