'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  X, Sparkles, ListChecks, Briefcase, Radio, Cog, Cpu as CpuIcon,
  Settings2, Zap as ZapIcon, ScrollText, History as HistoryIcon,
} from 'lucide-react';
import {
  ROBOTICS_SENSORS, ROBOTICS_ACTUATORS, ROBOTICS_CONTROL_SYSTEMS, ROBOTICS_MECHANISMS,
  ROBOTICS_ELECTRONICS, ROBOTICS_CLASSIFICATION, ROBOTICS_HISTORY,
  RoboticsFundamental, RoboticsFundamentalSection,
} from '@edusheets/content';
import { useContent } from '@/lib/useContent';
import SpeakButton from '@/components/labshared/SpeakButton';
import RoboticsFundamentalStage from '@/components/techlab/RoboticsFundamentalStage';

// Dynamically imported (ssr:false) so Three.js -- a genuinely large
// library -- only loads for a visitor who actually opens a detail modal,
// not on every Robotics Lab page view. WebGL also has no meaningful
// server-side representation, so ssr:false is correct here regardless.
const Robot3DViewer = dynamic(() => import('@/components/labshared/Robot3DViewer'), {
  ssr: false,
  loading: () => <div className="h-[260px] rounded-2xl bg-slate-50 dark:bg-slate-900/40 animate-pulse" />,
});

type TabId = RoboticsFundamentalSection | 'classification' | 'history';

const TABS: { id: TabId; label: string; icon: typeof Radio }[] = [
  { id: 'sensors', label: 'Sensors', icon: Radio },
  { id: 'actuators', label: 'Actuators', icon: Cog },
  { id: 'control-systems', label: 'Control Systems', icon: CpuIcon },
  { id: 'mechanisms', label: 'Mechanisms', icon: Settings2 },
  { id: 'electronics', label: 'Electronics', icon: ZapIcon },
  { id: 'classification', label: 'Robot Classification', icon: ScrollText },
  { id: 'history', label: 'History & Milestones', icon: HistoryIcon },
];

// The study-level core of Robotics Lab -- direct response to feedback that
// the application gallery alone "looks irrelevant and very far from the
// requirement" and needed real academic depth: real sensor/actuator specs,
// real control theory, real mechanism math, real electronics, and the
// actual classification system and history robotics engineering courses
// teach -- not a list of famous robots. See roboticsFundamentals.ts's
// header for the full rationale.
export default function RoboticsFundamentalsExplorer() {
  const [tab, setTab] = useState<TabId>('sensors');
  const [selected, setSelected] = useState<RoboticsFundamental | null>(null);

  const sensors = useContent('robotics-sensor', ROBOTICS_SENSORS);
  const actuators = useContent('robotics-actuator', ROBOTICS_ACTUATORS);
  const controlSystems = useContent('robotics-control-system', ROBOTICS_CONTROL_SYSTEMS);
  const mechanisms = useContent('robotics-mechanism', ROBOTICS_MECHANISMS);
  const electronics = useContent('robotics-electronics', ROBOTICS_ELECTRONICS);
  const classification = useContent('robotics-classification', ROBOTICS_CLASSIFICATION);
  const history = useContent('robotics-history', ROBOTICS_HISTORY);

  const listBySection: Record<RoboticsFundamentalSection, RoboticsFundamental[]> = {
    sensors, actuators, 'control-systems': controlSystems, mechanisms, electronics,
  };

  return (
    <div className="space-y-6">
      <p className="text-slate-500 text-sm max-w-2xl">
        The actual academic subject of robotics -- real sensor datasheets, real actuator control math, real control theory, real mechanism formulas, and the real classification system and history robotics engineering courses teach.
      </p>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${tab === t.id ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'border-slate-200 dark:border-slate-800 hover:border-primary-300'}`}>
              <Icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'classification' ? (
        <ClassificationGrid items={classification} />
      ) : tab === 'history' ? (
        <HistoryTimeline items={history} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listBySection[tab].map((item) => (
            <button key={item.id} onClick={() => setSelected(item)} className="text-left glass-card rounded-2xl p-5 space-y-2 hover:border-primary-400 hover:-translate-y-0.5 transition-all">
              <h3 className="font-bold text-sm">{item.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.tagline}</p>
              {item.playgroundType !== 'none' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary-600"><Sparkles className="w-3 h-3" /> Try the real formula</span>
              )}
            </button>
          ))}
        </div>
      )}

      {selected && <FundamentalDetailModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function ClassificationGrid({ items }: { items: typeof ROBOTICS_CLASSIFICATION }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((c) => (
        <div key={c.id} className="glass-card rounded-2xl p-5 space-y-2.5">
          <h3 className="font-bold text-sm">{c.name}</h3>
          <p className="text-xs text-slate-500 leading-relaxed">{c.definition}</p>
          <ul className="space-y-1">
            {c.characteristics.map((ch, i) => (
              <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex gap-1.5"><span className="text-primary-600 font-bold shrink-0">&bull;</span><span>{ch}</span></li>
            ))}
          </ul>
          <p className="text-xs bg-accent-50 dark:bg-accent-950/20 text-accent-700 dark:text-accent-300 rounded-lg p-2.5"><span className="font-bold">Real example:</span> {c.realExample}</p>
        </div>
      ))}
    </div>
  );
}

function HistoryTimeline({ items }: { items: typeof ROBOTICS_HISTORY }) {
  return (
    <div className="relative space-y-5 pl-6 border-l-2 border-primary-200 dark:border-primary-900">
      {items.map((m) => (
        <div key={m.id} className="relative">
          <span className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-primary-600 border-2 border-white dark:border-slate-950" />
          <p className="text-xs font-bold text-primary-600">{m.year}</p>
          <h3 className="font-bold text-sm">{m.title}</h3>
          <p className="text-xs text-slate-500 leading-relaxed mt-1">{m.description}</p>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2.5"><span className="font-bold">Why it matters:</span> {m.whyItMatters}</p>
        </div>
      ))}
    </div>
  );
}

function FundamentalDetailModal({ item, onClose }: { item: RoboticsFundamental; onClose: () => void }) {
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

        {item.model3d && (
          <div className="space-y-1">
            <Robot3DViewer src={item.model3d.src} alt={item.name} />
            <p className="text-center text-[10px] text-slate-400">
              3D model: {item.model3d.credit.author} &middot; {item.model3d.credit.license} &middot;{' '}
              <a href={item.model3d.credit.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary-600">Source</a>
            </p>
          </div>
        )}

        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">{item.overview}</p>

        {item.realSpecs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {item.realSpecs.map((s, i) => (
              <div key={i} className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase">{s.label}</p>
                <p className="text-xs font-mono text-slate-700 dark:text-slate-200">{s.value}</p>
              </div>
            ))}
          </div>
        )}

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

        {item.playgroundType !== 'none' && (
          <RoboticsFundamentalStage type={item.playgroundType} config={item.playgroundConfig} />
        )}

        <Section icon={<Sparkles className="w-4 h-4 text-primary-600" />} title="Worth Knowing">
          <ul className="space-y-2">
            {item.keyFacts.map((f, i) => (
              <li key={i} className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex gap-2">
                <span className="text-primary-600 font-bold shrink-0">&bull;</span><span>{f}</span>
              </li>
            ))}
          </ul>
        </Section>

        {item.commonUse.length > 0 && (
          <Section icon={<Briefcase className="w-4 h-4 text-accent-600" />} title="Where This Is Actually Used">
            <ul className="space-y-1.5">
              {item.commonUse.map((u, i) => (
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
