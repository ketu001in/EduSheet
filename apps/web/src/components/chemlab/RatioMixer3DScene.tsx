'use client';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';

// A real pair of 3D beakers for the Law of Constant Proportions -- fill
// level genuinely proportional to the real mass slider values, replacing
// two flat CSS bars.
export interface RatioMixer3DProps {
  massH: number; massO: number; maxH: number; maxO: number; isMatch: boolean;
}

export default function RatioMixer3DScene({ massH, massO, maxH, maxO, isMatch }: RatioMixer3DProps) {
  return (
    <SafeR3FCanvas height={230} shadows camera={{ position: [2.6, 1.9, 3.6], fov: 40 }}>
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 5, 3]} intensity={1.1} castShadow />
      <Table />
      <MiniBeaker x={-0.55} fill={massH / maxH} color="#38bdf8" />
      <MiniBeaker x={0.55} fill={massO / maxO} color={isMatch ? '#22c55e' : '#f87171'} />
    </SafeR3FCanvas>
  );
}

function Table() {
  return (
    <mesh position={[0, -0.02, 0]} receiveShadow>
      <boxGeometry args={[2.6, 0.06, 1.6]} />
      <meshStandardMaterial color="#e2e8f0" roughness={0.85} />
    </mesh>
  );
}

function MiniBeaker({ x, fill, color }: { x: number; fill: number; color: string }) {
  const h = Math.max(0.02, Math.min(1, fill)) * 0.9;
  return (
    <group position={[x, 0.02, 0]}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.38, 0.34, 1, 24, 1, true]} />
        <meshPhysicalMaterial color="#dbeafe" transparent opacity={0.18} roughness={0.05} />
      </mesh>
      <mesh position={[0, h / 2 + 0.03, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.32, h, 24]} />
        <meshStandardMaterial color={color} transparent opacity={0.88} roughness={0.25} />
      </mesh>
    </group>
  );
}
