'use client';
import { useState } from 'react';
import { Info } from 'lucide-react';
import { VEDIC_SUTRAS, VEDIC_MATH_HISTORICITY_NOTE, VedicSutra } from '@edusheets/content';
import SpeakButton from '@/components/labshared/SpeakButton';
import { ekadhikenaSquare, urdhvaTiryagbhyam, nikhilamMultiply } from '@/lib/vedicMathEngine';

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

function EkadhikenaCalculator({ sutra }: { sutra: VedicSutra }) {
  const [n, setN] = useState(25);
  const validInput = n % 10 === 5 && n >= 5;
  const { a, step1, result } = ekadhikenaSquare(validInput ? n : 25);
  const shown = validInput ? n : 25;

  return (
    <div className="glass-card rounded-3xl p-5 md:p-7 space-y-5">
      <SutraHeader sutra={sutra} />
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500">Pick a number ending in 5</label>
        <input
          type="number"
          value={n}
          step={10}
          onChange={(e) => setN(parseInt(e.target.value, 10) || 0)}
          className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-transparent p-3 text-lg font-bold focus:border-primary-500 outline-none"
        />
        {!validInput && <p className="text-xs text-amber-600">Must end in 5 -- showing 25 below until you enter one.</p>}
      </div>
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 space-y-2 text-sm">
        <p>1. Take the part before the 5: <span className="font-mono font-bold">{a}</span></p>
        <p>2. Multiply it by one more than itself: {a} &times; {a + 1} = <span className="font-mono font-bold">{step1}</span></p>
        <p>3. Write 25 right after it: <span className="font-mono font-bold">{step1}</span> &rarr; <span className="font-mono font-bold text-primary-600">{step1}25</span></p>
      </div>
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
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500">First number (10-99)</label>
          <input type="number" min={10} max={99} value={x} onChange={(e) => setX(parseInt(e.target.value, 10) || 0)} className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-transparent p-3 text-lg font-bold focus:border-primary-500 outline-none" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500">Second number (10-99)</label>
          <input type="number" min={10} max={99} value={y} onChange={(e) => setY(parseInt(e.target.value, 10) || 0)} className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-transparent p-3 text-lg font-bold focus:border-primary-500 outline-none" />
        </div>
      </div>
      {(!validX || !validY) && <p className="text-xs text-amber-600">Both must be two-digit numbers (10-99) -- showing 23 x 47 below until then.</p>}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 space-y-2 text-sm">
        <p>1. Units (crosswise-right): {r.b} &times; {r.d} = {r.units} &rarr; write <span className="font-mono font-bold">{r.unitsDigit}</span>, carry {r.unitsCarry}</p>
        <p>2. Crosswise: ({r.a}&times;{r.d}) + ({r.b}&times;{r.c}) + carry {r.unitsCarry} = {r.cross} &rarr; write <span className="font-mono font-bold">{r.crossDigit}</span>, carry {r.crossCarry}</p>
        <p>3. Leading (vertically-left): {r.a} &times; {r.c} + carry {r.crossCarry} = <span className="font-mono font-bold">{r.leading}</span></p>
      </div>
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
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500">First number (51-99)</label>
          <input type="number" min={51} max={99} value={x} onChange={(e) => setX(parseInt(e.target.value, 10) || 0)} className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-transparent p-3 text-lg font-bold focus:border-primary-500 outline-none" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500">Second number (51-99)</label>
          <input type="number" min={51} max={99} value={y} onChange={(e) => setY(parseInt(e.target.value, 10) || 0)} className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-transparent p-3 text-lg font-bold focus:border-primary-500 outline-none" />
        </div>
      </div>
      {(!validX || !validY) && <p className="text-xs text-amber-600">Both should be close to 100 (51-99) for this technique to make sense -- showing 96 x 97 below until then.</p>}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 space-y-2 text-sm">
        <p>1. How far short of 100 is each number? {validX ? x : 96} is short by <span className="font-mono font-bold">{r.dx}</span>, {validY ? y : 97} is short by <span className="font-mono font-bold">{r.dy}</span></p>
        <p>2. Cross-subtract one deficiency from the other number: {validX ? x : 96} - {r.dy} = <span className="font-mono font-bold">{r.leftPart}</span></p>
        <p>3. Multiply the two deficiencies: {r.dx} &times; {r.dy} = <span className="font-mono font-bold">{r.productOfDeficiencies}</span>{r.carry > 0 && <> (carries {r.carry} over, leaving {r.remainder})</>}</p>
      </div>
      <p className="text-center font-display text-xl font-bold">{validX ? x : 96} &times; {validY ? y : 97} = <span className="text-primary-600">{r.result}</span></p>
    </div>
  );
}

export default function VedicMathLab() {
  const [activeId, setActiveId] = useState(VEDIC_SUTRAS[0].id);
  const active = VEDIC_SUTRAS.find((s) => s.id === activeId) || VEDIC_SUTRAS[0];

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-2xl p-4 flex items-start gap-3 bg-amber-50/50 dark:bg-amber-950/10">
        <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{VEDIC_MATH_HISTORICITY_NOTE}</p>
      </div>

      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl w-fit">
        {VEDIC_SUTRAS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveId(s.id)}
            className={`px-3.5 py-2 rounded-lg text-sm font-bold transition-all ${activeId === s.id ? 'bg-white dark:bg-slate-900 shadow-sm text-primary-600' : 'text-slate-500'}`}
          >
            {s.transliteration}
          </button>
        ))}
      </div>

      {active.id === 'ekadhikena-purvena' && <EkadhikenaCalculator sutra={active} />}
      {active.id === 'urdhva-tiryagbhyam' && <UrdhvaCalculator sutra={active} />}
      {active.id === 'nikhilam' && <NikhilamCalculator sutra={active} />}
    </div>
  );
}
