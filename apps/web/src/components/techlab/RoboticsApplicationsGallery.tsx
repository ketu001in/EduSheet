'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  X, Bot, Factory, Sprout, HeartPulse, Rocket, Home as HomeIcon,
  ShieldAlert, Car, Users, Sparkles, ListChecks, Building2, Briefcase,
} from 'lucide-react';
import { ROBOTICS_APPLICATIONS, ROBOTICS_CATEGORY_LABEL, RoboticsApplication, RoboticsCategory } from '@edusheets/content';
import { useContent } from '@/lib/useContent';
import SpeakButton from '@/components/labshared/SpeakButton';
import RoboticsStage from '@/components/techlab/RoboticsStage';

// See RoboticsFundamentalsExplorer.tsx for why this is dynamically
// imported with ssr:false -- Three.js only loads when a modal with a
// real 3D model is actually opened.
const Model3DViewer = dynamic(() => import('@/components/labshared/Model3DViewer'), {
  ssr: false,
  loading: () => <div className="h-[260px] rounded-2xl bg-slate-50 dark:bg-slate-900/40 animate-pulse" />,
});

const CATEGORY_ICON: Record<RoboticsCategory, typeof Bot> = {
  industrial: Factory, agriculture: Sprout, medical: HeartPulse, space: Rocket,
  home: HomeIcon, 'disaster-safety': ShieldAlert, transportation: Car, 'swarm-social': Users,
};

// "Where this actually gets used" -- the complementary second half of
// Robotics Lab, alongside RoboticsFundamentalsExplorer (the study-level
// sensors/actuators/control-theory core). 24 real robots doing real jobs
// in the world today, each genuinely playable via RoboticsStage.
export default function RoboticsApplicationsGallery() {
  const applications = useContent('robotics-application', ROBOTICS_APPLICATIONS);
  const [activeCategory, setActiveCategory] = useState<RoboticsCategory | 'all'>('all');
  const [selected, setSelected] = useState<RoboticsApplication | null>(null);

  const categories = Object.keys(ROBOTICS_CATEGORY_LABEL) as RoboticsCategory[];
  const shown = activeCategory === 'all' ? applications : applications.filter((a) => a.category === activeCategory);

  return (
    <div className="space-y-6">
      <p className="text-slate-500 text-sm max-w-2xl">
        Real robots doing real jobs today -- in factories, farms, hospitals, on Mars, and in your own living room. Click a card for how it actually works, then try the simulation.
      </p>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setActiveCategory('all')} className={categoryBtn(activeCategory === 'all')}>All ({applications.length})</button>
        {categories.map((c) => {
          const Icon = CATEGORY_ICON[c];
          const count = applications.filter((a) => a.category === c).length;
          return (
            <button key={c} onClick={() => setActiveCategory(c)} className={categoryBtn(activeCategory === c)}>
              <Icon className="w-3.5 h-3.5" /> {ROBOTICS_CATEGORY_LABEL[c]} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shown.map((app) => {
          const Icon = CATEGORY_ICON[app.category];
          return (
            <button key={app.id} onClick={() => setSelected(app)} className="text-left glass-card rounded-2xl p-5 space-y-2.5 hover:border-primary-400 hover:-translate-y-0.5 transition-all">
              <div className="w-11 h-11 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm">{app.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{app.tagline}</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary-600">
                <Sparkles className="w-3 h-3" /> Play the simulation
              </span>
            </button>
          );
        })}
      </div>

      {selected && <RoboticsDetailModal app={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function categoryBtn(active: boolean) {
  return `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${active ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'border-slate-200 dark:border-slate-800 hover:border-primary-300'}`;
}

function RoboticsDetailModal({ app, onClose }: { app: RoboticsApplication; onClose: () => void }) {
  const Icon = CATEGORY_ICON[app.category];
  const fullNarration = [app.name, app.overview, app.howItWorks.join(' '), app.realWorldImpact].join(' ');

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-3xl max-h-[92vh] sm:max-h-[88vh] overflow-y-auto bg-surface-light dark:bg-surface-dark rounded-t-3xl sm:rounded-3xl border-2 border-slate-900 dark:border-slate-700 shadow-2xl p-5 md:p-7 space-y-5">
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700">
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3 pr-8">
          <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center shrink-0">
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-2xl font-bold">{app.name}</h2>
            <p className="text-sm text-primary-600 dark:text-primary-400 font-semibold">{app.tagline}</p>
          </div>
          <SpeakButton label="Listen" text={fullNarration} />
        </div>

        {app.model3d && (
          <div className="space-y-1">
            <Model3DViewer src={app.model3d.src} alt={app.name} />
            <p className="text-center text-[10px] text-slate-400">
              3D model: {app.model3d.credit.author} &middot; {app.model3d.credit.license} &middot;{' '}
              <a href={app.model3d.credit.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary-600">Source</a>
            </p>
          </div>
        )}

        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">{app.overview}</p>

        <Section icon={<ListChecks className="w-4 h-4 text-primary-600" />} title="How It Actually Works">
          <ol className="space-y-2">
            {app.howItWorks.map((s, i) => (
              <li key={i} className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex gap-2">
                <span className="w-5 h-5 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </Section>

        <div className="rounded-2xl border-2 border-dashed border-primary-300 dark:border-primary-800 bg-primary-50/40 dark:bg-primary-950/10 p-4 md:p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-primary-700 dark:text-primary-300">
            <Sparkles className="w-4 h-4" /> Try It Yourself
          </div>
          <RoboticsStage type={app.playgroundType} config={app.playgroundConfig} />
        </div>

        <Section icon={<Building2 className="w-4 h-4 text-accent-600" />} title="Real Examples">
          <ul className="space-y-1.5">
            {app.realExamples.map((e, i) => (
              <li key={i} className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex gap-2">
                <span className="text-accent-600 font-bold shrink-0">&bull;</span><span>{e}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={<Sparkles className="w-4 h-4 text-primary-600" />} title="Worth Knowing">
          <ul className="space-y-2">
            {app.deepFacts.map((f, i) => (
              <li key={i} className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex gap-2">
                <span className="text-primary-600 font-bold shrink-0">&bull;</span><span>{f}</span>
              </li>
            ))}
          </ul>
        </Section>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Real-World Impact</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{app.realWorldImpact}</p>
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1"><Briefcase className="w-3 h-3" /> Careers &amp; Futures</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{app.careersAndFutures}</p>
          </div>
        </div>

        <p className="text-xs text-slate-400 bg-amber-50 dark:bg-amber-950/20 rounded-xl p-3">
          <span className="font-bold">Curriculum tie-in:</span> {app.curriculumTie}
        </p>
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
