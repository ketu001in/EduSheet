'use client';
import { useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import SpeakButton from '@/components/labshared/SpeakButton';
import {
  Point, triangleAngles, angleOf, pointOnCircle, angleAtVertex, keepAngleOutsideRange,
} from '@/lib/mathEngine';

// Two flagship "live geometry" constructions -- drag a point, watch the
// live-computed angles prove the theorem in real time, rather than just
// reading a static statement. Distinct from AnatomyExplorer's fixed hotspot
// pattern: every number on screen here is recomputed from the actual
// dragged coordinates every frame, not looked up from curated data.
const VIEW = 400;

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

// Converts a pointer event's screen coordinates into the SVG's own 0-VIEW
// coordinate space, accounting for however large the SVG is actually
// rendered on screen (responsive width via CSS, fixed viewBox internally).
function toSvgPoint(svg: SVGSVGElement, clientX: number, clientY: number): Point {
  const rect = svg.getBoundingClientRect();
  return {
    x: ((clientX - rect.left) / rect.width) * VIEW,
    y: ((clientY - rect.top) / rect.height) * VIEW,
  };
}

function TriangleAngleSum() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [points, setPoints] = useState<{ A: Point; B: Point; C: Point }>({
    A: { x: 200, y: 60 },
    B: { x: 80, y: 320 },
    C: { x: 320, y: 320 },
  });
  const draggingRef = useRef<'A' | 'B' | 'C' | null>(null);

  const angles = triangleAngles(points.A, points.B, points.C);
  const sum = angles.A + angles.B + angles.C;

  const startDrag = (key: 'A' | 'B' | 'C') => (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    draggingRef.current = key;
  };
  const onMove = (e: React.PointerEvent) => {
    const key = draggingRef.current;
    const svg = svgRef.current;
    if (!key || !svg) return;
    const p = toSvgPoint(svg, e.clientX, e.clientY);
    setPoints((prev) => ({ ...prev, [key]: { x: clamp(p.x, 20, VIEW - 20), y: clamp(p.y, 20, VIEW - 20) } }));
  };
  const endDrag = () => { draggingRef.current = null; };
  const reset = () => setPoints({ A: { x: 200, y: 60 }, B: { x: 80, y: 320 }, C: { x: 320, y: 320 } });

  const labelOffset = (vertex: Point, centroid: Point, dist = 26) => {
    const dx = vertex.x - centroid.x;
    const dy = vertex.y - centroid.y;
    const len = Math.hypot(dx, dy) || 1;
    return { x: vertex.x + (dx / len) * dist, y: vertex.y + (dy / len) * dist };
  };
  const centroid = { x: (points.A.x + points.B.x + points.C.x) / 3, y: (points.A.y + points.B.y + points.C.y) / 3 };

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <p className="text-sm text-slate-500">Drag any corner. The three angles always add up to 180 degrees, no matter the triangle's shape.</p>
        <div className="flex items-center gap-2 shrink-0">
          <SpeakButton text="Drag any corner of the triangle. However you reshape it, the three interior angles always add up to exactly 180 degrees -- that's the Angle Sum Property." />
          <button onClick={reset} className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-700">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        className="w-full max-w-md mx-auto touch-none select-none rounded-2xl bg-slate-50 dark:bg-slate-900/40 border-2 border-slate-200 dark:border-slate-800"
        onPointerMove={onMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <polygon points={`${points.A.x},${points.A.y} ${points.B.x},${points.B.y} ${points.C.x},${points.C.y}`} className="fill-primary-500/10 stroke-primary-600" strokeWidth={2.5} />
        {(['A', 'B', 'C'] as const).map((key) => {
          const p = points[key];
          const angle = angles[key];
          const labelPos = labelOffset(p, centroid);
          return (
            <g key={key}>
              <text x={labelPos.x} y={labelPos.y} textAnchor="middle" fontSize={14} fontWeight={700} className="fill-slate-700 dark:fill-slate-200">{angle.toFixed(1)}°</text>
              <circle
                cx={p.x}
                cy={p.y}
                r={12}
                className="fill-primary-600 stroke-white dark:stroke-slate-900 cursor-grab active:cursor-grabbing"
                strokeWidth={3}
                onPointerDown={startDrag(key)}
              />
            </g>
          );
        })}
      </svg>
      <p className="text-center font-display text-lg font-semibold">
        {angles.A.toFixed(1)}° + {angles.B.toFixed(1)}° + {angles.C.toFixed(1)}° = <span className="text-primary-600">{sum.toFixed(1)}°</span>
      </p>
    </div>
  );
}

// Fixed reference points P and Q on the circle (at 200 and 340 degrees),
// carving the circle into a 140-degree minor arc and a 220-degree major
// arc. R is draggable, but constrained to the major arc (kept out of the
// 200-340 degree range) -- exactly the configuration the Angle in a
// Semicircle / Angle at the Centre theorem needs to hold true.
const CIRCLE_CENTER: Point = { x: 200, y: 200 };
const CIRCLE_RADIUS = 150;
const P_ANGLE = 200;
const Q_ANGLE = 340;

function CircleTheorem() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [rAngle, setRAngle] = useState(90); // starts on the major arc, opposite the P-Q chord
  const draggingRef = useRef(false);

  const P = pointOnCircle(CIRCLE_CENTER, CIRCLE_RADIUS, P_ANGLE);
  const Q = pointOnCircle(CIRCLE_CENTER, CIRCLE_RADIUS, Q_ANGLE);
  const R = pointOnCircle(CIRCLE_CENTER, CIRCLE_RADIUS, rAngle);

  const centralAngle = Q_ANGLE - P_ANGLE; // 140 degrees, the minor arc PQ
  const inscribedAngle = angleAtVertex(P, R, Q);

  const startDrag = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    draggingRef.current = true;
  };
  const onMove = (e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!draggingRef.current || !svg) return;
    const p = toSvgPoint(svg, e.clientX, e.clientY);
    const rawAngle = angleOf(CIRCLE_CENTER, p);
    setRAngle(keepAngleOutsideRange(rawAngle, P_ANGLE, Q_ANGLE));
  };
  const endDrag = () => { draggingRef.current = false; };
  const reset = () => setRAngle(90);

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <p className="text-sm text-slate-500">Drag point R around the outer arc. The angle at the centre (POQ) always stays exactly double the angle at R (PRQ).</p>
        <div className="flex items-center gap-2 shrink-0">
          <SpeakButton text="Drag point R around the outer arc of the circle. However far you drag it, the angle at the centre stays exactly double the angle at R -- that's the Angle at the Centre theorem, and it's also why any angle drawn from a diameter is always a perfect right angle." />
          <button onClick={reset} className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-700">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        className="w-full max-w-md mx-auto touch-none select-none rounded-2xl bg-slate-50 dark:bg-slate-900/40 border-2 border-slate-200 dark:border-slate-800"
        onPointerMove={onMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <circle cx={CIRCLE_CENTER.x} cy={CIRCLE_CENTER.y} r={CIRCLE_RADIUS} className="fill-none stroke-slate-300 dark:stroke-slate-700" strokeWidth={2} />
        <line x1={CIRCLE_CENTER.x} y1={CIRCLE_CENTER.y} x2={P.x} y2={P.y} className="stroke-primary-600" strokeWidth={2} />
        <line x1={CIRCLE_CENTER.x} y1={CIRCLE_CENTER.y} x2={Q.x} y2={Q.y} className="stroke-primary-600" strokeWidth={2} />
        <line x1={R.x} y1={R.y} x2={P.x} y2={P.y} className="stroke-accent-600" strokeWidth={2} />
        <line x1={R.x} y1={R.y} x2={Q.x} y2={Q.y} className="stroke-accent-600" strokeWidth={2} />
        <circle cx={CIRCLE_CENTER.x} cy={CIRCLE_CENTER.y} r={4} className="fill-slate-700 dark:fill-slate-200" />
        <text x={CIRCLE_CENTER.x + 8} y={CIRCLE_CENTER.y - 8} fontSize={13} fontWeight={700} className="fill-slate-600 dark:fill-slate-300">O</text>
        <text x={P.x + (P.x > CIRCLE_CENTER.x ? 10 : -18)} y={P.y} fontSize={13} fontWeight={700} className="fill-primary-700 dark:fill-primary-300">P</text>
        <text x={Q.x + (Q.x > CIRCLE_CENTER.x ? 10 : -18)} y={Q.y} fontSize={13} fontWeight={700} className="fill-primary-700 dark:fill-primary-300">Q</text>
        <circle
          cx={R.x}
          cy={R.y}
          r={12}
          className="fill-accent-600 stroke-white dark:stroke-slate-900 cursor-grab active:cursor-grabbing"
          strokeWidth={3}
          onPointerDown={startDrag}
        />
        <text x={R.x} y={R.y - 18} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-accent-700 dark:fill-accent-300">R</text>
      </svg>
      <p className="text-center font-display text-lg font-semibold">
        Angle POQ = <span className="text-primary-600">{centralAngle.toFixed(1)}°</span> &nbsp;|&nbsp; Angle PRQ = <span className="text-accent-600">{inscribedAngle.toFixed(1)}°</span> &nbsp;|&nbsp; Ratio = <span className="text-slate-500">{(centralAngle / (inscribedAngle || 1)).toFixed(2)}x</span>
      </p>
    </div>
  );
}

const CONSTRUCTIONS = [
  { id: 'triangle-angle-sum', label: 'Triangle Angle Sum', render: () => <TriangleAngleSum /> },
  { id: 'circle-theorem', label: 'Angle at the Centre', render: () => <CircleTheorem /> },
] as const;

export default function GeometryExplorer() {
  const [activeId, setActiveId] = useState<(typeof CONSTRUCTIONS)[number]['id']>(CONSTRUCTIONS[0].id);
  const active = CONSTRUCTIONS.find((c) => c.id === activeId) || CONSTRUCTIONS[0];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl w-fit">
        {CONSTRUCTIONS.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveId(c.id)}
            className={`px-3.5 py-2 rounded-lg text-sm font-bold transition-all ${activeId === c.id ? 'bg-white dark:bg-slate-900 shadow-sm text-primary-600' : 'text-slate-500'}`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="glass-card rounded-3xl p-4 md:p-6">
        {active.render()}
      </div>
    </div>
  );
}
