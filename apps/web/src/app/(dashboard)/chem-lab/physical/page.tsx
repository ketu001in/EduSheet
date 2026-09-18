'use client';
import Link from 'next/link';
import { ChevronLeft, Calculator } from 'lucide-react';
import PhysicalChemLab from '@/components/chemlab/PhysicalChemLab';
import SpeakButton from '@/components/labshared/SpeakButton';

export default function PhysicalChemLabPage() {
  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-6">
      <div className="px-3 py-2 rounded-xl bg-bg-light dark:bg-bg-dark border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
        <Link href="/chem-lab" className="text-sm font-medium text-slate-500 hover:text-primary-600 flex items-center gap-1.5">
          <ChevronLeft className="w-4 h-4" /> Back to Chem Lab
        </Link>
      </div>

      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-semibold mb-2 flex items-center gap-2"><Calculator className="w-7 h-7 text-primary-600" /> Physical Chemistry Lab</h1>
          <p className="text-slate-500 text-sm">Moles, gas laws, pH, equilibrium, kinetics, and electrochemistry -- calculated live, not just looked up.</p>
        </div>
        <SpeakButton text="Welcome to the Physical Chemistry Lab! Calculate mole conversions, simulate gas laws, explore pH, predict equilibrium shifts, graph reaction rates, and work out real electrochemical cell voltages." />
      </div>

      <PhysicalChemLab />
    </div>
  );
}
