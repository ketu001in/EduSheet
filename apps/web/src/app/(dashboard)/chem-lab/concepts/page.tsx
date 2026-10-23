'use client';
import Link from 'next/link';
import { ChevronLeft, BookOpenCheck } from 'lucide-react';
import { CHEM_CONCEPTS } from '@edusheets/content';
import ChemConceptsCorner from '@/components/chemlab/ChemConceptsCorner';
import SpeakButton from '@/components/labshared/SpeakButton';
import { useContent } from '@/lib/useContent';

export default function ChemConceptsPage() {
  // CMS Phase 2: merges in any admin edits from /admin/content live.
  const concepts = useContent('chem-concept', CHEM_CONCEPTS);

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-6">
      <div className="px-3 py-2 rounded-xl bg-bg-light dark:bg-bg-dark border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
        <Link href="/chem-lab" className="text-sm font-medium text-slate-500 hover:text-primary-600 flex items-center gap-1.5">
          <ChevronLeft className="w-4 h-4" /> Back to Chem Lab
        </Link>
      </div>

      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-semibold mb-2 flex items-center gap-2"><BookOpenCheck className="w-7 h-7 text-primary-600" /> Concepts Corner</h1>
          <p className="text-slate-500 text-sm">The key laws and principles the rest of CBSE/ICSE chemistry builds on -- stepped through, not just stated.</p>
        </div>
        <SpeakButton text="Welcome to Concepts Corner! Step through the real reasoning behind the key laws of chemistry -- conservation of mass, constant proportions, Avogadro's Law, Le Chatelier's Principle, the octet rule, the modern periodic law, Faraday's laws of electrolysis, and Graham's Law of Diffusion." />
      </div>

      <ChemConceptsCorner concepts={concepts} />
    </div>
  );
}
