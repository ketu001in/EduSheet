'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Zap, Wrench, Activity, Sparkles, CheckCircle2, ShieldAlert, Lightbulb, Info } from 'lucide-react';
import { ELECTRONICS_COMPONENTS, ELECTRONICS_PROJECTS, ELECTRONICS_CATEGORY_LABELS, ELECTRONICS_CATEGORY_ACCENT } from '@edusheets/content';
import Tilt3DCard from '@/components/labshared/Tilt3DCard';
import SpeakButton from '@/components/labshared/SpeakButton';
import { playSelectChime } from '@/lib/uiSoundEngine';
import { astable555 } from '@/lib/circuitEngine';
import ElectronicsComponentModal from '@/components/electronicslab/ElectronicsComponentModal';
import BreadboardWorkbench from '@/components/electronicslab/BreadboardWorkbench';
import type { DrawerCategory } from '@/components/electronicslab/ElectronicsCupboard3DScene';

const ElectronicsCupboard3DScene = dynamic(() => import('@/components/electronicslab/ElectronicsCupboard3DScene'), {
  ssr: false,
  loading: () => <div className="w-full h-[330px] rounded-2xl bg-slate-50 dark:bg-slate-900/40 animate-pulse" />,
});

type Tab = 'cupboard' | 'projects';

// Electronics Lab -- Phase 1. The Component Cupboard (real 3D, clickable,
// sound) is fully live. The Projects tab shows the LED Blinker's complete,
// hand-verified content (circuit, steps, real formula-driven timing,
// Force section, real-world use) -- the actual drag-and-drop breadboard
// workbench (wiring components together yourself) is the next build step,
// clearly flagged below rather than silently missing.
export default function ElectronicsLabPage() {
  const [tab, setTab] = useState<Tab>('cupboard');
  const [hoveredDrawerId, setHoveredDrawerId] = useState<string | null>(null);
  const [openDrawerId, setOpenDrawerId] = useState<string | null>(null);
  const [openComponentId, setOpenComponentId] = useState<string | null>(null);
  const [activeProjectId, setActiveProjectId] = useState(ELECTRONICS_PROJECTS[0]?.id);

  const activeProject = ELECTRONICS_PROJECTS.find((p) => p.id === activeProjectId) || ELECTRONICS_PROJECTS[0];
  const switchTab = (t: Tab) => { setTab(t); playSelectChime(); };

  const categories: DrawerCategory[] = Object.entries(ELECTRONICS_CATEGORY_LABELS).map(([id, label]) => ({
    id, label, accentHex: ELECTRONICS_CATEGORY_ACCENT[id] || '#94a3b8',
    count: ELECTRONICS_COMPONENTS.filter((c) => c.category === id).length,
  }));
  const openComponent = openComponentId ? ELECTRONICS_COMPONENTS.find((c) => c.id === openComponentId) || null : null;

  const clickDrawer = (id: string) => {
    setOpenDrawerId((prev) => (prev === id ? null : id));
    playSelectChime();
  };

  return (
    <div className="max-w-7xl mx-auto pb-16 space-y-6">
      <div>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <h1 className="font-display text-3xl font-semibold mb-2 flex items-center gap-2"><Zap className="w-7 h-7 text-primary-600" /> Electronics Lab</h1>
          <SpeakButton text="Welcome to Electronics Lab! Browse the component cupboard to learn about every real part, then step into the Simulation Lab: wire a real breadboard circuit and read its real behavior on a live oscilloscope -- real Ohm's Law, real component thresholds, and real timer formulas." />
        </div>
        <p className="text-slate-500 text-sm">A real component cupboard and a real Simulation Lab -- wire a real breadboard circuit and probe it with a real, live oscilloscope. Every formula and every component threshold here is real and verified, the same standard as every other lab.</p>
      </div>

      <div className="flex flex-wrap gap-2.5">
        <Tilt3DCard active={tab === 'cupboard'} onClick={() => switchTab('cupboard')} className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 ${tab === 'cupboard' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}`}>
          <Wrench className="w-4 h-4" /> Component Cupboard
        </Tilt3DCard>
        <Tilt3DCard active={tab === 'projects'} onClick={() => switchTab('projects')} className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 ${tab === 'projects' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}`}>
          <Activity className="w-4 h-4" /> Simulation Lab
        </Tilt3DCard>
      </div>

      {tab === 'cupboard' && (
        <div className="space-y-3">
          <p className="text-sm text-slate-500">
            {openDrawerId ? `${ELECTRONICS_CATEGORY_LABELS[openDrawerId]} -- click any part inside the drawer to see it in 3D with full detail.` : 'Click a drawer to slide it open. Every real value is in there, not just one example part per category.'}
          </p>
          <ElectronicsCupboard3DScene
            categories={categories}
            items={ELECTRONICS_COMPONENTS}
            openId={openDrawerId}
            hoveredId={hoveredDrawerId}
            onHover={setHoveredDrawerId}
            onUnhover={() => setHoveredDrawerId(null)}
            onClick={clickDrawer}
            onPickItem={(id) => { setOpenComponentId(id); playSelectChime(); }}
            height={420}
          />

          {openComponent && (
            <ElectronicsComponentModal component={openComponent} onClose={() => setOpenComponentId(null)} />
          )}
        </div>
      )}

      {tab === 'projects' && activeProject && (
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4">
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {ELECTRONICS_PROJECTS.map((p) => {
              const isSandbox = p.id === 'free-play-sandbox';
              return (
                <button
                  key={p.id}
                  onClick={() => { setActiveProjectId(p.id); playSelectChime(); }}
                  className={`shrink-0 md:shrink text-left px-3.5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all whitespace-nowrap md:whitespace-normal flex items-center gap-1.5 ${
                    activeProjectId === p.id
                      ? isSandbox ? 'border-slate-900 bg-accent-600 text-white shadow-[3px_3px_0_var(--color-ink)]' : 'border-slate-900 bg-primary-600 text-white shadow-[3px_3px_0_var(--color-ink)]'
                      : isSandbox ? 'border-slate-900 dark:border-slate-700 bg-accent-50 dark:bg-accent-950/20 text-accent-700 dark:text-accent-400 hover:shadow-[3px_3px_0_var(--color-ink)]'
                      : 'border-slate-900 dark:border-slate-700 bg-surface-light dark:bg-surface-dark hover:shadow-[3px_3px_0_var(--color-ink)]'
                  }`}
                >
                  {isSandbox && <Sparkles className="w-3.5 h-3.5 shrink-0" />}
                  {p.title}
                </button>
              );
            })}
          </div>

          <div className="glass-card rounded-3xl p-5 md:p-7 space-y-5">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <h3 className="font-display text-xl font-semibold">{activeProject.title}</h3>
              <span className="px-2.5 py-1 rounded-full bg-accent-50 dark:bg-accent-950/30 text-accent-700 dark:text-accent-400 text-[11px] font-bold">
                {activeProject.id === 'free-play-sandbox' ? 'Free play -- nothing pre-built, build anything real' : 'Live simulation -- wire it, probe it, watch it work'}
              </span>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300">{activeProject.purpose}</p>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">
              <p className="text-xs font-bold text-primary-600 uppercase tracking-wide mb-1.5">Working Model</p>
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{activeProject.workingModelDescription}</p>
            </div>

            <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
              <Sparkles className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
              <p><strong className="text-slate-900 dark:text-white">Force at work:</strong> {activeProject.forceSection}</p>
            </div>

            {activeProject.simulationHonestyNote && (
              <div className="flex items-start gap-2 text-sm bg-blue-50 dark:bg-blue-950/20 rounded-2xl p-4">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-blue-900/90 dark:text-blue-200/90"><strong className="text-blue-700 dark:text-blue-400">Honestly, what this simulation does and doesn't do:</strong> {activeProject.simulationHonestyNote}</p>
              </div>
            )}

            <div className="glass-card rounded-2xl p-4 border-2 border-slate-900 dark:border-slate-700">
              <h4 className="font-bold text-sm mb-2 flex items-center gap-1.5"><Wrench className="w-4 h-4 text-primary-600" /> Simulation Workbench &amp; Oscilloscope</h4>
              <BreadboardWorkbench project={activeProject} />
            </div>

            {activeProject.id === 'led-blinker-555' && (() => {
              // Real values come from the actual referenced catalog parts
              // (a project's placement just says WHICH real resistor/
              // capacitor it uses, by id) -- never a magic fallback number
              // that could silently drift out of sync with the catalog.
              const valueOf = (instanceId: string) => {
                const placement = activeProject.referenceCircuit.placements.find((p) => p.instanceId === instanceId);
                return ELECTRONICS_COMPONENTS.find((c) => c.id === placement?.componentId)?.electrical;
              };
              const r1 = valueOf('r1')?.resistanceOhms ?? 0;
              const r2 = valueOf('r2')?.resistanceOhms ?? 0;
              const cap = valueOf('cap1')?.capacitanceFarads ?? 0;
              const timing = astable555(r1, r2, cap);
              return (
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl bg-primary-50 dark:bg-primary-900/20 p-3">
                    <p className="text-[10px] font-bold text-primary-600 uppercase">Blink Rate</p>
                    <p className="font-mono font-bold">{timing.frequencyHz.toFixed(2)} Hz</p>
                  </div>
                  <div className="rounded-xl bg-accent-50 dark:bg-accent-900/20 p-3">
                    <p className="text-[10px] font-bold text-accent-600 uppercase">On Time</p>
                    <p className="font-mono font-bold">{timing.highTimeSeconds.toFixed(2)}s</p>
                  </div>
                  <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 p-3">
                    <p className="text-[10px] font-bold text-amber-600 uppercase">Off Time</p>
                    <p className="font-mono font-bold">{timing.lowTimeSeconds.toFixed(2)}s</p>
                  </div>
                </div>
              );
            })()}

            {activeProject.buildSteps.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-bold text-sm">Build Steps</h4>
                <ol className="space-y-2">
                  {activeProject.buildSteps.map((s) => (
                    <li key={s.number} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-900/30 rounded-xl p-3">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-primary-600 text-white text-[11px] font-bold flex items-center justify-center mt-0.5">{s.number}</span>
                      <span>{s.instruction}{s.hint && <span className="block text-xs text-slate-400 mt-1">Hint: {s.hint}</span>}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div>
              <h4 className="font-bold text-sm mb-1.5 flex items-center gap-1.5"><Lightbulb className="w-4 h-4 text-amber-500" /> Real-World Use</h4>
              <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                {activeProject.realWorldUse.map((u, i) => <li key={i}>{u}</li>)}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-1.5 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-accent-600" /> Extensions</h4>
              <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                {activeProject.extensions.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>

            {activeProject.safetyNotes.length > 0 && (
              <div className="bg-red-50 dark:bg-red-950/20 rounded-2xl p-4">
                <p className="text-xs font-bold text-red-700 dark:text-red-400 uppercase mb-1 flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5" /> Safety Notes</p>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1 list-disc list-inside">
                  {activeProject.safetyNotes.map((n, i) => <li key={i}>{n}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
