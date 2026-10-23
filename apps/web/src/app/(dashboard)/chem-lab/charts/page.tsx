'use client';
import Link from 'next/link';
import { ChevronLeft, BarChart3 } from 'lucide-react';
import { CHEM_REFERENCE_CHARTS } from '@edusheets/content';

export default function ChemChartsPage() {
  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-6">
      <div className="sticky top-0 z-30 isolate px-3 py-2 rounded-xl bg-bg-light dark:bg-bg-dark border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
        <Link href="/chem-lab" className="text-sm font-medium text-slate-500 hover:text-primary-600 flex items-center gap-1.5">
          <ChevronLeft className="w-4 h-4" /> Back to Chem Lab
        </Link>
      </div>
      <div>
        <h1 className="font-display text-3xl font-semibold mb-2 flex items-center gap-2"><BarChart3 className="w-7 h-7 text-primary-600" /> Reference Charts</h1>
        <p className="text-slate-500 text-sm">Standard chemistry reference charts, always one tap away while you experiment.</p>
      </div>

      <div className="space-y-6">
        {CHEM_REFERENCE_CHARTS.map((chart) => (
          <div key={chart.id} className="glass-card rounded-3xl p-6 md:p-8">
            <h2 className="font-display text-xl font-semibold mb-1">{chart.title}</h2>
            <p className="text-sm text-slate-500 mb-4">{chart.description}</p>
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {chart.rows.map((row, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-2.5">
                  <span className="font-bold text-sm w-40 shrink-0 text-primary-600">{row.label}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-300">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
