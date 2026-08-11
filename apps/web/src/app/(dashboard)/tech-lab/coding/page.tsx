'use client';
import Link from 'next/link';
import { ChevronLeft, Code2 } from 'lucide-react';
import { CODING_CONCEPTS } from '@edusheets/content';
import { useContent } from '@/lib/useContent';
import TechFoundationExplorer from '@/components/techlab/TechFoundationExplorer';

// Coding Lab -- kept intentionally foundational at this stage. Real
// content throughout, and a genuine algorithm race (real linear search vs
// real binary search, run against an actual array) for the one concept
// that has a clean, checkable comparison behind it.
export default function CodingLabPage() {
  const concepts = useContent('coding-concept', CODING_CONCEPTS);

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-6">
      <div className="sticky top-0 z-30 isolate px-3 py-2 rounded-xl bg-bg-light dark:bg-bg-dark border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
        <Link href="/tech-lab" className="text-sm font-medium text-slate-500 hover:text-primary-600 flex items-center gap-1.5">
          <ChevronLeft className="w-4 h-4" /> Back to Tech Lab
        </Link>
      </div>

      <div>
        <h1 className="font-display text-3xl font-semibold mb-2 flex items-center gap-2"><Code2 className="w-7 h-7 text-primary-600" /> Coding Lab</h1>
        <p className="text-slate-500 text-sm max-w-2xl">
          The core building blocks every program is made of -- algorithms, loops, conditionals, functions -- and a real look at why some algorithms are dramatically faster than others.
        </p>
      </div>

      <TechFoundationExplorer concepts={concepts} />
    </div>
  );
}
