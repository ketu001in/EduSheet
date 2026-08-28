'use client';
import { useMemo, useState } from 'react';
import {
  X, Sparkles, ListChecks, Briefcase, Cog, Move3d, Wrench, Radar, Volume2, Users, FlaskConical,
} from 'lucide-react';
import { ROBOTICS_EXPERIMENTS, RoboticsExperiment, ExperimentCategory } from '@edusheets/content';
import { useContent } from '@/lib/useContent';
import SpeakButton from '@/components/labshared/SpeakButton';
import RoboticsExperimentStage from '@/components/techlab/RoboticsExperimentStage';

const CATEGORY_META: Record<ExperimentCategory, { label: string; icon: typeof Cog }> = {
  'control-systems': { label: 'Control Systems', icon: Cog },
  'kinematics-motion': { label: 'Kinematics & Motion', icon: Move3d },
  'mechanical-design': { label: 'Mechanical Design', icon: Wrench },
  'sensing-navigation': { label: 'Sensing & Navigation', icon: Radar },
  'sound-light-output': { label: 'Sound & Light Output', icon: Volume2 },
  'swarm-multi-robot': { label: 'Swarm & Multi-Robot', icon: Users },
};
const CATEGORY_ORDER: ExperimentCategory[] = ['control-systems', 'kinematics-motion', 'mechanical-design', 'sensing-navigation', 'sound-light-output', 'swarm-multi-robot'];
const DIFFICULTY_COLOR: Record<string, string> = {
  beginner: 'text-accent-600 bg-accent-50 dark:bg-accent-900/20',
  intermediate: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
  advanced: 'text-red-600 bg-red-50 dark:bg-red-900/20',
};

// Robotics Lab's "Hands-On Experiments Laboratory" -- the direct answer to
// blunt feedback that the rest of the lab, however real its content, is
// still fundamentally a knowledgebase: every experiment here is a real
// design-and-iterate loop (tune a controller, solve a reach, pick gears,
// hit a precise angle, make real sound/light), not a single-formula
// calculator. See roboticsExperimentTypes.ts for the full rationale.
export default function RoboticsExperimentsLab() {
  const experiments = useContent('robotics-experiment', ROBOTICS_EXPERIMENTS);
  const categoriesPresent = useMemo(() => CATEGORY_ORDER.filter((c) => experiments.some((e) => e.category === c)), [experiments]);
  const [tab, setTab] = useState<ExperimentCategory | 'all'>('all');
  const [selected, setSelected] = useState<RoboticsExperiment | null>(null);

  const items = tab === 'all' ? experiments : experiments.filter((e) => e.category === tab);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border-2 border-dashed border-primary-300 dark:border-primary-800 bg-primary-50/40 dark:bg-primary-950/10 p-4 flex items-start gap-3">
        <FlaskConical className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Every experiment here is real design-and-iterate: tune a controller, solve a reach, pick gears to hit a target, land a precise angle, or make a real sound or light -- change something, run it, see what actually happens, then change it again.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setTab('all')} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${tab === 'all' ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'border-slate-200 dark:border-slate-800 hover:border-primary-300'}`}>
          All Experiments
        </button>
        {categoriesPresent.map((c) => {
          const meta = CATEGORY_META[c];
          const Icon = meta.icon;
          return (
            <button key={c} onClick={() => setTab(c)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${tab === c ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'border-slate-200 dark:border-slate-800 hover:border-primary-300'}`}>
              <Icon className="w-3.5 h-3.5" /> {meta.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const meta = CATEGORY_META[item.category];
          const Icon = meta.icon;
          return (
            <button key={item.id} onClick={() => setSelected(item)} className="text-left glass-card rounded-2xl p-5 space-y-2.5 hover:border-primary-400 hover:-translate-y-0.5 transition-all">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary-600"><Icon className="w-3 h-3" /> {meta.label}</span>
                <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${DIFFICULTY_COLOR[item.difficulty]}`}>{item.difficulty}</span>
              </div>
              <h3 className="font-bold text-sm">{item.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.tagline}</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent-600"><Sparkles className="w-3 h-3" /> Try it yourself</span>
            </button>
          );
        })}
      </div>

      {selected && <ExperimentDetailModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function ExperimentDetailModal({ item, onClose }: { item: RoboticsExperiment; onClose: () => void }) {
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

        <RoboticsExperimentStage type={item.playgroundType} config={item.playgroundConfig ?? {}} />

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
          {item.componentsUsed.map((c, i) => (
            <span key={i} className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500">{c}</span>
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
