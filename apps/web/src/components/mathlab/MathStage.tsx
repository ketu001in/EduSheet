'use client';
import { useEffect, useMemo, useState } from 'react';
import { Dices } from 'lucide-react';
import { MathSimType } from '@edusheets/content';
import {
  euclideanSteps, lcmFromHcf, solveQuadratic, DICE_SUM_WAYS,
  addWithCarries, subtractWithBorrows, multiplyPartialProducts, longDivisionSteps, gcd, pointOnCircle,
} from '@/lib/mathEngine';

// Renders whichever guided-experiment visual matches the current simType --
// one bespoke scene per type, same "one Scene per simType" pattern
// BiologyStage uses for microscope/foodtest/osmosis/punnett/explorer,
// rather than one generic renderer straining to cover six very different
// visuals (a number-sharing grid, an algorithm trace, a sequence, a
// parabola, a dice simulator, and a coordinate-grid line).
export default function MathStage({ simType, params, resetKey }: {
  simType: MathSimType;
  params: Record<string, number>;
  resetKey: number;
}) {
  switch (simType) {
    case 'divide': return <DivideScene params={params} />;
    case 'euclidean': return <EuclideanScene params={params} />;
    case 'progression': return <ProgressionScene params={params} />;
    case 'quadratic': return <QuadraticScene params={params} />;
    case 'probability': return <ProbabilityScene params={params} resetKey={resetKey} />;
    case 'graph': return <GraphScene params={params} />;
    case 'addition': return <AdditionScene params={params} />;
    case 'subtraction': return <SubtractionScene params={params} />;
    case 'multiplication': return <MultiplicationScene params={params} />;
    case 'division': return <DivisionScene params={params} />;
    case 'decimals': return <DecimalsScene params={params} />;
    case 'fractions': return <FractionsScene params={params} />;
    default: return null;
  }
}

const PLACE_LABELS = ['Ones', 'Tens', 'Hundreds', 'Thousands', 'Ten-Thousands'];
function placeLabel(p: number): string {
  return PLACE_LABELS[p] || `10^${p}`;
}

function StageCard({ children }: { children: React.ReactNode }) {
  return <div className="glass-card rounded-3xl p-5 md:p-7 space-y-4">{children}</div>;
}

// -- divide --------------------------------------------------------------
function DivideScene({ params }: { params: Record<string, number> }) {
  const total = Math.max(0, Math.round(params.totalItems ?? 20));
  const groups = Math.max(1, Math.round(params.groups ?? 4));
  const perGroup = Math.floor(total / groups);
  const remainder = total % groups;

  return (
    <StageCard>
      <p className="text-center text-sm text-slate-500">Sharing {total} items equally among {groups} groups</p>
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(groups, 4)}, minmax(0, 1fr))` }}>
        {Array.from({ length: groups }).map((_, g) => (
          <div key={g} className="rounded-2xl border-2 border-slate-900 dark:border-slate-700 p-3 space-y-1.5">
            <p className="text-[10px] font-bold text-slate-400 text-center">Group {g + 1}</p>
            <div className="flex flex-wrap justify-center gap-1 min-h-[2.5rem]">
              {Array.from({ length: perGroup }).map((_, i) => <span key={i} className="w-4 h-4 rounded-full bg-primary-600" />)}
            </div>
          </div>
        ))}
      </div>
      {remainder > 0 && (
        <div className="rounded-2xl border-2 border-dashed border-amber-500 p-3 space-y-1.5">
          <p className="text-[10px] font-bold text-amber-600 text-center">Leftover (Remainder)</p>
          <div className="flex flex-wrap justify-center gap-1">
            {Array.from({ length: remainder }).map((_, i) => <span key={i} className="w-4 h-4 rounded-full bg-amber-500" />)}
          </div>
        </div>
      )}
      <p className="text-center font-display text-lg font-semibold">
        {total} &divide; {groups} = <span className="text-primary-600">{perGroup}</span>{remainder > 0 && <> remainder <span className="text-amber-600">{remainder}</span></>}
      </p>
    </StageCard>
  );
}

// -- euclidean -------------------------------------------------------------
function EuclideanScene({ params }: { params: Record<string, number> }) {
  const a = Math.round(params.numberA ?? 48);
  const b = Math.round(params.numberB ?? 18);
  const { steps, hcf } = useMemo(() => euclideanSteps(a, b), [a, b]);
  const lcm = lcmFromHcf(a, b, hcf);

  return (
    <StageCard>
      <p className="text-center text-sm text-slate-500">Finding the HCF of {a} and {b} using the Euclidean Algorithm</p>
      <div className="space-y-2 max-w-sm mx-auto">
        {steps.map((s, i) => (
          <p key={i} className="font-mono text-sm bg-slate-900 text-slate-50 dark:bg-slate-950 rounded-xl px-3 py-2">
            {s.dividend} = {s.quotient} &times; {s.divisor} + {s.remainder}
          </p>
        ))}
      </div>
      <div className="flex items-center justify-center gap-6 font-display text-lg font-semibold pt-2">
        <p>HCF = <span className="text-primary-600">{hcf}</span></p>
        <p>LCM = <span className="text-accent-600">{lcm}</span></p>
      </div>
    </StageCard>
  );
}

// -- progression -----------------------------------------------------------
function ProgressionScene({ params }: { params: Record<string, number> }) {
  const a = params.firstTerm ?? 3;
  const d = params.commonDifference ?? 5;
  const n = Math.max(1, Math.round(params.numTerms ?? 8));
  const terms = useMemo(() => Array.from({ length: n }, (_, i) => a + i * d), [a, d, n]);
  const sum = terms.reduce((acc, t) => acc + t, 0);
  const formulaSum = (n / 2) * (2 * a + (n - 1) * d);

  return (
    <StageCard>
      <p className="text-center text-sm text-slate-500">a = {a}, d = {d}, n = {n}</p>
      <div className="flex flex-wrap justify-center gap-2">
        {terms.map((t, i) => (
          <span key={i} className="px-3 py-2 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-bold text-sm">{t}</span>
        ))}
      </div>
      <p className="text-center font-display text-lg font-semibold">
        Sum of {n} terms = <span className="text-primary-600">{sum}</span>
        <span className="text-xs text-slate-400 font-normal block mt-1">
          Formula check: n/2 &times; (2a + (n-1)d) = {formulaSum} {formulaSum === sum ? '✓ matches' : ''}
        </span>
      </p>
    </StageCard>
  );
}

// -- quadratic ---------------------------------------------------------------
function QuadraticScene({ params }: { params: Record<string, number> }) {
  const a = params.a ?? 1;
  const b = params.b ?? -5;
  const c = params.c ?? 6;
  const { discriminant, roots } = useMemo(() => solveQuadratic(a, b, c), [a, b, c]);

  // Sample the parabola across a range wide enough to show both roots (or
  // the vertex, if there are none), then map into a 320x220 SVG viewport.
  const vertexX = a !== 0 ? -b / (2 * a) : 0;
  const xs = Array.from({ length: 41 }, (_, i) => vertexX - 8 + i * 0.4);
  const ys = xs.map((x) => a * x * x + b * x + c);
  const minY = Math.min(...ys, 0);
  const maxY = Math.max(...ys, 0);
  const toSvg = (x: number, y: number) => {
    const px = ((x - xs[0]) / (xs[xs.length - 1] - xs[0])) * 300 + 10;
    const py = 210 - ((y - minY) / (maxY - minY || 1)) * 190;
    return `${px},${py}`;
  };
  const pathD = 'M ' + xs.map((x, i) => toSvg(x, ys[i])).join(' L ');
  const zeroY = 210 - ((0 - minY) / (maxY - minY || 1)) * 190;

  return (
    <StageCard>
      <p className="text-center text-sm text-slate-500">a = {a}, b = {b}, c = {c}</p>
      {a === 0 ? (
        <p className="text-center text-sm font-bold text-amber-600">Not a quadratic equation -- "a" can\'t be 0.</p>
      ) : (
        <>
          <svg viewBox="0 0 320 220" className="w-full max-w-sm mx-auto rounded-2xl bg-slate-50 dark:bg-slate-900/40 border-2 border-slate-200 dark:border-slate-800">
            <line x1={0} y1={zeroY} x2={320} y2={zeroY} className="stroke-slate-300 dark:stroke-slate-700" strokeWidth={1.5} />
            <path d={pathD} className="fill-none stroke-primary-600" strokeWidth={2.5} />
            {roots.map((r, i) => {
              const [px, py] = toSvg(r, 0).split(',').map(Number);
              return <circle key={i} cx={px} cy={py} r={5} className="fill-accent-600 stroke-white dark:stroke-slate-900" strokeWidth={2} />;
            })}
          </svg>
          <p className="text-center font-display text-lg font-semibold">
            Discriminant = <span className={discriminant > 0 ? 'text-accent-600' : discriminant === 0 ? 'text-amber-600' : 'text-red-500'}>{discriminant}</span>
            <span className="text-sm text-slate-500 font-normal block mt-1">
              {roots.length === 2 && `Two real roots: x = ${roots[0].toFixed(2)} and x = ${roots[1].toFixed(2)}`}
              {roots.length === 1 && `One repeated root: x = ${roots[0].toFixed(2)}`}
              {roots.length === 0 && 'No real roots -- the parabola never touches the x-axis.'}
            </span>
          </p>
        </>
      )}
    </StageCard>
  );
}

// -- probability -------------------------------------------------------------
function ProbabilityScene({ params, resetKey }: { params: Record<string, number>; resetKey: number }) {
  const targetSum = Math.round(params.targetSum ?? 7);
  const [rolls, setRolls] = useState<{ d1: number; d2: number }[]>([]);

  useEffect(() => { setRolls([]); }, [resetKey]);

  const roll = () => {
    const d1 = 1 + Math.floor(Math.random() * 6);
    const d2 = 1 + Math.floor(Math.random() * 6);
    setRolls((prev) => [...prev, { d1, d2 }]);
  };

  const hits = rolls.filter((r) => r.d1 + r.d2 === targetSum).length;
  const experimental = rolls.length > 0 ? hits / rolls.length : 0;
  const theoretical = (DICE_SUM_WAYS[targetSum] || 0) / 36;
  const last = rolls[rolls.length - 1];

  return (
    <StageCard>
      <p className="text-center text-sm text-slate-500">Target sum: {targetSum} &middot; Rolls so far: {rolls.length}</p>
      <div className="flex items-center justify-center gap-4">
        <div className="text-5xl">{last ? `⚀⚁⚂⚃⚄⚅`[last.d1 - 1] : '🎲'}</div>
        <div className="text-5xl">{last ? `⚀⚁⚂⚃⚄⚅`[last.d2 - 1] : '🎲'}</div>
      </div>
      {last && <p className="text-center text-sm font-bold">Rolled {last.d1} + {last.d2} = {last.d1 + last.d2}</p>}
      <button onClick={roll} className="btn-brutal mx-auto flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl">
        <Dices className="w-4 h-4" /> Roll Two Dice
      </button>
      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-center">
        <div className="rounded-xl bg-primary-50 dark:bg-primary-900/20 p-3">
          <p className="text-[10px] font-bold text-primary-600 uppercase">Experimental</p>
          <p className="font-display text-xl font-bold">{(experimental * 100).toFixed(1)}%</p>
          <p className="text-[10px] text-slate-400">{hits} of {rolls.length}</p>
        </div>
        <div className="rounded-xl bg-accent-50 dark:bg-accent-900/20 p-3">
          <p className="text-[10px] font-bold text-accent-600 uppercase">Theoretical</p>
          <p className="font-display text-xl font-bold">{(theoretical * 100).toFixed(1)}%</p>
          <p className="text-[10px] text-slate-400">{DICE_SUM_WAYS[targetSum] || 0} of 36</p>
        </div>
      </div>
    </StageCard>
  );
}

// -- graph -------------------------------------------------------------------
function GraphScene({ params }: { params: Record<string, number> }) {
  const m = params.slope ?? 2;
  const c = params.intercept ?? 1;
  const RANGE = 10; // grid spans -10 to 10 on both axes
  const toSvg = (x: number, y: number) => ({ x: (x + RANGE) * (300 / (2 * RANGE)) + 10, y: 210 - (y + RANGE) * (190 / (2 * RANGE)) });
  const p1 = toSvg(-RANGE, m * -RANGE + c);
  const p2 = toSvg(RANGE, m * RANGE + c);
  const origin = toSvg(0, 0);
  const yIntercept = toSvg(0, c);

  return (
    <StageCard>
      <p className="text-center text-sm text-slate-500">y = {m}x {c >= 0 ? '+' : '-'} {Math.abs(c)}</p>
      <svg viewBox="0 0 320 220" className="w-full max-w-sm mx-auto rounded-2xl bg-slate-50 dark:bg-slate-900/40 border-2 border-slate-200 dark:border-slate-800">
        <line x1={10} y1={origin.y} x2={310} y2={origin.y} className="stroke-slate-300 dark:stroke-slate-700" strokeWidth={1.5} />
        <line x1={origin.x} y1={10} x2={origin.x} y2={210} className="stroke-slate-300 dark:stroke-slate-700" strokeWidth={1.5} />
        <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} className="stroke-primary-600" strokeWidth={2.5} />
        <circle cx={yIntercept.x} cy={yIntercept.y} r={5} className="fill-accent-600 stroke-white dark:stroke-slate-900" strokeWidth={2} />
      </svg>
      <p className="text-center font-display text-lg font-semibold">
        Slope = <span className="text-primary-600">{m}</span> &nbsp;|&nbsp; y-Intercept = <span className="text-accent-600">(0, {c})</span>
      </p>
    </StageCard>
  );
}

// -- addition ----------------------------------------------------------------
function AdditionScene({ params }: { params: Record<string, number> }) {
  const a = Math.round(params.addendA ?? 27);
  const b = Math.round(params.addendB ?? 15);
  const { columns, sum } = useMemo(() => addWithCarries(a, b), [a, b]);

  return (
    <StageCard>
      <p className="text-center text-sm text-slate-500">{a} + {b}</p>
      <div className="flex flex-wrap justify-center gap-3">
        {[...columns].reverse().map((col) => (
          <div key={col.place} className="rounded-2xl border-2 border-slate-900 dark:border-slate-700 p-3 space-y-1.5 text-center min-w-[84px]">
            <p className="text-[10px] font-bold text-slate-400">{placeLabel(col.place)}</p>
            <div className="flex flex-wrap justify-center gap-1 min-h-[1.25rem] max-w-[90px]">
              {Array.from({ length: col.digitA }).map((_, i) => <span key={`a${i}`} className="w-3 h-3 rounded-sm bg-primary-600" />)}
              {Array.from({ length: col.digitB }).map((_, i) => <span key={`b${i}`} className="w-3 h-3 rounded-sm bg-accent-600" />)}
              {Array.from({ length: col.carryIn }).map((_, i) => <span key={`c${i}`} className="w-3 h-3 rounded-sm bg-amber-500" />)}
            </div>
            <p className="font-display text-lg font-bold">{col.digitOut}</p>
            {col.carryOut > 0 && <p className="text-[9px] font-bold text-amber-600">regroups {col.carryOut} &rarr; next column</p>}
          </div>
        ))}
      </div>
      <p className="text-center font-display text-lg font-semibold">
        {a} + {b} = <span className="text-primary-600">{sum}</span>
      </p>
    </StageCard>
  );
}

// -- subtraction ---------------------------------------------------------------
function SubtractionScene({ params }: { params: Record<string, number> }) {
  const minuend = Math.round(params.minuend ?? 42);
  const subtrahend = Math.round(params.subtrahend ?? 27);
  const { columns, difference, swapped } = useMemo(() => subtractWithBorrows(minuend, subtrahend), [minuend, subtrahend]);
  const top = swapped ? subtrahend : minuend;
  const bottom = swapped ? minuend : subtrahend;

  return (
    <StageCard>
      <p className="text-center text-sm text-slate-500">
        {top} - {bottom}
        {swapped && <span className="block text-amber-600 text-xs mt-1">(swapped so the larger number is on top)</span>}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {[...columns].reverse().map((col) => (
          <div key={col.place} className="rounded-2xl border-2 border-slate-900 dark:border-slate-700 p-3 space-y-1.5 text-center min-w-[84px]">
            <p className="text-[10px] font-bold text-slate-400">{placeLabel(col.place)}</p>
            {col.borrowed && <p className="text-[9px] font-bold text-amber-600">borrowed a ten &rarr; +10</p>}
            <div className="flex flex-wrap justify-center gap-1 min-h-[1.25rem] max-w-[90px]">
              {Array.from({ length: col.effectiveTop }).map((_, i) => (
                <span key={i} className={`w-3 h-3 rounded-sm ${i < col.digitBottom ? 'bg-slate-300 dark:bg-slate-700' : 'bg-primary-600'}`} />
              ))}
            </div>
            <p className="font-display text-lg font-bold">{col.digitOut}</p>
          </div>
        ))}
      </div>
      <p className="text-center font-display text-lg font-semibold">
        {top} - {bottom} = <span className="text-primary-600">{difference}</span>
      </p>
    </StageCard>
  );
}

// -- multiplication --------------------------------------------------------
function MultiplicationScene({ params }: { params: Record<string, number> }) {
  const a = Math.max(1, Math.round(params.factorA ?? 4));
  const b = Math.max(1, Math.round(params.factorB ?? 6));
  const product = a * b;
  const { parts } = useMemo(() => multiplyPartialProducts(a, b), [a, b]);
  const useArray = a <= 12 && b <= 12 && product <= 144;

  return (
    <StageCard>
      {useArray ? (
        <>
          <p className="text-center text-sm text-slate-500">{a} rows &times; {b} columns</p>
          <div className="flex flex-col items-center gap-1">
            {Array.from({ length: a }).map((_, r) => (
              <div key={r} className="flex gap-1">
                {Array.from({ length: b }).map((_, c) => <span key={c} className="w-4 h-4 rounded-full bg-primary-600" />)}
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="text-center text-sm text-slate-500">{a} &times; {b}, broken into tens and ones</p>
          <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
            {parts.map((p, i) => (
              <div key={i} className="rounded-2xl border-2 border-slate-900 dark:border-slate-700 p-3 text-center">
                <p className="text-[10px] font-bold text-slate-400">{p.placeA} &times; {p.placeB}</p>
                <p className="font-display text-lg font-bold text-primary-600">{p.value}</p>
              </div>
            ))}
          </div>
        </>
      )}
      <p className="text-center font-display text-lg font-semibold">
        {a} &times; {b} = <span className="text-primary-600">{product}</span>
      </p>
    </StageCard>
  );
}

// -- division (long division) -----------------------------------------------
function DivisionScene({ params }: { params: Record<string, number> }) {
  const dividend = Math.max(1, Math.round(params.dividend ?? 936));
  const divisor = Math.max(1, Math.round(params.divisor ?? 8));
  const { steps, quotient, remainder } = useMemo(() => longDivisionSteps(dividend, divisor), [dividend, divisor]);

  return (
    <StageCard>
      <p className="text-center text-sm text-slate-500">{dividend} &divide; {divisor}, one digit at a time</p>
      <div className="space-y-2 max-w-sm mx-auto">
        {steps.map((s, i) => (
          <p key={i} className="font-mono text-sm bg-slate-900 text-slate-50 dark:bg-slate-950 rounded-xl px-3 py-2">
            bring down {s.bringDown} &rarr; {s.workingValue} &divide; {divisor} = {s.digitQuotient} r {s.remainderAfter}
          </p>
        ))}
      </div>
      <p className="text-center font-display text-lg font-semibold">
        {dividend} &divide; {divisor} = <span className="text-primary-600">{quotient}</span>
        {remainder > 0 && <> remainder <span className="text-amber-600">{remainder}</span></>}
      </p>
    </StageCard>
  );
}

// -- decimals ------------------------------------------------------------------
function DecimalsScene({ params }: { params: Record<string, number> }) {
  const dual = params.bWhole !== undefined;

  if (!dual) {
    const whole = Math.round(params.wholePart ?? 3);
    const tenths = Math.round(params.tenths ?? 4);
    const hundredths = Math.round(params.hundredths ?? 7);
    const value = whole + tenths / 10 + hundredths / 100;
    const max = Math.max(10, whole + 1);
    return (
      <StageCard>
        <p className="text-center text-sm text-slate-500">Building {whole}.{tenths}{hundredths}</p>
        <div className="flex justify-center items-center gap-3">
          <div className="rounded-2xl border-2 border-slate-900 dark:border-slate-700 p-3 text-center min-w-[70px]">
            <p className="text-[10px] font-bold text-slate-400">Ones</p>
            <p className="font-display text-xl font-bold text-primary-600">{whole}</p>
          </div>
          <p className="text-2xl font-bold">.</p>
          <div className="rounded-2xl border-2 border-slate-900 dark:border-slate-700 p-3 text-center min-w-[70px]">
            <p className="text-[10px] font-bold text-slate-400">Tenths (1/10)</p>
            <p className="font-display text-xl font-bold text-accent-600">{tenths}</p>
          </div>
          <div className="rounded-2xl border-2 border-slate-900 dark:border-slate-700 p-3 text-center min-w-[70px]">
            <p className="text-[10px] font-bold text-slate-400">Hundredths (1/100)</p>
            <p className="font-display text-xl font-bold text-amber-600">{hundredths}</p>
          </div>
        </div>
        <svg viewBox="0 0 320 50" className="w-full max-w-sm mx-auto">
          <line x1={10} y1={30} x2={310} y2={30} className="stroke-slate-300 dark:stroke-slate-700" strokeWidth={1.5} />
          {Array.from({ length: max + 1 }).map((_, i) => (
            <line key={i} x1={10 + (i / max) * 300} y1={25} x2={10 + (i / max) * 300} y2={35} className="stroke-slate-300 dark:stroke-slate-700" strokeWidth={1} />
          ))}
          <circle cx={10 + (value / max) * 300} cy={30} r={6} className="fill-primary-600 stroke-white dark:stroke-slate-900" strokeWidth={2} />
        </svg>
        <p className="text-center font-display text-lg font-semibold">{whole}.{tenths}{hundredths} = <span className="text-primary-600">{value}</span></p>
      </StageCard>
    );
  }

  const aWhole = Math.round(params.aWhole ?? 4);
  const aTenths = Math.round(params.aTenths ?? 6);
  const aHundredths = Math.round(params.aHundredths ?? 0);
  const bWhole = Math.round(params.bWhole ?? 2);
  const bTenths = Math.round(params.bTenths ?? 0);
  const bHundredths = Math.round(params.bHundredths ?? 8);
  const aValue = aWhole + aTenths / 10 + aHundredths / 100;
  const bValue = bWhole + bTenths / 10 + bHundredths / 100;
  const sum = Math.round((aValue + bValue) * 100) / 100;
  const max = Math.max(10, Math.ceil(Math.max(aValue, bValue)) + 1);

  return (
    <StageCard>
      <p className="text-center text-sm text-slate-500">Comparing {aWhole}.{aTenths}{aHundredths} and {bWhole}.{bTenths}{bHundredths}</p>
      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto text-center">
        <div>
          <p className="text-[10px] font-bold text-primary-600 uppercase">Number A</p>
          <p className="font-display text-xl font-bold">{aWhole}.{aTenths}{aHundredths}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-accent-600 uppercase">Number B</p>
          <p className="font-display text-xl font-bold">{bWhole}.{bTenths}{bHundredths}</p>
        </div>
      </div>
      <svg viewBox="0 0 320 50" className="w-full max-w-sm mx-auto">
        <line x1={10} y1={30} x2={310} y2={30} className="stroke-slate-300 dark:stroke-slate-700" strokeWidth={1.5} />
        {Array.from({ length: max + 1 }).map((_, i) => (
          <line key={i} x1={10 + (i / max) * 300} y1={25} x2={10 + (i / max) * 300} y2={35} className="stroke-slate-300 dark:stroke-slate-700" strokeWidth={1} />
        ))}
        <circle cx={10 + (aValue / max) * 300} cy={30} r={6} className="fill-primary-600 stroke-white dark:stroke-slate-900" strokeWidth={2} />
        <circle cx={10 + (bValue / max) * 300} cy={30} r={6} className="fill-accent-600 stroke-white dark:stroke-slate-900" strokeWidth={2} />
      </svg>
      <p className="text-center font-display text-lg font-semibold">
        {aValue} {aValue > bValue ? '>' : aValue < bValue ? '<' : '='} {bValue} &nbsp;|&nbsp; Sum = <span className="text-primary-600">{sum}</span>
      </p>
    </StageCard>
  );
}

// -- fractions -----------------------------------------------------------------
function FractionBar({ numerator, denominator, colorClass }: { numerator: number; denominator: number; colorClass: string }) {
  return (
    <div className="flex w-28 h-9 rounded-lg overflow-hidden border-2 border-slate-900 dark:border-slate-700">
      {Array.from({ length: Math.max(1, denominator) }).map((_, i) => (
        <div key={i} className={`flex-1 border-r border-slate-400/40 last:border-r-0 ${i < numerator ? colorClass : 'bg-slate-100 dark:bg-slate-800'}`} />
      ))}
    </div>
  );
}

function FractionCircle({ numerator, denominator, colorClass }: { numerator: number; denominator: number; colorClass: string }) {
  const center = { x: 50, y: 50 };
  const r = 44;
  const slices = Math.max(1, denominator);
  return (
    <svg viewBox="0 0 100 100" className="w-20 h-20">
      {Array.from({ length: slices }).map((_, i) => {
        const startAngle = -90 + (i * 360) / slices;
        const endAngle = -90 + ((i + 1) * 360) / slices;
        const p1 = pointOnCircle(center, r, startAngle);
        const p2 = pointOnCircle(center, r, endAngle);
        const largeArc = 360 / slices > 180 ? 1 : 0;
        return (
          <path
            key={i}
            d={`M ${center.x} ${center.y} L ${p1.x} ${p1.y} A ${r} ${r} 0 ${largeArc} 1 ${p2.x} ${p2.y} Z`}
            className={`${i < numerator ? colorClass : 'fill-slate-100 dark:fill-slate-800'} stroke-slate-900 dark:stroke-slate-600`}
            strokeWidth={1}
          />
        );
      })}
    </svg>
  );
}

function FractionsScene({ params }: { params: Record<string, number> }) {
  const dual = params.numeratorA !== undefined;

  if (!dual) {
    const numerator = Math.max(0, Math.round(params.numerator ?? 3));
    const denominator = Math.max(1, Math.round(params.denominator ?? 4));
    const wholes = Math.floor(numerator / denominator);
    const remainder = numerator % denominator;
    const unitsToShow = Math.max(1, wholes + (remainder > 0 ? 1 : 0));

    return (
      <StageCard>
        <p className="text-center text-sm text-slate-500">
          {numerator}/{denominator}
          {numerator > denominator && ' -- an improper fraction, more than one whole'}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: unitsToShow }).map((_, i) => (
            <FractionBar key={i} numerator={i < wholes ? denominator : remainder} denominator={denominator} colorClass="bg-primary-600" />
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: unitsToShow }).map((_, i) => (
            <FractionCircle key={i} numerator={i < wholes ? denominator : remainder} denominator={denominator} colorClass="fill-accent-600" />
          ))}
        </div>
        <p className="text-center font-display text-lg font-semibold">
          {numerator}/{denominator} = <span className="text-primary-600">{(numerator / denominator).toFixed(2)}</span>
        </p>
      </StageCard>
    );
  }

  const numeratorA = Math.max(0, Math.round(params.numeratorA ?? 1));
  const denominatorA = Math.max(1, Math.round(params.denominatorA ?? 3));
  const numeratorB = Math.max(0, Math.round(params.numeratorB ?? 1));
  const denominatorB = Math.max(1, Math.round(params.denominatorB ?? 4));
  const g = gcd(denominatorA, denominatorB);
  const commonDen = (denominatorA * denominatorB) / g;
  const scaledA = numeratorA * (commonDen / denominatorA);
  const scaledB = numeratorB * (commonDen / denominatorB);
  const sumNumerator = scaledA + scaledB;
  const sumGcd = gcd(sumNumerator || 1, commonDen);
  const simplified = sumGcd > 1 ? `${sumNumerator / sumGcd}/${commonDen / sumGcd}` : null;

  return (
    <StageCard>
      <p className="text-center text-sm text-slate-500">{numeratorA}/{denominatorA} + {numeratorB}/{denominatorB}</p>
      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto text-center">
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-primary-600 uppercase">{numeratorA}/{denominatorA} = {scaledA}/{commonDen}</p>
          <FractionBar numerator={scaledA} denominator={commonDen} colorClass="bg-primary-600" />
        </div>
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-accent-600 uppercase">{numeratorB}/{denominatorB} = {scaledB}/{commonDen}</p>
          <FractionBar numerator={scaledB} denominator={commonDen} colorClass="bg-accent-600" />
        </div>
      </div>
      <p className="text-center font-display text-lg font-semibold">
        {numeratorA}/{denominatorA} + {numeratorB}/{denominatorB} = <span className="text-primary-600">{sumNumerator}/{commonDen}</span>
        {simplified && <span className="text-sm text-slate-400 font-normal block mt-1">simplifies to {simplified}</span>}
      </p>
    </StageCard>
  );
}
