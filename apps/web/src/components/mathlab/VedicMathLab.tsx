'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { VEDIC_SUTRAS, VEDIC_MATH_HISTORICITY_NOTE, VedicSutra } from '@edusheets/content';
import SpeakButton from '@/components/labshared/SpeakButton';
import Tilt3DCard from '@/components/labshared/Tilt3DCard';
import { playHoverTick, playSuccessChime } from '@/lib/uiSoundEngine';
import {
  ekadhikenaSquare, urdhvaTiryagbhyam, nikhilamMultiply,
  antyayordashake, yavadunamSquare, ekanyunenaMultiply,
} from '@/lib/vedicMathEngine';
import { useContent } from '@/lib/useContent';

function SutraHeader({ sutra }: { sutra: VedicSutra }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-2xl font-display">{sutra.sanskrit}</p>
          <p className="text-sm font-bold text-primary-600">{sutra.transliteration} -- &ldquo;{sutra.translation}&rdquo;</p>
        </div>
        <SpeakButton text={`${sutra.transliteration}, meaning ${sutra.translation}. ${sutra.description} It's used for ${sutra.usedFor}.`} />
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300">{sutra.description}</p>
      <p className="text-xs text-slate-400">Used for: {sutra.usedFor}</p>
    </div>
  );
}

// Shared step-reveal control -- every calculator's working now animates one
// step at a time (Next/Back, progress dots, a tick sound per step and a
// success chime on the final reveal) instead of dumping every line of
// arithmetic on screen at once. `steps` re-renders fresh from the live
// input each time, so changing the numbers mid-walkthrough keeps your
// place instead of jumping back to step 1.
function StepReveal({ steps }: { steps: React.ReactNode[] }) {
  const [i, setI] = useState(0);
  const clamped = Math.min(i, steps.length - 1);
  const advance = (next: number) => {
    setI(next);
    if (next >= steps.length - 1) playSuccessChime(); else playHoverTick();
  };
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400">Step {clamped + 1} of {steps.length}</span>
        <div className="flex items-center gap-1.5">
          <button onClick={() => advance(Math.max(0, clamped - 1))} disabled={clamped === 0} className="p-1.5 rounded-lg border-2 border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:border-primary-400">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => advance(Math.min(steps.length - 1, clamped + 1))} disabled={clamped === steps.length - 1} className="p-1.5 rounded-lg border-2 border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:border-primary-400">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex gap-1.5">
        {steps.map((_, idx) => (
          <div key={idx} className={`h-1.5 flex-1 rounded-full transition-colors ${idx <= clamped ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-800'}`} />
        ))}
      </div>
      <div className="space-y-2">
        {steps.slice(0, clamped + 1).map((s, idx) => (
          <p
            key={idx}
            className={`text-sm rounded-xl p-3 transition-all ${idx === clamped ? 'bg-primary-50 dark:bg-primary-900/20 font-bold scale-[1.01]' : 'bg-slate-50 dark:bg-slate-800/40 text-slate-500'}`}
          >
            {s}
          </p>
        ))}
      </div>
    </div>
  );
}

function NumberField({ label, value, onChange, min, max }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-500">{label}</label>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
        className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-transparent p-3 text-lg font-bold focus:border-primary-500 outline-none"
      />
    </div>
  );
}

function EkadhikenaCalculator({ sutra }: { sutra: VedicSutra }) {
  const [n, setN] = useState(25);
  const validInput = n % 10 === 5 && n >= 5;
  const { a, step1, result } = ekadhikenaSquare(validInput ? n : 25);
  const shown = validInput ? n : 25;
  return (
    <div className="glass-card rounded-3xl p-5 md:p-7 space-y-5">
      <SutraHeader sutra={sutra} />
      <NumberField label="Pick a number ending in 5" value={n} onChange={setN} min={5} />
      {!validInput && <p className="text-xs text-amber-600">Must end in 5 -- showing 25 below until you enter one.</p>}
      <StepReveal steps={[
        <>Take the part before the 5: <span className="font-mono font-bold">{a}</span></>,
        <>Multiply it by one more than itself: {a} &times; {a + 1} = <span className="font-mono font-bold">{step1}</span></>,
        <>Write 25 right after it: <span className="font-mono font-bold">{step1}</span> &rarr; <span className="font-mono font-bold text-primary-600">{step1}25</span></>,
      ]} />
      <p className="text-center font-display text-xl font-bold">{shown}<sup>2</sup> = <span className="text-primary-600">{result}</span></p>
    </div>
  );
}

function UrdhvaCalculator({ sutra }: { sutra: VedicSutra }) {
  const [x, setX] = useState(23);
  const [y, setY] = useState(47);
  const validX = x >= 10 && x <= 99;
  const validY = y >= 10 && y <= 99;
  const r = urdhvaTiryagbhyam(validX ? x : 23, validY ? y : 47);
  return (
    <div className="glass-card rounded-3xl p-5 md:p-7 space-y-5">
      <SutraHeader sutra={sutra} />
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="First number (10-99)" value={x} onChange={setX} min={10} max={99} />
        <NumberField label="Second number (10-99)" value={y} onChange={setY} min={10} max={99} />
      </div>
      {(!validX || !validY) && <p className="text-xs text-amber-600">Both must be two-digit numbers (10-99) -- showing 23 x 47 below until then.</p>}
      <StepReveal steps={[
        <>Units (crosswise-right): {r.b} &times; {r.d} = {r.units} &rarr; write <span className="font-mono font-bold">{r.unitsDigit}</span>, carry {r.unitsCarry}</>,
        <>Crosswise: ({r.a}&times;{r.d}) + ({r.b}&times;{r.c}) + carry {r.unitsCarry} = {r.cross} &rarr; write <span className="font-mono font-bold">{r.crossDigit}</span>, carry {r.crossCarry}</>,
        <>Leading (vertically-left): {r.a} &times; {r.c} + carry {r.crossCarry} = <span className="font-mono font-bold">{r.leading}</span></>,
      ]} />
      <p className="text-center font-display text-xl font-bold">{validX ? x : 23} &times; {validY ? y : 47} = <span className="text-primary-600">{r.result}</span></p>
    </div>
  );
}

function NikhilamCalculator({ sutra }: { sutra: VedicSutra }) {
  const [x, setX] = useState(96);
  const [y, setY] = useState(97);
  const validX = x >= 51 && x <= 99;
  const validY = y >= 51 && y <= 99;
  const r = nikhilamMultiply(validX ? x : 96, validY ? y : 97, 100);
  return (
    <div className="glass-card rounded-3xl p-5 md:p-7 space-y-5">
      <SutraHeader sutra={sutra} />
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="First number (51-99)" value={x} onChange={setX} min={51} max={99} />
        <NumberField label="Second number (51-99)" value={y} onChange={setY} min={51} max={99} />
      </div>
      {(!validX || !validY) && <p className="text-xs text-amber-600">Both should be close to 100 (51-99) for this technique to make sense -- showing 96 x 97 below until then.</p>}
      <StepReveal steps={[
        <>How far short of 100 is each number? {validX ? x : 96} is short by <span className="font-mono font-bold">{r.dx}</span>, {validY ? y : 97} is short by <span className="font-mono font-bold">{r.dy}</span></>,
        <>Cross-subtract one deficiency from the other number: {validX ? x : 96} - {r.dy} = <span className="font-mono font-bold">{r.leftPart}</span></>,
        <>Multiply the two deficiencies: {r.dx} &times; {r.dy} = <span className="font-mono font-bold">{r.productOfDeficiencies}</span>{r.carry > 0 && <> (carries {r.carry} over, leaving {r.remainder})</>}</>,
      ]} />
      <p className="text-center font-display text-xl font-bold">{validX ? x : 96} &times; {validY ? y : 97} = <span className="text-primary-600">{r.result}</span></p>
    </div>
  );
}

function AntyayordashakeCalculator({ sutra }: { sutra: VedicSutra }) {
  const [x, setX] = useState(23);
  const [y, setY] = useState(27);
  const sameTens = Math.floor(x / 10) === Math.floor(y / 10) && x >= 10 && x <= 99 && y >= 10 && y <= 99;
  const sumsToTen = (x % 10) + (y % 10) === 10;
  const validInput = sameTens && sumsToTen;
  const r = antyayordashake(validInput ? x : 23, validInput ? y : 27);
  return (
    <div className="glass-card rounded-3xl p-5 md:p-7 space-y-5">
      <SutraHeader sutra={sutra} />
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="First number" value={x} onChange={setX} min={10} max={99} />
        <NumberField label="Second number" value={y} onChange={setY} min={10} max={99} />
      </div>
      {!validInput && <p className="text-xs text-amber-600">Both need the same tens digit, with units digits summing to 10 (like 23 &amp; 27) -- showing that example below until then.</p>}
      <StepReveal steps={[
        <>Same tens digit: t = <span className="font-mono font-bold">{r.t}</span>. Units digits {r.u1} and {r.u2} sum to 10 ✓</>,
        <>Multiply t by (t+1): {r.t} &times; {r.t + 1} = <span className="font-mono font-bold">{r.leading}</span> &rarr; the leading digits</>,
        <>Multiply the units digits: {r.u1} &times; {r.u2} = <span className="font-mono font-bold">{r.trailing}</span> &rarr; the trailing digits</>,
        <>Combine: <span className="font-mono font-bold">{r.leading}</span> followed by <span className="font-mono font-bold">{String(r.trailing).padStart(2, '0')}</span> &rarr; <span className="font-mono font-bold text-primary-600">{r.result}</span></>,
      ]} />
      <p className="text-center font-display text-xl font-bold">{validInput ? x : 23} &times; {validInput ? y : 27} = <span className="text-primary-600">{r.result}</span></p>
    </div>
  );
}

function YavadunamCalculator({ sutra }: { sutra: VedicSutra }) {
  const [x, setX] = useState(98);
  const validInput = x >= 90 && x <= 110 && x !== 100;
  const r = yavadunamSquare(validInput ? x : 98, 100);
  const shown = validInput ? x : 98;
  return (
    <div className="glass-card rounded-3xl p-5 md:p-7 space-y-5">
      <SutraHeader sutra={sutra} />
      <NumberField label="Pick a number close to 100 (90-110)" value={x} onChange={setX} min={90} max={110} />
      {!validInput && <p className="text-xs text-amber-600">Pick a number close to the base 100 (90-110, not 100 itself) -- showing 98 below until then.</p>}
      <StepReveal steps={[
        <>How far is {shown} from the base 100? d = {shown} - 100 = <span className="font-mono font-bold">{r.d}</span></>,
        <>Adjust: {shown} + d = {shown} + ({r.d}) = <span className="font-mono font-bold">{r.adjusted}</span></>,
        <>Multiply by the base: {r.adjusted} &times; 100 = <span className="font-mono font-bold">{r.scaled}</span></>,
        <>Add d squared: ({r.d})² = {r.dSquared} &rarr; {r.scaled} + {r.dSquared} = <span className="font-mono font-bold text-primary-600">{r.result}</span></>,
      ]} />
      <p className="text-center font-display text-xl font-bold">{shown}<sup>2</sup> = <span className="text-primary-600">{r.result}</span></p>
    </div>
  );
}

function EkanyunenaCalculator({ sutra }: { sutra: VedicSutra }) {
  const [n, setN] = useState(43);
  const validInput = n >= 1 && n <= 99;
  const r = ekanyunenaMultiply(validInput ? n : 43, 100);
  const shown = validInput ? n : 43;
  return (
    <div className="glass-card rounded-3xl p-5 md:p-7 space-y-5">
      <SutraHeader sutra={sutra} />
      <NumberField label="Pick a number to multiply by 99" value={n} onChange={setN} min={1} max={99} />
      {!validInput && <p className="text-xs text-amber-600">Pick a number smaller than 100 -- showing 43 below until then.</p>}
      <StepReveal steps={[
        <>Multiplier is 99 (2 nines) &rarr; base = <span className="font-mono font-bold">{r.base}</span></>,
        <>Left part: n - 1 = {shown} - 1 = <span className="font-mono font-bold">{r.left}</span></>,
        <>Right part: base - n = {r.base} - {shown} = <span className="font-mono font-bold">{r.rightPadded}</span> (padded to {r.digitCount} digits)</>,
        <>Combine: <span className="font-mono font-bold">{r.left}</span> followed by <span className="font-mono font-bold">{r.rightPadded}</span> &rarr; <span className="font-mono font-bold text-primary-600">{r.result}</span></>,
      ]} />
      <p className="text-center font-display text-xl font-bold">{shown} &times; 99 = <span className="text-primary-600">{r.result}</span></p>
    </div>
  );
}

const CALCULATORS: Record<string, (props: { sutra: VedicSutra }) => React.ReactElement> = {
  'ekadhikena-purvena': EkadhikenaCalculator,
  'urdhva-tiryagbhyam': UrdhvaCalculator,
  nikhilam: NikhilamCalculator,
  antyayordashake: AntyayordashakeCalculator,
  yavadunam: YavadunamCalculator,
  'ekanyunena-purvena': EkanyunenaCalculator,
};

export default function VedicMathLab() {
  // CMS Phase 2: merges in any admin edits from /admin/content live -- see
  // lib/useContent.ts. Editing an existing sutra's text works fully; a
  // brand-new admin-added sutra shows its text but falls back to a plain
  // message below instead of a calculator, since each calculator here is
  // real, hand-verified arithmetic specific to that one sutra (see
  // vedicMathEngine.ts) -- not something that can be generated generically
  // for an arbitrary new sutra without the same verification rigor.
  const sutras = useContent('vedic-sutra', VEDIC_SUTRAS);
  const [activeId, setActiveId] = useState(VEDIC_SUTRAS[0].id);
  const active = sutras.find((s) => s.id === activeId) || sutras[0];
  const Calculator = CALCULATORS[active.id];

  const selectSutra = (id: string) => setActiveId(id);

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-2xl p-4 flex items-start gap-3 bg-amber-50/50 dark:bg-amber-950/10">
        <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{VEDIC_MATH_HISTORICITY_NOTE}</p>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {sutras.map((s) => (
          <Tilt3DCard
            key={s.id}
            active={activeId === s.id}
            onClick={() => selectSutra(s.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold ${activeId === s.id ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}`}
          >
            {s.transliteration}
          </Tilt3DCard>
        ))}
      </div>

      {Calculator ? (
        <Calculator sutra={active} />
      ) : (
        <div className="glass-card rounded-3xl p-5 md:p-7 space-y-4">
          <SutraHeader sutra={active} />
          <p className="text-xs text-slate-400">This sutra doesn&apos;t have an interactive calculator built yet -- only the six above do, each hand-verified against hundreds to thousands of test cases (see the code comments in lib/vedicMathEngine.ts).</p>
        </div>
      )}
    </div>
  );
}
