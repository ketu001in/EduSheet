'use client';
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import ModernSlider from '@/components/labshared/ModernSlider';
import { cyclicQuadrilateralArea, secantSlope, taxicabRepresentations } from '@/lib/mathHistoryEngine';

// "Try It Yourself" -- one genuine hands-on experiment per historical
// figure, each built directly on an achievement already described (and
// hand-verified) in mathHistoryFigures.ts, not a new unverified claim.
// Read-only portrait+text pages became read-AND-do pages.
function ExperimentCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-slate-900 dark:border-slate-700 bg-surface-light dark:bg-surface-dark p-4 md:p-5 space-y-4">
      <div className="flex items-center gap-1.5 text-xs font-bold text-primary-600 uppercase tracking-wide">
        <Sparkles className="w-3.5 h-3.5" /> Try It Yourself
      </div>
      {children}
    </div>
  );
}

// -- Aryabhata: how close is his value of pi, and how do ancient
// mathematicians measure pi at all? (the inscribed-polygon method shown
// here is the real, general geometric idea -- NOT claimed to be
// Aryabhata's own specific derivation, which isn't fully documented) --
function PiApproximationExperiment() {
  const aryabhataPi = 62832 / 20000;
  const [sides, setSides] = useState(6);
  // A regular n-gon inscribed in a unit circle has half-perimeter
  // n*sin(pi/n), which approaches pi as n grows -- the real geometric
  // method (used historically by Archimedes, among others) for squeezing
  // in on pi by measurement rather than infinite-series calculus.
  const polygonEstimate = sides * Math.sin(Math.PI / sides);
  return (
    <ExperimentCard>
      <p className="text-sm text-slate-600 dark:text-slate-300">Aryabhata stated pi as 62832/20000. See exactly how close that really is, and try the general "measure a polygon inside a circle" method ancient mathematicians used to close in on pi.</p>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-primary-50 dark:bg-primary-900/20 p-3">
          <p className="text-[10px] font-bold text-primary-600 uppercase">Aryabhata</p>
          <p className="font-mono font-bold">{aryabhataPi.toFixed(6)}</p>
        </div>
        <div className="rounded-xl bg-accent-50 dark:bg-accent-900/20 p-3">
          <p className="text-[10px] font-bold text-accent-600 uppercase">Real π</p>
          <p className="font-mono font-bold">{Math.PI.toFixed(6)}</p>
        </div>
        <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 p-3">
          <p className="text-[10px] font-bold text-amber-600 uppercase">Error</p>
          <p className="font-mono font-bold">{Math.abs(aryabhataPi - Math.PI).toExponential(2)}</p>
        </div>
      </div>
      <div className="space-y-2">
        <ModernSlider label="Polygon sides (n)" min={3} max={96} step={1} value={sides} onChange={setSides} />
        <p className="text-center text-sm">An {sides}-sided polygon inside a circle estimates π as <span className="font-mono font-bold text-primary-600">{polygonEstimate.toFixed(6)}</span></p>
      </div>
    </ExperimentCard>
  );
}

// -- Brahmagupta: his real formula, live -- type any 4 side lengths and
// watch the cyclic quadrilateral's area compute instantly, no angles needed.
function CyclicQuadrilateralExperiment() {
  const [a, setA] = useState(25);
  const [b, setB] = useState(39);
  const [c, setC] = useState(52);
  const [d, setD] = useState(60);
  const area = cyclicQuadrilateralArea(a, b, c, d);
  return (
    <ExperimentCard>
      <p className="text-sm text-slate-600 dark:text-slate-300">Type any four side lengths of a cyclic quadrilateral -- Brahmagupta's formula finds its area instantly, with no angles measured at all.</p>
      <div className="grid grid-cols-4 gap-2">
        {[['a', a, setA], ['b', b, setB], ['c', c, setC], ['d', d, setD]].map(([label, val, setter]) => (
          <div key={label as string} className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 block text-center">{label as string}</label>
            <input
              type="number"
              value={val as number}
              min={1}
              onChange={(e) => (setter as (v: number) => void)(parseFloat(e.target.value) || 1)}
              className="w-full rounded-lg border-2 border-slate-200 dark:border-slate-800 bg-transparent p-2 text-center font-mono font-bold focus:border-primary-500 outline-none"
            />
          </div>
        ))}
      </div>
      <p className="text-center font-display text-lg font-semibold">
        {Number.isFinite(area) ? <>Area = <span className="text-primary-600">{area.toFixed(2)}</span></> : <span className="text-amber-600">These four lengths can&apos;t form a real quadrilateral -- try again.</span>}
      </p>
    </ExperimentCard>
  );
}

// -- Bhaskara II: watch a secant line become a tangent line, live -- the
// exact "instantaneous motion" idea his deepDive describes, on y=x^2.
function InstantaneousMotionExperiment() {
  const [x0] = useState(2);
  const [h, setH] = useState(1);
  const slope = secantSlope(x0, h);
  const trueSlope = 2 * x0;
  const VIEW = 300;
  const scale = 30;
  const toSvg = (x: number, y: number) => ({ x: VIEW / 2 + x * scale, y: 260 - y * scale * 0.5 });
  const f = (x: number) => x * x;
  const curvePoints = Array.from({ length: 41 }, (_, i) => {
    const x = x0 - 3 + (i / 40) * 6;
    return toSvg(x, f(x));
  });
  const pathD = 'M ' + curvePoints.map((p) => `${p.x},${p.y}`).join(' L ');
  const P = toSvg(x0, f(x0));
  const Q = toSvg(x0 + h, f(x0 + h));
  return (
    <ExperimentCard>
      <p className="text-sm text-slate-600 dark:text-slate-300">Drag the slider to bring point Q closer to point P on the curve y = x². Watch the secant line&apos;s slope approach the true &quot;instantaneous&quot; slope at P -- exactly the idea Bhaskara II described centuries before calculus was formalized.</p>
      <svg viewBox={`0 0 ${VIEW} 280`} className="w-full max-w-sm mx-auto rounded-2xl bg-slate-50 dark:bg-slate-900/40 border-2 border-slate-200 dark:border-slate-800">
        <path d={pathD} className="fill-none stroke-slate-400 dark:stroke-slate-600" strokeWidth={2} />
        <line x1={P.x} y1={P.y} x2={Q.x} y2={Q.y} className="stroke-primary-600" strokeWidth={2.5} />
        <circle cx={P.x} cy={P.y} r={7} className="fill-accent-600 stroke-white dark:stroke-slate-900" strokeWidth={2} />
        <circle cx={Q.x} cy={Q.y} r={7} className="fill-primary-600 stroke-white dark:stroke-slate-900" strokeWidth={2} />
        <text x={P.x - 10} y={P.y - 12} fontSize={12} fontWeight={700} className="fill-accent-700 dark:fill-accent-300">P</text>
        <text x={Q.x + 8} y={Q.y - 8} fontSize={12} fontWeight={700} className="fill-primary-700 dark:fill-primary-300">Q</text>
      </svg>
      <ModernSlider label="Distance from P to Q (h)" min={0.05} max={2} step={0.05} value={h} onChange={setH} />
      <p className="text-center font-display text-base font-semibold">
        Secant slope = <span className="text-primary-600">{slope.toFixed(3)}</span> &nbsp;(true instantaneous slope at P = <span className="text-accent-600">{trueSlope}</span>)
      </p>
    </ExperimentCard>
  );
}

// -- Ramanujan: search for taxicab numbers live, and verify 1729 yourself.
function TaxicabExperiment() {
  const [n, setN] = useState(1729);
  const reps = taxicabRepresentations(Math.max(2, Math.min(50000, Math.round(n))));
  return (
    <ExperimentCard>
      <p className="text-sm text-slate-600 dark:text-slate-300">Type any number and search, by real computation, for every way it can be written as a sum of two positive cubes. Try 1729 -- Ramanujan&apos;s famous taxicab number.</p>
      <input
        type="number"
        value={n}
        min={2}
        max={50000}
        onChange={(e) => setN(parseInt(e.target.value, 10) || 2)}
        className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-transparent p-3 text-lg font-bold text-center focus:border-primary-500 outline-none"
      />
      <div className="space-y-1.5 min-h-[3rem]">
        {reps.length === 0 && <p className="text-center text-sm text-slate-400">No way found to write {n} as a sum of two positive cubes.</p>}
        {reps.map(([a, b], i) => (
          <p key={i} className="text-center font-mono text-sm">{n} = {a}³ + {b}³ = {a ** 3} + {b ** 3}</p>
        ))}
        {reps.length >= 2 && <p className="text-center text-xs font-bold text-primary-600 mt-1">Two or more ways -- {n} is a genuine taxicab number!</p>}
      </div>
    </ExperimentCard>
  );
}

const EXPERIMENTS: Record<string, () => React.ReactElement> = {
  aryabhata: PiApproximationExperiment,
  brahmagupta: CyclicQuadrilateralExperiment,
  'bhaskara-ii': InstantaneousMotionExperiment,
  ramanujan: TaxicabExperiment,
};

export default function AncientMathExperiment({ figureId }: { figureId: string }) {
  const Experiment = EXPERIMENTS[figureId];
  if (!Experiment) return null;
  return <Experiment />;
}
