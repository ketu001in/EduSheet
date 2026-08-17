'use client';
import { useMemo, useState } from 'react';
import {
  X, Sparkles, ListChecks, Briefcase, Brain, TrendingDown, Map, Scan, Type, Table2, FlaskConical,
} from 'lucide-react';
import { AI_EXPERIMENTS, AIExperiment, AIExperimentCategory } from '@edusheets/content';
import { useContent } from '@/lib/useContent';
import SpeakButton from '@/components/labshared/SpeakButton';
import AIExperimentStage from '@/components/techlab/AIExperimentStage';

const CATEGORY_META: Record<AIExperimentCategory, { label: string; icon: typeof Brain }> = {
  'neural-networks': { label: 'Neural Networks', icon: Brain },
  optimization: { label: 'Optimization', icon: TrendingDown },
  'reinforcement-learning': { label: 'Reinforcement Learning', icon: Map },
  'computer-vision': { label: 'Computer Vision', icon: Scan },
  nlp: { label: 'Natural Language Processing', icon: Type },
  'model-evaluation': { label: 'Model Evaluation', icon: Table2 },
};
const CATEGORY_ORDER: AIExperimentCategory[] = ['neural-networks', 'optimization', 'reinforcement-learning', 'computer-vision', 'nlp', 'model-evaluation'];
const DIFFICULTY_COLOR: Record<string, string> = {
  beginner: 'text-accent-600 bg-accent-50 dark:bg-accent-900/20',
  intermediate: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
  advanced: 'text-red-600 bg-red-50 dark:bg-red-900/20',
};

// AI Lab's "Hands-On Experiments Laboratory" -- the same move made for
// Robotics Lab: real design-and-iterate loops (train a real network,
// watch real gradient descent, run real reinforcement learning, run a
// real convolution kernel, test the real word2vec analogy property, trade
// off real precision/recall, break a real sentiment classifier) rather
// than a knowledgebase with a slider embedded in it. See
// aiExperimentTypes.ts for the full rationale.
export default function AIExperimentsLab() {
  const experiments = useContent('ai-experiment', AI_EXPERIMENTS);
  const categoriesPresent = useMemo(() => CATEGORY_ORDER.filter((c) => experiments.some((e) => e.category === c)), [experiments]);
  const [tab, setTab] = useState<AIExperimentCategory | 'all'>('all');
  const [selected, setSelected] = useState<AIExperiment | null>(null);

  const items = tab === 'all' ? experiments : experiments.filter((e) => e.category === tab);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border-2 border-dashed border-primary-300 dark:border-primary-800 bg-primary-50/40 dark:bg-primary-950/10 p-4 flex items-start gap-3">
        <FlaskConical className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Every experiment here runs the real algorithm live -- train an actual multi-layer network, watch real gradient descent converge or diverge, run real reinforcement learning, apply a real edge-detection kernel, test real vector arithmetic, or trade off real precision and recall. Change something, run it, see what genuinely happens, then change it again.
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

function ExperimentDetailModal({ item, onClose }: { item: AIExperiment; onClose: () => void }) {
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

        <AIExperimentStage type={item.playgroundType} config={item.playgroundConfig ?? {}} />

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
