'use client';
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';

// A real 3D electrolysis cell -- two real electrode rods in a real
// beaker of electrolyte, with the cathode's plated-metal coating
// genuinely thickening as the real, verified Faraday's-law mass
// (electrolysisMassDeposited) increases -- not a bar chart standing in
// for it.
export interface Electrolysis3DProps {
  mass: number;
  maxMass: number;
  depositColor: string;
}

export default function Electrolysis3DScene({ mass, maxMass, depositColor }: Electrolysis3DProps) {
  return (
    <SafeR3FCanvas height={260} shadows camera={{ position: [0, 1.6, 4], fov: 38 }}>
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 5, 3]} intensity={1.1} castShadow />
      <Table />
      <BeakerLiquid />
      <Electrode x={-0.22} />
      <Electrode x={0.22} plated mass={mass} maxMass={maxMass} depositColor={depositColor} />
      <CurrentGlow />
    </SafeR3FCanvas>
  );
}

function Table() {
  return (
    <mesh position={[0, -0.02, 0]} receiveShadow>
      <boxGeometry args={[3.4, 0.06, 2]} />
      <meshStandardMaterial color="#e2e8f0" roughness={0.85} />
    </mesh>
  );
}

function BeakerLiquid() {
  return (
    <group>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.55, 0.5, 1, 32, 1, true]} />
        <meshPhysicalMaterial color="#dbeafe" transparent opacity={0.18} roughness={0.05} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.5, 0.47, 0.85, 32]} />
        <meshStandardMaterial color="#7dd3fc" transparent opacity={0.5} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Electrode({ x, plated, mass = 0, maxMass = 1, depositColor = '#c2703d' }: { x: number; plated?: boolean; mass?: number; maxMass?: number; depositColor?: string }) {
  const platedRadius = 0.03 + Math.min(1, mass / maxMass) * 0.06;
  return (
    <group position={[x, 0, 0]}>
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 10]} />
        <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.75, 10]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.25} />
      </mesh>
      {plated && mass > 0 && (
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[platedRadius, platedRadius, 0.78, 12]} />
          <meshStandardMaterial color={depositColor} metalness={0.6} roughness={0.35} />
        </mesh>
      )}
    </group>
  );
}

function CurrentGlow() {
  const ref = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.intensity = 0.4 + Math.sin(state.clock.elapsedTime * 6) * 0.15;
    state.invalidate();
  });
  return <pointLight ref={ref} position={[0, 0.9, 0]} color="#38bdf8" intensity={0.4} distance={2} />;
}
