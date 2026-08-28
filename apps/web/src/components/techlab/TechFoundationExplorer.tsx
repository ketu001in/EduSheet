'use client';
import { useState } from 'react';
import { X, Sparkles, ListChecks, Globe2 } from 'lucide-react';
import { TechFoundationConcept } from '@edusheets/content';
import SpeakButton from '@/components/labshared/SpeakButton';
import TechFoundationStage from '@/components/techlab/TechFoundationStage';

// Shared explorer UI for AI Lab and Coding Lab -- deliberately simpler than
// Robotics Lab's Fundamentals Explorer (no sections/tabs), since both are
// intentionally kept foundational at this stage. Same bar as everywhere
// else though: real facts, and a genuine formula-backed interactive
// wherever the underlying concept actually has one (Perceptron, Linear vs
// Binary Search) rather than everywhere for its own sake.
export default function TechFoundationExplorer({ concepts }: { concepts: TechFoundationConcept[] }) {
  const [selected, setSelected] = useState<TechFoundationConcept | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {concepts.map((c) => (
        <button key={c.id} onClick={() => setSelected(c)} className="text-left glass-card rounded-2xl p-5 space-y-2 hover:border-primary-400 hover:-translate-y-0.5 transition-all">
          <h3 className="font-bold text-sm">{c.name}</h3>
          <p className="text-xs text-slate-500 leading-relaxed">{c.tagline}</p>
          {c.playgroundType !== 'none' && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary-600"><Sparkles className="w-3 h-3" /> Try it live</span>
          )}
        </button>
      ))}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative w-full sm:max-w-3xl max-h-[92vh] sm:max-h-[88vh] overflow-y-auto bg-surface-light dark:bg-surface-dark rounded-t-3xl sm:rounded-3xl border-2 border-slate-900 dark:border-slate-700 shadow-2xl p-5 md:p-7 space-y-5">
            <button onClick={() => setSelected(null)} aria-label="Close" className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700">
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start justify-between gap-3 pr-8">
              <div>
                <h2 className="font-display text-2xl font-bold">{selected.name}</h2>
                <p className="text-sm text-primary-600 dark:text-primary-400 font-semibold">{selected.tagline}</p>
              </div>
              <SpeakButton label="Listen" text={[selected.name, selected.overview, selected.howItWorks.join(' ')].join(' ')} />
            </div>

            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">{selected.overview}</p>

            <Section icon={<ListChecks className="w-4 h-4 text-primary-600" />} title="How It Actually Works">
              <ol className="space-y-2">
                {selected.howItWorks.map((s, i) => (
                  <li key={i} className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </Section>

            {selected.playgroundType !== 'none' && <TechFoundationStage type={selected.playgroundType} />}

            <Section icon={<Sparkles className="w-4 h-4 text-primary-600" />} title="Worth Knowing">
              <ul className="space-y-2">
                {selected.keyFacts.map((f, i) => (
                  <li key={i} className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex gap-2">
                    <span className="text-primary-600 font-bold shrink-0">&bull;</span><span>{f}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section icon={<Globe2 className="w-4 h-4 text-accent-600" />} title="Real Examples">
              <ul className="space-y-1.5">
                {selected.realExamples.map((e, i) => (
                  <li key={i} className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex gap-2">
                    <span className="text-accent-600 font-bold shrink-0">&bull;</span><span>{e}</span>
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        </div>
      )}
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
