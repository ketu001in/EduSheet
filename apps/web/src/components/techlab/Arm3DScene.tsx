'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import { RotateCcw, Sparkles } from 'lucide-react';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';
import { forwardKinematics2Link, inverseKinematics2Link } from '@/lib/roboticsEngineeringEngine';

// A real 3D robotic arm scene -- direct rebuild after fair feedback that
// the original flat-SVG stick-figure version ("thin blue lines and dots
// on a blank box") didn't read as a lab at all. Same verified inverse-
// kinematics math as before (unchanged, scale-invariant), but now solid
// cylindrical arm segments with real materials and shadows, an actual
// box-shaped object that visibly gets picked up and carried, and smooth
// eased motion between targets instead of an instant snap.
const L1 = 2.2, L2 = 1.8;
const BASE_Y = 0.15;
const OBJECT_POS = { x: 1.3, y: 2.0 };
const DROP_POS = { x: -1.9, y: 1.7 };
const REACH_TOLERANCE = 0.35;
const HOME = { theta1: Math.PI / 2, theta2: -0.3 };

export default function Arm3DScene() {
  const [angles, setAngles] = useState(HOME);
  const [phase, setPhase] = useState<'reach-object' | 'holding' | 'delivered'>('reach-object');
  const [message, setMessage] = useState<string | null>(null);
  const anglesRef = useRef(HOME);

  useEffect(() => { anglesRef.current = angles; }, [angles]);

  // Smoothly ease the arm from its current pose to a newly solved target
  // pose over ~400ms (ease-out cubic) instead of snapping instantly --
  // this is what makes it read as a real, physical arm moving rather than
  // a value updating.
  const animateTo = (target: { theta1: number; theta2: number }) => {
    const from = anglesRef.current;
    const start = performance.now();
    const duration = 400;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = {
        theta1: from.theta1 + (target.theta1 - from.theta1) * eased,
        theta2: from.theta2 + (target.theta2 - from.theta2) * eased,
      };
      anglesRef.current = next;
      setAngles(next);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const end = forwardKinematics2Link(L1, L2, angles.theta1, angles.theta2);

  useEffect(() => {
    const target = phase === 'reach-object' ? OBJECT_POS : phase === 'holding' ? DROP_POS : null;
    if (!target) return;
    const dist = Math.hypot(end.x - target.x, end.y - target.y);
    if (dist < REACH_TOLERANCE) {
      if (phase === 'reach-object') { setPhase('holding'); setMessage('Object gripped! Now reach the drop zone.'); }
      else if (phase === 'holding') { setPhase('delivered'); setMessage('Delivered! A real pick-and-place, start to finish.'); }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [angles]);

  const handlePick = (x: number, y: number) => {
    const solved = inverseKinematics2Link(L1, L2, x, y);
    if (!solved) { setMessage('Out of reach! Click closer to the arm.'); return; }
    animateTo(solved);
    setMessage(null);
  };

  const reset = () => { animateTo(HOME); setPhase('reach-object'); setMessage(null); };

  return (
    <div className="space-y-2">
      <SafeR3FCanvas height={340} shadows camera={{ position: [4.2, 3.2, 5.5], fov: 42 }}>
        <ambientLight intensity={0.75} />
        <directionalLight position={[3, 6, 4]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-3, 3, -2]} intensity={0.35} />
        <Table />
        <ClickPlane onPick={handlePick} />
        <ArmRig angles={angles} phase={phase} />
        <ObjectBox angles={angles} phase={phase} />
        <DropZoneRing active={phase === 'holding'} />
        <OrbitControls enablePan={false} enableZoom makeDefault target={[0, 1.2, 0]} />
      </SafeR3FCanvas>
      <p className="text-center text-[10px] text-slate-400">Drag to rotate &middot; click the table to move the arm</p>
      <div className="flex justify-center">
        <button onClick={reset} className="px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-800 font-bold text-sm flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"><RotateCcw className="w-4 h-4" /> Reset</button>
      </div>
      <p className={`text-center text-sm font-bold ${phase === 'delivered' ? 'text-accent-600' : 'text-slate-500'}`}>
        {phase === 'delivered' && <Sparkles className="w-4 h-4 inline mr-1 -mt-0.5" />}
        {message ?? (phase === 'reach-object' ? 'Click near the orange box to grip it.' : 'Reach the glowing ring to deliver it.')}
      </p>
    </div>
  );
}

function Table() {
  return (
    <mesh position={[0, -0.05, 0]} receiveShadow>
      <boxGeometry args={[6, 0.1, 6]} />
      <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
    </mesh>
  );
}

// An invisible plane covering the arm's whole vertical operating plane --
// clicking it gives a real 3D world-space intersection point directly via
// R3F's event.point, which is exactly the (x,y) the inverse-kinematics
// solver needs -- no manual screen-to-world coordinate math required.
function ClickPlane({ onPick }: { onPick: (x: number, y: number) => void }) {
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onPick(e.point.x, e.point.y);
  };
  return (
    <mesh position={[0, 1.8, 0]} onClick={handleClick} visible={false}>
      <planeGeometry args={[6, 4]} />
      <meshBasicMaterial transparent opacity={0} side={THREE.DoubleSide} />
    </mesh>
  );
}

function ArmRig({ angles, phase }: { angles: { theta1: number; theta2: number }; phase: string }) {
  const j1 = { x: L1 * Math.cos(angles.theta1), y: BASE_Y + L1 * Math.sin(angles.theta1) };
  const end = forwardKinematics2Link(L1, L2, angles.theta1, angles.theta2);
  const j2 = { x: end.x, y: BASE_Y + end.y };

  const segment = (from: { x: number; y: number }, to: { x: number; y: number }, radius: number, color: string) => {
    const mid: [number, number, number] = [(from.x + to.x) / 2, (from.y + to.y) / 2, 0];
    const length = Math.hypot(to.x - from.x, to.y - from.y);
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    return (
      <mesh position={mid} rotation={[0, 0, angle - Math.PI / 2]} castShadow>
        <cylinderGeometry args={[radius, radius, length, 16]} />
        <meshStandardMaterial color={color} metalness={0.35} roughness={0.4} />
      </mesh>
    );
  };

  const gripOpen = phase !== 'holding' ? 0.16 : 0.03;

  return (
    <group>
      {/* Base */}
      <mesh position={[0, BASE_Y / 2, 0]} castShadow>
        <cylinderGeometry args={[0.45, 0.5, BASE_Y, 24]} />
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.4} />
      </mesh>
      {segment({ x: 0, y: BASE_Y }, j1, 0.22, '#2F5FE0')}
      <mesh position={[j1.x, j1.y, 0]} castShadow>
        <sphereGeometry args={[0.19, 20, 20]} />
        <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.3} />
      </mesh>
      {segment(j1, j2, 0.16, '#5580F0')}
      <mesh position={[j2.x, j2.y, 0]} castShadow>
        <sphereGeometry args={[0.14, 20, 20]} />
        <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Gripper fingers */}
      <mesh position={[j2.x - gripOpen, j2.y - 0.12, 0]} rotation={[0, 0, 0.5]} castShadow>
        <boxGeometry args={[0.28, 0.08, 0.12]} />
        <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[j2.x + gripOpen, j2.y - 0.12, 0]} rotation={[0, 0, -0.5]} castShadow>
        <boxGeometry args={[0.28, 0.08, 0.12]} />
        <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

function ObjectBox({ angles, phase }: { angles: { theta1: number; theta2: number }; phase: string }) {
  const end = forwardKinematics2Link(L1, L2, angles.theta1, angles.theta2);
  const pos: [number, number, number] = phase === 'holding'
    ? [end.x, BASE_Y + end.y - 0.22, 0]
    : phase === 'reach-object'
      ? [OBJECT_POS.x, BASE_Y + OBJECT_POS.y - 0.15, 0]
      : [DROP_POS.x, BASE_Y + DROP_POS.y - 0.15, 0];
  return (
    <mesh position={pos} castShadow>
      <boxGeometry args={[0.32, 0.32, 0.32]} />
      <meshStandardMaterial color="#f59e0b" roughness={0.6} />
    </mesh>
  );
}

function DropZoneRing({ active }: { active: boolean }) {
  return (
    <mesh position={[DROP_POS.x, BASE_Y - 0.03, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.32, 0.4, 32]} />
      <meshStandardMaterial color="#237A4C" emissive="#237A4C" emissiveIntensity={active ? 1 : 0.35} transparent opacity={0.85} side={THREE.DoubleSide} />
    </mesh>
  );
}
