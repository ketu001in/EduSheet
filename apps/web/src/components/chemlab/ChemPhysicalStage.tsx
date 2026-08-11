'use client';
import { useMemo } from 'react';
import { PhysicalChemSimType } from '@edusheets/content';
import {
  moleConversion, solveCombinedGasLaw, celsiusToKelvin, pHFromHydrogenIonConcentration,
  hydrogenIonConcentrationFromPH, pOHFromPH, ammoniaEquilibriumConstant, predictEquilibriumShift,
  EquilibriumStress, firstOrderConcentration, zeroOrderConcentration, cellEMF, STANDARD_REDUCTION_POTENTIALS,
} from '@/lib/chemEngine';

// Renders whichever Physical Chemistry Calculator matches the current
// simType -- one bespoke scene per type, same "one Scene per simType"
// pattern as MathStage.tsx/BiologyStage.tsx, since a mole conversion table,
// a gas-law grid, a pH meter, an equilibrium predictor, a kinetics graph,
// and a voltage readout are all genuinely different visuals.
export default function ChemPhysicalStage({ simType, params }: { simType: PhysicalChemSimType; params: Record<string, number> }) {
  switch (simType) {
    case 'mole-calculator': return <MoleCalculatorScene params={params} />;
    case 'gas-laws': return <GasLawsScene params={params} />;
    case 'ph-calculator': return <PHCalculatorScene params={params} />;
    case 'equilibrium': return <EquilibriumScene params={params} />;
    case 'kinetics': return <KineticsScene params={params} />;
    case 'electrochemistry': return <ElectrochemistryScene params={params} />;
    default: return null;
  }
}

function StageCard({ children }: { children: React.ReactNode }) {
  return <div className="glass-card rounded-3xl p-5 md:p-7 space-y-4">{children}</div>;
}

const SUBSTANCES = [
  { name: 'Water (H2O)', molarMass: 18 },
  { name: 'Carbon Dioxide (CO2)', molarMass: 44 },
  { name: 'Sodium Chloride (NaCl)', molarMass: 58.5 },
  { name: 'Oxygen Gas (O2)', molarMass: 32 },
  { name: 'Glucose (C6H12O6)', molarMass: 180 },
];

function MoleCalculatorScene({ params }: { params: Record<string, number> }) {
  const substance = SUBSTANCES[Math.round(params.substanceIndex ?? 0)] || SUBSTANCES[0];
  const massGrams = params.massGrams ?? 18;
  const result = useMemo(() => moleConversion(substance.molarMass, { massGrams }), [substance.molarMass, massGrams]);

  return (
    <StageCard>
      <p className="text-center text-sm text-slate-500">{substance.name} &middot; molar mass {substance.molarMass} g/mol &middot; {massGrams} g</p>
      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
        {[
          { label: 'Moles', value: result.moles.toFixed(3), unit: 'mol' },
          { label: 'Mass', value: result.massGrams.toFixed(2), unit: 'g' },
          { label: 'Volume at STP', value: result.volumeLitersAtSTP.toFixed(2), unit: 'L' },
          { label: 'Particles', value: result.particles.toExponential(3), unit: '' },
        ].map((row) => (
          <div key={row.label} className="rounded-xl bg-primary-50 dark:bg-primary-900/20 p-3 text-center">
            <p className="text-[10px] font-bold text-primary-600 uppercase">{row.label}</p>
            <p className="font-display text-lg font-bold">{row.value} {row.unit}</p>
          </div>
        ))}
      </div>
    </StageCard>
  );
}

function GasLawsScene({ params }: { params: Record<string, number> }) {
  const p1 = params.pressure1 ?? 1, v1 = params.volume1 ?? 10, t1C = params.temperature1C ?? 27;
  const p2 = params.pressure2 ?? 1, t2C = params.temperature2C ?? 27;
  const t1 = celsiusToKelvin(t1C), t2 = celsiusToKelvin(t2C);
  const result = useMemo(() => solveCombinedGasLaw(p1, v1, t1, { pressure2: p2, temperature2: t2 }), [p1, v1, t1, p2, t2]);

  const maxV = Math.max(v1, result.volume2, 1);
  const barHeight = (v: number) => Math.max(6, (v / maxV) * 100);

  return (
    <StageCard>
      <p className="text-center text-sm text-slate-500">P1V1/T1 = P2V2/T2</p>
      <div className="flex items-end justify-center gap-8 h-32">
        <div className="flex flex-col items-center gap-1">
          <div className="w-16 bg-primary-300 dark:bg-primary-800 rounded-t-lg" style={{ height: `${barHeight(v1)}%` }} />
          <p className="text-[10px] font-bold text-slate-500">Before</p>
          <p className="text-xs">{p1}atm, {v1.toFixed(1)}L, {t1C}°C</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-16 bg-accent-400 dark:bg-accent-700 rounded-t-lg transition-all" style={{ height: `${barHeight(result.volume2)}%` }} />
          <p className="text-[10px] font-bold text-slate-500">After</p>
          <p className="text-xs">{p2}atm, {result.volume2.toFixed(2)}L, {t2C}°C</p>
        </div>
      </div>
      <p className="text-center font-display text-lg font-semibold">New Volume = <span className="text-accent-600">{result.volume2.toFixed(2)} L</span></p>
    </StageCard>
  );
}

function PHCalculatorScene({ params }: { params: Record<string, number> }) {
  const pH = params.pH ?? 7;
  const hConc = hydrogenIonConcentrationFromPH(pH);
  const pOH = pOHFromPH(pH);
  const label = pH < 7 ? 'Acidic' : pH > 7 ? 'Alkaline (Basic)' : 'Neutral';
  const color = pH < 4 ? '#dc2626' : pH < 7 ? '#f59e0b' : pH === 7 ? '#22c55e' : pH < 11 ? '#3b82f6' : '#7c3aed';

  return (
    <StageCard>
      <div className="h-8 rounded-full overflow-hidden relative bg-slate-100 dark:bg-slate-800 max-w-md mx-auto" style={{ background: 'linear-gradient(to right, #dc2626, #f59e0b, #22c55e, #3b82f6, #7c3aed)' }}>
        <div className="absolute top-0 bottom-0 w-1.5 bg-slate-900 dark:bg-white" style={{ left: `${(pH / 14) * 100}%` }} />
      </div>
      <p className="text-center font-display text-2xl font-bold" style={{ color }}>pH {pH.toFixed(1)} -- {label}</p>
      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase">[H+]</p>
          <p className="font-mono text-sm font-bold">{hConc.toExponential(2)} mol/L</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase">pOH</p>
          <p className="font-mono text-sm font-bold">{pOH.toFixed(1)}</p>
        </div>
      </div>
    </StageCard>
  );
}

// Index matches each stress choice's `value` in chemPhysicalExperiments.ts's
// paramConfig exactly -- index 0 ("None") intentionally has no engine key,
// since no stress is applied yet.
const STRESS_BY_INDEX: Record<number, { label: string; key: EquilibriumStress }> = {
  1: { label: 'Add N2', key: 'add-n2' },
  2: { label: 'Add H2', key: 'add-h2' },
  3: { label: 'Remove NH3', key: 'remove-nh3' },
  4: { label: 'Add NH3', key: 'add-nh3' },
  5: { label: 'Increase Pressure', key: 'increase-pressure' },
  6: { label: 'Decrease Pressure', key: 'decrease-pressure' },
  7: { label: 'Increase Temperature', key: 'increase-temperature' },
};

function EquilibriumScene({ params }: { params: Record<string, number> }) {
  const n2 = params.n2 ?? 1, h2 = params.h2 ?? 1, nh3 = params.nh3 ?? 1;
  const stressIndex = Math.round(params.stressIndex ?? 0);
  const kc = ammoniaEquilibriumConstant(n2, h2, nh3);
  const stress = STRESS_BY_INDEX[stressIndex];
  const shift = stress ? predictEquilibriumShift(stress.key) : null;

  return (
    <StageCard>
      <p className="text-center font-mono text-sm">N2(g) + 3H2(g) &#8652; 2NH3(g)</p>
      <div className="grid grid-cols-3 gap-3 max-w-md mx-auto text-center">
        <div className="rounded-xl bg-primary-50 dark:bg-primary-900/20 p-3"><p className="text-[10px] font-bold text-primary-600">[N2]</p><p className="font-bold">{n2.toFixed(1)}</p></div>
        <div className="rounded-xl bg-primary-50 dark:bg-primary-900/20 p-3"><p className="text-[10px] font-bold text-primary-600">[H2]</p><p className="font-bold">{h2.toFixed(1)}</p></div>
        <div className="rounded-xl bg-accent-50 dark:bg-accent-900/20 p-3"><p className="text-[10px] font-bold text-accent-600">[NH3]</p><p className="font-bold">{nh3.toFixed(1)}</p></div>
      </div>
      <p className="text-center font-display text-lg font-semibold">Kc = <span className="text-primary-600">{kc.toFixed(3)}</span></p>
      {shift && stress && (
        <div className={`rounded-xl p-4 text-center font-bold ${shift === 'forward' ? 'bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-300' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'}`}>
          Stress: {stress.label} &rarr; Equilibrium shifts <span className="uppercase">{shift === 'forward' ? 'FORWARD (more NH3)' : 'REVERSE (more N2 + H2)'}</span>
        </div>
      )}
    </StageCard>
  );
}

function KineticsScene({ params }: { params: Record<string, number> }) {
  const c0 = params.initialConcentration ?? 1;
  const k = params.rateConstantK ?? 0.1;
  const orderIndex = Math.round(params.orderIndex ?? 1);
  const timeRange = 50;

  const points = useMemo(() => {
    const pts: { t: number; c: number }[] = [];
    for (let t = 0; t <= timeRange; t += 1) {
      const c = orderIndex === 0 ? zeroOrderConcentration(c0, k, t) : firstOrderConcentration(c0, k, t);
      pts.push({ t, c });
    }
    return pts;
  }, [c0, k, orderIndex]);

  const maxC = c0;
  const toSvg = (t: number, c: number) => ({ x: (t / timeRange) * 300 + 10, y: 210 - (c / maxC) * 190 });
  const pathD = 'M ' + points.map((p) => { const s = toSvg(p.t, p.c); return `${s.x},${s.y}`; }).join(' L ');

  return (
    <StageCard>
      <p className="text-center text-sm text-slate-500">{orderIndex === 0 ? 'Zero Order: [A]t = [A]0 - kt' : 'First Order: [A]t = [A]0 . e^(-kt)'}</p>
      <svg viewBox="0 0 320 220" className="w-full max-w-sm mx-auto rounded-2xl bg-slate-50 dark:bg-slate-900/40 border-2 border-slate-200 dark:border-slate-800">
        <line x1={10} y1={210} x2={310} y2={210} className="stroke-slate-300 dark:stroke-slate-700" strokeWidth={1.5} />
        <line x1={10} y1={10} x2={10} y2={210} className="stroke-slate-300 dark:stroke-slate-700" strokeWidth={1.5} />
        <path d={pathD} className="fill-none stroke-primary-600" strokeWidth={2.5} />
      </svg>
      <p className="text-center text-xs text-slate-400">x-axis: time (0-{timeRange}) &middot; y-axis: concentration (0-{maxC.toFixed(1)} mol/L)</p>
    </StageCard>
  );
}

function ElectrochemistryScene({ params }: { params: Record<string, number> }) {
  const keys = Object.keys(STANDARD_REDUCTION_POTENTIALS);
  const key1 = keys[Math.round(params.metal1Index ?? 6)] || keys[0];
  const key2 = keys[Math.round(params.metal2Index ?? 9)] || keys[1];
  const result = useMemo(() => cellEMF(key1, key2), [key1, key2]);

  return (
    <StageCard>
      <div className="flex items-center justify-center gap-6">
        <div className="text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Anode (oxidised)</p>
          <p className="font-display text-lg font-bold">{STANDARD_REDUCTION_POTENTIALS[result.anode].name}</p>
          <p className="text-xs text-slate-400">{result.anode}: {STANDARD_REDUCTION_POTENTIALS[result.anode].volts.toFixed(2)}V</p>
        </div>
        <div className="text-3xl text-primary-600">&rarr;</div>
        <div className="text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Cathode (reduced)</p>
          <p className="font-display text-lg font-bold">{STANDARD_REDUCTION_POTENTIALS[result.cathode].name}</p>
          <p className="text-xs text-slate-400">{result.cathode}: {STANDARD_REDUCTION_POTENTIALS[result.cathode].volts.toFixed(2)}V</p>
        </div>
      </div>
      <p className="text-center font-display text-2xl font-bold text-accent-600">E°cell = {result.emf.toFixed(2)} V</p>
    </StageCard>
  );
}
