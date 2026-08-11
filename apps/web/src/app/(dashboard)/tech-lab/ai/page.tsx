'use client';
import Link from 'next/link';
import { ChevronLeft, Brain } from 'lucide-react';
import { AI_CONCEPTS } from '@edusheets/content';
import { useContent } from '@/lib/useContent';
import TechFoundationExplorer from '@/components/techlab/TechFoundationExplorer';

// AI Lab -- kept intentionally foundational at this stage (Robotics Lab
// got the full deep-dive first, per explicit instruction). Still real,
// verified content: named researchers, dates, documented studies, and a
// genuine formula-backed interactive (a real perceptron) for the one
// concept that has a clean, checkable formula behind it.
export default function AiLabPage() {
  const concepts = useContent('ai-concept', AI_CONCEPTS);

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-6">
      <div className="sticky top-0 z-30 isolate px-3 py-2 rounded-xl bg-bg-light dark:bg-bg-dark border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
        <Link href="/tech-lab" className="text-sm font-medium text-slate-500 hover:text-primary-600 flex items-center gap-1.5">
          <ChevronLeft className="w-4 h-4" /> Back to Tech Lab
        </Link>
      </div>

      <div>
        <h1 className="font-display text-3xl font-semibold mb-2 flex items-center gap-2"><Brain className="w-7 h-7 text-primary-600" /> AI Lab</h1>
        <p className="text-slate-500 text-sm max-w-2xl">
          The core ideas behind machine learning -- how it's different from traditional programming, the real types of learning, and the actual math behind the simplest possible neural network.
        </p>
      </div>

      <TechFoundationExplorer concepts={concepts} />
    </div>
  );
}
