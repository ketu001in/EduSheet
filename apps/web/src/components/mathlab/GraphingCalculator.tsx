'use client';
import { useMemo, useState } from 'react';
import SpeakButton from '@/components/labshared/SpeakButton';

// Free Play's deeper graphing tool -- unlike the Linear Equation Grapher in
// Guided Experiments (fixed at degree 1), this plots any cubic
// y = ax^3 + bx^2 + cx + d, so a student can freely explore how each term
// reshapes the curve: constant, linear, quadratic, and cubic all visible
// as one continuous slider each, no fixed-form restriction. Coefficient
// sliders (not free-text expression input) deliberately -- evaluating an
// arbitrary user-typed formula would need a real expression parser to do
// safely, which is out of scope here; every curve this tool CAN draw is
// still exact, live-computed math, just from a bounded, safe input space.
const RANGE = 6; // x spans -6 to 6

export default function GraphingCalculator() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(1);
  const [c, setC] = useState(0);
  const [d, setD] = useState(0);

  const f = (x: number) => a * x ** 3 + b * x ** 2 + c * x + d;

  const { pathD, toSvg } = useMemo(() => {
    const xs = Array.from({ length: 121 }, (_, i) => -RANGE + (i / 120) * (2 * RANGE));
    const ys = xs.map(f);
    const maxAbsY = Math.max(...ys.map((y) => Math.abs(y)), 1);
    const yRange = Math.min(maxAbsY * 1.15, 500); // clamp so a runaway cubic doesn't flatten the view
    const toSvgPoint = (x: number, y: number) => ({
      x: ((x + RANGE) / (2 * RANGE)) * 300 + 10,
      y: 210 - ((Math.max(-yRange, Math.min(yRange, y)) + yRange) / (2 * yRange)) * 190,
    });
    const d0 = 'M ' + xs.map((x, i) => { const p = toSvgPoint(x, ys[i]); return `${p.x},${p.y}`; }).join(' L ');
    return { pathD: d0, toSvg: toSvgPoint };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a, b, c, d]);

  const origin = toSvg(0, 0);
  const formulaParts = [
    a !== 0 && `${a}x³`,
    b !== 0 && `${b}x²`,
    c !== 0 && `${c}x`,
    d !== 0 && `${d}`,
  ].filter(Boolean);
  const formula = formulaParts.length > 0 ? formulaParts.join(' + ').replace(/\+ -/g, '- ') : '0';

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <p className="text-sm text-slate-500">Adjust any coefficient and watch every term reshape the curve in real time.</p>
        <SpeakButton text={`This graphs y equals a x cubed, plus b x squared, plus c x, plus d. Adjust any of the four sliders and watch the curve reshape live.`} />
      </div>

      <div className="glass-card rounded-3xl p-5 md:p-7 space-y-5">
        <p className="text-center font-display text-lg font-semibold">y = {formula}</p>
        <svg viewBox="0 0 320 220" className="w-full max-w-md mx-auto rounded-2xl bg-slate-50 dark:bg-slate-900/40 border-2 border-slate-200 dark:border-slate-800">
          <line x1={10} y1={origin.y} x2={310} y2={origin.y} className="stroke-slate-300 dark:stroke-slate-700" strokeWidth={1.5} />
          <line x1={origin.x} y1={10} x2={origin.x} y2={210} className="stroke-slate-300 dark:stroke-slate-700" strokeWidth={1.5} />
          <path d={pathD} className="fill-none stroke-primary-600" strokeWidth={2.5} />
        </svg>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'a (cubic term)', value: a, setValue: setA },
            { label: 'b (quadratic term)', value: b, setValue: setB },
            { label: 'c (linear term)', value: c, setValue: setC },
            { label: 'd (constant term)', value: d, setValue: setD },
          ].map((row) => (
            <div key={row.label} className="text-xs font-bold text-slate-500 space-y-1.5">
              <span className="block">{row.label} ({row.value})</span>
              <input
                type="range"
                min={-5}
                max={5}
                step={0.5}
                value={row.value}
                onChange={(e) => row.setValue(parseFloat(e.target.value))}
                className="w-full accent-primary-600"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
