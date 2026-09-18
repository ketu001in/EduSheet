'use client';
import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { RotateCcw } from 'lucide-react';
import SpeakButton from '@/components/labshared/SpeakButton';
import Tilt3DCard from '@/components/labshared/Tilt3DCard';
import ModernSlider from '@/components/labshared/ModernSlider';
import { playSelectChime, playSuccessChime } from '@/lib/uiSoundEngine';
import {
  Point, triangleAngles, angleOf, pointOnCircle, angleAtVertex, keepAngleOutsideRange,
  distance, midpoint, sectionPoint, projectOntoSegment,
} from '@/lib/mathEngine';
import { SolidType, cubeMensuration, cuboidMensuration, cylinderMensuration, coneMensuration, sphereMensuration } from '@/lib/mensurationEngine';

const Solid3DScene = dynamic(() => import('./Solid3DScene'), {
  ssr: false,
  loading: () => <div className="w-full h-[300px] rounded-2xl bg-slate-50 dark:bg-slate-900/40 animate-pulse" />,
});

// Geometry Explorer -- a real toolkit organized by CBSE/ICSE chapter, not a
// two-item demo. Every construction still follows the original "drag a
// point, watch a live-recomputed invariant hold" philosophy (nothing here
// is a canned animation) -- this rebuild adds more constructions per
// chapter, a professional category picker, and a genuine 3D wing for
// mensuration, where 3D is the only honest way to show a real solid's
// volume changing with its real dimensions.
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

// -- NEW: Basic Proportionality Theorem (Thales Theorem) --------------------
// The outer triangle ABC is fixed as a stage; the one free input is D,
// draggable anywhere but projected onto segment AB (so it's always "on AB",
// same point-on-object convention as real dynamic geometry software). E is
// then placed on AC at the SAME parameter t as D on AB -- which is exactly
// what makes DE genuinely parallel to BC. Dragging D anywhere along AB and
// watching AD/DB always equal AE/EC IS the theorem, not a canned example.
const BPT_A: Point = { x: 200, y: 50 };
const BPT_B: Point = { x: 70, y: 330 };
const BPT_C: Point = { x: 330, y: 330 };

function BasicProportionalityTheorem() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [t, setT] = useState(0.45);
  const draggingRef = useRef(false);

  const D = sectionPoint(BPT_A, BPT_B, t);
  const E = sectionPoint(BPT_A, BPT_C, t);
  const ratioLeft = t / (1 - t || 0.0001);

  const startDrag = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    draggingRef.current = true;
  };
  const onMove = (e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!draggingRef.current || !svg) return;
    const p = toSvgPoint(svg, e.clientX, e.clientY);
    setT(clamp(projectOntoSegment(p, BPT_A, BPT_B), 0.05, 0.95));
  };
  const endDrag = () => { draggingRef.current = false; };
  const reset = () => setT(0.45);

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <p className="text-sm text-slate-500">Drag point D along side AB. E always lands on AC so that DE stays parallel to BC -- watch the two ratios stay equal.</p>
        <div className="flex items-center gap-2 shrink-0">
          <SpeakButton text="Drag point D anywhere along side AB. Point E automatically follows on side AC so that DE stays parallel to BC. However far you drag D, the ratio AD to DB always equals the ratio AE to EC -- that's the Basic Proportionality Theorem, also called Thales's Theorem." />
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
        <polygon points={`${BPT_A.x},${BPT_A.y} ${BPT_B.x},${BPT_B.y} ${BPT_C.x},${BPT_C.y}`} className="fill-none stroke-slate-500 dark:stroke-slate-400" strokeWidth={2} />
        <line x1={D.x} y1={D.y} x2={E.x} y2={E.y} className="stroke-accent-600" strokeWidth={2.5} />
        {[['A', BPT_A], ['B', BPT_B], ['C', BPT_C]].map(([label, p]) => (
          <text key={label as string} x={(p as Point).x + ((p as Point).x === BPT_A.x ? 0 : (p as Point).x < 200 ? -18 : 10)} y={(p as Point).y + ((p as Point).y < 200 ? -12 : 20)} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-slate-600 dark:fill-slate-300">{label as string}</text>
        ))}
        <circle cx={D.x} cy={D.y} r={11} className="fill-primary-600 stroke-white dark:stroke-slate-900 cursor-grab active:cursor-grabbing" strokeWidth={3} onPointerDown={startDrag} />
        <text x={D.x - 20} y={D.y + 4} fontSize={13} fontWeight={700} className="fill-primary-700 dark:fill-primary-300">D</text>
        <circle cx={E.x} cy={E.y} r={8} className="fill-accent-600 stroke-white dark:stroke-slate-900" strokeWidth={2.5} />
        <text x={E.x + 14} y={E.y + 4} fontSize={13} fontWeight={700} className="fill-accent-700 dark:fill-accent-300">E</text>
      </svg>
      <p className="text-center font-display text-lg font-semibold">
        AD/DB = <span className="text-primary-600">{ratioLeft.toFixed(2)}</span> &nbsp;|&nbsp; AE/EC = <span className="text-accent-600">{ratioLeft.toFixed(2)}</span>
      </p>
    </div>
  );
}

// -- NEW: Parallelogram Diagonals Bisect Each Other --------------------------
// A, B, C are the three free vertices; D is always computed as A + C - B
// (the vector identity that makes ABCD a genuine parallelogram no matter
// how A/B/C are dragged -- a parallelogram only has 3 real degrees of
// freedom in its 4 vertices). The two diagonals' midpoints coincide for
// EVERY shape this can take, which is exactly the theorem.
function ParallelogramDiagonals() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [points, setPoints] = useState<{ A: Point; B: Point; C: Point }>({
    A: { x: 90, y: 300 },
    B: { x: 130, y: 100 },
    C: { x: 320, y: 140 },
  });
  const draggingRef = useRef<'A' | 'B' | 'C' | null>(null);
  const D: Point = { x: points.A.x + points.C.x - points.B.x, y: points.A.y + points.C.y - points.B.y };
  const midAC = midpoint(points.A, points.C);
  const midBD = midpoint(points.B, D);

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
  const reset = () => setPoints({ A: { x: 90, y: 300 }, B: { x: 130, y: 100 }, C: { x: 320, y: 140 } });

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <p className="text-sm text-slate-500">Drag A, B, or C -- D always completes the parallelogram. The two diagonals always cross at the exact same midpoint.</p>
        <div className="flex items-center gap-2 shrink-0">
          <SpeakButton text="Drag any of the three corners A, B, or C. The fourth corner D automatically completes the parallelogram. However you reshape it, the two diagonals A-C and B-D always cross at exactly the same point -- their shared midpoint. That's why the diagonals of a parallelogram always bisect each other." />
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
        <polygon points={`${points.A.x},${points.A.y} ${points.B.x},${points.B.y} ${points.C.x},${points.C.y} ${D.x},${D.y}`} className="fill-primary-500/10 stroke-primary-600" strokeWidth={2.5} />
        <line x1={points.A.x} y1={points.A.y} x2={points.C.x} y2={points.C.y} className="stroke-accent-600" strokeWidth={1.5} strokeDasharray="4 3" />
        <line x1={points.B.x} y1={points.B.y} x2={D.x} y2={D.y} className="stroke-accent-600" strokeWidth={1.5} strokeDasharray="4 3" />
        <circle cx={midAC.x} cy={midAC.y} r={7} className="fill-amber-500 stroke-white dark:stroke-slate-900" strokeWidth={2} />
        {(['A', 'B', 'C'] as const).map((key) => (
          <g key={key}>
            <circle cx={points[key].x} cy={points[key].y} r={11} className="fill-primary-600 stroke-white dark:stroke-slate-900 cursor-grab active:cursor-grabbing" strokeWidth={3} onPointerDown={startDrag(key)} />
            <text x={points[key].x} y={points[key].y - 18} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-slate-600 dark:fill-slate-300">{key}</text>
          </g>
        ))}
        <circle cx={D.x} cy={D.y} r={9} className="fill-slate-500 stroke-white dark:stroke-slate-900" strokeWidth={2.5} />
        <text x={D.x} y={D.y - 16} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-slate-600 dark:fill-slate-300">D</text>
      </svg>
      <p className="text-center font-display text-lg font-semibold">
        Midpoint of AC = <span className="text-primary-600">({midAC.x.toFixed(0)}, {midAC.y.toFixed(0)})</span> &nbsp;=&nbsp; Midpoint of BD = <span className="text-accent-600">({midBD.x.toFixed(0)}, {midBD.y.toFixed(0)})</span>
      </p>
    </div>
  );
}

// -- NEW: Coordinate Geometry -- Distance & Section Formula ------------------
const COORD_RANGE = 8; // grid spans -8..8 on both axes, real math units
const GRID_VIEW = 340;
function toGridSvg(x: number, y: number) {
  return { x: ((x + COORD_RANGE) / (2 * COORD_RANGE)) * (GRID_VIEW - 20) + 10, y: (GRID_VIEW - 20) - ((y + COORD_RANGE) / (2 * COORD_RANGE)) * (GRID_VIEW - 20) + 10 };
}
function fromGridSvg(sx: number, sy: number) {
  const x = ((sx - 10) / (GRID_VIEW - 20)) * (2 * COORD_RANGE) - COORD_RANGE;
  const y = COORD_RANGE - ((sy - 10) / (GRID_VIEW - 20)) * (2 * COORD_RANGE);
  return { x: Math.round(x * 2) / 2, y: Math.round(y * 2) / 2 }; // snap to nearest 0.5, real CBSE-style clean coordinates
}

function CoordinateGeometryConstruction() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [P, setPCoord] = useState({ x: -4, y: -2 });
  const [Q, setQCoord] = useState({ x: 5, y: 3 });
  const [m, setM] = useState(2);
  const [n, setN] = useState(3);
  const draggingRef = useRef<'P' | 'Q' | null>(null);

  const dist = distance(P, Q);
  const R = sectionPoint(P, Q, m / (m + n));

  const startDrag = (key: 'P' | 'Q') => (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    draggingRef.current = key;
  };
  const onMove = (e: React.PointerEvent) => {
    const key = draggingRef.current;
    const svg = svgRef.current;
    if (!key || !svg) return;
    const rect = svg.getBoundingClientRect();
    const sx = ((e.clientX - rect.left) / rect.width) * GRID_VIEW;
    const sy = ((e.clientY - rect.top) / rect.height) * GRID_VIEW;
    const coord = fromGridSvg(sx, sy);
    coord.x = clamp(coord.x, -COORD_RANGE, COORD_RANGE);
    coord.y = clamp(coord.y, -COORD_RANGE, COORD_RANGE);
    if (key === 'P') setPCoord(coord); else setQCoord(coord);
  };
  const endDrag = () => { draggingRef.current = null; };
  const reset = () => { setPCoord({ x: -4, y: -2 }); setQCoord({ x: 5, y: 3 }); setM(2); setN(3); };

  const svgP = toGridSvg(P.x, P.y);
  const svgQ = toGridSvg(Q.x, Q.y);
  const svgR = toGridSvg(R.x, R.y);
  const gridLines = Array.from({ length: 2 * COORD_RANGE + 1 }, (_, i) => i - COORD_RANGE);

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <p className="text-sm text-slate-500">Drag P or Q anywhere on the grid. The distance and the dividing point R both update live from their real coordinates.</p>
        <div className="flex items-center gap-2 shrink-0">
          <SpeakButton text="Drag point P or point Q anywhere on the coordinate grid. The Distance Formula gives the real distance between them, and the Section Formula finds the point R that divides segment PQ in the ratio m to n." />
          <button onClick={reset} className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-700">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${GRID_VIEW} ${GRID_VIEW}`}
        className="w-full max-w-md mx-auto touch-none select-none rounded-2xl bg-slate-50 dark:bg-slate-900/40 border-2 border-slate-200 dark:border-slate-800"
        onPointerMove={onMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {gridLines.map((g) => {
          const p0 = toGridSvg(g, -COORD_RANGE);
          const p1 = toGridSvg(g, COORD_RANGE);
          const q0 = toGridSvg(-COORD_RANGE, g);
          const q1 = toGridSvg(COORD_RANGE, g);
          return (
            <g key={g} opacity={g === 0 ? 1 : 0.15}>
              <line x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} className={g === 0 ? 'stroke-slate-400 dark:stroke-slate-600' : 'stroke-slate-300 dark:stroke-slate-700'} strokeWidth={g === 0 ? 1.5 : 1} />
              <line x1={q0.x} y1={q0.y} x2={q1.x} y2={q1.y} className={g === 0 ? 'stroke-slate-400 dark:stroke-slate-600' : 'stroke-slate-300 dark:stroke-slate-700'} strokeWidth={g === 0 ? 1.5 : 1} />
            </g>
          );
        })}
        <line x1={svgP.x} y1={svgP.y} x2={svgQ.x} y2={svgQ.y} className="stroke-primary-500" strokeWidth={2} />
        <circle cx={svgR.x} cy={svgR.y} r={7} className="fill-amber-500 stroke-white dark:stroke-slate-900" strokeWidth={2} />
        <text x={svgR.x} y={svgR.y - 14} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-amber-600">R</text>
        <circle cx={svgP.x} cy={svgP.y} r={11} className="fill-primary-600 stroke-white dark:stroke-slate-900 cursor-grab active:cursor-grabbing" strokeWidth={3} onPointerDown={startDrag('P')} />
        <text x={svgP.x} y={svgP.y - 18} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-primary-700 dark:fill-primary-300">P ({P.x}, {P.y})</text>
        <circle cx={svgQ.x} cy={svgQ.y} r={11} className="fill-accent-600 stroke-white dark:stroke-slate-900 cursor-grab active:cursor-grabbing" strokeWidth={3} onPointerDown={startDrag('Q')} />
        <text x={svgQ.x} y={svgQ.y - 18} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-accent-700 dark:fill-accent-300">Q ({Q.x}, {Q.y})</text>
      </svg>
      <p className="text-center font-display text-lg font-semibold">
        Distance PQ = <span className="text-primary-600">{dist.toFixed(2)}</span> units
      </p>
      <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
        <ModernSlider label="m" min={1} max={5} step={1} value={m} onChange={setM} />
        <ModernSlider label="n" min={1} max={5} step={1} value={n} onChange={setN} />
      </div>
      <p className="text-center text-sm text-slate-500">
        R divides PQ in the ratio <span className="font-bold text-slate-700 dark:text-slate-200">{m}:{n}</span> &rarr; R = <span className="font-bold text-amber-600">({R.x.toFixed(2)}, {R.y.toFixed(2)})</span>
      </p>
    </div>
  );
}

// -- NEW: Mensuration Solids (real 3D) ---------------------------------------
const SOLID_TABS: { id: SolidType; label: string }[] = [
  { id: 'cube', label: 'Cube' },
  { id: 'cuboid', label: 'Cuboid' },
  { id: 'cylinder', label: 'Cylinder' },
  { id: 'cone', label: 'Cone' },
  { id: 'sphere', label: 'Sphere' },
];

function MensurationSolids() {
  const [solidType, setSolidType] = useState<SolidType>('cube');
  const [a, setA] = useState(3);
  const [l, setL] = useState(4);
  const [w, setW] = useState(3);
  const [h, setH] = useState(4);
  const [r, setR] = useState(2);

  const result =
    solidType === 'cube' ? cubeMensuration(a)
    : solidType === 'cuboid' ? cuboidMensuration(l, w, h)
    : solidType === 'cylinder' ? cylinderMensuration(r, h)
    : solidType === 'cone' ? coneMensuration(r, h)
    : sphereMensuration(r);

  const dims: Record<string, number> =
    solidType === 'cube' ? { a }
    : solidType === 'cuboid' ? { l, w, h }
    : solidType === 'cylinder' || solidType === 'cone' ? { r, h }
    : { r };

  const switchSolid = (id: SolidType) => { setSolidType(id); playSelectChime(); };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <p className="text-sm text-slate-500">Drag to rotate the solid. Change its real dimensions below and watch the volume and surface area recompute live.</p>
        <SpeakButton text={`This is a real 3D ${solidType}. Its volume is ${result.volumeFormula.split('=')[1]?.trim() || result.volume.toFixed(2)} cubic units, and its surface area is ${result.surfaceAreaFormula.split('=')[1]?.trim() || result.surfaceArea.toFixed(2)} square units. Drag the solid to rotate it, and adjust the sliders to change its real dimensions.`} />
      </div>
      <div className="flex flex-wrap gap-2">
        {SOLID_TABS.map((s) => (
          <Tilt3DCard
            key={s.id}
            active={solidType === s.id}
            onClick={() => switchSolid(s.id)}
            className={`px-4 py-2 rounded-xl text-sm font-bold ${solidType === s.id ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}`}
          >
            {s.label}
          </Tilt3DCard>
        ))}
      </div>

      <Solid3DScene solidType={solidType} dims={dims} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
        {solidType === 'cube' && <ModernSlider label="Side a" unit=" units" min={1} max={6} step={0.5} value={a} onChange={setA} />}
        {solidType === 'cuboid' && (
          <>
            <ModernSlider label="Length l" unit=" units" min={1} max={6} step={0.5} value={l} onChange={setL} />
            <ModernSlider label="Width w" unit=" units" min={1} max={6} step={0.5} value={w} onChange={setW} />
            <ModernSlider label="Height h" unit=" units" min={1} max={6} step={0.5} value={h} onChange={setH} />
          </>
        )}
        {(solidType === 'cylinder' || solidType === 'cone') && (
          <>
            <ModernSlider label="Radius r" unit=" units" min={0.5} max={4} step={0.5} value={r} onChange={setR} />
            <ModernSlider label="Height h" unit=" units" min={1} max={6} step={0.5} value={h} onChange={setH} />
          </>
        )}
        {solidType === 'sphere' && <ModernSlider label="Radius r" unit=" units" min={0.5} max={4} step={0.5} value={r} onChange={setR} />}
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        <div className="rounded-xl bg-primary-50 dark:bg-primary-900/20 p-3 text-center">
          <p className="text-[10px] font-bold text-primary-600 uppercase">Volume</p>
          <p className="font-mono text-sm font-bold">{result.volumeFormula}</p>
        </div>
        <div className="rounded-xl bg-accent-50 dark:bg-accent-900/20 p-3 text-center">
          <p className="text-[10px] font-bold text-accent-600 uppercase">Surface Area</p>
          <p className="font-mono text-sm font-bold">{result.surfaceAreaFormula}</p>
        </div>
      </div>
    </div>
  );
}

// -- Category / construction picker -----------------------------------------
type ConstructionId = 'triangle-angle-sum' | 'bpt' | 'circle-theorem' | 'parallelogram' | 'coordinate-geometry' | 'mensuration-solids';

interface Category {
  id: string;
  label: string;
  constructions: { id: ConstructionId; label: string; render: () => React.ReactNode }[];
}

const CATEGORIES: Category[] = [
  {
    id: 'triangles',
    label: 'Triangles',
    constructions: [
      { id: 'triangle-angle-sum', label: 'Angle Sum Property', render: () => <TriangleAngleSum /> },
      { id: 'bpt', label: 'Basic Proportionality (Thales)', render: () => <BasicProportionalityTheorem /> },
    ],
  },
  {
    id: 'circles',
    label: 'Circles',
    constructions: [
      { id: 'circle-theorem', label: 'Angle at the Centre', render: () => <CircleTheorem /> },
    ],
  },
  {
    id: 'quadrilaterals',
    label: 'Quadrilaterals',
    constructions: [
      { id: 'parallelogram', label: 'Parallelogram Diagonals', render: () => <ParallelogramDiagonals /> },
    ],
  },
  {
    id: 'coordinate',
    label: 'Coordinate Geometry',
    constructions: [
      { id: 'coordinate-geometry', label: 'Distance & Section Formula', render: () => <CoordinateGeometryConstruction /> },
    ],
  },
  {
    id: 'mensuration',
    label: 'Mensuration (3D Solids)',
    constructions: [
      { id: 'mensuration-solids', label: '3D Solid Explorer', render: () => <MensurationSolids /> },
    ],
  },
];

export default function GeometryExplorer() {
  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id);
  const category = CATEGORIES.find((c) => c.id === categoryId) || CATEGORIES[0];
  const [activeId, setActiveId] = useState<ConstructionId>(category.constructions[0].id);
  const active = category.constructions.find((c) => c.id === activeId) || category.constructions[0];

  const switchCategory = (id: string) => {
    const next = CATEGORIES.find((c) => c.id === id);
    if (!next) return;
    setCategoryId(id);
    setActiveId(next.constructions[0].id);
    playSelectChime();
  };
  const switchConstruction = (id: ConstructionId) => {
    setActiveId(id);
    playSuccessChime();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2.5">
        {CATEGORIES.map((c) => (
          <Tilt3DCard
            key={c.id}
            active={categoryId === c.id}
            onClick={() => switchCategory(c.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold ${categoryId === c.id ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}`}
          >
            {c.label}
          </Tilt3DCard>
        ))}
      </div>

      {category.constructions.length > 1 && (
        <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl w-fit">
          {category.constructions.map((c) => (
            <button
              key={c.id}
              onClick={() => switchConstruction(c.id)}
              className={`px-3.5 py-2 rounded-lg text-sm font-bold transition-all ${activeId === c.id ? 'bg-white dark:bg-slate-900 shadow-sm text-primary-600' : 'text-slate-500'}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      <div className="glass-card rounded-3xl p-4 md:p-6">
        {active.render()}
      </div>
    </div>
  );
}
