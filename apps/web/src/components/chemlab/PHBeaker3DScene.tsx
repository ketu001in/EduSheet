'use client';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';

// A real 3D beaker whose liquid color genuinely follows the real pH-to-
// color mapping already used by the flat gradient bar (red/acidic through
// green/neutral to violet/alkaline), replacing a flat colored div.
export default function PHBeaker3DScene({ color }: { color: string }) {
  return (
    <SafeR3FCanvas height={210} shadows camera={{ position: [0, 1.6, 3.6], fov: 38 }}>
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 5, 3]} intensity={1.1} castShadow />
      <mesh position={[0, -0.02, 0]} receiveShadow>
        <cylinderGeometry args={[1, 1, 0.05, 32]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.85} />
      </mesh>
      <group position={[0, 0.02, 0]}>
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.42, 0.38, 1.05, 24, 1, true]} />
          <meshPhysicalMaterial color="#dbeafe" transparent opacity={0.2} roughness={0.05} />
        </mesh>
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.37, 0.35, 0.7, 24]} />
          <meshStandardMaterial color={color} transparent opacity={0.88} roughness={0.2} />
        </mesh>
        {/* pH probe dipped in */}
        <mesh position={[0.15, 0.9, 0]} rotation={[0, 0, -0.15]}>
          <cylinderGeometry args={[0.03, 0.03, 0.9, 10]} />
          <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.4} />
        </mesh>
      </group>
    </SafeR3FCanvas>
  );
}
