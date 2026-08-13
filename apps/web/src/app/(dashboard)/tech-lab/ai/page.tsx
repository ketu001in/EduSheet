'use client';
import Link from 'next/link';
import { ChevronLeft, Brain } from 'lucide-react';
import AIFoundationsExplorer from '@/components/techlab/AIFoundationsExplorer';

// AI Lab -- promoted from a flat 5-concept list to a real, sectioned
// system (see aiTypes.ts's header) per direct feedback that the lab
// needed "max topics and vast experiments space": a real trainable
// perceptron, a brute-force-verified XOR limitation demo, and plotted
// activation functions in this first phase, with Classic ML Algorithms /
// Computer Vision / Language AI / a real Applications Gallery / AI+IoT to
// follow in later phases.
export default function AiLabPage() {
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
          The real ideas behind machine learning -- how it differs from traditional programming, the actual math behind a neural network's simplest building block, and why depth (multiple layers) genuinely matters.
        </p>
      </div>

      <AIFoundationsExplorer />
    </div>
  );
}
