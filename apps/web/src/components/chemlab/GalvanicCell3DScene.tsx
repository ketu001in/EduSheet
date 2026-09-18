'use client';
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';

// A real 3D galvanic cell -- two real electrodes in two real beakers,
// connected by a real wire arc, replacing a flat anode/cathode text
// readout. The glow pulse rate is tied to the real, already-verified
// EMF value (a real, if illustrative, way to show "more voltage, more
// activity"), not decoration.
export default function GalvanicCell3DScene({ emf }: { emf: number }) {
  return (
    <SafeR3FCanvas height={230} shadows camera={{ position: [0, 2.4, 4.4], fov: 40 }}>
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 5, 3]} intensity={1.1} castShadow />
      <Table />
      <Beaker x={-1.1} />
      <Beaker x={1.1} />
      <Wire emf={emf} />
    </SafeR3FCanvas>
  );
}

function Table() {
  return (
    <mesh position={[0, -0.02, 0]} receiveShadow>
      <boxGeometry args={[3.4, 0.06, 1.6]} />
      <meshStandardMaterial color="#e2e8f0" roughness={0.85} />
    </mesh>
  );
}

function Beaker({ x }: { x: number }) {
  return (
    <group position={[x, 0.02, 0]}>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.42, 0.38, 0.8, 24, 1, true]} />
        <meshPhysicalMaterial color="#dbeafe" transparent opacity={0.2} roughness={0.05} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.37, 0.35, 0.55, 24]} />
        <meshStandardMaterial color="#7dd3fc" transparent opacity={0.5} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.72, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.85, 10]} />
        <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.35} />
      </mesh>
    </group>
  );
}

function Wire({ emf }: { emf: number }) {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.1, 1.1, 0),
    new THREE.Vector3(-0.5, 1.6, 0),
    new THREE.Vector3(0, 1.7, 0),
    new THREE.Vector3(0.5, 1.6, 0),
    new THREE.Vector3(1.1, 1.1, 0),
  ]);
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    const pulseHz = Math.max(0.5, Math.min(4, emf * 3));
    mat.emissiveIntensity = 0.4 + Math.sin(state.clock.elapsedTime * pulseHz * 2) * 0.35;
    state.invalidate();
  });
  return (
    <mesh ref={ref}>
      <tubeGeometry args={[curve, 32, 0.025, 8, false]} />
      <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.5} metalness={0.4} roughness={0.4} />
    </mesh>
  );
}
