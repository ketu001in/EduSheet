'use client';
import { Sparkles, History, Globe2, AlertTriangle, ShieldAlert, ArrowRight } from 'lucide-react';
import { DeepDiveContent } from '@edusheets/content';
import RotatableImageCard from './RotatableImageCard';
import SpeakButton from './SpeakButton';
import ChemConceptPlayground from '@/components/chemlab/ChemConceptPlayground';
import { useDeepDives } from '@/lib/useDeepDives';

// The actual content renderer for a Deep Dive -- pure presentation, no
// modal/open-state logic of its own (see DeepDiveTrigger.tsx for that), so
// it can be dropped into a modal, a slide-over, or eventually a dedicated
// page without change. This is the "everything worth knowing" layer every
// lab's items now share: overview, real facts beyond the curriculum-minimum
// card, history, real-world applications, common misconceptions, safety,
// an optional hold-and-rotate real object view, an optional interactive
// playground, and links to keep exploring related topics.
export default function TopicDeepDive({ entry, onNavigate }: { entry: DeepDiveContent; onNavigate: (id: string) => void }) {
  const all = useDeepDives();
  const titleFor = (id: string) => all.find((d) => d.id === id)?.title || id;
  const fullNarration = [
    entry.title, entry.overview,
    entry.deepFacts.join(' '),
    entry.history,
    entry.realWorldApplications.join(' '),
  ].filter(Boolean).join(' ');

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="font-display text-2xl font-bold">{entry.title}</h2>
          <p className="text-sm text-primary-600 dark:text-primary-400 font-semibold">{entry.tagline}</p>
        </div>
        <SpeakButton label="Listen to All" text={fullNarration} />
      </div>

      {entry.visualType === 'rotate-3d' && entry.imageSrc && (
        <RotatableImageCard imageSrc={entry.imageSrc} imageAlt={entry.imageAlt || entry.title} credit={entry.credit} />
      )}

      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">{entry.overview}</p>

      {entry.deepFacts.length > 0 && (
        <Section icon={<Sparkles className="w-4 h-4 text-primary-600" />} title="Worth Knowing">
          <ul className="space-y-2">
            {entry.deepFacts.map((f, i) => (
              <li key={i} className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex gap-2">
                <span className="text-primary-600 font-bold shrink-0">&bull;</span><span>{f}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {entry.history && (
        <Section icon={<History className="w-4 h-4 text-amber-500" />} title="History">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{entry.history}</p>
        </Section>
      )}

      {entry.realWorldApplications.length > 0 && (
        <Section icon={<Globe2 className="w-4 h-4 text-accent-600" />} title="Real-World Applications">
          <ul className="space-y-2">
            {entry.realWorldApplications.map((a, i) => (
              <li key={i} className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex gap-2">
                <span className="text-accent-600 font-bold shrink-0">&bull;</span><span>{a}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {entry.commonMisconceptions && entry.commonMisconceptions.length > 0 && (
        <Section icon={<AlertTriangle className="w-4 h-4 text-rose-500" />} title="Common Misconceptions">
          <ul className="space-y-2">
            {entry.commonMisconceptions.map((m, i) => (
              <li key={i} className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-rose-50 dark:bg-rose-950/20 rounded-xl p-3">{m}</li>
            ))}
          </ul>
        </Section>
      )}

      {entry.safetyNotes && (
        <div className="flex items-start gap-2.5 bg-amber-50 dark:bg-amber-950/20 rounded-2xl p-4">
          <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{entry.safetyNotes}</p>
        </div>
      )}

      {entry.lab === 'chemistry' && entry.playgroundType && (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <ChemConceptPlayground type={entry.playgroundType as any} />
      )}

      {entry.relatedIds.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-bold text-sm">Keep Exploring</h4>
          <div className="flex flex-wrap gap-2">
            {entry.relatedIds.map((rid) => (
              <button
                key={rid}
                onClick={() => onNavigate(rid)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border-2 border-slate-200 dark:border-slate-800 hover:border-primary-400 hover:text-primary-600 transition-all"
              >
                {titleFor(rid)} <ArrowRight className="w-3 h-3" />
              </button>
            ))}
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
