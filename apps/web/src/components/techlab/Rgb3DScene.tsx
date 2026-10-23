'use client';
import { useMemo, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';
import { rgbDutyCyclesToCss, PWM_MAX_8BIT } from '@/lib/roboticsEngineeringEngine';

// A real 3D RGB LED bulb whose actual glow color mixes live from three
// real 0-255 PWM channels, replacing the flat color swatch.
export default function Rgb3DScene() {
  const [r, setR] = useState(255);
  const [g, setG] = useState(180);
  const [b, setB] = useState(0);
  const cssColor = rgbDutyCyclesToCss(r, g, b);
  const threeColor = useMemo(() => new THREE.Color(r / PWM_MAX_8BIT, g / PWM_MAX_8BIT, b / PWM_MAX_8BIT), [r, g, b]);

  return (
    <div className="space-y-2">
      <p className="text-center text-xs text-slate-500">Each slider is a real 0-255 PWM duty cycle -- the exact range a microcontroller uses to drive an RGB LED&apos;s brightness per channel.</p>
      <SafeR3FCanvas height={230} shadows camera={{ position: [1.6, 1.2, 1.8], fov: 40 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 4, 3]} intensity={0.8} castShadow />
        <mesh position={[0, -0.35, 0]} receiveShadow>
          <boxGeometry args={[1.4, 0.15, 1.4]} />
          <meshStandardMaterial color="#334155" metalness={0.4} roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.13, 0.25, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.15, 0]} castShadow>
          <sphereGeometry args={[0.24, 24, 24]} />
          <meshStandardMaterial color={threeColor} emissive={threeColor} emissiveIntensity={1.4} transparent opacity={0.92} />
        </mesh>
        <pointLight position={[0, 0.15, 0]} color={threeColor} intensity={1.8} distance={2} />
        <OrbitControls enablePan={false} enableZoom makeDefault target={[0, 0, 0]} />
      </SafeR3FCanvas>
      <div className="space-y-2 max-w-sm mx-auto">
        <label className="block text-xs font-bold text-red-500 space-y-1">
          <span>Red ({r})</span>
          <input type="range" min={0} max={255} value={r} onChange={(e) => setR(parseInt(e.target.value, 10))} className="w-full accent-red-500" />
        </label>
        <label className="block text-xs font-bold text-accent-600 space-y-1">
          <span>Green ({g})</span>
          <input type="range" min={0} max={255} value={g} onChange={(e) => setG(parseInt(e.target.value, 10))} className="w-full accent-accent-500" />
        </label>
        <label className="block text-xs font-bold text-primary-600 space-y-1">
          <span>Blue ({b})</span>
          <input type="range" min={0} max={255} value={b} onChange={(e) => setB(parseInt(e.target.value, 10))} className="w-full accent-primary-600" />
        </label>
      </div>
      <p className="text-center text-sm font-mono font-bold text-slate-600 dark:text-slate-300">{cssColor}</p>
    </div>
  );
}
