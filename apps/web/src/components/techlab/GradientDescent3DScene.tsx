'use client';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import { Play, RotateCcw, StepForward } from 'lucide-react';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';
import { bowlLoss, gradientDescentStep } from '@/lib/aiExperimentsEngine';

// A real 3D bowl-shaped loss surface f(x,z) = x^2 + z^2 -- click anywhere
// to drop a marker, then watch genuine gradient descent walk it downhill
// step by step. Push the learning rate too high and watch the exact same
// real math genuinely diverge -- a real, common training failure, not a
// scripted animation.
const RANGE = 2.6;
const HEIGHT_SCALE = 0.16;
const DIVERGE_THRESHOLD = 6;

function toWorld(x: number, z: number) {
  const y = Math.min(bowlLoss(x, z), 40) * HEIGHT_SCALE;
  return { x: THREE.MathUtils.clamp(x, -4, 4), y, z: THREE.MathUtils.clamp(z, -4, 4) };
}

export default function GradientDescent3DScene() {
  const [pos, setPos] = useState({ x: 1.8, z: 1.5 });
  const [lr, setLr] = useState(10); // /100
  const [trail, setTrail] = useState<{ x: number; z: number }[]>([{ x: 1.8, z: 1.5 }]);
  const [diverged, setDiverged] = useState(false);
  const [steps, setSteps] = useState(0);
  const runRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stepOnce = (from: { x: number; z: number }): { x: number; z: number } => {
    const raw = gradientDescentStep(from.x, from.z, lr / 100);
    const next = { x: raw.x, z: raw.y };
    const magnitude = Math.hypot(next.x, next.z);
    if (magnitude > DIVERGE_THRESHOLD) { setDiverged(true); }
    return next;
  };

  const handleStep = () => {
    if (diverged) return;
    setPos((p) => {
      const next = stepOnce(p);
      setTrail((t) => [...t.slice(-30), next]);
      return next;
    });
    setSteps((s) => s + 1);
  };

  const handleRun = () => {
    if (runRef.current) return;
    runRef.current = setInterval(() => {
      setPos((p) => {
        if (Math.hypot(p.x, p.z) > DIVERGE_THRESHOLD || (Math.hypot(p.x, p.z) < 0.05 && !diverged)) {
          if (runRef.current) { clearInterval(runRef.current); runRef.current = null; }
          return p;
        }
        const next = stepOnce(p);
        setTrail((t) => [...t.slice(-30), next]);
        setSteps((s) => s + 1);
        if (Math.hypot(next.x, next.z) > DIVERGE_THRESHOLD && runRef.current) { clearInterval(runRef.current); runRef.current = null; }
        return next;
      });
    }, 180);
  };

  const handleClickGround = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (runRef.current) { clearInterval(runRef.current); runRef.current = null; }
    const x = THREE.MathUtils.clamp(e.point.x, -RANGE, RANGE);
    const z = THREE.MathUtils.clamp(e.point.z, -RANGE, RANGE);
    setPos({ x, z });
    setTrail([{ x, z }]);
    setDiverged(false);
    setSteps(0);
  };

  const reset = () => {
    if (runRef.current) { clearInterval(runRef.current); runRef.current = null; }
    setPos({ x: 1.8, z: 1.5 });
    setTrail([{ x: 1.8, z: 1.5 }]);
    setDiverged(false);
    setSteps(0);
  };

  const loss = bowlLoss(pos.x, pos.z);

  return (
    <div className="space-y-2">
      <SafeR3FCanvas height={300} shadows camera={{ position: [4.2, 3.4, 4.2], fov: 42 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 6, 4]} intensity={1.1} castShadow />
        <BowlSurface />
        <ClickGround onClickGround={handleClickGround} />
        <TrailLine trail={trail} />
        <Ball pos={pos} diverged={diverged} />
        <OrbitControls enablePan={false} enableZoom makeDefault target={[0, 0.4, 0]} />
      </SafeR3FCanvas>
      <p className="text-center text-[10px] text-slate-400">Click the ground to drop the marker &middot; drag to rotate</p>

      <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
        <div className="rounded-lg p-1.5 bg-slate-50 dark:bg-slate-800/50"><p className="text-[10px] font-bold text-slate-400">Loss</p><p className="font-black">{loss.toFixed(3)}</p></div>
        <div className="rounded-lg p-1.5 bg-slate-50 dark:bg-slate-800/50"><p className="text-[10px] font-bold text-slate-400">Steps</p><p className="font-black">{steps}</p></div>
        <div className={`rounded-lg p-1.5 ${diverged ? 'bg-red-50 dark:bg-red-900/20' : 'bg-accent-50 dark:bg-accent-900/20'}`}><p className="text-[10px] font-bold text-slate-400">Status</p><p className={`font-black ${diverged ? 'text-red-600' : 'text-accent-600'}`}>{diverged ? 'Diverging!' : loss < 0.02 ? 'Converged' : 'Descending'}</p></div>
      </div>

      <label className="block text-xs font-bold text-slate-500 space-y-1">
        <span>Learning Rate ({(lr / 100).toFixed(2)}) {lr >= 100 && <span className="text-red-500">-- past the real stability limit (1.00) for this bowl, watch it diverge</span>}</span>
        <input type="range" min={1} max={150} value={lr} onChange={(e) => setLr(parseInt(e.target.value, 10))} className="w-full accent-primary-600" />
      </label>

      <div className="flex justify-center gap-2 flex-wrap">
        <button onClick={handleStep} disabled={diverged} className="px-4 py-2 rounded-lg border-2 border-primary-300 text-primary-700 dark:text-primary-300 font-bold text-sm flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"><StepForward className="w-4 h-4" /> Step Once</button>
        <button onClick={handleRun} disabled={diverged} className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold text-sm flex items-center gap-1.5 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"><Play className="w-4 h-4" /> Run</button>
        <button onClick={reset} className="px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-800 font-bold text-sm flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"><RotateCcw className="w-4 h-4" /> Reset</button>
      </div>
    </div>
  );
}

function BowlSurface() {
  const segments = 22;
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];
    for (let i = 0; i <= segments; i++) {
      for (let j = 0; j <= segments; j++) {
        const x = -RANGE + (2 * RANGE * i) / segments;
        const z = -RANGE + (2 * RANGE * j) / segments;
        const { x: wx, y: wy, z: wz } = toWorld(x, z);
        positions.push(wx, wy, wz);
        const t = Math.min(1, bowlLoss(x, z) / (2 * RANGE * RANGE));
        colors.push(0.18 + 0.7 * t, 0.55 - 0.3 * t, 0.9 - 0.5 * t);
      }
    }
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segments; j++) {
        const a = i * (segments + 1) + j;
        const b = a + 1;
        const c = a + (segments + 1);
        const d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }
    geo.setIndex(indices);
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);
  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial vertexColors transparent opacity={0.75} side={THREE.DoubleSide} roughness={0.5} />
    </mesh>
  );
}

function ClickGround({ onClickGround }: { onClickGround: (e: ThreeEvent<MouseEvent>) => void }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} onClick={onClickGround} visible={false}>
      <planeGeometry args={[2 * RANGE, 2 * RANGE]} />
      <meshBasicMaterial transparent opacity={0} side={THREE.DoubleSide} />
    </mesh>
  );
}

function TrailLine({ trail }: { trail: { x: number; z: number }[] }) {
  const points = useMemo(() => trail.map((p) => {
    const w = toWorld(p.x, p.z);
    return new THREE.Vector3(w.x, w.y + 0.03, w.z);
  }), [trail]);
  if (points.length < 2) return null;
  const positions = new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]));
  return (
    <line>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={points.length} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial color="#1e293b" linewidth={2} />
    </line>
  );
}

function Ball({ pos, diverged }: { pos: { x: number; z: number }; diverged: boolean }) {
  const w = toWorld(pos.x, pos.z);
  return (
    <mesh position={[w.x, w.y + 0.12, w.z]} castShadow>
      <sphereGeometry args={[0.14, 20, 20]} />
      <meshStandardMaterial color={diverged ? '#dc2626' : '#f59e0b'} emissive={diverged ? '#dc2626' : '#f59e0b'} emissiveIntensity={0.4} metalness={0.3} roughness={0.4} />
    </mesh>
  );
}
