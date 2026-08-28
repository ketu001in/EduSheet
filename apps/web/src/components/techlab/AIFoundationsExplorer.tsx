'use client';
import { useMemo, useState } from 'react';
import { X, Sparkles, ListChecks, Briefcase, Lightbulb, Scale, Eye, MessageSquare, Layers } from 'lucide-react';
import { AI_FOUNDATIONS, AIConcept, AISection } from '@edusheets/content';
import { useContent } from '@/lib/useContent';
import SpeakButton from '@/components/labshared/SpeakButton';
import AIFoundationStage from '@/components/techlab/AIFoundationStage';

const SECTION_META: Record<AISection, { label: string; icon: typeof Lightbulb }> = {
  foundations: { label: 'Foundations', icon: Lightbulb },
  'classic-ml': { label: 'Classic ML Algorithms', icon: Layers },
  'computer-vision': { label: 'Computer Vision', icon: Eye },
  nlp: { label: 'Language & Generative AI', icon: MessageSquare },
  ethics: { label: 'Ethics & Safety', icon: Scale },
};
const SECTION_ORDER: AISection[] = ['foundations', 'classic-ml', 'computer-vision', 'nlp', 'ethics'];

// The study-level core of AI Lab -- same architecture as Robotics Lab's
// RoboticsFundamentalsExplorer (real sections, real interactives backed by
// verified formulas, a detail modal per concept), built out in phases per
// the agreed AI Lab expansion plan. Only sections with at least one
// concept show a tab, so partially-built phases never show an empty tab.
export default function AIFoundationsExplorer() {
  const concepts = useContent('ai-concept', AI_FOUNDATIONS);
  const sectionsPresent = useMemo(() => SECTION_ORDER.filter((s) => concepts.some((c) => c.section === s)), [concepts]);
  const [tab, setTab] = useState<AISection>(sectionsPresent[0] ?? 'foundations');
  const [selected, setSelected] = useState<AIConcept | null>(null);

  const activeTab = sectionsPresent.includes(tab) ? tab : sectionsPresent[0];
  const items = concepts.filter((c) => c.section === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {sectionsPresent.map((s) => {
          const meta = SECTION_META[s];
          const Icon = meta.icon;
          return (
            <button key={s} onClick={() => setTab(s)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${activeTab === s ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'border-slate-200 dark:border-slate-800 hover:border-primary-300'}`}>
              <Icon className="w-3.5 h-3.5" /> {meta.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <button key={item.id} onClick={() => setSelected(item)} className="text-left glass-card rounded-2xl p-5 space-y-2 hover:border-primary-400 hover:-translate-y-0.5 transition-all">
            <h3 className="font-bold text-sm">{item.name}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{item.tagline}</p>
            {item.playgroundType !== 'none' && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary-600"><Sparkles className="w-3 h-3" /> Try it yourself</span>
            )}
          </button>
        ))}
      </div>

      {selected && <ConceptDetailModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function ConceptDetailModal({ item, onClose }: { item: AIConcept; onClose: () => void }) {
  const fullNarration = [item.name, item.overview, item.howItWorks.join(' ')].join(' ');
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

        <Section icon={<ListChecks className="w-4 h-4 text-primary-600" />} title="How It Actually Works">
          <ol className="space-y-2">
            {item.howItWorks.map((s, i) => (
              <li key={i} className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex gap-2">
                <span className="w-5 h-5 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </Section>

        {item.playgroundType !== 'none' && <AIFoundationStage type={item.playgroundType} />}

        <Section icon={<Sparkles className="w-4 h-4 text-primary-600" />} title="Worth Knowing">
          <ul className="space-y-2">
            {item.keyFacts.map((f, i) => (
              <li key={i} className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex gap-2">
                <span className="text-primary-600 font-bold shrink-0">&bull;</span><span>{f}</span>
              </li>
            ))}
          </ul>
        </Section>

        {item.realExamples.length > 0 && (
          <Section icon={<Briefcase className="w-4 h-4 text-accent-600" />} title="Real Examples">
            <ul className="space-y-1.5">
              {item.realExamples.map((u, i) => (
                <li key={i} className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex gap-2">
                  <span className="text-accent-600 font-bold shrink-0">&bull;</span><span>{u}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}
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
