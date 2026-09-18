'use client';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
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
import { EquipmentModal } from '@/components/labshared/LabHotspot';

// One 3D scene per simType, dynamically imported (ssr:false) -- same
// pattern as ChemPhysicalStage.tsx -- so a student looking at the Pendulum
// never downloads the Circuit/Mirror/Magnet scene code, keeping each
// individual page load light even though there are 8 scenes total.
const sceneLoading = (h: number) => () => <div className="w-full rounded-2xl bg-slate-50 dark:bg-slate-900/40 animate-pulse" style={{ height: h }} />;
const Pendulum3DScene = dynamic(() => import('./Pendulum3DScene'), { ssr: false, loading: sceneLoading(288) });
const Spring3DScene = dynamic(() => import('./Spring3DScene'), { ssr: false, loading: sceneLoading(288) });
const Projectile3DScene = dynamic(() => import('./Projectile3DScene'), { ssr: false, loading: sceneLoading(288) });
const Lever3DScene = dynamic(() => import('./Lever3DScene'), { ssr: false, loading: sceneLoading(288) });
const Buoyancy3DScene = dynamic(() => import('./Buoyancy3DScene'), { ssr: false, loading: sceneLoading(288) });
const Circuit3DScene = dynamic(() => import('./Circuit3DScene'), { ssr: false, loading: sceneLoading(288) });
const Mirror3DScene = dynamic(() => import('./Mirror3DScene'), { ssr: false, loading: sceneLoading(288) });
const Magnet3DScene = dynamic(() => import('./Magnet3DScene'), { ssr: false, loading: sceneLoading(288) });

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

  // Every readout string previously drawn as SVG <text> inside each scene
  // now lives here as a single HTML overlay panel -- one consistent look
  // across all 8 sim types instead of per-scene text placement, layered
  // over the 3D canvas the same way the sound toggle already is.
  let readout = '';
  let energy: { keFraction: number; peFraction: number } | null = null;

  if (simType === 'pendulum') {
    const length = params.length || 1;
    const gravity = params.gravity || 9.8;
    const amplitudeDeg = params.amplitudeDeg || 15;
    const period = pendulumPeriodSmallAngle(length, gravity);
    readout = `Period: ${period.toFixed(2)}s${!smallAngle ? ' (full nonlinear)' : ''}`;
    if (showOverlay) {
      const theta = smallAngle ? pendulumSmallAngle(t, { length, gravity, amplitudeDeg }).theta : pendulumAngle.theta;
      const theta0 = (amplitudeDeg * Math.PI) / 180;
      const height = length * (1 - Math.cos(theta));
      const maxHeight = length * (1 - Math.cos(theta0));
      const peFraction = maxHeight > 0 ? height / maxHeight : 0;
      energy = { keFraction: 1 - peFraction, peFraction };
    }
  } else if (simType === 'spring') {
    const mass = params.mass || 0.5;
    const springConstant = params.springConstant || 20;
    const amplitude = params.amplitude || 0.15;
    const period = springPeriod(mass, springConstant);
    readout = `Period: ${period.toFixed(2)}s`;
    if (showOverlay) {
      const { displacement, velocity } = springState(t, { mass, springConstant, amplitude });
      const ke = 0.5 * mass * velocity * velocity;
      const pe = 0.5 * springConstant * displacement * displacement;
      const totalE = 0.5 * springConstant * amplitude * amplitude;
      energy = { keFraction: totalE > 0 ? Math.min(1, ke / totalE) : 0, peFraction: totalE > 0 ? Math.min(1, pe / totalE) : 0 };
    }
  } else if (simType === 'projectile') {
    const p = { speed: params.speed || 15, angleDeg: params.angleDeg || 45, gravity: params.gravity || 9.8 };
    const range = Math.max(0.5, projectileRange(p));
    const maxHeight = Math.max(0.5, projectileMaxHeight(p));
    readout = `Range: ${range.toFixed(1)}m · Max Height: ${maxHeight.toFixed(1)}m`;
  } else if (simType === 'lever') {
    const leftForce = params.leftForce ?? 20;
    const leftDistance = params.leftDistance ?? 2;
    const rightForce = params.rightForce ?? 20;
    const rightDistance = params.rightDistance ?? 2;
    readout = `Left moment: ${(leftForce * leftDistance).toFixed(0)} N·m   Right moment: ${(rightForce * rightDistance).toFixed(0)} N·m`;
  } else if (simType === 'buoyancy') {
    const objectDensity = params.objectDensity ?? 700;
    const fluidDensity = params.fluidDensity ?? 1000;
    const floats = buoyancyFloats({ objectDensity, fluidDensity });
    readout = `${floats ? 'Floating' : 'Sinking'} · object ${objectDensity} kg/m³ vs fluid ${fluidDensity} kg/m³`;
  } else if (simType === 'circuit') {
    const voltage = params.voltage ?? 6;
    const resistance = params.resistance ?? 3;
    const current = ohmsLawCurrent({ voltage, resistance });
    readout = `Current: ${current.toFixed(2)} A`;
  } else if (simType === 'mirror') {
    const incidenceAngleDeg = params.incidenceAngleDeg ?? 40;
    const reflectedAngleDeg = reflectionAngleDeg({ incidenceAngleDeg });
    readout = `Incidence: ${incidenceAngleDeg}°   Reflection: ${reflectedAngleDeg}°`;
  } else if (simType === 'magnet') {
    const orientation = params.orientation ?? 0;
    const attract = magnetsAttract({ orientation });
    readout = attract ? 'Unlike poles -- attracting' : 'Like poles -- repelling';
  }

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-sky-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border-2 border-slate-200 dark:border-slate-800 overflow-hidden">
      <button
        onClick={toggleSound}
        title={soundOn ? 'Mute lab sounds' : 'Enable lab sounds'}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform"
      >
        {soundOn ? <Volume2 className="w-4 h-4 text-primary-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
      </button>

      {readout && (
        <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300">
          {readout}
        </div>
      )}

      {energy && (
        <div className="absolute top-11 left-3 z-10 flex items-end gap-2 px-2.5 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-slate-200 dark:border-slate-700">
          <EnergyBar label="KE" fraction={energy.keFraction} color="#2F9560" />
          <EnergyBar label="PE" fraction={energy.peFraction} color="#E8474C" />
        </div>
      )}

      {simType === 'pendulum' && (
        <Pendulum3DScene
          length={params.length || 1}
          mass={params.mass ?? 0.2}
          theta={smallAngle ? pendulumSmallAngle(t, { length: params.length || 1, gravity: params.gravity || 9.8, amplitudeDeg: params.amplitudeDeg || 15 }).theta : pendulumAngle.theta}
          hoveredId={hoveredId} onHover={hover} onUnhover={unhover} onClick={openEquipment}
        />
      )}
      {simType === 'spring' && (
        <Spring3DScene
          mass={params.mass || 0.5}
          displacement={springState(t, { mass: params.mass || 0.5, springConstant: params.springConstant || 20, amplitude: params.amplitude || 0.15 }).displacement}
          hoveredId={hoveredId} onHover={hover} onUnhover={unhover} onClick={openEquipment}
        />
      )}
      {simType === 'projectile' && (() => {
        const p = { speed: params.speed || 15, angleDeg: params.angleDeg || 45, gravity: params.gravity || 9.8 };
        const { x, y, landed } = projectileState(t, p);
        return (
          <Projectile3DScene
            angleDeg={p.angleDeg}
            ballX={x} ballY={y}
            range={Math.max(0.5, projectileRange(p))}
            maxHeight={Math.max(0.5, projectileMaxHeight(p))}
            landed={landed}
            running={running}
            hoveredId={hoveredId} onHover={hover} onUnhover={unhover} onClick={openEquipment}
          />
        );
      })()}
      {simType === 'lever' && (
        <Lever3DScene
          leftForce={params.leftForce ?? 20} leftDistance={params.leftDistance ?? 2}
          rightForce={params.rightForce ?? 20} rightDistance={params.rightDistance ?? 2}
          leverAngle={leverAngle}
          hoveredId={hoveredId} onHover={hover} onUnhover={unhover} onClick={openEquipment}
        />
      )}
      {simType === 'buoyancy' && (
        <Buoyancy3DScene
          floats={buoyancyFloats({ objectDensity: params.objectDensity ?? 700, fluidDensity: params.fluidDensity ?? 1000 })}
          buoyancyFrac={buoyancyFrac}
          hoveredId={hoveredId} onHover={hover} onUnhover={unhover} onClick={openEquipment}
        />
      )}
      {simType === 'circuit' && (
        <Circuit3DScene
          voltage={params.voltage ?? 6}
          current={ohmsLawCurrent({ voltage: params.voltage ?? 6, resistance: params.resistance ?? 3 })}
          running={running}
          hoveredId={hoveredId} onHover={hover} onUnhover={unhover} onClick={openEquipment}
        />
      )}
      {simType === 'mirror' && (
        <Mirror3DScene
          incidenceAngleDeg={params.incidenceAngleDeg ?? 40}
          reflectedAngleDeg={reflectionAngleDeg({ incidenceAngleDeg: params.incidenceAngleDeg ?? 40 })}
          travelPhase={(t * 0.6) % 1}
          hoveredId={hoveredId} onHover={hover} onUnhover={unhover} onClick={openEquipment}
        />
      )}
      {simType === 'magnet' && (
        <Magnet3DScene
          attract={magnetsAttract({ orientation: params.orientation ?? 0 })}
          magnetGap={magnetGap}
          hoveredId={hoveredId} onHover={hover} onUnhover={unhover} onClick={openEquipment}
        />
      )}

      {openEquipmentId && <EquipmentModal equipmentId={openEquipmentId} equipment={PHYSICS_EQUIPMENT} onClose={() => setOpenEquipmentId(null)} deepDivePrefix="physics-equip" />}
      <p className="text-center text-[11px] text-slate-400 pb-2">Click any equipment for details &middot; apparatus shown: {apparatusIds.length}</p>
    </div>
  );
}

function EnergyBar({ label, fraction, color }: { label: string; fraction: number; color: string }) {
  const pct = Math.max(0, Math.min(1, fraction)) * 100;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-4 h-14 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex flex-col justify-end">
        <div className="w-full transition-[height] duration-100" style={{ height: `${pct}%`, background: color }} />
      </div>
      <span className="text-[9px] font-bold text-slate-400">{label}</span>
    </div>
  );
}
