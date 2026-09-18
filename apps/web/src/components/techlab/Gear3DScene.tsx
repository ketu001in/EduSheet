'use client';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Sparkles } from 'lucide-react';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';
import { gearOutputTorque, gearOutputRPM } from '@/lib/roboticsEngineeringEngine';

// Real, visibly meshing 3D gears -- the original version had NO visual at
// all, just stat cards. A bigger output gear is now a genuinely bigger
// gear that visibly spins slower (real inverse relationship between size
// and speed, driven by the same verified gearOutputRPM/Torque formulas),
// continuously rotating while the experiment is open.
const GEAR_OPTIONS = [10, 15, 20, 25, 30, 40];
const TOOTH_PITCH = 0.09; // world units per tooth -- sets each gear's radius from its teeth count

function gearRadius(teeth: number) { return teeth * TOOTH_PITCH; }

export default function Gear3DScene({ config }: { config: any }) {
  const requiredTorque = config.requiredTorqueNcm ?? 45;
  const inputTorque = config.inputTorqueNcm ?? 12;
  const inputRPM = config.inputRPM ?? 300;
  const [inputTeeth, setInputTeeth] = useState(10);
  const [outputTeeth, setOutputTeeth] = useState(10);

  const achievedTorque = gearOutputTorque(inputTorque, inputTeeth, outputTeeth);
  const achievedRPM = gearOutputRPM(inputRPM, inputTeeth, outputTeeth);
  const solved = achievedTorque >= requiredTorque;

  return (
    <div className="space-y-2">
      <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3 text-center">
        <p className="text-xs text-slate-500">Your motor delivers <span className="font-bold">{inputTorque} N&middot;cm</span> at <span className="font-bold">{inputRPM} RPM</span> -- this task needs at least <span className="font-bold text-primary-600">{requiredTorque} N&middot;cm</span>. Pick gears to get there.</p>
      </div>
      <SafeR3FCanvas height={280} shadows camera={{ position: [0, 3.4, 3.2], fov: 42 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 5, 4]} intensity={1.2} castShadow />
        <mesh position={[0, -0.06, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[2.2, 48]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
        </mesh>
        <GearMesh teeth={inputTeeth} centerX={0} spinSign={1} inputRPM={inputRPM} color="#2F5FE0" />
        <GearMesh teeth={outputTeeth} centerX={gearRadius(inputTeeth) + gearRadius(outputTeeth)} spinSign={-1} inputRPM={achievedRPM} color="#237A4C" />
        <OrbitControls enablePan={false} enableZoom makeDefault target={[(gearRadius(inputTeeth) + gearRadius(outputTeeth)) / 2, 0.2, 0]} />
      </SafeR3FCanvas>
      <p className="text-center text-[10px] text-slate-400">Blue = input gear &middot; Green = output gear &middot; drag to rotate the view</p>
      <div className="grid grid-cols-2 gap-4">
        <label className="block text-xs font-bold text-slate-500 space-y-1">
          <span>Input gear teeth ({inputTeeth})</span>
          <input type="range" min={0} max={GEAR_OPTIONS.length - 1} step={1} value={GEAR_OPTIONS.indexOf(inputTeeth)} onChange={(e) => setInputTeeth(GEAR_OPTIONS[parseInt(e.target.value, 10)])} className="w-full accent-primary-600" />
        </label>
        <label className="block text-xs font-bold text-slate-500 space-y-1">
          <span>Output gear teeth ({outputTeeth})</span>
          <input type="range" min={0} max={GEAR_OPTIONS.length - 1} step={1} value={GEAR_OPTIONS.indexOf(outputTeeth)} onChange={(e) => setOutputTeeth(GEAR_OPTIONS[parseInt(e.target.value, 10)])} className="w-full accent-primary-600" />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className={`rounded-xl p-3 ${solved ? 'bg-accent-50 dark:bg-accent-900/20' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
          <p className="text-[9px] font-bold text-slate-400 uppercase">Achieved Torque</p>
          <p className={`text-base font-mono font-bold ${solved ? 'text-accent-600' : 'text-slate-700 dark:text-slate-200'}`}>{achievedTorque.toFixed(1)} N&middot;cm</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3">
          <p className="text-[9px] font-bold text-slate-400 uppercase">Achieved Speed</p>
          <p className="text-base font-mono font-bold text-slate-700 dark:text-slate-200">{achievedRPM.toFixed(0)} RPM</p>
        </div>
      </div>
      <p className={`text-center text-sm font-bold ${solved ? 'text-accent-600' : 'text-slate-500'}`}>
        {solved ? <><Sparkles className="w-4 h-4 inline mr-1 -mt-0.5" />Torque target met -- but notice the speed cost: {inputRPM} RPM down to {achievedRPM.toFixed(0)} RPM.</> : 'Not enough torque yet -- try a bigger output gear relative to the input.'}
      </p>
    </div>
  );
}

function GearMesh({ teeth, spinSign, inputRPM, color, centerX }: { teeth: number; spinSign: 1 | -1; inputRPM: number; color: string; centerX: number }) {
  const radius = gearRadius(teeth);
  const groupRef = useRef<THREE.Group>(null);
  // Real angular speed proportional to RPM -- a bigger gear (more teeth,
  // driven at a proportionally lower RPM by the mesh) visibly spins
  // slower, exactly the real relationship gearOutputRPM describes.
  const radiansPerSecond = (inputRPM / 60) * 2 * Math.PI * 0.15; // slowed for visibility
  useFrame((state, delta) => {
    if (groupRef.current) groupRef.current.rotation.z += spinSign * radiansPerSecond * delta;
    state.invalidate();
  });

  const teethMeshes = useMemo(() => Array.from({ length: teeth }, (_, i) => {
    const angle = (i / teeth) * Math.PI * 2;
    return { x: Math.cos(angle) * radius, z: Math.sin(angle) * radius, angle };
  }), [teeth, radius]);

  return (
    <group position={[centerX, 0.12, 0]}>
      <group ref={groupRef}>
        <mesh castShadow>
          <cylinderGeometry args={[radius * 0.82, radius * 0.82, 0.18, 32]} />
          <meshStandardMaterial color={color} metalness={0.4} roughness={0.4} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[radius * 0.15, radius * 0.15, 0.2, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.3} />
        </mesh>
        {teethMeshes.map((t, i) => (
          <mesh key={i} position={[t.x, 0, t.z]} rotation={[0, -t.angle, 0]} castShadow>
            <boxGeometry args={[0.12, 0.18, radius * 0.22]} />
            <meshStandardMaterial color={color} metalness={0.4} roughness={0.4} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
