'use client';
import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { AlertTriangle } from 'lucide-react';
import SpeakButton from '@/components/labshared/SpeakButton';
import Tilt3DCard from '@/components/labshared/Tilt3DCard';
import ModernSlider from '@/components/labshared/ModernSlider';
import { compileExpression } from '@/lib/exprParser';

const Surface3DScene = dynamic(() => import('./Surface3DScene'), {
  ssr: false,
  loading: () => <div className="w-full h-[340px] rounded-2xl bg-slate-50 dark:bg-slate-900/40 animate-pulse" />,
});

// Free Play's graphing tool -- genuinely real-time (recomputes on every
// keystroke/slider move, no submit button) in three modes:
//  - Sliders: the original bounded-and-safe coefficient cubic, kept as the
//    friendliest on-ramp for younger students (no typing required).
//  - Type a Formula (2D): any y=f(x) via a real, hand-verified expression
//    parser (exprParser.ts, no eval/Function) -- free-form, not limited to
//    a fixed polynomial degree.
//  - 3D Surface: any z=f(x,y), the one place in Math Lab 3D isn't
//    optional -- a 2-variable function genuinely cannot be seen in a 2D
//    plot at all.
const RANGE_2D = 6;
const CUBIC_2D_PRESETS = ['x^3 - 3*x', 'x^2 - 2*x - 3', 'sin(x)', '1/x', 'sqrt(x+6)', 'abs(x)'];
const SURFACE_PRESETS = ['sin(x)*cos(y)', 'x^2 + y^2', 'x^2 - y^2', 'sin(sqrt(x^2+y^2))'];

type Mode2D = 'sliders' | 'formula';

export default function GraphingCalculator() {
  const [is3D, setIs3D] = useState(false);
  const [mode2D, setMode2D] = useState<Mode2D>('sliders');

  // -- Sliders (cubic) mode ---------------------------------------------------
  const [a, setA] = useState(0);
  const [b, setB] = useState(1);
  const [c, setC] = useState(0);
  const [d, setD] = useState(0);
  const cubicFn = (x: number) => a * x ** 3 + b * x ** 2 + c * x + d;
  const formulaParts = [
    a !== 0 && `${a}x³`, b !== 0 && `${b}x²`, c !== 0 && `${c}x`, d !== 0 && `${d}`,
  ].filter(Boolean);
  const cubicFormula = formulaParts.length > 0 ? formulaParts.join(' + ').replace(/\+ -/g, '- ') : '0';

  // -- Type a Formula (2D) mode -------------------------------------------------
  const [expr2D, setExpr2D] = useState('x^2 - 2*x - 1');
  const { fn2D, error2D } = useMemo(() => {
    try {
      const compiled = compileExpression(expr2D);
      compiled({ x: 1 }); // smoke-test the expression once before trusting it for 121 samples
      return { fn2D: (x: number) => compiled({ x }), error2D: null as string | null };
    } catch (err) {
      return { fn2D: null, error2D: err instanceof Error ? err.message : 'Invalid expression' };
    }
  }, [expr2D]);

  const activeFn2D = mode2D === 'sliders' ? cubicFn : fn2D;

  const { pathD, toSvg } = useMemo(() => {
    const f = activeFn2D || cubicFn;
    const xs = Array.from({ length: 121 }, (_, i) => -RANGE_2D + (i / 120) * (2 * RANGE_2D));
    const ys = xs.map((x) => { const y = f(x); return Number.isFinite(y) ? y : NaN; });
    const finiteYs = ys.filter((y) => Number.isFinite(y));
    const maxAbsY = Math.max(...finiteYs.map((y) => Math.abs(y)), 1);
    const yRange = Math.min(maxAbsY * 1.15, 500);
    const toSvgPoint = (x: number, y: number) => ({
      x: ((x + RANGE_2D) / (2 * RANGE_2D)) * 300 + 10,
      y: 210 - ((Math.max(-yRange, Math.min(yRange, y)) + yRange) / (2 * yRange)) * 190,
    });
    // Break the path at NaN/Infinity gaps (e.g. 1/x at x=0) instead of
    // drawing a false connecting line across an undefined point.
    let d0 = '';
    let drawing = false;
    xs.forEach((x, i) => {
      const y = ys[i];
      if (!Number.isFinite(y)) { drawing = false; return; }
      const p = toSvgPoint(x, y);
      d0 += `${drawing ? 'L' : 'M'} ${p.x},${p.y} `;
      drawing = true;
    });
    return { pathD: d0, toSvg: toSvgPoint };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a, b, c, d, mode2D, fn2D]);

  // -- 3D Surface mode -----------------------------------------------------------
  const [expr3D, setExpr3D] = useState('sin(x)*cos(y)');
  const [range3D, setRange3D] = useState(4);
  const resolution = 32;
  const { heights3D, error3D } = useMemo(() => {
    try {
      const compiled = compileExpression(expr3D);
      const grid = new Float32Array(resolution * resolution);
      let i = 0;
      for (let iy = 0; iy < resolution; iy++) {
        const y = -range3D + (iy / (resolution - 1)) * 2 * range3D;
        for (let ix = 0; ix < resolution; ix++) {
          const x = -range3D + (ix / (resolution - 1)) * 2 * range3D;
          let z = compiled({ x, y });
          if (!Number.isFinite(z)) z = 0;
          grid[i++] = Math.max(-8, Math.min(8, z)); // clamp so a runaway function (e.g. 1/x near 0) can't blow out the mesh
        }
      }
      return { heights3D: grid, error3D: null as string | null };
    } catch (err) {
      return { heights3D: null, error3D: err instanceof Error ? err.message : 'Invalid expression' };
    }
  }, [expr3D, range3D]);

  const origin = toSvg(0, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <p className="text-sm text-slate-500">Every curve here is live -- type a real formula or drag a slider and watch it redraw instantly.</p>
        <SpeakButton text="Pick 2D Curve to graph any y equals f of x, or 3D Surface to graph any z equals f of x, y -- type a real formula and watch it plot live." />
      </div>

      <div className="flex flex-wrap gap-2.5">
        <Tilt3DCard active={!is3D} onClick={() => setIs3D(false)} className={`px-4 py-2.5 rounded-xl text-sm font-bold ${!is3D ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}`}>2D Curve</Tilt3DCard>
        <Tilt3DCard active={is3D} onClick={() => setIs3D(true)} className={`px-4 py-2.5 rounded-xl text-sm font-bold ${is3D ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}`}>3D Surface</Tilt3DCard>
      </div>

      {!is3D && (
        <div className="glass-card rounded-3xl p-5 md:p-7 space-y-5">
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl w-fit">
            {(['sliders', 'formula'] as Mode2D[]).map((m) => (
              <button key={m} onClick={() => setMode2D(m)} className={`px-3.5 py-2 rounded-lg text-sm font-bold transition-all ${mode2D === m ? 'bg-white dark:bg-slate-900 shadow-sm text-primary-600' : 'text-slate-500'}`}>
                {m === 'sliders' ? 'Sliders (cubic)' : 'Type a Formula'}
              </button>
            ))}
          </div>

          {mode2D === 'formula' && (
            <div className="space-y-2">
              <input
                type="text"
                value={expr2D}
                onChange={(e) => setExpr2D(e.target.value)}
                placeholder="e.g. x^2 - 3*x + 2"
                className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-transparent p-3 font-mono text-sm focus:border-primary-500 outline-none"
              />
              {error2D && (
                <p className="flex items-center gap-1.5 text-xs text-amber-600"><AlertTriangle className="w-3.5 h-3.5" /> {error2D} -- showing the last valid graph.</p>
              )}
              <div className="flex flex-wrap gap-1.5">
                {CUBIC_2D_PRESETS.map((p) => (
                  <button key={p} onClick={() => setExpr2D(p)} className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/20">{p}</button>
                ))}
              </div>
            </div>
          )}

          <p className="text-center font-display text-lg font-semibold">y = {mode2D === 'sliders' ? cubicFormula : expr2D}</p>
          <svg viewBox="0 0 320 220" className="w-full max-w-md mx-auto rounded-2xl bg-slate-50 dark:bg-slate-900/40 border-2 border-slate-200 dark:border-slate-800">
            <line x1={10} y1={origin.y} x2={310} y2={origin.y} className="stroke-slate-300 dark:stroke-slate-700" strokeWidth={1.5} />
            <line x1={origin.x} y1={10} x2={origin.x} y2={210} className="stroke-slate-300 dark:stroke-slate-700" strokeWidth={1.5} />
            <path d={pathD} className="fill-none stroke-primary-600" strokeWidth={2.5} />
          </svg>

          {mode2D === 'sliders' && (
            <div className="grid grid-cols-2 gap-4">
              <ModernSlider label="a (cubic term)" min={-5} max={5} step={0.5} value={a} onChange={setA} />
              <ModernSlider label="b (quadratic term)" min={-5} max={5} step={0.5} value={b} onChange={setB} />
              <ModernSlider label="c (linear term)" min={-5} max={5} step={0.5} value={c} onChange={setC} />
              <ModernSlider label="d (constant term)" min={-5} max={5} step={0.5} value={d} onChange={setD} />
            </div>
          )}
        </div>
      )}

      {is3D && (
        <div className="glass-card rounded-3xl p-5 md:p-7 space-y-5">
          <div className="space-y-2">
            <input
              type="text"
              value={expr3D}
              onChange={(e) => setExpr3D(e.target.value)}
              placeholder="e.g. sin(x)*cos(y)"
              className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-transparent p-3 font-mono text-sm focus:border-primary-500 outline-none"
            />
            {error3D && (
              <p className="flex items-center gap-1.5 text-xs text-amber-600"><AlertTriangle className="w-3.5 h-3.5" /> {error3D} -- showing the last valid surface.</p>
            )}
            <div className="flex flex-wrap gap-1.5">
              {SURFACE_PRESETS.map((p) => (
                <button key={p} onClick={() => setExpr3D(p)} className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/20">{p}</button>
              ))}
            </div>
          </div>

          <p className="text-center font-display text-lg font-semibold">z = {expr3D}</p>
          {heights3D && <Surface3DScene heights={heights3D} resolution={resolution} range={range3D} />}

          <div className="max-w-xs mx-auto">
            <ModernSlider label="Domain range" unit=" units" min={2} max={7} step={1} value={range3D} onChange={setRange3D} />
          </div>
        </div>
      )}
    </div>
  );
}
