'use client';
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';
import { ReagentState } from '@/lib/reagentVisuals';

// A real 3D bottle/sample scene for a Reagents Studio detail view --
// mounted only inside the detail modal (one canvas at a time), same
// discipline as Equipment Studio's Model3DViewer, never one per grid
// card. The shape genuinely changes with the reagent's real state: a
// liquid gets a real glass bottle with a real fill color, a solid gets a
// pile of real crystal/grain chunks, a metal gets a real metallic strip,
// and a flame sample gets a real flickering flame in its real color.
export default function ReagentBottle3DScene({ color, state }: { color: string; state: ReagentState }) {
  return (
    <SafeR3FCanvas height={220} shadows camera={{ position: [0, 1.6, 3.6], fov: 38 }}>
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 5, 3]} intensity={1.1} castShadow />
      <Table />
      {state === 'liquid' && <Bottle color={color} />}
      {state === 'solid' && <SolidPile color={color} />}
      {state === 'crystal' && <CrystalCluster color={color} />}
      {state === 'metal' && <MetalStrip color={color} />}
      {state === 'flame' && <FlameSample color={color} />}
      <OrbitControls enablePan={false} enableZoom minDistance={2} maxDistance={7} makeDefault />
    </SafeR3FCanvas>
  );
}

function Table() {
  return (
    <mesh position={[0, -0.02, 0]} receiveShadow>
      <cylinderGeometry args={[1.4, 1.4, 0.05, 32]} />
      <meshStandardMaterial color="#e2e8f0" roughness={0.85} />
    </mesh>
  );
}

function Bottle({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.42, 0.38, 1.15, 24, 1, true]} />
        <meshPhysicalMaterial color="#dbeafe" transparent opacity={0.2} roughness={0.05} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.12, 0.18, 0.28, 16]} />
        <meshPhysicalMaterial color="#dbeafe" transparent opacity={0.2} roughness={0.05} />
      </mesh>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.37, 0.35, 0.75, 24]} />
        <meshStandardMaterial color={color} transparent opacity={0.85} roughness={0.2} />
      </mesh>
    </group>
  );
}

function SolidPile({ color }: { color: string }) {
  const chunks = Array.from({ length: 9 }, (_, i) => ({
    x: (Math.random() - 0.5) * 0.7,
    z: (Math.random() - 0.5) * 0.7,
    y: 0.06 + Math.random() * 0.06,
    r: 0.07 + Math.random() * 0.06,
  }));
  return (
    <group>
      {chunks.map((c, i) => (
        <mesh key={i} position={[c.x, c.y, c.z]} castShadow>
          <dodecahedronGeometry args={[c.r, 0]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function CrystalCluster({ color }: { color: string }) {
  const crystals = Array.from({ length: 7 }, (_, i) => ({
    x: (Math.random() - 0.5) * 0.6,
    z: (Math.random() - 0.5) * 0.6,
    rot: Math.random() * Math.PI,
    h: 0.25 + Math.random() * 0.25,
  }));
  return (
    <group>
      {crystals.map((c, i) => (
        <mesh key={i} position={[c.x, c.h / 2, c.z]} rotation={[0, c.rot, 0]} castShadow>
          <octahedronGeometry args={[0.14, 0]} />
          <meshPhysicalMaterial color={color} transparent opacity={0.75} roughness={0.05} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

function MetalStrip({ color }: { color: string }) {
  return (
    <mesh position={[0, 0.4, 0]} rotation={[0, 0, 0.1]} castShadow>
      <boxGeometry args={[0.12, 0.8, 0.04]} />
      <meshStandardMaterial color={color} metalness={0.75} roughness={0.3} />
    </mesh>
  );
}

function FlameSample({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const s = 1 + Math.sin(t * 11) * 0.1;
    ref.current.scale.set(s, 1 + Math.sin(t * 8) * 0.15, s);
    state.invalidate();
  });
  return (
    <group>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 10]} />
        <meshStandardMaterial color="#78716c" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh ref={ref} position={[0, 0.45, 0]}>
        <coneGeometry args={[0.14, 0.4, 14]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} transparent opacity={0.85} />
      </mesh>
      <pointLight position={[0, 0.5, 0]} color={color} intensity={0.6} distance={1.5} />
    </group>
  );
}
