'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Waves, Play, Pause, RotateCcw, Lightbulb } from 'lucide-react';
import { PHYSICS_EXPERIMENTS, PhysicsSimType } from '@edusheets/content';
import PhysicsStage from '@/components/physicslab/PhysicsStage';
import Tilt3DCard from '@/components/labshared/Tilt3DCard';
import ModernSlider from '@/components/labshared/ModernSlider';

const SIM_TABS: { simType: PhysicsSimType; label: string }[] = [
  { simType: 'pendulum', label: 'Pendulum' },
  { simType: 'spring', label: 'Spring / SHM' },
  { simType: 'projectile', label: 'Projectile' },
  { simType: 'lever', label: 'Lever' },
  { simType: 'buoyancy', label: 'Sink or Float' },
  { simType: 'circuit', label: 'Circuit' },
  { simType: 'mirror', label: 'Mirror' },
  { simType: 'magnet', label: 'Magnets' },
];

const RULE_CALLOUTS: Record<PhysicsSimType, string[]> = {
  pendulum: [
    "A pendulum's time period doesn't depend on its mass -- try it! Swap a heavy bob for a light one at the same length.",
    'Doubling the length does NOT double the period -- it multiplies it by only √2 ≈ 1.41, since T is proportional to √L, not L.',
    'On the Moon, gravity is about 1/6th of Earth\'s -- the same pendulum would swing much slower there.',
  ],
  spring: [
    "A stiffer spring (higher k) oscillates faster, while more mass oscillates slower -- try changing each one separately to see why.",
    "Hooke's Law only holds up to the spring's elastic limit -- stretch a real spring too far and it stops obeying F=-kx.",
    'The period of a mass-spring system does not depend on how far you pull it before releasing -- only on mass and spring constant.',
  ],
  projectile: [
    '45 degrees gives the maximum range for a given launch speed -- but any two angles that add up to 90° give the SAME range.',
    'Horizontal and vertical motion are totally independent -- gravity only ever affects the vertical part.',
    'Doubling the launch speed doesn\'t just double the range -- range depends on speed SQUARED, so it actually quadruples.',
  ],
  lever: [
    'A lever balances when Force x Distance is equal on both sides -- a light weight far from the pivot can balance a heavy weight close to it.',
    'This is why a long crowbar lets you lift a heavy rock with far less force than lifting it directly.',
    'Try keeping the moments equal but changing BOTH the force and distance on one side -- it still balances!',
  ],
  buoyancy: [
    'Whether something floats depends on its DENSITY compared to the fluid, not its total weight.',
    'A massive steel ship floats because its hollow shape gives it a low average density, even though solid steel sinks.',
    'Try making the fluid denser than the object (like salt water) -- a sinking object can start floating again!',
  ],
  circuit: [
    'Double the resistance and the current is cut exactly in half -- current is inversely proportional to resistance.',
    'Double the voltage and the current doubles too -- current is directly proportional to voltage.',
    'Watch the bulb brightness -- it changes together with the current flowing through it.',
  ],
  mirror: [
    'The angle of incidence always exactly equals the angle of reflection -- try any angle and check.',
    'As the incident ray gets closer to hitting the mirror straight-on (0°), the reflected ray does too.',
    'This exact law is what lets a periscope let you see over a wall using two angled mirrors.',
  ],
  magnet: [
    'Like poles (N-N or S-S) always repel -- unlike poles (N-S) always attract. No exceptions.',
    'Every magnet has both a North and South pole -- cut one in half and you get two smaller magnets, each with both poles again.',
    'Maglev trains use powerful versions of this exact repulsion to float above the track with almost no friction.',
  ],
};

export default function PhysicsPlaygroundPage() {
  const [simType, setSimType] = useState<PhysicsSimType>('pendulum');
  const activeExperiment = useMemo(() => PHYSICS_EXPERIMENTS.find((e) => e.simType === simType) || PHYSICS_EXPERIMENTS[0], [simType]);
  const [params, setParams] = useState<Record<string, number>>(activeExperiment.defaultParams);
  const [running, setRunning] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [smallAngle, setSmallAngle] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);
  const [calloutIndex, setCalloutIndex] = useState(0);

  useEffect(() => {
    setParams(activeExperiment.defaultParams);
    setResetKey((k) => k + 1);
    setRunning(true);
    setCalloutIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simType]);

  useEffect(() => {
    const id = setInterval(() => {
      setCalloutIndex((i) => (i + 1) % RULE_CALLOUTS[simType].length);
    }, 7000);
    return () => clearInterval(id);
  }, [simType]);

  const formulaReadout = activeExperiment.formulaVars
    .map((key) => {
      const cfg = activeExperiment.paramConfig.find((p) => p.key === key);
      const val = params[key] ?? activeExperiment.defaultParams[key];
      return `${cfg?.label || key} = ${val}${cfg?.unit || ''}`;
    })
    .join(',  ');

  return (
    <div className="max-w-3xl mx-auto pb-16 space-y-6">
      <div className="px-3 py-2 rounded-xl bg-bg-light dark:bg-bg-dark border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
        <Link href="/physics-lab" className="text-sm font-medium text-slate-500 hover:text-primary-600 flex items-center gap-1.5">
          <ChevronLeft className="w-4 h-4" /> Back to Physics Lab
        </Link>
      </div>

      <div>
        <h1 className="font-display text-3xl font-semibold mb-2 flex items-center gap-2"><Waves className="w-7 h-7 text-primary-600" /> Free Play Sandbox</h1>
        <p className="text-slate-500 text-sm">No script, no grading -- just drag every slider and watch real physics respond, live.</p>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {SIM_TABS.map((tab) => (
          <Tilt3DCard
            key={tab.simType}
            active={simType === tab.simType}
            onClick={() => setSimType(tab.simType)}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold ${simType === tab.simType ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}`}
          >
            {tab.label}
          </Tilt3DCard>
        ))}
      </div>

      <PhysicsStage
        simType={activeExperiment.simType}
        params={params}
        running={running}
        resetKey={resetKey}
        apparatusIds={activeExperiment.apparatusIds}
        smallAngle={smallAngle}
        showOverlay={showOverlay}
      />

      <div className="glass-card rounded-2xl p-4 flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => setRunning((r) => !r)} className="p-2.5 rounded-xl bg-primary-600 text-white hover:bg-primary-500">
            {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button onClick={() => setResetKey((k) => k + 1)} className="p-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 hover:border-primary-400">
            <RotateCcw className="w-4 h-4" />
          </button>
          {activeExperiment.hasSmallAngleToggle && (
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 ml-2">
              <input type="checkbox" checked={!smallAngle} onChange={(e) => { setSmallAngle(!e.target.checked); setResetKey((k) => k + 1); }} /> Full nonlinear model
            </label>
          )}
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 ml-2">
            <input type="checkbox" checked={showOverlay} onChange={(e) => setShowOverlay(e.target.checked)} /> Energy overlay
          </label>
        </div>
        <p className="text-xs font-mono text-slate-400">{activeExperiment.formula} &nbsp;|&nbsp; {formulaReadout}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 glass-card rounded-2xl p-4">
        {activeExperiment.paramConfig.map((pc) => (
          <ModernSlider
            key={pc.key}
            label={pc.label}
            unit={pc.unit}
            min={pc.min}
            max={pc.max}
            step={pc.step}
            value={params[pc.key] ?? activeExperiment.defaultParams[pc.key]}
            onChange={(v) => setParams((prev) => ({ ...prev, [pc.key]: v }))}
          />
        ))}
      </div>

      <div className="glass-card rounded-2xl p-5 flex items-start gap-3 bg-amber-50/50 dark:bg-amber-950/10">
        <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-slate-600 dark:text-slate-300">{RULE_CALLOUTS[simType][calloutIndex]}</p>
      </div>
    </div>
  );
}
