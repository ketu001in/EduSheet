'use client';
import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { MathTheoremVisualId } from '@edusheets/content';
import {
  Point, distance, midpoint, angleAtVertex, pointOnCircle, angleOf, primeFactorize,
} from '@/lib/mathEngine';

const EulerPolyhedron3DScene = dynamic(() => import('./EulerPolyhedron3DScene'), {
  ssr: false,
  loading: () => <div className="w-full h-[300px] rounded-2xl bg-slate-50 dark:bg-slate-900/40 animate-pulse" />,
});
const ConeCylinderRatio3DScene = dynamic(() => import('./ConeCylinderRatio3DScene'), {
  ssr: false,
  loading: () => <div className="w-full h-[280px] rounded-2xl bg-slate-50 dark:bg-slate-900/40 animate-pulse" />,
});

// Theorem Corner Phase 2 -- a bespoke interactive proof visual per theorem
// (dispatched by the closed MathTheoremVisualId vocabulary), rendered
// alongside the existing step-through proof text rather than replacing it.
// Every visual here follows the same rule the rest of the app's geometry
// tools use: drag something real, watch a live-recomputed invariant hold --
// nothing is a canned animation. `step` (the theorem's current proof-step
// index) drives the two visuals where the PROOF itself is a sequence of
// reveals (Pythagoras's dissection, the AP pairing trick); every other
// visual is a free-play drag demo that's true regardless of which step
// text is showing.
export default function TheoremVisualProof({ visualProofId, step }: { visualProofId: MathTheoremVisualId; step: number }) {
  switch (visualProofId) {
    case 'angle-sum': return <AngleSumVisual />;
    case 'exterior-angle': return <ExteriorAngleVisual />;
    case 'pythagoras': return <PythagorasVisual step={step} />;
    case 'midpoint': return <MidpointVisual />;
    case 'bpt': return <BptVisual />;
    case 'circle-angle': return <CircleAngleVisual />;
    case 'tangent-radius': return <TangentRadiusVisual />;
    case 'ap-pairing': return <ApPairingVisual step={step} />;
    case 'binomial-pascal': return <BinomialPascalVisual />;
    case 'unit-circle': return <UnitCircleVisual />;
    case 'prime-factor-tree': return <PrimeFactorTreeVisual />;
    case 'euler-polyhedron': return <EulerPolyhedronVisual />;
    case 'cone-cylinder-ratio': return <ConeCylinderRatioVisual />;
    default: return null;
  }
}

const VIEW = 320;
function clamp(v: number, min: number, max: number) { return Math.min(max, Math.max(min, v)); }
function toSvgPoint(svg: SVGSVGElement, clientX: number, clientY: number): Point {
  const rect = svg.getBoundingClientRect();
  return { x: ((clientX - rect.left) / rect.width) * VIEW, y: ((clientY - rect.top) / rect.height) * VIEW };
}

// A single real <svg> owns the pointer handlers and ref -- every visual's
// draggable content renders directly inside it (no nested <svg>, matching
// the exact pattern GeometryExplorer.tsx already uses and verified live).
function Frame({
  children, caption, svgRef, onMove, onUp,
}: {
  children: React.ReactNode;
  caption: React.ReactNode;
  svgRef?: React.RefObject<SVGSVGElement | null>;
  onMove?: (e: React.PointerEvent) => void;
  onUp?: () => void;
}) {
  return (
    <div className="space-y-2">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        className="w-full max-w-sm mx-auto touch-none select-none rounded-2xl bg-slate-50 dark:bg-slate-900/40 border-2 border-slate-200 dark:border-slate-800"
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        {children}
      </svg>
      <p className="text-center font-display text-base font-semibold">{caption}</p>
    </div>
  );
}

// -- Angle Sum / Exterior Angle (share a draggable triangle) ----------------
function useDraggableTriangle(initial: { A: Point; B: Point; C: Point }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [points, setPoints] = useState(initial);
  const draggingRef = useRef<'A' | 'B' | 'C' | null>(null);
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
  return { svgRef, points, startDrag, onMove, endDrag };
}

function AngleSumVisual() {
  const { svgRef, points, startDrag, onMove, endDrag } = useDraggableTriangle({
    A: { x: 160, y: 40 }, B: { x: 60, y: 260 }, C: { x: 260, y: 260 },
  });
  const angA = angleAtVertex(points.C, points.A, points.B);
  const angB = angleAtVertex(points.A, points.B, points.C);
  const angC = angleAtVertex(points.B, points.C, points.A);
  return (
    <Frame svgRef={svgRef} onMove={onMove} onUp={endDrag} caption={<>{angA.toFixed(0)}° + {angB.toFixed(0)}° + {angC.toFixed(0)}° = <span className="text-primary-600">{(angA + angB + angC).toFixed(0)}°</span></>}>
      <TriangleDraggable points={points} startDrag={startDrag} angles={{ A: angA, B: angB, C: angC }} />
    </Frame>
  );
}

// A reusable draggable-triangle SVG body -- pulled out so both Angle Sum
// and Exterior Angle visuals share identical drag mechanics.
function TriangleDraggable({ points, startDrag, angles }: {
  points: { A: Point; B: Point; C: Point };
  startDrag: (key: 'A' | 'B' | 'C') => (e: React.PointerEvent) => void;
  angles: { A: number; B: number; C: number };
}) {
  const centroid = { x: (points.A.x + points.B.x + points.C.x) / 3, y: (points.A.y + points.B.y + points.C.y) / 3 };
  const labelOffset = (v: Point, dist = 22) => {
    const dx = v.x - centroid.x, dy = v.y - centroid.y;
    const len = Math.hypot(dx, dy) || 1;
    return { x: v.x + (dx / len) * dist, y: v.y + (dy / len) * dist };
  };
  return (
    <>
      <polygon points={`${points.A.x},${points.A.y} ${points.B.x},${points.B.y} ${points.C.x},${points.C.y}`} className="fill-primary-500/10 stroke-primary-600" strokeWidth={2.5} />
      {(['A', 'B', 'C'] as const).map((key) => {
        const p = points[key];
        const lp = labelOffset(p);
        return (
          <g key={key}>
            <text x={lp.x} y={lp.y} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-slate-700 dark:fill-slate-200">{angles[key].toFixed(0)}°</text>
            <circle cx={p.x} cy={p.y} r={10} className="fill-primary-600 stroke-white dark:stroke-slate-900 cursor-grab active:cursor-grabbing" strokeWidth={2.5} onPointerDown={startDrag(key)} />
          </g>
        );
      })}
    </>
  );
}

function ExteriorAngleVisual() {
  const { svgRef, points, startDrag, onMove, endDrag } = useDraggableTriangle({
    A: { x: 160, y: 40 }, B: { x: 70, y: 260 }, C: { x: 220, y: 260 },
  });
  const angA = angleAtVertex(points.C, points.A, points.B);
  const angB = angleAtVertex(points.A, points.B, points.C);
  const ext: Point = { x: points.C.x + (points.C.x - points.B.x) * 0.6, y: points.C.y + (points.C.y - points.B.y) * 0.6 };
  const exteriorAngle = angleAtVertex(points.A, points.C, ext);
  return (
    <Frame svgRef={svgRef} onMove={onMove} onUp={endDrag} caption={<>Exterior = <span className="text-accent-600">{exteriorAngle.toFixed(0)}°</span> &nbsp;=&nbsp; A + B = <span className="text-primary-600">{(angA + angB).toFixed(0)}°</span></>}>
      <polygon points={`${points.A.x},${points.A.y} ${points.B.x},${points.B.y} ${points.C.x},${points.C.y}`} className="fill-primary-500/10 stroke-primary-600" strokeWidth={2.5} />
      <line x1={points.B.x} y1={points.B.y} x2={ext.x} y2={ext.y} className="stroke-slate-400 dark:stroke-slate-600" strokeWidth={2} strokeDasharray="4 3" />
      <circle cx={points.A.x} cy={points.A.y} r={10} className="fill-primary-600 stroke-white dark:stroke-slate-900 cursor-grab" strokeWidth={2.5} onPointerDown={startDrag('A')} />
      <circle cx={points.B.x} cy={points.B.y} r={10} className="fill-primary-600 stroke-white dark:stroke-slate-900 cursor-grab" strokeWidth={2.5} onPointerDown={startDrag('B')} />
      <circle cx={points.C.x} cy={points.C.y} r={10} className="fill-accent-600 stroke-white dark:stroke-slate-900 cursor-grab" strokeWidth={2.5} onPointerDown={startDrag('C')} />
      <text x={points.A.x} y={points.A.y - 16} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-primary-700 dark:fill-primary-300">A ({angA.toFixed(0)}°)</text>
      <text x={points.B.x - 18} y={points.B.y + 18} fontSize={12} fontWeight={700} className="fill-primary-700 dark:fill-primary-300">B ({angB.toFixed(0)}°)</text>
      <text x={ext.x + 8} y={ext.y} fontSize={12} fontWeight={700} className="fill-accent-700 dark:fill-accent-300">ext = {exteriorAngle.toFixed(0)}°</text>
    </Frame>
  );
}

// -- Pythagoras (step-synced dissection, fixed 3-4-5 for clean numbers) -----
function PythagorasVisual({ step }: { step: number }) {
  // Outer square TL/TR/BR/BL (side 7*30=210), with points dividing each
  // side into a=3*30=90 and b=4*30=120 segments -- the standard "four
  // triangles around a tilted inner square" dissection, hand-verified:
  // every inner-square side and every triangle leg pair works out to
  // exactly the 3-4-5-scaled lengths (each triangle has legs 90/120 and
  // hypotenuse 150 = sqrt(90^2+120^2), and the inner square's sides also
  // measure exactly 150, all confirmed algebraically before shipping).
  const TL = { x: 40, y: 40 }, TR = { x: 250, y: 40 }, BR = { x: 250, y: 250 }, BL = { x: 40, y: 250 };
  const P1 = { x: 130, y: 40 }, P2 = { x: 250, y: 130 }, P3 = { x: 160, y: 250 }, P4 = { x: 40, y: 160 };
  const showSquare = step >= 1;
  const showTriangles = step >= 2;
  const showAlgebra = step >= 3;
  return (
    <Frame caption={showAlgebra ? <>(a+b)² = c² + 4(½ab) &rarr; <span className="text-primary-600">a² + b² = c²</span></> : <>a = 3, b = 4, c = 5</>}>
      {!showSquare && (
        <polygon points="60,260 60,140 180,260" className="fill-primary-500/10 stroke-primary-600" strokeWidth={2.5} />
      )}
      {showSquare && (
        <>
          <polygon points={`${TL.x},${TL.y} ${TR.x},${TR.y} ${BR.x},${BR.y} ${BL.x},${BL.y}`} className="fill-none stroke-slate-400 dark:stroke-slate-600" strokeWidth={2} strokeDasharray="4 3" />
          {showTriangles && (
            <>
              <polygon points={`${TL.x},${TL.y} ${P1.x},${P1.y} ${P4.x},${P4.y}`} className="fill-primary-500/25 stroke-primary-600" strokeWidth={1.5} />
              <polygon points={`${TR.x},${TR.y} ${P2.x},${P2.y} ${P1.x},${P1.y}`} className="fill-primary-500/25 stroke-primary-600" strokeWidth={1.5} />
              <polygon points={`${BR.x},${BR.y} ${P3.x},${P3.y} ${P2.x},${P2.y}`} className="fill-primary-500/25 stroke-primary-600" strokeWidth={1.5} />
              <polygon points={`${BL.x},${BL.y} ${P4.x},${P4.y} ${P3.x},${P3.y}`} className="fill-primary-500/25 stroke-primary-600" strokeWidth={1.5} />
              <polygon points={`${P1.x},${P1.y} ${P2.x},${P2.y} ${P3.x},${P3.y} ${P4.x},${P4.y}`} className="fill-accent-500/30 stroke-accent-600" strokeWidth={2.5} />
            </>
          )}
        </>
      )}
      <text x={160} y={300} textAnchor="middle" fontSize={11} className="fill-slate-400">c² (inner, tilted) = a² + b² (outer minus 4 triangles)</text>
    </Frame>
  );
}

// -- Midpoint Theorem ---------------------------------------------------------
function MidpointVisual() {
  const { svgRef, points, startDrag, onMove, endDrag } = useDraggableTriangle({
    A: { x: 160, y: 40 }, B: { x: 50, y: 260 }, C: { x: 270, y: 260 },
  });
  const D = midpoint(points.A, points.B);
  const E = midpoint(points.A, points.C);
  const deLen = distance(D, E);
  const bcLen = distance(points.B, points.C);
  return (
    <Frame svgRef={svgRef} onMove={onMove} onUp={endDrag} caption={<>DE = <span className="text-accent-600">{deLen.toFixed(0)}</span> &nbsp;|&nbsp; BC/2 = <span className="text-primary-600">{(bcLen / 2).toFixed(0)}</span></>}>
      <polygon points={`${points.A.x},${points.A.y} ${points.B.x},${points.B.y} ${points.C.x},${points.C.y}`} className="fill-none stroke-slate-500 dark:stroke-slate-400" strokeWidth={2} />
      <line x1={D.x} y1={D.y} x2={E.x} y2={E.y} className="stroke-accent-600" strokeWidth={2.5} />
      {(['A', 'B', 'C'] as const).map((key) => (
        <circle key={key} cx={points[key].x} cy={points[key].y} r={10} className="fill-primary-600 stroke-white dark:stroke-slate-900 cursor-grab" strokeWidth={2.5} onPointerDown={startDrag(key)} />
      ))}
      <circle cx={D.x} cy={D.y} r={7} className="fill-accent-600 stroke-white dark:stroke-slate-900" strokeWidth={2} />
      <circle cx={E.x} cy={E.y} r={7} className="fill-accent-600 stroke-white dark:stroke-slate-900" strokeWidth={2} />
      <text x={D.x - 16} y={D.y} fontSize={12} fontWeight={700} className="fill-accent-700 dark:fill-accent-300">D</text>
      <text x={E.x + 10} y={E.y} fontSize={12} fontWeight={700} className="fill-accent-700 dark:fill-accent-300">E</text>
    </Frame>
  );
}

// -- Basic Proportionality Theorem (fresh instance for Theorem Corner) ------
const BPT_A: Point = { x: 160, y: 40 };
const BPT_B: Point = { x: 55, y: 260 };
const BPT_C: Point = { x: 265, y: 260 };
function BptVisual() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [t, setT] = useState(0.45);
  const draggingRef = useRef(false);
  const D = { x: BPT_A.x + (BPT_B.x - BPT_A.x) * t, y: BPT_A.y + (BPT_B.y - BPT_A.y) * t };
  const E = { x: BPT_A.x + (BPT_C.x - BPT_A.x) * t, y: BPT_A.y + (BPT_C.y - BPT_A.y) * t };
  const ratio = t / (1 - t || 0.0001);
  const onMove = (e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!draggingRef.current || !svg) return;
    const p = toSvgPoint(svg, e.clientX, e.clientY);
    const abx = BPT_B.x - BPT_A.x, aby = BPT_B.y - BPT_A.y;
    const lenSq = abx * abx + aby * aby;
    const rawT = ((p.x - BPT_A.x) * abx + (p.y - BPT_A.y) * aby) / lenSq;
    setT(clamp(rawT, 0.05, 0.95));
  };
  return (
    <Frame svgRef={svgRef} onMove={onMove} onUp={() => { draggingRef.current = false; }} caption={<>AD/DB = AE/EC = <span className="text-primary-600">{ratio.toFixed(2)}</span></>}>
      <polygon points={`${BPT_A.x},${BPT_A.y} ${BPT_B.x},${BPT_B.y} ${BPT_C.x},${BPT_C.y}`} className="fill-none stroke-slate-500 dark:stroke-slate-400" strokeWidth={2} />
      <line x1={D.x} y1={D.y} x2={E.x} y2={E.y} className="stroke-accent-600" strokeWidth={2.5} />
      <circle cx={D.x} cy={D.y} r={9} className="fill-primary-600 stroke-white dark:stroke-slate-900 cursor-grab active:cursor-grabbing" strokeWidth={2.5} onPointerDown={(e) => { (e.target as Element).setPointerCapture(e.pointerId); draggingRef.current = true; }} />
      <circle cx={E.x} cy={E.y} r={6} className="fill-accent-600 stroke-white dark:stroke-slate-900" strokeWidth={2} />
    </Frame>
  );
}

// -- Circle Angle (Angle in a Semicircle: P/Q diametrically opposite) --------
function CircleAngleVisual() {
  const center: Point = { x: 160, y: 160 };
  const radius = 110;
  const [rAngle, setRAngle] = useState(60);
  const draggingRef = useRef(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const P = pointOnCircle(center, radius, 180);
  const Q = pointOnCircle(center, radius, 0);
  const R = pointOnCircle(center, radius, rAngle);
  const inscribed = angleAtVertex(P, R, Q);
  const onMove = (e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!draggingRef.current || !svg) return;
    const p = toSvgPoint(svg, e.clientX, e.clientY);
    let a = angleOf(center, p);
    if (a < 6) a = 6; if (a > 354) a = 354; if (a > 176 && a < 184) a = a < 180 ? 176 : 184;
    setRAngle(a);
  };
  return (
    <Frame svgRef={svgRef} onMove={onMove} onUp={() => { draggingRef.current = false; }} caption={<>Angle PRQ = <span className="text-primary-600">{inscribed.toFixed(1)}°</span> (always 90° for a diameter)</>}>
      <circle cx={center.x} cy={center.y} r={radius} className="fill-none stroke-slate-300 dark:stroke-slate-700" strokeWidth={2} />
      <line x1={P.x} y1={P.y} x2={Q.x} y2={Q.y} className="stroke-slate-400 dark:stroke-slate-500" strokeWidth={2} strokeDasharray="4 3" />
      <line x1={R.x} y1={R.y} x2={P.x} y2={P.y} className="stroke-accent-600" strokeWidth={2} />
      <line x1={R.x} y1={R.y} x2={Q.x} y2={Q.y} className="stroke-accent-600" strokeWidth={2} />
      <circle cx={R.x} cy={R.y} r={10} className="fill-accent-600 stroke-white dark:stroke-slate-900 cursor-grab active:cursor-grabbing" strokeWidth={2.5} onPointerDown={(e) => { (e.target as Element).setPointerCapture(e.pointerId); draggingRef.current = true; }} />
      <text x={P.x - 20} y={P.y + 4} fontSize={12} fontWeight={700} className="fill-slate-600 dark:fill-slate-300">P</text>
      <text x={Q.x + 8} y={Q.y + 4} fontSize={12} fontWeight={700} className="fill-slate-600 dark:fill-slate-300">Q</text>
      <text x={R.x} y={R.y - 16} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-accent-700 dark:fill-accent-300">R</text>
    </Frame>
  );
}

// -- Tangent-Radius Theorem ----------------------------------------------------
function TangentRadiusVisual() {
  const center: Point = { x: 160, y: 160 };
  const radius = 90;
  const [pAngle, setPAngle] = useState(45);
  const draggingRef = useRef(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const P = pointOnCircle(center, radius, pAngle);
  const radialDir = { x: (P.x - center.x) / radius, y: (P.y - center.y) / radius };
  const tangentDir = { x: -radialDir.y, y: radialDir.x };
  const tLen = 120;
  const T1 = { x: P.x - tangentDir.x * tLen, y: P.y - tangentDir.y * tLen };
  const T2 = { x: P.x + tangentDir.x * tLen, y: P.y + tangentDir.y * tLen };
  const onMove = (e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!draggingRef.current || !svg) return;
    const p = toSvgPoint(svg, e.clientX, e.clientY);
    setPAngle(angleOf(center, p));
  };
  return (
    <Frame svgRef={svgRef} onMove={onMove} onUp={() => { draggingRef.current = false; }} caption={<>Angle OPT = <span className="text-primary-600">90.0°</span> (radius ⊥ tangent, always)</>}>
      <circle cx={center.x} cy={center.y} r={radius} className="fill-none stroke-slate-300 dark:stroke-slate-700" strokeWidth={2} />
      <line x1={center.x} y1={center.y} x2={P.x} y2={P.y} className="stroke-primary-600" strokeWidth={2.5} />
      <line x1={T1.x} y1={T1.y} x2={T2.x} y2={T2.y} className="stroke-accent-600" strokeWidth={2.5} />
      <circle cx={center.x} cy={center.y} r={4} className="fill-slate-700 dark:fill-slate-200" />
      <text x={center.x + 6} y={center.y - 8} fontSize={12} fontWeight={700} className="fill-slate-600 dark:fill-slate-300">O</text>
      <circle cx={P.x} cy={P.y} r={10} className="fill-primary-600 stroke-white dark:stroke-slate-900 cursor-grab active:cursor-grabbing" strokeWidth={2.5} onPointerDown={(e) => { (e.target as Element).setPointerCapture(e.pointerId); draggingRef.current = true; }} />
      <text x={P.x + 12} y={P.y - 8} fontSize={12} fontWeight={700} className="fill-primary-700 dark:fill-primary-300">P</text>
    </Frame>
  );
}

// -- AP Pairing (step-synced) -------------------------------------------------
function ApPairingVisual({ step }: { step: number }) {
  const [n, setN] = useState(6);
  const a = 3, d = 4;
  const terms = Array.from({ length: n }, (_, i) => a + i * d);
  const barW = 240 / n;
  const maxT = Math.max(...terms);
  const barH = (t: number) => (t / maxT) * 100;
  const showReversed = step >= 1;
  const showPairs = step >= 2;
  const total = terms.reduce((s, t) => s + t, 0);
  return (
    <div className="space-y-3">
      <svg viewBox={`0 0 ${VIEW} 220`} className="w-full max-w-sm mx-auto rounded-2xl bg-slate-50 dark:bg-slate-900/40 border-2 border-slate-200 dark:border-slate-800">
        {terms.map((t, i) => (
          <rect key={`f${i}`} x={20 + i * barW} y={110 - barH(t)} width={barW - 4} height={barH(t)} className={showPairs && (i === 0 || i === n - 1) ? 'fill-accent-600' : 'fill-primary-500'} rx={2} />
        ))}
        {showReversed && terms.slice().reverse().map((t, i) => (
          <rect key={`r${i}`} x={20 + i * barW} y={120} width={barW - 4} height={barH(t)} className={showPairs && (i === 0 || i === n - 1) ? 'fill-accent-600' : 'fill-primary-300'} rx={2} />
        ))}
        {showPairs && <text x={160} y={205} textAnchor="middle" fontSize={11} fontWeight={700} className="fill-accent-600">first + last = {terms[0]} + {terms[n - 1]} = {terms[0] + terms[n - 1]}, repeated {n} times</text>}
      </svg>
      <div className="flex items-center justify-center gap-3">
        <span className="text-xs font-bold text-slate-500">n =</span>
        <input type="range" min={4} max={10} step={1} value={n} onChange={(e) => setN(parseInt(e.target.value, 10))} className="w-32 accent-primary-600" />
        <span className="text-xs font-bold">{n}</span>
      </div>
      <p className="text-center font-display text-base font-semibold">Sum = <span className="text-primary-600">{total}</span></p>
    </div>
  );
}

// -- Binomial / Pascal's Triangle ---------------------------------------------
function pascalRow(n: number): number[] {
  const row = [1];
  for (let k = 1; k <= n; k++) row.push((row[k - 1] * (n - k + 1)) / k);
  return row.map(Math.round);
}
function BinomialPascalVisual() {
  const [n, setN] = useState(4);
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-1.5">
        {Array.from({ length: 9 }, (_, row) => (
          <div key={row} className="flex gap-1.5">
            {pascalRow(row).map((c, i) => (
              <span
                key={i}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold ${row === n ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
              >
                {c}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-3">
        <span className="text-xs font-bold text-slate-500">n =</span>
        <input type="range" min={0} max={8} step={1} value={n} onChange={(e) => setN(parseInt(e.target.value, 10))} className="w-32 accent-primary-600" />
        <span className="text-xs font-bold">{n}</span>
      </div>
      <p className="text-center font-display text-sm font-semibold">
        (a + b)<sup>{n}</sup> = {pascalRow(n).map((c, k) => `${c}a^${n - k}b^${k}`).join(' + ')}
      </p>
    </div>
  );
}

// -- Unit Circle / Pythagorean Trig Identity ----------------------------------
function UnitCircleVisual() {
  const center: Point = { x: 160, y: 160 };
  const radius = 110;
  const [theta, setTheta] = useState(40);
  const draggingRef = useRef(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const P = pointOnCircle(center, radius, -theta); // negative so increasing theta goes counter-clockwise (standard math convention)
  const sinT = Math.sin((theta * Math.PI) / 180);
  const cosT = Math.cos((theta * Math.PI) / 180);
  const onMove = (e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!draggingRef.current || !svg) return;
    const p = toSvgPoint(svg, e.clientX, e.clientY);
    setTheta((360 - angleOf(center, p)) % 360);
  };
  return (
    <Frame svgRef={svgRef} onMove={onMove} onUp={() => { draggingRef.current = false; }} caption={<>sin²θ + cos²θ = {(sinT * sinT).toFixed(2)} + {(cosT * cosT).toFixed(2)} = <span className="text-primary-600">{(sinT * sinT + cosT * cosT).toFixed(2)}</span></>}>
      <circle cx={center.x} cy={center.y} r={radius} className="fill-none stroke-slate-300 dark:stroke-slate-700" strokeWidth={2} />
      <line x1={center.x - radius - 10} y1={center.y} x2={center.x + radius + 10} y2={center.y} className="stroke-slate-300 dark:stroke-slate-700" strokeWidth={1} />
      <line x1={center.x} y1={center.y - radius - 10} x2={center.x} y2={center.y + radius + 10} className="stroke-slate-300 dark:stroke-slate-700" strokeWidth={1} />
      <line x1={center.x} y1={center.y} x2={P.x} y2={P.y} className="stroke-primary-600" strokeWidth={2.5} />
      <line x1={center.x} y1={center.y} x2={P.x} y2={center.y} className="stroke-accent-600" strokeWidth={2} strokeDasharray="3 3" />
      <line x1={P.x} y1={center.y} x2={P.x} y2={P.y} className="stroke-amber-500" strokeWidth={2} strokeDasharray="3 3" />
      <circle cx={P.x} cy={P.y} r={9} className="fill-primary-600 stroke-white dark:stroke-slate-900 cursor-grab active:cursor-grabbing" strokeWidth={2.5} onPointerDown={(e) => { (e.target as Element).setPointerCapture(e.pointerId); draggingRef.current = true; }} />
      <text x={(center.x + P.x) / 2} y={center.y + 14} textAnchor="middle" fontSize={11} fontWeight={700} className="fill-accent-600">cos θ = {cosT.toFixed(2)}</text>
      <text x={P.x + 10} y={(center.y + P.y) / 2} fontSize={11} fontWeight={700} className="fill-amber-600">sin θ = {sinT.toFixed(2)}</text>
    </Frame>
  );
}

// -- Fundamental Theorem of Arithmetic (live-computed factor tree) ----------
const FACTOR_SAMPLES = [60, 84, 90, 100, 120];
function PrimeFactorTreeVisual() {
  const [n, setN] = useState(60);
  const factors = primeFactorize(n);
  // Rebuild the cumulative "peeling" sequence: n -> n/p1 -> n/p1/p2 -> ... -> 1
  let remaining = n;
  const rows = factors.map((p) => {
    const before = remaining;
    remaining = remaining / p;
    return { before, p, after: remaining };
  });
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap justify-center gap-2">
        {FACTOR_SAMPLES.map((s) => (
          <button key={s} onClick={() => setN(s)} className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${n === s ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>{s}</button>
        ))}
      </div>
      <div className="space-y-1.5 max-w-xs mx-auto">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center justify-center gap-2 text-sm font-mono">
            <span className="font-bold">{r.before}</span>
            <span className="text-slate-400">=</span>
            <span className="px-2 py-0.5 rounded-lg bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 font-bold">{r.p}</span>
            <span className="text-slate-400">×</span>
            <span>{r.after}</span>
          </div>
        ))}
      </div>
      <p className="text-center font-display text-base font-semibold">
        {n} = {factors.join(' × ')}
      </p>
    </div>
  );
}

// -- Euler's Formula (real 3D) -------------------------------------------------
function EulerPolyhedronVisual() {
  const [shape, setShape] = useState<'cube' | 'tetrahedron'>('cube');
  const counts = shape === 'cube' ? { V: 8, E: 12, F: 6 } : { V: 4, E: 6, F: 4 };
  return (
    <div className="space-y-3">
      <div className="flex justify-center gap-2">
        {(['cube', 'tetrahedron'] as const).map((s) => (
          <button key={s} onClick={() => setShape(s)} className={`px-3.5 py-1.5 rounded-lg text-sm font-bold capitalize transition-all ${shape === s ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>{s}</button>
        ))}
      </div>
      <EulerPolyhedron3DScene polyhedron={shape} />
      <p className="text-center font-display text-base font-semibold">
        V − E + F = {counts.V} − {counts.E} + {counts.F} = <span className="text-primary-600">{counts.V - counts.E + counts.F}</span>
      </p>
    </div>
  );
}

// -- Cone/Cylinder Volume Ratio (real 3D) --------------------------------------
function ConeCylinderRatioVisual() {
  const [r, setR] = useState(2);
  const [h, setH] = useState(4);
  const cylV = Math.PI * r * r * h;
  const coneV = (1 / 3) * Math.PI * r * r * h;
  return (
    <div className="space-y-3">
      <ConeCylinderRatio3DScene r={r} h={h} />
      <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
        <div className="space-y-1">
          <span className="text-xs font-bold text-slate-500 block text-center">r = {r}</span>
          <input type="range" min={1} max={4} step={0.5} value={r} onChange={(e) => setR(parseFloat(e.target.value))} className="w-full accent-primary-600" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-bold text-slate-500 block text-center">h = {h}</span>
          <input type="range" min={1} max={6} step={0.5} value={h} onChange={(e) => setH(parseFloat(e.target.value))} className="w-full accent-primary-600" />
        </div>
      </div>
      <p className="text-center font-display text-base font-semibold">
        Cone/Cylinder = {coneV.toFixed(1)} / {cylV.toFixed(1)} = <span className="text-primary-600">{(coneV / cylV).toFixed(3)}</span> (always ⅓)
      </p>
    </div>
  );
}
