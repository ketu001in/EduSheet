'use client';
import { useRef, useState } from 'react';
import { Zap, RefreshCw } from 'lucide-react';
import { leastSquaresFit } from '@/lib/aiCodingEngine';

// A real, click-to-add-point interactive: unlike the perceptron/kNN/k-means
// scenes, a single input -> single continuous output relationship is
// genuinely clearest as a flat 2D line, so this stays 2D and leans into
// direct-manipulation playfulness instead -- click to add a data point
// (or click an existing one to remove it), and the real least-squares
// best-fit line refits live, every time.
const SEED_POINTS = [
  { x: 1, y: 35 }, { x: 2, y: 42 }, { x: 3, y: 50 }, { x: 4, y: 55 }, { x: 5, y: 68 },
  { x: 6, y: 72 }, { x: 7, y: 80 }, { x: 8, y: 85 }, { x: 9, y: 90 },
];
const X_MAX = 10, Y_MAX = 100;
function toScreen(x: number, y: number) {
  return { sx: 20 + (x / X_MAX) * 170, sy: 190 - (y / Y_MAX) * 170 };
}
function fromScreen(sx: number, sy: number) {
  return { x: ((sx - 20) / 170) * X_MAX, y: ((190 - sy) / 170) * Y_MAX };
}

export default function LinearRegressionScene() {
  const [points, setPoints] = useState(SEED_POINTS);
  const svgRef = useRef<SVGSVGElement>(null);

  const { slope, intercept, rSquared } = leastSquaresFit(points);
  const lineStart = toScreen(0, intercept);
  const lineEnd = toScreen(X_MAX, slope * X_MAX + intercept);

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const sx = ((e.clientX - rect.left) / rect.width) * 200;
    const sy = ((e.clientY - rect.top) / rect.height) * 200;

    // Clicking near an existing point removes it; clicking empty space adds one.
    const clickedIndex = points.findIndex((p) => {
      const { sx: psx, sy: psy } = toScreen(p.x, p.y);
      return Math.hypot(psx - sx, psy - sy) < 8;
    });
    if (clickedIndex >= 0) {
      setPoints(points.filter((_, i) => i !== clickedIndex));
      return;
    }
    if (sx < 15 || sx > 195 || sy < 5 || sy > 195) return;
    const { x, y } = fromScreen(sx, sy);
    setPoints([...points, { x: Math.max(0, Math.min(X_MAX, x)), y: Math.max(0, Math.min(Y_MAX, y)) }]);
  };

  return (
    <div className="rounded-2xl border-2 border-primary-200 dark:border-primary-900 bg-gradient-to-br from-primary-50/60 via-white to-accent-50/40 dark:from-primary-950/20 dark:via-slate-950 dark:to-accent-950/10 p-4 md:p-5 space-y-3 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
        <Zap className="w-4 h-4 text-primary-600" /> Predict a Real Number, Not a Class
      </div>
      <p className="text-center text-xs text-slate-500">X: hours studied. Y: exam score. Click empty space to add a data point, click an existing dot to remove it -- the real least-squares line refits instantly.</p>
      <div className="flex justify-center">
        <svg ref={svgRef} viewBox="0 0 200 200" onClick={handleSvgClick} className="w-64 h-64 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 cursor-crosshair">
          <defs>
            <linearGradient id="regressionLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          <line x1={20} y1={10} x2={20} y2={190} className="stroke-slate-200 dark:stroke-slate-700" strokeWidth={1} />
          <line x1={20} y1={190} x2={190} y2={190} className="stroke-slate-200 dark:stroke-slate-700" strokeWidth={1} />
          {points.length >= 2 && (
            <line x1={lineStart.sx} y1={Math.max(5, Math.min(195, lineStart.sy))} x2={lineEnd.sx} y2={Math.max(5, Math.min(195, lineEnd.sy))} stroke="url(#regressionLine)" strokeWidth={2.5} strokeLinecap="round" />
          )}
          {points.map((p, i) => {
            const { sx, sy } = toScreen(p.x, p.y);
            return <circle key={i} cx={sx} cy={sy} r={5} className="fill-primary-600 hover:fill-red-500 transition-colors" />;
          })}
        </svg>
      </div>
      <div className="flex justify-center">
        <button onClick={() => setPoints(SEED_POINTS)} className="px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-800 font-bold text-sm flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"><RefreshCw className="w-4 h-4" /> Reset Data</button>
      </div>
      <p className="text-center text-sm font-bold text-slate-600 dark:text-slate-300">
        score &asymp; {slope.toFixed(2)} &times; hours + {intercept.toFixed(1)} &middot; R&sup2; = {rSquared.toFixed(3)}
      </p>
    </div>
  );
}
