'use client';
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';

// A real 3D piston-and-cylinder for the Combined Gas Law -- the piston's
// real height genuinely reflects the real solved volume (before vs
// after), replacing two flat bars.
export default function GasPiston3DScene({ v1, v2, maxV }: { v1: number; v2: number; maxV: number }) {
  return (
    <SafeR3FCanvas height={230} shadows camera={{ position: [2.4, 1.6, 3.2], fov: 40 }}>
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 5, 3]} intensity={1.1} castShadow />
      <Table />
      <Cylinder x={-0.6} volume={v1} maxV={maxV} label="before" color="#38bdf8" />
      <Cylinder x={0.6} volume={v2} maxV={maxV} label="after" color="#f59e0b" />
    </SafeR3FCanvas>
  );
}

function Table() {
  return (
    <mesh position={[0, -0.02, 0]} receiveShadow>
      <boxGeometry args={[2.4, 0.06, 1.4]} />
      <meshStandardMaterial color="#e2e8f0" roughness={0.85} />
    </mesh>
  );
}

function Cylinder({ x, volume, maxV, color }: { x: number; volume: number; maxV: number; label: string; color: string }) {
  const pistonRef = useRef<THREE.Group>(null);
  const targetY = useRef(0.15 + Math.max(0.05, (volume / maxV)) * 0.9);
  const currentY = useRef(targetY.current);

  useFrame((state, delta) => {
    targetY.current = 0.15 + Math.max(0.05, volume / maxV) * 0.9;
    currentY.current += (targetY.current - currentY.current) * Math.min(1, delta * 6);
    if (pistonRef.current) pistonRef.current.position.y = currentY.current;
    if (Math.abs(targetY.current - currentY.current) > 0.001) state.invalidate();
  });

  return (
    <group position={[x, 0, 0]}>
      {/* Cylinder walls */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 1.2, 20, 1, true]} />
        <meshPhysicalMaterial color="#cbd5e1" transparent opacity={0.25} roughness={0.1} side={THREE.DoubleSide} />
      </mesh>
      {/* Gas fill below piston */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.06, 20]} />
        <meshStandardMaterial color={color} transparent opacity={0.5} />
      </mesh>
      <group ref={pistonRef}>
        <mesh castShadow>
          <cylinderGeometry args={[0.31, 0.31, 0.1, 20]} />
          <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.4, 10]} />
          <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.06, 20]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.6} />
      </mesh>
    </group>
  );
}
