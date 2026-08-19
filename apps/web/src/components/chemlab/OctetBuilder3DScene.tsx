'use client';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';

// A real 3D Bohr-model atom -- a genuine nucleus with real electron
// shells as rings, each with real electron spheres actually orbiting in
// real time, replacing flat "e-" dot chips. The shell electron counts
// still come from the exact same verified bohrBuryShells data as before
// -- only the rendering became spatial.
export interface OctetBuilder3DProps {
  shellCounts: number[]; // e.g. [2, 8, 1] -- electrons per shell, innermost first
}

const SHELL_COLORS = ['#38bdf8', '#a78bfa', '#f472b6', '#fbbf24', '#34d399'];

export default function OctetBuilder3DScene({ shellCounts }: OctetBuilder3DProps) {
  return (
    <SafeR3FCanvas height={260} camera={{ position: [0, 3.6, 4.6], fov: 42 }}>
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 5, 4]} intensity={1.1} />
      <Nucleus />
      {shellCounts.map((count, shellIdx) => (
        <Shell key={shellIdx} radius={0.7 + shellIdx * 0.55} count={count} color={SHELL_COLORS[shellIdx % SHELL_COLORS.length]} speed={0.5 - shellIdx * 0.08} />
      ))}
    </SafeR3FCanvas>
  );
}

function Nucleus() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.005;
    state.invalidate();
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.32, 20, 20]} />
      <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.3} roughness={0.4} />
    </mesh>
  );
}

function Shell({ radius, count, color, speed }: { radius: number; count: number; color: string; speed: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const tilt = useMemo(() => Math.random() * 0.3 - 0.15, []);
  const electrons = useMemo(() => Array.from({ length: count }, (_, i) => (i / count) * Math.PI * 2), [count]);

  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * speed;
    state.invalidate();
  });

  return (
    <group rotation={[tilt, 0, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.008, radius + 0.008, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
      <group ref={groupRef}>
        {electrons.map((angle, i) => (
          <mesh key={i} position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}>
            <sphereGeometry args={[0.1, 12, 12]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
