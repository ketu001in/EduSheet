'use client';
import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Wind, FlaskConical } from 'lucide-react';
import {
  ChemConceptPlaygroundType, CHEM_PHYSICAL_EXPERIMENTS, bohrBuryShells,
} from '@edusheets/content';
import {
  electrolysisMassDeposited, grahamsLawRatio, FARADAY_CONSTANT,
} from '@/lib/chemEngine';
import ChemPhysicalStage from './ChemPhysicalStage';

const MassBalance3DScene = dynamic(() => import('./MassBalance3DScene'), {
  ssr: false,
  loading: () => <div className="w-full h-[260px] rounded-2xl bg-slate-50 dark:bg-slate-900/40 animate-pulse" />,
});
const Electrolysis3DScene = dynamic(() => import('./Electrolysis3DScene'), {
  ssr: false,
  loading: () => <div className="w-full h-[260px] rounded-2xl bg-slate-50 dark:bg-slate-900/40 animate-pulse" />,
});
const RatioMixer3DScene = dynamic(() => import('./RatioMixer3DScene'), {
  ssr: false,
  loading: () => <div className="w-full h-[230px] rounded-2xl bg-slate-50 dark:bg-slate-900/40 animate-pulse" />,
});
const OctetBuilder3DScene = dynamic(() => import('./OctetBuilder3DScene'), {
  ssr: false,
  loading: () => <div className="w-full h-[260px] rounded-2xl bg-slate-50 dark:bg-slate-900/40 animate-pulse" />,
});
const Periodicity3DScene = dynamic(() => import('./Periodicity3DScene'), {
  ssr: false,
  loading: () => <div className="w-full h-[200px] rounded-2xl bg-slate-50 dark:bg-slate-900/40 animate-pulse" />,
});
const DiffusionRace3DScene = dynamic(() => import('./DiffusionRace3DScene'), {
  ssr: false,
  loading: () => <div className="w-full h-[220px] rounded-2xl bg-slate-50 dark:bg-slate-900/40 animate-pulse" />,
});

// The "Try It Yourself" playground every Concepts Corner entry now carries --
// direct response to user feedback that pure statement + step-through
// explanation "looks so gimmicky" with no experiment attached. Every one of
// these is a genuine, always-visible interactive (not a link out, not
// gated behind another click) that lets the learner manipulate a real
// variable and see a real, formula-driven result change live.
export default function ChemConceptPlayground({ type }: { type: ChemConceptPlaygroundType }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-primary-300 dark:border-primary-800 bg-primary-50/40 dark:bg-primary-950/10 p-4 md:p-5 space-y-3">
      <div className="flex items-center gap-2 text-sm font-bold text-primary-700 dark:text-primary-300">
        <FlaskConical className="w-4 h-4" /> Try It Yourself
      </div>
      <PlaygroundBody type={type} />
    </div>
  );
}

function PlaygroundBody({ type }: { type: ChemConceptPlaygroundType }) {
  switch (type) {
    case 'mass-balance': return <MassBalancePlayground />;
    case 'ratio-mixer': return <RatioMixerPlayground />;
    case 'mole-calculator': return <ReusedCalculatorPlayground experimentId="phys-mole-calculator" />;
    case 'equilibrium': return <ReusedCalculatorPlayground experimentId="phys-equilibrium" />;
    case 'octet-builder': return <OctetBuilderPlayground />;
    case 'periodicity-explorer': return <PeriodicityExplorerPlayground />;
    case 'electrolysis-calculator': return <ElectrolysisPlayground />;
    case 'diffusion-race': return <DiffusionRacePlayground />;
    case 'burette-reading': return <BuretteReadingPlayground />;
    default: return null;
  }
}

function Slider({ label, unit, value, min, max, step, onChange }: { label: string; unit: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <label className="block text-xs font-bold text-slate-500 space-y-1.5">
      <span>{label} ({value}{unit})</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full accent-primary-600" />
    </label>
  );
}

// -- Reused Physical Chemistry Calculators (Avogadro's Law, Le Chatelier) ---
function ReusedCalculatorPlayground({ experimentId }: { experimentId: string }) {
  const experiment = CHEM_PHYSICAL_EXPERIMENTS.find((e) => e.id === experimentId)!;
  const [params, setParams] = useState<Record<string, number>>(experiment.defaultParams);

  return (
    <div className="space-y-3">
      <ChemPhysicalStage simType={experiment.simType} params={params} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {experiment.paramConfig.map((pc) => (
          <div key={pc.key} className="text-xs font-bold text-slate-500 space-y-1.5">
            <span className="block">{pc.label}{!pc.choices && ` (${params[pc.key] ?? experiment.defaultParams[pc.key]}${pc.unit})`}</span>
            {pc.choices ? (
              <div className="flex flex-wrap gap-1.5">
                {pc.choices.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setParams((prev) => ({ ...prev, [pc.key]: c.value }))}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] border-2 transition-all ${(params[pc.key] ?? experiment.defaultParams[pc.key]) === c.value ? 'border-primary-600 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            ) : (
              <input type="range" min={pc.min} max={pc.max} step={pc.step} value={params[pc.key] ?? experiment.defaultParams[pc.key]} onChange={(e) => setParams((prev) => ({ ...prev, [pc.key]: parseFloat(e.target.value) }))} className="w-full accent-primary-600" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// -- Conservation of Mass: 2Mg + O2 -> 2MgO, both sides always balance -----
function MassBalancePlayground() {
  const [massMg, setMassMg] = useState(24);
  const result = useMemo(() => {
    const molesMg = massMg / 24;
    const molesO2 = molesMg / 2;
    const massO2 = molesO2 * 32;
    const massMgO = molesMg * 40; // 2Mg + O2 -> 2MgO, 1:1 Mg:MgO
    return { massO2, massMgO, reactantTotal: massMg + massO2 };
  }, [massMg]);
  const maxScale = Math.max(result.reactantTotal, 1);

  return (
    <div className="space-y-3">
      <p className="text-center font-mono text-sm">2Mg + O2 &rarr; 2MgO</p>
      <Slider label="Mass of Magnesium burned" unit="g" value={massMg} min={2} max={96} step={1} onChange={setMassMg} />
      <MassBalance3DScene reactantMass={result.reactantTotal} productMass={result.massMgO} maxScale={maxScale} />
      <p className="text-center text-[11px] text-slate-500">Reactants: {massMg}g Mg + {result.massO2.toFixed(1)}g O2 &nbsp;|&nbsp; Product: {result.massMgO.toFixed(1)}g MgO</p>
      <p className="text-center text-sm font-bold text-accent-700 dark:text-accent-300">
        {result.reactantTotal.toFixed(1)}g reactants = {result.massMgO.toFixed(1)}g product -- mass is always conserved, no matter how much Mg you burn.
      </p>
    </div>
  );
}

// -- Constant Proportions: water is always H:O = 1:8 by mass ---------------
function RatioMixerPlayground() {
  const [massH, setMassH] = useState(2);
  const [massO, setMassO] = useState(16);
  const requiredO = massH * 8;
  const actualRatio = massO / massH;
  const isMatch = Math.abs(actualRatio - 8) < 0.15;

  return (
    <div className="space-y-3">
      <p className="text-center text-xs text-slate-500">Water is always Hydrogen : Oxygen = 1 : 8 by mass. Try to match Oxygen to the required ratio.</p>
      <Slider label="Hydrogen used" unit="g" value={massH} min={1} max={10} step={0.5} onChange={setMassH} />
      <Slider label="Oxygen you add" unit="g" value={massO} min={1} max={80} step={0.5} onChange={setMassO} />
      <RatioMixer3DScene massH={massH} massO={massO} maxH={10} maxO={80} isMatch={isMatch} />
      <div className={`rounded-xl p-3 text-center text-sm font-bold ${isMatch ? 'bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-300' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'}`}>
        Your ratio is {actualRatio.toFixed(1)} : 1 (need exactly 8 : 1) -- {isMatch ? 'Match! You\'ve made pure water (H2O) with nothing left over.' : `required Oxygen for ${massH}g Hydrogen is ${requiredO}g`}
      </div>
    </div>
  );
}

// -- Octet Rule: build an atom's outer shell, see if it reaches a stable 8 -
const OCTET_ELEMENTS = [
  { symbol: 'Na', name: 'Sodium', atomicNumber: 11 },
  { symbol: 'Mg', name: 'Magnesium', atomicNumber: 12 },
  { symbol: 'O', name: 'Oxygen', atomicNumber: 8 },
  { symbol: 'N', name: 'Nitrogen', atomicNumber: 7 },
  { symbol: 'F', name: 'Fluorine', atomicNumber: 9 },
  { symbol: 'Cl', name: 'Chlorine', atomicNumber: 17 },
];

function OctetBuilderPlayground() {
  const [elIndex, setElIndex] = useState(0);
  const el = OCTET_ELEMENTS[elIndex];
  const neutralShells = useMemo(() => bohrBuryShells(el.atomicNumber), [el.atomicNumber]);
  const [delta, setDelta] = useState(0); // electrons gained (+) or lost (-) from the outer shell

  const shells = useMemo(() => bohrBuryShells(el.atomicNumber + delta), [el.atomicNumber, delta]);
  const outerShellCount = shells[shells.length - 1] ?? 0;
  const outerShellIsFirst = shells.length === 1;
  const targetCount = outerShellIsFirst ? 2 : 8;
  const isStable = outerShellCount === targetCount;

  const selectEl = (i: number) => { setElIndex(i); setDelta(0); };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5 justify-center">
        {OCTET_ELEMENTS.map((e, i) => (
          <button key={e.symbol} onClick={() => selectEl(i)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 ${i === elIndex ? 'border-primary-600 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'}`}>
            {e.symbol}
          </button>
        ))}
      </div>
      <p className="text-center text-sm text-slate-500">{el.name} normally has {neutralShells[neutralShells.length - 1]} electrons in its outer shell. Gain or lose electrons and see what happens.</p>
      <OctetBuilder3DScene shellCounts={shells} />
      <div className="flex items-center justify-center gap-4">
        <button onClick={() => setDelta((d) => Math.max(d - 1, -(el.atomicNumber - 1)))} className="w-9 h-9 rounded-full border-2 border-slate-300 dark:border-slate-700 font-bold text-lg">-</button>
        <div className="text-center">
          <p className="font-display text-2xl font-bold">{outerShellCount} e-</p>
          <p className="text-[10px] text-slate-400">outer shell (target: {targetCount})</p>
        </div>
        <button onClick={() => setDelta((d) => d + 1)} className="w-9 h-9 rounded-full border-2 border-slate-300 dark:border-slate-700 font-bold text-lg">+</button>
      </div>
      <div className={`rounded-xl p-3 text-center text-sm font-bold ${isStable ? 'bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-300' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'}`}>
        {isStable ? `Stable! A full outer shell (${targetCount}) -- this is the noble-gas-like ion ${el.symbol}${delta > 0 ? `${Math.abs(delta)}-` : delta < 0 ? `${Math.abs(delta)}+` : ''} chemistry actually forms.` : `${outerShellCount < targetCount ? `${targetCount - outerShellCount} more electron(s) needed` : `${outerShellCount - targetCount} too many`} to complete the octet.`}
      </div>
    </div>
  );
}

// -- Modern Periodic Law: periodicity of valence electrons repeats with Z --
function PeriodicityExplorerPlayground() {
  const [maxZ, setMaxZ] = useState(1);
  const points = useMemo(() => Array.from({ length: 20 }, (_, i) => {
    const z = i + 1;
    const shells = bohrBuryShells(z);
    return { z, valence: shells[shells.length - 1] };
  }), []);

  return (
    <div className="space-y-3">
      <Slider label="Reveal up to atomic number" unit="" value={maxZ} min={1} max={20} step={1} onChange={setMaxZ} />
      <Periodicity3DScene points={points} maxZ={maxZ} />
      <p className="text-center text-xs text-slate-500">
        Notice the pattern climbs 1&rarr;{maxZ >= 2 ? '2' : '...'} then resets and climbs 1&rarr;8 twice more (the highlighted bars are the noble gases He, Ne, Ar) -- this repeating rise-and-reset IS periodicity, and it's why elements below one another share properties.
      </p>
    </div>
  );
}

// -- Faraday's Laws: electroplating mass calculator -------------------------
// Deposit colors are the real, familiar color of each metal -- copper's
// reddish tone, silver's bright grey, aluminium's dull silver, zinc's
// bluish-grey -- an honest visual cue, not an arbitrary palette choice.
const ELECTROLYSIS_IONS = [
  { label: 'Copper (Cu2+)', molarMass: 63.5, charge: 2, color: '#c2703d' },
  { label: 'Silver (Ag+)', molarMass: 108, charge: 1, color: '#e2e8f0' },
  { label: 'Aluminium (Al3+)', molarMass: 27, charge: 3, color: '#cbd5e1' },
  { label: 'Zinc (Zn2+)', molarMass: 65.4, charge: 2, color: '#94a3b8' },
];

function ElectrolysisPlayground() {
  const [ionIndex, setIonIndex] = useState(0);
  const [current, setCurrent] = useState(2);
  const [timeMinutes, setTimeMinutes] = useState(30);
  const ion = ELECTROLYSIS_IONS[ionIndex];
  const mass = useMemo(() => electrolysisMassDeposited(current, timeMinutes * 60, ion.molarMass, ion.charge), [current, timeMinutes, ion]);
  const maxMass = 20;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5 justify-center">
        {ELECTROLYSIS_IONS.map((i, idx) => (
          <button key={i.label} onClick={() => setIonIndex(idx)} className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border-2 ${idx === ionIndex ? 'border-primary-600 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'}`}>{i.label}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Slider label="Current" unit="A" value={current} min={0.5} max={10} step={0.5} onChange={setCurrent} />
        <Slider label="Time" unit=" min" value={timeMinutes} min={1} max={120} step={1} onChange={setTimeMinutes} />
      </div>
      <Electrolysis3DScene mass={mass} maxMass={maxMass} depositColor={ion.color} />
      <p className="text-center font-display text-lg font-bold">{mass.toFixed(3)} g of {ion.label.split(' ')[0]} deposited</p>
      <p className="text-center text-[11px] text-slate-400">mass = (current &times; time &times; molar mass) / (charge &times; {FARADAY_CONSTANT})</p>
    </div>
  );
}

// -- Burette meniscus reading practice --------------------------------------
// A real skill every titration depends on: burettes are graduated 0 at the
// TOP down to 50 at the bottom (readings increase downward), and read from
// the BOTTOM of the meniscus (the curved liquid surface). This gives a
// randomly-placed liquid level and checks the student's reading against
// the real value to the standard 0.1 mL tolerance a burette is graduated to.
function randomBuretteLevel() {
  return Math.round((Math.random() * 46 + 2) * 10) / 10; // 2.0-48.0 mL, one decimal
}

function BuretteReadingPlayground() {
  const [target, setTarget] = useState(randomBuretteLevel);
  const [guess, setGuess] = useState('');
  const [checked, setChecked] = useState(false);
  const tubeHeight = 260;
  const meniscusY = 10 + (target / 50) * tubeHeight; // 0 mL at top, 50 mL at bottom

  const newReading = () => { setTarget(randomBuretteLevel()); setGuess(''); setChecked(false); };
  const check = () => setChecked(true);
  const guessNum = parseFloat(guess);
  const isCorrect = checked && !isNaN(guessNum) && Math.abs(guessNum - target) <= 0.1;

  return (
    <div className="space-y-3">
      <p className="text-center text-xs text-slate-500">Read the burette to the nearest 0.1 mL, the way a real titration is read -- from the bottom of the curved liquid surface (the meniscus).</p>
      <div className="flex justify-center">
        <svg viewBox="0 0 100 300" className="h-64">
          <rect x={40} y={10} width={20} height={tubeHeight} rx={3} className="fill-sky-50 dark:fill-sky-950/30 stroke-slate-400" strokeWidth={1.5} />
          <rect x={40} y={meniscusY} width={20} height={10 + tubeHeight - meniscusY} className="fill-sky-300 dark:fill-sky-700" />
          {Array.from({ length: 11 }, (_, i) => {
            const y = 10 + (i / 10) * tubeHeight;
            return (
              <g key={i}>
                <line x1={40} y1={y} x2={i % 5 === 0 ? 32 : 36} y2={y} className="stroke-slate-500" strokeWidth={1} />
                {i % 5 === 0 && <text x={28} y={y + 3} textAnchor="end" className="fill-slate-500 text-[7px]">{i * 5}</text>}
              </g>
            );
          })}
          <polygon points={`38,${meniscusY} 62,${meniscusY} 50,${meniscusY + 6}`} className="fill-sky-600 dark:fill-sky-400" />
        </svg>
      </div>
      <div className="flex items-center justify-center gap-2">
        <input
          type="number" step="0.1" value={guess} onChange={(e) => { setGuess(e.target.value); setChecked(false); }}
          placeholder="Your reading (mL)"
          className="w-40 text-center rounded-lg border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 text-sm font-bold"
        />
        <button onClick={check} className="px-4 py-2 rounded-lg bg-primary-600 text-white font-bold text-sm">Check</button>
        <button onClick={newReading} className="px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-800 font-bold text-sm">New Reading</button>
      </div>
      {checked && (
        <div className={`rounded-xl p-3 text-center text-sm font-bold ${isCorrect ? 'bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-300' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'}`}>
          {isCorrect ? `Correct! The reading is ${target.toFixed(1)} mL.` : `Not quite -- the actual reading is ${target.toFixed(1)} mL. Remember: burettes read top-to-bottom, and you read the BOTTOM of the meniscus curve.`}
        </div>
      )}
    </div>
  );
}

// -- Graham's Law: race two gases diffusing down a tube ---------------------
const DIFFUSION_GASES = [
  { label: 'Hydrogen (H2)', molarMass: 2 },
  { label: 'Ammonia (NH3)', molarMass: 17 },
  { label: 'Oxygen (O2)', molarMass: 32 },
  { label: 'Hydrogen Chloride (HCl)', molarMass: 36.5 },
  { label: 'Carbon Dioxide (CO2)', molarMass: 44 },
];

function DiffusionRacePlayground() {
  const [gas1Index, setGas1Index] = useState(0);
  const [gas2Index, setGas2Index] = useState(2);
  const [racing, setRacing] = useState(false);
  const gas1 = DIFFUSION_GASES[gas1Index];
  const gas2 = DIFFUSION_GASES[gas2Index];
  // rate is proportional to 1/sqrt(M) -- normalize so the faster (lighter) gas travels 100%.
  const rate1 = 1 / Math.sqrt(gas1.molarMass);
  const rate2 = 1 / Math.sqrt(gas2.molarMass);
  const maxRate = Math.max(rate1, rate2);
  const ratio = grahamsLawRatio(gas1.molarMass, gas2.molarMass);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <select value={gas1Index} onChange={(e) => { setGas1Index(parseInt(e.target.value)); setRacing(false); }} className="text-xs font-bold rounded-lg border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2">
          {DIFFUSION_GASES.map((g, i) => <option key={g.label} value={i}>{g.label}</option>)}
        </select>
        <select value={gas2Index} onChange={(e) => { setGas2Index(parseInt(e.target.value)); setRacing(false); }} className="text-xs font-bold rounded-lg border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2">
          {DIFFUSION_GASES.map((g, i) => <option key={g.label} value={i}>{g.label}</option>)}
        </select>
      </div>
      <button onClick={() => { setRacing(false); requestAnimationFrame(() => setRacing(true)); }} className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary-600 text-white font-bold py-2 text-sm">
        <Wind className="w-4 h-4" /> Race!
      </button>
      <DiffusionRace3DScene rate1={rate1} rate2={rate2} maxRate={maxRate} label1={gas1.label} label2={gas2.label} racing={racing} />
      <div className="flex justify-center gap-6 text-[11px] font-bold text-slate-500">
        <span>{gas1.label} (M={gas1.molarMass})</span>
        <span>{gas2.label} (M={gas2.molarMass})</span>
      </div>
      <p className="text-center text-sm font-bold text-slate-600 dark:text-slate-300">Diffusion rate ratio = {ratio.toFixed(2)} : 1 -- the lighter gas travels {ratio.toFixed(2)}x farther in the same time.</p>
    </div>
  );
}
