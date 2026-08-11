'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Bot, BookOpenText, Globe2 } from 'lucide-react';
import RoboticsFundamentalsExplorer from '@/components/techlab/RoboticsFundamentalsExplorer';
import RoboticsApplicationsGallery from '@/components/techlab/RoboticsApplicationsGallery';

type TopTab = 'fundamentals' | 'applications';

// Robotics Lab -- the first fully curated, play-based section of Tech Lab,
// distinct from the existing AI-generated "New Build" flow. Two halves:
// Fundamentals (the real study-level subject matter -- sensors, actuators,
// control theory, mechanisms, electronics, classification, history) is the
// primary tab, since a lab about robotics should first teach robotics, not
// just showcase robots. Applications Gallery (24 real robots doing real
// jobs) is the complementary "where this actually gets used" second half.
export default function RoboticsLabPage() {
  const [tab, setTab] = useState<TopTab>('fundamentals');

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
          Learn robotics as a real subject -- real sensor specs, real control theory, real mechanism math -- then see exactly where it's actually used in the world.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl w-fit">
        <button
          onClick={() => setTab('fundamentals')}
          className={`px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${tab === 'fundamentals' ? 'bg-white dark:bg-slate-900 shadow-sm text-primary-600' : 'text-slate-500'}`}
        >
          <BookOpenText className="w-4 h-4" /> Fundamentals
        </button>
        <button
          onClick={() => setTab('applications')}
          className={`px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${tab === 'applications' ? 'bg-white dark:bg-slate-900 shadow-sm text-primary-600' : 'text-slate-500'}`}
        >
          <Globe2 className="w-4 h-4" /> Real-World Applications
        </button>
      </div>

      {tab === 'fundamentals' ? <RoboticsFundamentalsExplorer /> : <RoboticsApplicationsGallery />}
    </div>
  );
}
