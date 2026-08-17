'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Bot, BookOpenText, Globe2, Library, FlaskConical } from 'lucide-react';
import RoboticsFundamentalsExplorer from '@/components/techlab/RoboticsFundamentalsExplorer';
import RoboticsApplicationsGallery from '@/components/techlab/RoboticsApplicationsGallery';
import RoboticsExperimentsLab from '@/components/techlab/RoboticsExperimentsLab';

type TopTab = 'knowledge-base' | 'experiments';
type KnowledgeSubTab = 'fundamentals' | 'applications';

// Robotics Lab -- restructured per direct, blunt feedback that
// Fundamentals + Applications, however real their content, still read as
// "a knowledgebase with widgets embedded in it": every interactive there
// is a single-formula calculator isolated to its own fact-card, nothing
// lets a student actually build/tune/iterate. Fundamentals and
// Applications are now nested under one "Knowledge Base / Component
// Library" parent tab (reference material), sitting alongside a genuinely
// new, equal-weight "Hands-On Experiments Laboratory" tab (real
// design-and-iterate exercises) -- so the lab's top-level structure itself
// now honestly signals "here's what a robot's made of" vs "here's what
// you can actually build with it".
export default function RoboticsLabPage() {
  const [topTab, setTopTab] = useState<TopTab>('knowledge-base');
  const [subTab, setSubTab] = useState<KnowledgeSubTab>('fundamentals');

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-6">
      <div className="sticky top-0 z-30 isolate px-3 py-2 rounded-xl bg-bg-light dark:bg-bg-dark border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
        <Link href="/tech-lab" className="text-sm font-medium text-slate-500 hover:text-primary-600 flex items-center gap-1.5">
          <ChevronLeft className="w-4 h-4" /> Back to Tech Lab
        </Link>
      </div>

      <div>
        <h1 className="font-display text-3xl font-semibold mb-2 flex items-center gap-2"><Bot className="w-7 h-7 text-primary-600" /> Robotics Lab</h1>
        <p className="text-slate-500 text-sm max-w-2xl">
          Learn robotics as a real subject, see where it's actually used in the world -- then actually build, tune, and test something yourself in the Hands-On Experiments Laboratory.
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

      {topTab === 'knowledge-base' ? (
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl w-fit">
            <button
              onClick={() => setSubTab('fundamentals')}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${subTab === 'fundamentals' ? 'bg-white dark:bg-slate-900 shadow-sm text-primary-600' : 'text-slate-500'}`}
            >
              <BookOpenText className="w-4 h-4" /> Fundamentals
            </button>
            <button
              onClick={() => setSubTab('applications')}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${subTab === 'applications' ? 'bg-white dark:bg-slate-900 shadow-sm text-primary-600' : 'text-slate-500'}`}
            >
              <Globe2 className="w-4 h-4" /> Real-World Applications
            </button>
          </div>
          {subTab === 'fundamentals' ? <RoboticsFundamentalsExplorer /> : <RoboticsApplicationsGallery />}
        </div>
      ) : (
        <RoboticsExperimentsLab />
      )}
    </div>
  );
}
