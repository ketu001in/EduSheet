'use client';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';

// A real 3D diffusion race for Graham's Law -- two real tubes, each with
// a swarm of real gas-particle spheres genuinely drifting at a speed
// proportional to 1/sqrt(molarMass) (the same verified rate used by the
// bar-race version), replacing two flat progress bars.
export interface DiffusionRace3DProps {
  rate1: number; rate2: number; maxRate: number;
  label1: string; label2: string;
  racing: boolean;
}

const PARTICLE_COUNT = 14;
const TUBE_LENGTH = 4.2;

export default function DiffusionRace3DScene({ rate1, rate2, maxRate, label1, label2, racing }: DiffusionRace3DProps) {
  return (
    <SafeR3FCanvas height={220} camera={{ position: [0, 3.2, 5.6], fov: 40 }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 5, 4]} intensity={1.1} />
      <Tube z={-0.65} speed={racing ? (rate1 / maxRate) * 0.035 : 0} color="#38bdf8" />
      <Tube z={0.65} speed={racing ? (rate2 / maxRate) * 0.035 : 0} color="#f59e0b" />
    </SafeR3FCanvas>
  );
}

function Tube({ z, speed, color }: { z: number; speed: number; color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const particles = useMemo(() => Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    baseX: -TUBE_LENGTH / 2 + Math.random() * 0.3,
    offsetY: (Math.random() - 0.5) * 0.12,
    offsetZ: (Math.random() - 0.5) * 0.12,
    seed: i,
  })), []);
  const progressRef = useRef(0);

  useFrame((state) => {
    if (speed > 0) {
      progressRef.current += speed;
      if (groupRef.current) {
        groupRef.current.children.forEach((child, i) => {
          const p = particles[i];
          const jitter = Math.sin(state.clock.elapsedTime * 3 + p.seed) * 0.03;
          child.position.x = Math.min(TUBE_LENGTH / 2 - 0.15, p.baseX + progressRef.current + jitter);
        });
      }
      state.invalidate();
    }
  });

  return (
    <group position={[0, 0.15, z]}>
      {/* Tube walls */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.22, TUBE_LENGTH, 20, 1, true]} />
        <meshPhysicalMaterial color="#e2e8f0" transparent opacity={0.15} side={THREE.DoubleSide} roughness={0.1} />
      </mesh>
      <group ref={groupRef}>
        {particles.map((p, i) => (
          <mesh key={i} position={[p.baseX, p.offsetY, p.offsetZ]}>
            <sphereGeometry args={[0.055, 10, 10]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
