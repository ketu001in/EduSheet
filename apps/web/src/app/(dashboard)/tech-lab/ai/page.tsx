'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Brain, Library, FlaskConical } from 'lucide-react';
import AIFoundationsExplorer from '@/components/techlab/AIFoundationsExplorer';
import AIExperimentsLab from '@/components/techlab/AIExperimentsLab';

type TopTab = 'knowledge-base' | 'experiments';

// AI Lab -- restructured the same way as Robotics Lab, per the explicit
// instruction to apply the same treatment: however real Foundations +
// Classic ML's content is, it's still a knowledgebase with widgets
// embedded in it -- every interactive there is a single concept's own
// calculator, nothing lets a student actually design something, run it,
// and iterate. "Knowledge Base / Component Library" now holds Foundations
// + Classic ML (AIFoundationsExplorer already tabs between those two
// internally, so no extra nesting layer is needed here, unlike Robotics
// which had two separate top-level components to combine); "Hands-On
// Experiments Laboratory" is a new, equal-weight tab of real
// design-and-iterate exercises: train an actual neural network, watch
// real gradient descent, run real reinforcement learning, apply a real
// edge-detection kernel, test the real word2vec analogy property, trade
// off real precision/recall, and try to break a real sentiment
// classifier.
export default function AiLabPage() {
  const [topTab, setTopTab] = useState<TopTab>('knowledge-base');

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
          Learn the real ideas behind machine learning -- then actually train a network, run reinforcement learning, and test real algorithms yourself in the Hands-On Experiments Laboratory.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setTopTab('knowledge-base')}
          className={`px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all border-2 ${topTab === 'knowledge-base' ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-sm' : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-primary-300'}`}
        >
          <Library className="w-4 h-4" /> Knowledge Base / Component Library
        </button>
        <button
          onClick={() => setTopTab('experiments')}
          className={`px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all border-2 ${topTab === 'experiments' ? 'border-accent-600 bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-300 shadow-sm' : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-accent-300'}`}
        >
          <FlaskConical className="w-4 h-4" /> Hands-On Experiments Laboratory
        </button>
      </div>

      {topTab === 'knowledge-base' ? <AIFoundationsExplorer /> : <AIExperimentsLab />}
    </div>
  );
}
