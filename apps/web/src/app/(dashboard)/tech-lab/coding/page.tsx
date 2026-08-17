'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Code2, Library, FlaskConical } from 'lucide-react';
import { CODING_CONCEPTS } from '@edusheets/content';
import { useContent } from '@/lib/useContent';
import TechFoundationExplorer from '@/components/techlab/TechFoundationExplorer';
import CodingExperimentsLab from '@/components/techlab/CodingExperimentsLab';

type TopTab = 'knowledge-base' | 'experiments';

// Coding Lab -- restructured the same way as Robotics Lab and AI Lab:
// "Knowledge Base / Component Library" holds the existing foundational
// concepts (algorithms, loops, conditionals, functions); "Hands-On
// Experiments Laboratory" is a new, equal-weight tab with a real
// drag-and-drop visual programming studio (Google Blockly, generating
// and genuinely executing real JavaScript/Python) plus a sorting-
// algorithm race, a recursion/call-stack visualizer, and a data-structure
// playground -- spanning every school stage, not just one difficulty
// level.
export default function CodingLabPage() {
  const concepts = useContent('coding-concept', CODING_CONCEPTS);
  const [topTab, setTopTab] = useState<TopTab>('knowledge-base');

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
          The core building blocks every program is made of -- then build a real one yourself, drag-and-drop or algorithm by algorithm, in the Hands-On Experiments Laboratory.
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

      {topTab === 'knowledge-base' ? <TechFoundationExplorer concepts={concepts} /> : <CodingExperimentsLab />}
    </div>
  );
}
