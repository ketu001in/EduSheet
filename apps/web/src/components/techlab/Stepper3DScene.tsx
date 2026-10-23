'use client';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { RefreshCw } from 'lucide-react';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';
import { stepperDegreesPerStep } from '@/lib/roboticsEngineeringEngine';

// A real rotating stepper shaft -- replacing the flat 2D dial with an
// actual cylindrical motor body and a shaft that visibly, smoothly turns
// to the achieved angle (never past it -- a stepper genuinely can't
// overshoot to a non-step angle, which is honestly represented here).
export default function Stepper3DScene() {
  const [target, setTarget] = useState(137);
  const [mode, setMode] = useState<'full' | 'half'>('full');
  const stepsPerRev = mode === 'full' ? 200 : 400;
  const degPerStep = stepperDegreesPerStep(stepsPerRev);
  const [steps, setSteps] = useState(0);

  const achieved = (steps * degPerStep) % 360;
  const error = Math.min(Math.abs(achieved - target), 360 - Math.abs(achieved - target));
  const onTarget = error < 2;

  const newTarget = () => { setTarget(Math.floor(Math.random() * 350) + 5); setSteps(0); };

  return (
    <div className="space-y-2">
      <p className="text-center text-xs text-slate-500">Target: {target}&deg;. Each step moves exactly {degPerStep.toFixed(2)}&deg; ({mode === 'full' ? '200' : '400'} steps/rev) -- pick a step count that lands as close as possible.</p>
      <SafeR3FCanvas height={260} shadows camera={{ position: [0, 2.2, 3.4], fov: 42 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 5, 4]} intensity={1.2} castShadow />
        <mesh position={[0, -0.55, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[2, 40]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
        </mesh>
        <MotorBody />
        <ShaftPointer achievedDeg={achieved} onTarget={onTarget} />
        <TargetMarker targetDeg={target} />
        <OrbitControls enablePan={false} enableZoom makeDefault target={[0, 0.2, 0]} />
      </SafeR3FCanvas>
      <div className="flex justify-center gap-1.5">
        <button onClick={() => setMode('full')} className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${mode === 'full' ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-200 dark:border-slate-800'}`}>Full step (1.8&deg;)</button>
        <button onClick={() => setMode('half')} className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${mode === 'half' ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-200 dark:border-slate-800'}`}>Half step (0.9&deg;)</button>
      </div>
      <label className="block text-xs font-bold text-slate-500 space-y-1 max-w-sm mx-auto">
        <span>Step count ({steps} steps = {(steps * degPerStep).toFixed(1)}&deg;)</span>
        <input type="range" min={0} max={stepsPerRev} step={1} value={steps} onChange={(e) => setSteps(parseInt(e.target.value, 10))} className="w-full accent-primary-600" />
      </label>
      <div className="flex justify-center">
        <button onClick={newTarget} className="px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-800 font-bold text-sm flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"><RefreshCw className="w-4 h-4" /> New Target</button>
      </div>
      <p className={`text-center text-sm font-bold ${onTarget ? 'text-accent-600' : 'text-slate-500'}`}>
        Achieved: {achieved.toFixed(1)}&deg; &middot; Off by {error.toFixed(1)}&deg;{onTarget ? ' -- on target!' : ''}
      </p>
    </div>
  );
}

function MotorBody() {
  return (
    <group>
      <mesh position={[0, -0.15, 0]} castShadow>
        <boxGeometry args={[0.9, 0.7, 0.9]} />
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.4} />
      </mesh>
      {[[-0.35, -0.35], [0.35, -0.35], [-0.35, 0.35], [0.35, 0.35]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.21, z]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.06, 12]} />
          <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function ShaftPointer({ achievedDeg, onTarget }: { achievedDeg: number; onTarget: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const displayed = useRef(0);
  useFrame((state, delta) => {
    // Ease the visible pointer toward the achieved angle rather than
    // snapping -- a real shaft has real rotational inertia.
    const targetRad = (achievedDeg * Math.PI) / 180;
    let current = displayed.current;
    let diff = targetRad - current;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    if (Math.abs(diff) > 0.001) {
      current += diff * Math.min(1, delta * 6);
      displayed.current = current;
      if (ref.current) ref.current.rotation.y = current;
      state.invalidate();
    }
  });
  return (
    <group ref={ref} position={[0, 0.25, 0]}>
      <mesh position={[0, 0, 0.35]} castShadow>
        <boxGeometry args={[0.08, 0.08, 0.7]} />
        <meshStandardMaterial color={onTarget ? '#237A4C' : '#2F5FE0'} emissive={onTarget ? '#237A4C' : '#000000'} emissiveIntensity={onTarget ? 0.4 : 0} metalness={0.4} roughness={0.4} />
      </mesh>
    </group>
  );
}

function TargetMarker({ targetDeg }: { targetDeg: number }) {
  const rad = (targetDeg * Math.PI) / 180;
  return (
    <mesh position={[Math.sin(rad) * 0.75, 0.25, Math.cos(rad) * 0.75]}>
      <sphereGeometry args={[0.06, 12, 12]} />
      <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.5} />
    </mesh>
  );
}
