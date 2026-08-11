'use client';
import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { PHYSICS_EQUIPMENT, PhysicsSimType } from '@edusheets/content';
import {
  pendulumSmallAngle, pendulumNonlinearStep, pendulumPeriodSmallAngle,
  springState, springPeriod,
  projectileState, projectileRange, projectileMaxHeight, projectileTimeOfFlight,
  easeToward, leverTargetAngleDeg, buoyancyFloats, buoyancySubmergedFraction,
  ohmsLawCurrent, reflectionAngleDeg, magnetsAttract, magnetTargetGap,
} from '@/lib/physicsEngine';
import { playTick, playTwang, playThud, isSoundMuted, setSoundMuted } from '@/lib/sound';
import { speak, isSpeechSupported } from '@/lib/speech';
import { Hotspot, HoverLabel, EquipmentModal } from '@/components/labshared/LabHotspot';

const PENDULUM_PX_PER_M = 80;
const SPRING_PX_PER_M = 100;

export interface PhysicsStageProps {
  simType: PhysicsSimType;
  params: Record<string, number>;
  running: boolean;
  resetKey: number | string;
  apparatusIds: string[];
  smallAngle?: boolean;
  showOverlay?: boolean;
}

export default function PhysicsStage({ simType, params, running, resetKey, apparatusIds, smallAngle = true, showOverlay = false }: PhysicsStageProps) {
  const [t, setT] = useState(0);
  const [pendulumAngle, setPendulumAngle] = useState({ theta: ((params.amplitudeDeg ?? 15) * Math.PI) / 180, thetaDot: 0 });
  const [leverAngle, setLeverAngle] = useState(0);
  const [buoyancyFrac, setBuoyancyFrac] = useState(0);
  const [magnetGap, setMagnetGap] = useState(1.4);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [openEquipmentId, setOpenEquipmentId] = useState<string | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);
  const lastFrameRef = useRef<number | null>(null);
  const lastSignRef = useRef(1);
  const landedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    setSoundOn(!isSoundMuted());
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundMuted(!next);
  };

  // Reset simulation clock whenever the caller bumps resetKey (e.g. a new
  // "release" step, or the student hits Reset in the Playground).
  useEffect(() => {
    setT(0);
    setTrail([]);
    landedRef.current = false;
    lastSignRef.current = 1;
    setPendulumAngle({ theta: ((params.amplitudeDeg ?? 15) * Math.PI) / 180, thetaDot: 0 });
    setLeverAngle(0);
    setBuoyancyFrac(0);
    setMagnetGap(1.4);
    lastFrameRef.current = null;
    if (hasMountedRef.current && simType === 'spring' && soundOn) playTwang();
    hasMountedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  useEffect(() => {
    if (!running) {
      lastFrameRef.current = null;
      return;
    }
    const loop = (now: number) => {
      if (lastFrameRef.current === null) lastFrameRef.current = now;
      const dt = Math.min(0.05, (now - lastFrameRef.current) / 1000);
      lastFrameRef.current = now;
      setT((prev) => prev + dt);

      if (simType === 'pendulum' && !smallAngle) {
        setPendulumAngle((prev) => {
          const next = pendulumNonlinearStep(prev.theta, prev.thetaDot, dt, params.length || 1, params.gravity || 9.8);
          const sign = Math.sign(next.theta) || 1;
          if (sign !== lastSignRef.current && soundOn) playTick();
          lastSignRef.current = sign;
          return next;
        });
      }
      if (simType === 'lever') {
        const target = leverTargetAngleDeg({
          leftForce: params.leftForce ?? 20, leftDistance: params.leftDistance ?? 2,
          rightForce: params.rightForce ?? 20, rightDistance: params.rightDistance ?? 2,
        });
        setLeverAngle((prev) => easeToward(prev, target, dt));
      }
      if (simType === 'buoyancy') {
        const target = buoyancySubmergedFraction({ objectDensity: params.objectDensity ?? 700, fluidDensity: params.fluidDensity ?? 1000 });
        setBuoyancyFrac((prev) => {
          const next = easeToward(prev, target, dt);
          if (Math.abs(next - target) < 0.01 && Math.abs(prev - target) >= 0.01 && soundOn) playThud();
          return next;
        });
      }
      if (simType === 'magnet') {
        const target = magnetTargetGap({ orientation: params.orientation ?? 0 });
        setMagnetGap((prev) => {
          const next = easeToward(prev, target, dt, 3);
          if (Math.abs(next - target) < 0.02 && Math.abs(prev - target) >= 0.02 && soundOn) playThud();
          return next;
        });
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    running, simType, smallAngle, soundOn,
    params.length, params.gravity,
    params.leftForce, params.leftDistance, params.rightForce, params.rightDistance,
    params.objectDensity, params.fluidDensity, params.orientation,
  ]);

  // Pendulum small-angle tick + landing/thud side-effects driven off t.
  useEffect(() => {
    if (!running || simType !== 'pendulum' || !smallAngle) return;
    const { theta } = pendulumSmallAngle(t, { length: params.length || 1, gravity: params.gravity || 9.8, amplitudeDeg: params.amplitudeDeg || 15 });
    const sign = Math.sign(theta) || 1;
    if (sign !== lastSignRef.current && soundOn) playTick();
    lastSignRef.current = sign;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  useEffect(() => {
    if (simType !== 'projectile' || !running) return;
    const tof = projectileTimeOfFlight({ speed: params.speed || 15, angleDeg: params.angleDeg || 45, gravity: params.gravity || 9.8 });
    if (t >= tof && !landedRef.current) {
      landedRef.current = true;
      if (soundOn) playThud();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, simType, running]);

  const hover = (id: string) => setHoveredId(id);
  const unhover = () => setHoveredId(null);
  const openEquipment = (id: string) => {
    setOpenEquipmentId(id);
    if (isSpeechSupported()) {
      const eq = PHYSICS_EQUIPMENT.find((e) => e.id === id);
      if (eq) speak(`Here's the ${eq.name}. ${eq.description}`);
    }
  };

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-sky-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border-2 border-slate-200 dark:border-slate-800 overflow-hidden">
      <button
        onClick={toggleSound}
        title={soundOn ? 'Mute lab sounds' : 'Enable lab sounds'}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform"
      >
        {soundOn ? <Volume2 className="w-4 h-4 text-primary-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
      </button>

      {simType === 'pendulum' && (
        <PendulumScene
          params={params}
          t={t}
          smallAngle={smallAngle}
          angle={pendulumAngle}
          hoveredId={hoveredId}
          onHover={hover}
          onUnhover={unhover}
          onClick={openEquipment}
          showOverlay={showOverlay}
        />
      )}
      {simType === 'spring' && (
        <SpringScene
          params={params}
          t={t}
          hoveredId={hoveredId}
          onHover={hover}
          onUnhover={unhover}
          onClick={openEquipment}
          showOverlay={showOverlay}
        />
      )}
      {simType === 'projectile' && (
        <ProjectileScene
          params={params}
          t={t}
          trail={trail}
          setTrail={setTrail}
          running={running}
          hoveredId={hoveredId}
          onHover={hover}
          onUnhover={unhover}
          onClick={openEquipment}
          showOverlay={showOverlay}
        />
      )}
      {simType === 'lever' && (
        <LeverScene params={params} leverAngle={leverAngle} hoveredId={hoveredId} onHover={hover} onUnhover={unhover} onClick={openEquipment} />
      )}
      {simType === 'buoyancy' && (
        <BuoyancyScene params={params} buoyancyFrac={buoyancyFrac} hoveredId={hoveredId} onHover={hover} onUnhover={unhover} onClick={openEquipment} />
      )}
      {simType === 'circuit' && (
        <CircuitScene params={params} t={t} running={running} hoveredId={hoveredId} onHover={hover} onUnhover={unhover} onClick={openEquipment} />
      )}
      {simType === 'mirror' && (
        <MirrorScene params={params} t={t} hoveredId={hoveredId} onHover={hover} onUnhover={unhover} onClick={openEquipment} />
      )}
      {simType === 'magnet' && (
        <MagnetScene params={params} magnetGap={magnetGap} hoveredId={hoveredId} onHover={hover} onUnhover={unhover} onClick={openEquipment} />
      )}

      {openEquipmentId && <EquipmentModal equipmentId={openEquipmentId} equipment={PHYSICS_EQUIPMENT} onClose={() => setOpenEquipmentId(null)} deepDivePrefix="physics-equip" />}
      <p className="text-center text-[11px] text-slate-400 pb-2">Click any equipment for details &middot; apparatus shown: {apparatusIds.length}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pendulum scene
// ---------------------------------------------------------------------------
function PendulumScene({ params, t, smallAngle, angle, hoveredId, onHover, onUnhover, onClick, showOverlay }: {
  params: Record<string, number>; t: number; smallAngle: boolean; angle: { theta: number; thetaDot: number };
  hoveredId: string | null; onHover: (id: string) => void; onUnhover: () => void; onClick: (id: string) => void; showOverlay: boolean;
}) {
  const length = params.length || 1;
  const gravity = params.gravity || 9.8;
  const amplitudeDeg = params.amplitudeDeg || 15;
  const mass = params.mass ?? 0.2;

  const theta = smallAngle ? pendulumSmallAngle(t, { length, gravity, amplitudeDeg }).theta : angle.theta;
  const period = pendulumPeriodSmallAngle(length, gravity);

  const pivotX = 170;
  const pivotY = 36;
  const lengthPx = Math.min(220, length * PENDULUM_PX_PER_M);
  const bobX = pivotX + lengthPx * Math.sin(theta);
  const bobY = pivotY + lengthPx * Math.cos(theta);
  const bobRadius = 8 + mass * 18;

  const theta0 = (amplitudeDeg * Math.PI) / 180;
  const height = length * (1 - Math.cos(theta));
  const maxHeight = length * (1 - Math.cos(theta0));
  const peFraction = maxHeight > 0 ? height / maxHeight : 0;
  const keFraction = 1 - peFraction;

  return (
    <svg viewBox="0 0 340 300" className="w-full h-72">
      <line x1={0} y1={270} x2={340} y2={270} className="stroke-slate-300 dark:stroke-slate-700" strokeWidth={2} />

      <Hotspot x={pivotX} y={pivotY} hovered={hoveredId === 'pendulum-stand'} onEnter={() => onHover('pendulum-stand')} onLeave={onUnhover} onClick={() => onClick('pendulum-stand')}>
        <rect x={pivotX - 60} y={pivotY - 14} width={120} height={10} rx={3} className="fill-slate-700 dark:fill-slate-300" />
        <rect x={pivotX - 6} y={pivotY - 14} width={12} height={260} className="fill-slate-400 dark:fill-slate-600" />
        {hoveredId === 'pendulum-stand' && <HoverLabel x={pivotX} y={pivotY - 40} text="Pendulum Stand" />}
      </Hotspot>

      <Hotspot x={(pivotX + bobX) / 2} y={(pivotY + bobY) / 2} hovered={hoveredId === 'pendulum-string'} onEnter={() => onHover('pendulum-string')} onLeave={onUnhover} onClick={() => onClick('pendulum-string')}>
        <line x1={pivotX} y1={pivotY} x2={bobX} y2={bobY} className="stroke-slate-500 dark:stroke-slate-400" strokeWidth={2} />
        {hoveredId === 'pendulum-string' && <HoverLabel x={(pivotX + bobX) / 2} y={(pivotY + bobY) / 2 - 24} text="Inextensible String" />}
      </Hotspot>

      <Hotspot x={bobX} y={bobY} hovered={hoveredId === 'pendulum-bob'} onEnter={() => onHover('pendulum-bob')} onLeave={onUnhover} onClick={() => onClick('pendulum-bob')}>
        <circle cx={bobX} cy={bobY} r={bobRadius} className="fill-primary-600 dark:fill-primary-500" stroke="#1e293b" strokeWidth={1.5} />
        {hoveredId === 'pendulum-bob' && <HoverLabel x={bobX} y={bobY + bobRadius + 8} text="Pendulum Bob" />}
      </Hotspot>

      <text x={12} y={20} fontSize={12} fontWeight={700} className="fill-slate-500">Period: {period.toFixed(2)}s{!smallAngle && ' (full nonlinear)'}</text>

      {showOverlay && (
        <g transform="translate(260, 20)">
          <text x={0} y={0} fontSize={9} fontWeight={700} className="fill-slate-400">ENERGY</text>
          <rect x={0} y={6} width={16} height={60} className="fill-slate-200 dark:fill-slate-800" rx={3} />
          <rect x={0} y={6 + 60 * (1 - keFraction)} width={16} height={60 * keFraction} className="fill-accent-500" rx={3} />
          <text x={20} y={20} fontSize={8} className="fill-slate-400">KE</text>
          <rect x={22} y={6} width={16} height={60} className="fill-slate-200 dark:fill-slate-800" rx={3} />
          <rect x={22} y={6 + 60 * (1 - peFraction)} width={16} height={60 * peFraction} className="fill-red-400" rx={3} />
          <text x={42} y={20} fontSize={8} className="fill-slate-400">PE</text>
        </g>
      )}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Spring scene
// ---------------------------------------------------------------------------
function springCoilPath(topX: number, topY: number, bottomY: number, coils = 7, width = 22): string {
  const segLen = (bottomY - topY) / (coils * 2);
  let d = `M ${topX} ${topY}`;
  for (let i = 1; i <= coils * 2; i++) {
    const y = topY + i * segLen;
    const x = topX + (i % 2 === 0 ? 0 : (i % 4 === 1 ? width : -width));
    d += ` L ${x} ${y}`;
  }
  return d;
}

function SpringScene({ params, t, hoveredId, onHover, onUnhover, onClick, showOverlay }: {
  params: Record<string, number>; t: number; hoveredId: string | null; onHover: (id: string) => void; onUnhover: () => void; onClick: (id: string) => void; showOverlay: boolean;
}) {
  const mass = params.mass || 0.5;
  const springConstant = params.springConstant || 20;
  const amplitude = params.amplitude || 0.15;
  const { displacement, velocity } = springState(t, { mass, springConstant, amplitude });
  const period = springPeriod(mass, springConstant);

  const topY = 30;
  const naturalLength = 140;
  const bottomY = topY + naturalLength + displacement * SPRING_PX_PER_M;
  const topX = 170;
  const blockSize = 24 + mass * 24;

  const ke = 0.5 * mass * velocity * velocity;
  const pe = 0.5 * springConstant * displacement * displacement;
  const totalE = 0.5 * springConstant * amplitude * amplitude;
  const keFraction = totalE > 0 ? ke / totalE : 0;
  const peFraction = totalE > 0 ? pe / totalE : 0;

  return (
    <svg viewBox="0 0 340 320" className="w-full h-72">
      <line x1={0} y1={300} x2={340} y2={300} className="stroke-slate-300 dark:stroke-slate-700" strokeWidth={2} />

      <Hotspot x={topX} y={topY} hovered={hoveredId === 'pendulum-stand'} onEnter={() => onHover('pendulum-stand')} onLeave={onUnhover} onClick={() => onClick('pendulum-stand')}>
        <rect x={topX - 60} y={topY - 14} width={120} height={10} rx={3} className="fill-slate-700 dark:fill-slate-300" />
        {hoveredId === 'pendulum-stand' && <HoverLabel x={topX} y={topY - 34} text="Support Stand" />}
      </Hotspot>

      <Hotspot x={topX} y={(topY + bottomY) / 2} hovered={hoveredId === 'spring-coil'} onEnter={() => onHover('spring-coil')} onLeave={onUnhover} onClick={() => onClick('spring-coil')}>
        <path d={springCoilPath(topX, topY, bottomY)} fill="none" className="stroke-slate-500 dark:stroke-slate-400" strokeWidth={2.5} strokeLinejoin="round" />
        {hoveredId === 'spring-coil' && <HoverLabel x={topX} y={(topY + bottomY) / 2} text="Helical Spring" />}
      </Hotspot>

      <Hotspot x={topX} y={bottomY} hovered={hoveredId === 'mass-hanger'} onEnter={() => onHover('mass-hanger')} onLeave={onUnhover} onClick={() => onClick('mass-hanger')}>
        <rect x={topX - blockSize / 2} y={bottomY} width={blockSize} height={blockSize} rx={4} className="fill-primary-600 dark:fill-primary-500" stroke="#1e293b" strokeWidth={1.5} />
        {hoveredId === 'mass-hanger' && <HoverLabel x={topX} y={bottomY + blockSize + 16} text="Hanging Mass" />}
      </Hotspot>

      <text x={12} y={20} fontSize={12} fontWeight={700} className="fill-slate-500">Period: {period.toFixed(2)}s</text>

      {showOverlay && (
        <g transform="translate(260, 20)">
          <text x={0} y={0} fontSize={9} fontWeight={700} className="fill-slate-400">ENERGY</text>
          <rect x={0} y={6} width={16} height={60} className="fill-slate-200 dark:fill-slate-800" rx={3} />
          <rect x={0} y={6 + 60 * (1 - keFraction)} width={16} height={60 * Math.min(1, keFraction)} className="fill-accent-500" rx={3} />
          <text x={20} y={20} fontSize={8} className="fill-slate-400">KE</text>
          <rect x={22} y={6} width={16} height={60} className="fill-slate-200 dark:fill-slate-800" rx={3} />
          <rect x={22} y={6 + 60 * (1 - peFraction)} width={16} height={60 * Math.min(1, peFraction)} className="fill-red-400" rx={3} />
          <text x={42} y={20} fontSize={8} className="fill-slate-400">PE</text>
        </g>
      )}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Projectile scene
// ---------------------------------------------------------------------------
function ProjectileScene({ params, t, trail, setTrail, running, hoveredId, onHover, onUnhover, onClick, showOverlay }: {
  params: Record<string, number>; t: number; trail: { x: number; y: number }[]; setTrail: (fn: (prev: { x: number; y: number }[]) => { x: number; y: number }[]) => void;
  running: boolean; hoveredId: string | null; onHover: (id: string) => void; onUnhover: () => void; onClick: (id: string) => void; showOverlay: boolean;
}) {
  const speed = params.speed || 15;
  const angleDeg = params.angleDeg || 45;
  const gravity = params.gravity || 9.8;
  const p = { speed, angleDeg, gravity };
  const range = Math.max(0.5, projectileRange(p));
  const maxHeight = Math.max(0.5, projectileMaxHeight(p));

  const groundY = 260;
  const launchX = 40;
  const availableW = 480;
  const availableH = 200;
  const scale = Math.min(availableW / range, availableH / maxHeight, 60);

  const { x, y, landed } = projectileState(t, p);
  const ballX = launchX + x * scale;
  const ballY = groundY - y * scale;

  useEffect(() => {
    if (!running) return;
    setTrail((prev) => {
      const next = [...prev, { x: ballX, y: ballY }];
      return next.length > 200 ? next.slice(-200) : next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, running]);

  const trailPath = trail.length > 1 ? `M ${trail.map((pt) => `${pt.x} ${pt.y}`).join(' L ')}` : '';

  return (
    <svg viewBox="0 0 540 300" className="w-full h-72">
      <line x1={0} y1={groundY} x2={540} y2={groundY} className="stroke-slate-300 dark:stroke-slate-700" strokeWidth={2} />

      <Hotspot x={launchX} y={groundY - 10} hovered={hoveredId === 'launcher'} onEnter={() => onHover('launcher')} onLeave={onUnhover} onClick={() => onClick('launcher')}>
        <g transform={`translate(${launchX}, ${groundY}) rotate(${-angleDeg})`}>
          <rect x={-6} y={-40} width={12} height={40} rx={3} className="fill-slate-700 dark:fill-slate-300" />
        </g>
        {hoveredId === 'launcher' && <HoverLabel x={launchX} y={groundY - 60} text="Projectile Launcher" />}
      </Hotspot>

      {trailPath && <path d={trailPath} fill="none" className="stroke-primary-400 dark:stroke-primary-600" strokeWidth={2} strokeDasharray="1 5" strokeLinecap="round" opacity={0.6} />}

      {!landed && (
        <line x1={launchX} y1={groundY - Math.max(0, maxHeight * scale)} x2={launchX} y2={groundY} className="stroke-slate-200 dark:stroke-slate-800" strokeDasharray="4 4" />
      )}

      <Hotspot x={ballX} y={ballY} hovered={hoveredId === 'ball'} onEnter={() => onHover('ball')} onLeave={onUnhover} onClick={() => onClick('ball')}>
        <circle cx={ballX} cy={ballY} r={9} className="fill-accent-500" stroke="#1e293b" strokeWidth={1.5} />
        {hoveredId === 'ball' && <HoverLabel x={ballX} y={ballY - 20} text="Steel Ball" />}
      </Hotspot>

      {landed && (
        <g>
          <line x1={launchX + range * scale} y1={groundY - 26} x2={launchX + range * scale} y2={groundY + 4} className="stroke-accent-500" strokeDasharray="3 3" />
          <text x={launchX + range * scale} y={groundY + 18} textAnchor="middle" fontSize={11} fontWeight={700} className="fill-accent-600">R = {range.toFixed(1)}m</text>
        </g>
      )}

      <text x={12} y={20} fontSize={12} fontWeight={700} className="fill-slate-500">Range: {range.toFixed(1)}m &middot; Max Height: {maxHeight.toFixed(1)}m</text>

      {showOverlay && (
        <g transform={`translate(${ballX}, ${ballY})`} pointerEvents="none">
          <line x1={0} y1={0} x2={Math.cos((angleDeg * Math.PI) / 180) * 26} y2={0} className="stroke-accent-500" strokeWidth={2} markerEnd="url(#arrow)" />
        </g>
      )}
      <defs>
        <marker id="arrow" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto"><path d="M0,0 L6,3 L0,6 z" className="fill-accent-500" /></marker>
      </defs>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Lever & Principle of Moments scene
// ---------------------------------------------------------------------------
function LeverScene({ params, leverAngle, hoveredId, onHover, onUnhover, onClick }: {
  params: Record<string, number>; leverAngle: number; hoveredId: string | null; onHover: (id: string) => void; onUnhover: () => void; onClick: (id: string) => void;
}) {
  const leftForce = params.leftForce ?? 20;
  const leftDistance = params.leftDistance ?? 2;
  const rightForce = params.rightForce ?? 20;
  const rightDistance = params.rightDistance ?? 2;

  const pivotX = 170;
  const pivotY = 150;
  const beamHalfLen = 130;
  const rad = (leverAngle * Math.PI) / 180;
  const dirX = Math.cos(rad);
  const dirY = Math.sin(rad);
  const maxDist = 4;
  const leftT = Math.min(1, leftDistance / maxDist);
  const rightT = Math.min(1, rightDistance / maxDist);
  const leftPos = { x: pivotX - beamHalfLen * leftT * dirX, y: pivotY - beamHalfLen * leftT * dirY };
  const rightPos = { x: pivotX + beamHalfLen * rightT * dirX, y: pivotY + beamHalfLen * rightT * dirY };
  const beamLeft = { x: pivotX - beamHalfLen * dirX, y: pivotY - beamHalfLen * dirY };
  const beamRight = { x: pivotX + beamHalfLen * dirX, y: pivotY + beamHalfLen * dirY };
  const leftSize = 12 + leftForce * 0.5;
  const rightSize = 12 + rightForce * 0.5;

  return (
    <svg viewBox="0 0 340 260" className="w-full h-72">
      <line x1={0} y1={230} x2={340} y2={230} className="stroke-slate-300 dark:stroke-slate-700" strokeWidth={2} />

      <Hotspot x={pivotX} y={pivotY + 35} hovered={hoveredId === 'lever-pivot'} onEnter={() => onHover('lever-pivot')} onLeave={onUnhover} onClick={() => onClick('lever-pivot')}>
        <path d={`M ${pivotX - 22} ${pivotY + 40} L ${pivotX + 22} ${pivotY + 40} L ${pivotX} ${pivotY} Z`} className="fill-slate-700 dark:fill-slate-300" />
        {hoveredId === 'lever-pivot' && <HoverLabel x={pivotX} y={pivotY + 58} text="Fulcrum" />}
      </Hotspot>

      <Hotspot x={pivotX} y={pivotY} hovered={hoveredId === 'lever-beam'} onEnter={() => onHover('lever-beam')} onLeave={onUnhover} onClick={() => onClick('lever-beam')}>
        <line x1={beamLeft.x} y1={beamLeft.y} x2={beamRight.x} y2={beamRight.y} className="stroke-slate-600 dark:stroke-slate-400" strokeWidth={8} strokeLinecap="round" />
        {hoveredId === 'lever-beam' && <HoverLabel x={pivotX} y={pivotY - 90} text="Lever Beam" />}
      </Hotspot>

      <Hotspot x={leftPos.x} y={leftPos.y} hovered={hoveredId === 'lever-weight-left'} onEnter={() => onHover('lever-weight-left')} onLeave={onUnhover} onClick={() => onClick('lever-weight')}>
        <rect x={leftPos.x - leftSize / 2} y={leftPos.y - leftSize / 2} width={leftSize} height={leftSize} className="fill-primary-600" stroke="#1e293b" strokeWidth={1.5} />
        {hoveredId === 'lever-weight-left' && <HoverLabel x={leftPos.x} y={leftPos.y - leftSize - 12} text="Slotted Weight" />}
      </Hotspot>
      <Hotspot x={rightPos.x} y={rightPos.y} hovered={hoveredId === 'lever-weight-right'} onEnter={() => onHover('lever-weight-right')} onLeave={onUnhover} onClick={() => onClick('lever-weight')}>
        <rect x={rightPos.x - rightSize / 2} y={rightPos.y - rightSize / 2} width={rightSize} height={rightSize} className="fill-accent-500" stroke="#1e293b" strokeWidth={1.5} />
        {hoveredId === 'lever-weight-right' && <HoverLabel x={rightPos.x} y={rightPos.y - rightSize - 12} text="Slotted Weight" />}
      </Hotspot>

      <text x={12} y={20} fontSize={11} fontWeight={700} className="fill-slate-500">
        Left moment: {(leftForce * leftDistance).toFixed(0)} N&middot;m &nbsp; Right moment: {(rightForce * rightDistance).toFixed(0)} N&middot;m
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Buoyancy / Archimedes' Principle scene
// ---------------------------------------------------------------------------
function BuoyancyScene({ params, buoyancyFrac, hoveredId, onHover, onUnhover, onClick }: {
  params: Record<string, number>; buoyancyFrac: number; hoveredId: string | null; onHover: (id: string) => void; onUnhover: () => void; onClick: (id: string) => void;
}) {
  const objectDensity = params.objectDensity ?? 700;
  const fluidDensity = params.fluidDensity ?? 1000;
  const floats = buoyancyFloats({ objectDensity, fluidDensity });

  const beakerX = 110;
  const beakerY = 30;
  const beakerW = 140;
  const beakerH = 210;
  const waterlineY = beakerY + 55;
  const floorY = beakerY + beakerH - 8;
  const blockSize = 46;

  const centerY = floats
    ? waterlineY + blockSize * (buoyancyFrac - 0.5)
    : (waterlineY - blockSize / 2) + buoyancyFrac * ((floorY - blockSize / 2) - (waterlineY - blockSize / 2));

  return (
    <svg viewBox="0 0 340 280" className="w-full h-72">
      <Hotspot x={beakerX + beakerW / 2} y={beakerY + beakerH / 2} hovered={hoveredId === 'beaker-water'} onEnter={() => onHover('beaker-water')} onLeave={onUnhover} onClick={() => onClick('beaker-water')}>
        <rect x={beakerX} y={beakerY} width={beakerW} height={beakerH} rx={6} fill="none" className="stroke-slate-400 dark:stroke-slate-600" strokeWidth={3} />
        <rect x={beakerX + 2} y={waterlineY} width={beakerW - 4} height={beakerH - (waterlineY - beakerY) - 4} className="fill-sky-300/50 dark:fill-sky-500/20" />
        {hoveredId === 'beaker-water' && <HoverLabel x={beakerX + beakerW / 2} y={beakerY - 16} text="Beaker of Water" />}
      </Hotspot>

      <Hotspot x={beakerX + beakerW / 2} y={centerY} hovered={hoveredId === 'density-block'} onEnter={() => onHover('density-block')} onLeave={onUnhover} onClick={() => onClick('density-block')}>
        <rect x={beakerX + beakerW / 2 - blockSize / 2} y={centerY - blockSize / 2} width={blockSize} height={blockSize} rx={4} className="fill-primary-600" stroke="#1e293b" strokeWidth={1.5} />
        {hoveredId === 'density-block' && <HoverLabel x={beakerX + beakerW / 2} y={centerY - blockSize / 2 - 12} text="Test Block" />}
      </Hotspot>

      <text x={12} y={20} fontSize={11} fontWeight={700} className="fill-slate-500">
        {floats ? 'Floating' : 'Sinking'} &middot; object {objectDensity} kg/m&sup3; vs fluid {fluidDensity} kg/m&sup3;
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Ohm's Law Circuit scene
// ---------------------------------------------------------------------------
function CircuitScene({ params, t, running, hoveredId, onHover, onUnhover, onClick }: {
  params: Record<string, number>; t: number; running: boolean; hoveredId: string | null; onHover: (id: string) => void; onUnhover: () => void; onClick: (id: string) => void;
}) {
  const voltage = params.voltage ?? 6;
  const resistance = params.resistance ?? 3;
  const current = ohmsLawCurrent({ voltage, resistance });
  const brightness = Math.min(1, current / 4);

  const loopPath = 'M 70 190 L 70 50 L 260 50 L 260 190 Z';
  const dashOffset = running ? -(t * (2 + current * 6)) : 0;

  return (
    <svg viewBox="0 0 330 230" className="w-full h-72">
      <path d={loopPath} fill="none" className="stroke-slate-300 dark:stroke-slate-700" strokeWidth={4} />
      <path d={loopPath} fill="none" stroke="#2f5fe0" strokeWidth={4} strokeDasharray="10 10" strokeDashoffset={dashOffset} opacity={current > 0 ? 0.9 : 0} />

      <Hotspot x={70} y={165} hovered={hoveredId === 'battery'} onEnter={() => onHover('battery')} onLeave={onUnhover} onClick={() => onClick('battery')}>
        <rect x={52} y={145} width={36} height={40} rx={3} className="fill-slate-700 dark:fill-slate-300" />
        <text x={70} y={169} textAnchor="middle" fontSize={11} fontWeight={700} className="fill-white dark:fill-slate-900">{voltage}V</text>
        {hoveredId === 'battery' && <HoverLabel x={70} y={130} text="Battery Cell" />}
      </Hotspot>

      <Hotspot x={165} y={50} hovered={hoveredId === 'bulb'} onEnter={() => onHover('bulb')} onLeave={onUnhover} onClick={() => onClick('bulb')}>
        <circle cx={165} cy={50} r={26} fill={`rgba(251, 191, 36, ${0.15 + brightness * 0.85})`} stroke="#92400e" strokeWidth={2} />
        <circle cx={165} cy={50} r={26} fill="none" stroke="#fbbf24" strokeWidth={brightness * 8} opacity={0.5} />
        {hoveredId === 'bulb' && <HoverLabel x={165} y={12} text="Light Bulb" />}
      </Hotspot>

      <Hotspot x={260} y={120} hovered={hoveredId === 'connecting-wire'} onEnter={() => onHover('connecting-wire')} onLeave={onUnhover} onClick={() => onClick('connecting-wire')}>
        <rect x={252} y={90} width={16} height={60} opacity={0} />
        {hoveredId === 'connecting-wire' && <HoverLabel x={260} y={80} text="Connecting Wire" />}
      </Hotspot>

      <text x={12} y={20} fontSize={12} fontWeight={700} className="fill-slate-500">Current: {current.toFixed(2)} A</text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Plane Mirror Reflection scene
// ---------------------------------------------------------------------------
function MirrorScene({ params, t, hoveredId, onHover, onUnhover, onClick }: {
  params: Record<string, number>; t: number; hoveredId: string | null; onHover: (id: string) => void; onUnhover: () => void; onClick: (id: string) => void;
}) {
  const incidenceAngleDeg = params.incidenceAngleDeg ?? 40;
  const reflectedAngleDeg = reflectionAngleDeg({ incidenceAngleDeg });
  const rad = (incidenceAngleDeg * Math.PI) / 180;
  const hitX = 170;
  const hitY = 180;
  const rayLen = 130;

  const sourcePos = { x: hitX - rayLen * Math.sin(rad), y: hitY - rayLen * Math.cos(rad) };
  const reflectedEnd = { x: hitX + rayLen * Math.sin((reflectedAngleDeg * Math.PI) / 180), y: hitY - rayLen * Math.cos((reflectedAngleDeg * Math.PI) / 180) };

  const travelPhase = (t * 0.6) % 1;
  const incidentDot = { x: sourcePos.x + (hitX - sourcePos.x) * travelPhase, y: sourcePos.y + (hitY - sourcePos.y) * travelPhase };
  const reflectedDot = { x: hitX + (reflectedEnd.x - hitX) * travelPhase, y: hitY + (reflectedEnd.y - hitY) * travelPhase };

  return (
    <svg viewBox="0 0 340 260" className="w-full h-72">
      <line x1={hitX} y1={hitY - 90} x2={hitX} y2={hitY + 20} strokeDasharray="4 4" className="stroke-slate-300 dark:stroke-slate-700" strokeWidth={1.5} />

      <Hotspot x={60} y={220} hovered={hoveredId === 'plane-mirror'} onEnter={() => onHover('plane-mirror')} onLeave={onUnhover} onClick={() => onClick('plane-mirror')}>
        <line x1={60} y1={hitY} x2={280} y2={hitY} className="stroke-slate-600 dark:stroke-slate-300" strokeWidth={5} />
        {hoveredId === 'plane-mirror' && <HoverLabel x={170} y={hitY + 20} text="Plane Mirror" />}
      </Hotspot>

      <Hotspot x={sourcePos.x} y={sourcePos.y} hovered={hoveredId === 'light-ray-source'} onEnter={() => onHover('light-ray-source')} onLeave={onUnhover} onClick={() => onClick('light-ray-source')}>
        <rect x={sourcePos.x - 10} y={sourcePos.y - 8} width={20} height={16} rx={2} className="fill-amber-500" />
        {hoveredId === 'light-ray-source' && <HoverLabel x={sourcePos.x} y={sourcePos.y - 20} text="Ray Box" />}
      </Hotspot>

      <line x1={sourcePos.x} y1={sourcePos.y} x2={hitX} y2={hitY} className="stroke-amber-500" strokeWidth={2} />
      <line x1={hitX} y1={hitY} x2={reflectedEnd.x} y2={reflectedEnd.y} className="stroke-amber-500" strokeWidth={2} strokeDasharray="1 0" />
      <circle cx={incidentDot.x} cy={incidentDot.y} r={3.5} className="fill-amber-300" />
      <circle cx={reflectedDot.x} cy={reflectedDot.y} r={3.5} className="fill-amber-300" />

      <text x={12} y={20} fontSize={11} fontWeight={700} className="fill-slate-500">Incidence: {incidenceAngleDeg}&deg; &nbsp; Reflection: {reflectedAngleDeg}&deg;</text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Magnets: Attract or Repel scene
// ---------------------------------------------------------------------------
function MagnetScene({ params, magnetGap, hoveredId, onHover, onUnhover, onClick }: {
  params: Record<string, number>; magnetGap: number; hoveredId: string | null; onHover: (id: string) => void; onUnhover: () => void; onClick: (id: string) => void;
}) {
  const orientation = params.orientation ?? 0;
  const attract = magnetsAttract({ orientation });

  const fixedX = 40;
  const magnetW = 70;
  const magnetH = 34;
  const y = 113;
  const gapPx = magnetGap * 90;
  const movableX = fixedX + magnetW + gapPx;

  return (
    <svg viewBox="0 0 340 240" className="w-full h-72">
      <line x1={0} y1={200} x2={340} y2={200} className="stroke-slate-300 dark:stroke-slate-700" strokeWidth={2} />

      <Hotspot x={fixedX + magnetW / 2} y={y + magnetH / 2} hovered={hoveredId === 'bar-magnet-fixed'} onEnter={() => onHover('bar-magnet-fixed')} onLeave={onUnhover} onClick={() => onClick('bar-magnet')}>
        <rect x={fixedX} y={y} width={magnetW / 2} height={magnetH} className="fill-blue-500" stroke="#1e293b" strokeWidth={1.5} />
        <rect x={fixedX + magnetW / 2} y={y} width={magnetW / 2} height={magnetH} className="fill-red-500" stroke="#1e293b" strokeWidth={1.5} />
        <text x={fixedX + magnetW * 0.25} y={y + magnetH / 2 + 5} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-white">S</text>
        <text x={fixedX + magnetW * 0.75} y={y + magnetH / 2 + 5} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-white">N</text>
        {hoveredId === 'bar-magnet-fixed' && <HoverLabel x={fixedX + magnetW / 2} y={y - 14} text="Bar Magnet" />}
      </Hotspot>

      <Hotspot x={movableX + magnetW / 2} y={y + magnetH / 2} hovered={hoveredId === 'bar-magnet-movable'} onEnter={() => onHover('bar-magnet-movable')} onLeave={onUnhover} onClick={() => onClick('bar-magnet')}>
        <rect x={movableX} y={y} width={magnetW / 2} height={magnetH} className={attract ? 'fill-blue-500' : 'fill-red-500'} stroke="#1e293b" strokeWidth={1.5} />
        <rect x={movableX + magnetW / 2} y={y} width={magnetW / 2} height={magnetH} className={attract ? 'fill-red-500' : 'fill-blue-500'} stroke="#1e293b" strokeWidth={1.5} />
        <text x={movableX + magnetW * 0.25} y={y + magnetH / 2 + 5} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-white">{attract ? 'S' : 'N'}</text>
        <text x={movableX + magnetW * 0.75} y={y + magnetH / 2 + 5} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-white">{attract ? 'N' : 'S'}</text>
        {hoveredId === 'bar-magnet-movable' && <HoverLabel x={movableX + magnetW / 2} y={y - 14} text="Bar Magnet" />}
      </Hotspot>

      <text x={12} y={20} fontSize={12} fontWeight={700} className="fill-slate-500">{attract ? 'Unlike poles -- attracting' : 'Like poles -- repelling'}</text>
    </svg>
  );
}
