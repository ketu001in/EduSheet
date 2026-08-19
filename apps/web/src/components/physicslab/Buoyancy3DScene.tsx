'use client';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';
import { Hotspot3D, Ground } from './Hotspot3D';

// A real 3D beaker of water with a test block that floats or sinks to the
// exact depth PhysicsStage already eased toward via buoyancySubmergedFraction()
// (Archimedes' Principle) -- same easing state, just a real transparent
// cylinder + a real cube instead of an SVG rect.
export default function Buoyancy3DScene({
  floats, buoyancyFrac, hoveredId, onHover, onUnhover, onClick,
}: {
  floats: boolean;
  buoyancyFrac: number;
  hoveredId: string | null;
  onHover: (id: string) => void;
  onUnhover: () => void;
  onClick: (id: string) => void;
}) {
  const beakerHeight = 1.4;
  const beakerRadius = 0.55;
  const waterTopY = beakerHeight * 0.75;
  const blockSize = 0.32;

  const centerY = floats
    ? waterTopY - blockSize * buoyancyFrac + blockSize / 2
    : waterTopY + blockSize / 2 - buoyancyFrac * waterTopY;

  return (
    <SafeR3FCanvas height={288} shadows camera={{ position: [2.4, 1.8, 3.0], fov: 40 }}>
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 5, 2]} intensity={1.1} castShadow />
      <Ground color="#e2e8f0" />

      <Hotspot3D id="beaker-water" label="Beaker of Water" position={[0, beakerHeight / 2, 0]} hoveredId={hoveredId} onHover={onHover} onUnhover={onUnhover} onClick={onClick}>
        <mesh position={[0, beakerHeight / 2, 0]}>
          <cylinderGeometry args={[beakerRadius, beakerRadius, beakerHeight, 28, 1, true]} />
          <meshPhysicalMaterial color="#cbd5e1" transparent opacity={0.22} roughness={0.1} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, waterTopY / 2, 0]}>
          <cylinderGeometry args={[beakerRadius - 0.03, beakerRadius - 0.03, waterTopY, 28]} />
          <meshStandardMaterial color="#7dd3fc" transparent opacity={0.55} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0.01, 0]}>
          <cylinderGeometry args={[beakerRadius, beakerRadius, 0.02, 28]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.6} />
        </mesh>
      </Hotspot3D>

      <Hotspot3D id="density-block" label="Test Block" position={[0, centerY, 0]} hoveredId={hoveredId} onHover={onHover} onUnhover={onUnhover} onClick={onClick}>
        <mesh castShadow>
          <boxGeometry args={[blockSize, blockSize, blockSize]} />
          <meshStandardMaterial color={floats ? '#2F9560' : '#E8474C'} metalness={0.3} roughness={0.4} />
        </mesh>
      </Hotspot3D>

      <OrbitControls enablePan={false} minDistance={2} maxDistance={6} target={[0, 0.6, 0]} makeDefault />
    </SafeR3FCanvas>
  );
}
