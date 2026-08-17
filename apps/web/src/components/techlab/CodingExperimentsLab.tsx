'use client';
import { useMemo, useState } from 'react';
import {
  X, Sparkles, ListChecks, Briefcase, Blocks, BarChart3, GitBranch, Layers3, FlaskConical,
} from 'lucide-react';
import { CODING_EXPERIMENTS, CodingExperiment, GradeBand } from '@edusheets/content';
import { useContent } from '@/lib/useContent';
import SpeakButton from '@/components/labshared/SpeakButton';
import CodingExperimentStage from '@/components/techlab/CodingExperimentStage';

const CATEGORY_ICON = { 'visual-programming': Blocks, algorithms: BarChart3, 'data-structures': Layers3 } as const;
const GRADE_META: Record<GradeBand, string> = {
  junior: 'Junior (grades 3-5)', middle: 'Middle (grades 6-8)', senior: 'Senior (grades 9-10)', plusTwo: '+2 (grades 11-12)',
};
const GRADE_ORDER: GradeBand[] = ['junior', 'middle', 'senior', 'plusTwo'];

// Coding Lab's "Hands-On Experiments Laboratory" -- the same move made
// for Robotics Lab and AI Lab, this time explicitly organized around
// grade band first (rather than difficulty) because the goal of this
// pass was covering every school stage with something real to build.
export default function CodingExperimentsLab() {
  const experiments = useContent('coding-experiment', CODING_EXPERIMENTS);
  const bandsPresent = useMemo(() => GRADE_ORDER.filter((g) => experiments.some((e) => e.gradeBands.includes(g))), [experiments]);
  const [band, setBand] = useState<GradeBand | 'all'>('all');
  const [selected, setSelected] = useState<CodingExperiment | null>(null);

  const items = band === 'all' ? experiments : experiments.filter((e) => e.gradeBands.includes(band));

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border-2 border-dashed border-primary-300 dark:border-primary-800 bg-primary-50/40 dark:bg-primary-950/10 p-4 flex items-start gap-3">
        <FlaskConical className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Drag real blocks that generate and run real JavaScript or Python, race real sorting algorithms, watch a real call stack grow and unwind, and push/pop a real stack and queue -- one real, working program at a time.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setBand('all')} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${band === 'all' ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'border-slate-200 dark:border-slate-800 hover:border-primary-300'}`}>
          All Grade Bands
        </button>
        {bandsPresent.map((g) => (
          <button key={g} onClick={() => setBand(g)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${band === g ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'border-slate-200 dark:border-slate-800 hover:border-primary-300'}`}>
            {GRADE_META[g]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const Icon = CATEGORY_ICON[item.category];
          return (
            <button key={item.id} onClick={() => setSelected(item)} className="text-left glass-card rounded-2xl p-5 space-y-2.5 hover:border-primary-400 hover:-translate-y-0.5 transition-all">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary-600"><Icon className="w-3 h-3" /> {item.category.replace('-', ' ')}</span>
              </div>
              <h3 className="font-bold text-sm">{item.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.tagline}</p>
              <div className="flex flex-wrap gap-1">
                {item.gradeBands.map((g) => (
                  <span key={g} className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">{g}</span>
                ))}
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent-600"><Sparkles className="w-3 h-3" /> Try it yourself</span>
            </button>
          );
        })}
      </div>

      {selected && <ExperimentDetailModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function ExperimentDetailModal({ item, onClose }: { item: CodingExperiment; onClose: () => void }) {
  const fullNarration = [item.name, item.overview, item.whatYoullDo.join(' ')].join(' ');
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-3xl max-h-[92vh] sm:max-h-[88vh] overflow-y-auto bg-surface-light dark:bg-surface-dark rounded-t-3xl sm:rounded-3xl border-2 border-slate-900 dark:border-slate-700 shadow-2xl p-5 md:p-7 space-y-5">
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700">
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start justify-between gap-3 pr-8">
          <div>
            <h2 className="font-display text-2xl font-bold">{item.name}</h2>
            <p className="text-sm text-primary-600 dark:text-primary-400 font-semibold">{item.tagline}</p>
          </div>
          <SpeakButton label="Listen" text={fullNarration} />
        </div>

        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">{item.overview}</p>

        <CodingExperimentStage type={item.playgroundType} />

        <Section icon={<ListChecks className="w-4 h-4 text-primary-600" />} title="What You'll Do">
          <ol className="space-y-2">
            {item.whatYoullDo.map((s, i) => (
              <li key={i} className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex gap-2">
                <span className="w-5 h-5 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </Section>

        <Section icon={<Briefcase className="w-4 h-4 text-accent-600" />} title="Real-World Tie-In">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.realWorldTieIn}</p>
        </Section>

        <div className="flex flex-wrap gap-1.5">
          {item.gradeBands.map((g) => (
            <span key={g} className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 flex items-center gap-1"><GitBranch className="w-3 h-3" /> {GRADE_META[g]}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h4 className="font-bold text-sm flex items-center gap-1.5">{icon} {title}</h4>
      {children}
    </div>
  );
}
