'use client';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';
import { Hotspot3D, Ground } from './Hotspot3D';

// A real 3D helical spring -- built from a real tube following a real
// helix curve (THREE.CatmullRomCurve3 through points sampled from the
// same parametric spring-coil shape the old SVG path traced), so the
// number of visible coils and the stretch/compression are both driven by
// the actual displacement PhysicsStage already computed from Hooke's Law.
export default function Spring3DScene({
  mass, displacement, hoveredId, onHover, onUnhover, onClick,
}: {
  mass: number;
  displacement: number; // metres, +down / -up from natural length, from springState()
  hoveredId: string | null;
  onHover: (id: string) => void;
  onUnhover: () => void;
  onClick: (id: string) => void;
}) {
  const topY = 1.85;
  const naturalLen = 0.9;
  const bottomY = topY - naturalLen - displacement * 1.4;
  const coils = 8;
  const coilRadius = 0.14;
  const blockSize = 0.16 + mass * 0.16;

  const points: THREE.Vector3[] = [];
  const segLen = (topY - bottomY) / (coils * 8);
  for (let i = 0; i <= coils * 8; i++) {
    const y = topY - i * segLen;
    const angle = (i / 8) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * coilRadius, y, Math.sin(angle) * coilRadius));
  }
  const curve = new THREE.CatmullRomCurve3(points);

  return (
    <SafeR3FCanvas height={288} shadows camera={{ position: [2.6, 1.6, 3.0], fov: 40 }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 5, 2]} intensity={1.1} castShadow />
      <Ground color="#e2e8f0" />

      <Hotspot3D id="pendulum-stand" label="Support Stand" position={[0, 0, 0]} hoveredId={hoveredId} onHover={onHover} onUnhover={onUnhover} onClick={onClick}>
        <mesh position={[0, topY, 0]} castShadow>
          <boxGeometry args={[1.1, 0.09, 0.3]} />
          <meshStandardMaterial color="#1e293b" metalness={0.4} roughness={0.4} />
        </mesh>
        <mesh position={[0.45, topY / 2, 0]} castShadow>
          <boxGeometry args={[0.09, topY, 0.09]} />
          <meshStandardMaterial color="#475569" metalness={0.4} roughness={0.5} />
        </mesh>
      </Hotspot3D>

      <Hotspot3D id="spring-coil" label="Helical Spring" position={[0, (topY + bottomY) / 2, 0]} hoveredId={hoveredId} onHover={onHover} onUnhover={onUnhover} onClick={onClick}>
        <mesh>
          <tubeGeometry args={[curve, 200, 0.022, 8, false]} />
          <meshStandardMaterial color="#64748b" metalness={0.5} roughness={0.4} />
        </mesh>
      </Hotspot3D>

      <Hotspot3D id="mass-hanger" label="Hanging Mass" position={[0, bottomY - blockSize / 2, 0]} hoveredId={hoveredId} onHover={onHover} onUnhover={onUnhover} onClick={onClick}>
        <mesh castShadow>
          <boxGeometry args={[blockSize, blockSize, blockSize]} />
          <meshStandardMaterial color="#2F5FE0" metalness={0.3} roughness={0.35} />
        </mesh>
      </Hotspot3D>

      <OrbitControls enablePan={false} minDistance={2} maxDistance={6} target={[0, 1, 0]} makeDefault />
    </SafeR3FCanvas>
  );
}
