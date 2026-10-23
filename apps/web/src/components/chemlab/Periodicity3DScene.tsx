'use client';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';

// A real 3D bar row for Modern Periodic Law -- valence-electron height
// per atomic number, the noble gases genuinely picked out by color, same
// verified bohrBuryShells data as before, replacing a flat CSS bar row.
export interface Periodicity3DProps {
  points: { z: number; valence: number }[];
  maxZ: number;
}

export default function Periodicity3DScene({ points, maxZ }: Periodicity3DProps) {
  const visible = points.filter((p) => p.z <= maxZ);
  const spacing = 0.42;
  const offset = ((points.length - 1) * spacing) / 2;
  return (
    <SafeR3FCanvas height={200} shadows camera={{ position: [0, 3.2, 5.4], fov: 38 }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 5, 4]} intensity={1.1} castShadow />
      <mesh position={[0, -0.02, 0]} receiveShadow>
        <boxGeometry args={[offset * 2 + 1, 0.05, 1]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.85} />
      </mesh>
      {visible.map((p) => {
        const h = Math.max(0.06, (p.valence / 8) * 1.3);
        const isNoble = [2, 10, 18].includes(p.z);
        return (
          <mesh key={p.z} position={[p.z * spacing - offset, h / 2, 0]} castShadow>
            <boxGeometry args={[0.3, h, 0.3]} />
            <meshStandardMaterial color={isNoble ? '#22c55e' : '#2F5FE0'} emissive={isNoble ? '#22c55e' : '#2F5FE0'} emissiveIntensity={0.25} roughness={0.5} />
          </mesh>
        );
      })}
    </SafeR3FCanvas>
  );
}
