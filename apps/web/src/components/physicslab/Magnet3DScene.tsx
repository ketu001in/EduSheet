'use client';
import { OrbitControls, Text } from '@react-three/drei';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';
import { Hotspot3D, Ground } from './Hotspot3D';

// Two real 3D bar magnets -- the gap between them is the exact magnetGap
// PhysicsStage already eased toward via magnetTargetGap() (like poles
// repel and settle far apart; unlike poles attract and settle close).
export default function Magnet3DScene({
  attract, magnetGap, hoveredId, onHover, onUnhover, onClick,
}: {
  attract: boolean;
  magnetGap: number;
  hoveredId: string | null;
  onHover: (id: string) => void;
  onUnhover: () => void;
  onClick: (id: string) => void;
}) {
  const magnetW = 0.75;
  const magnetH = 0.35;
  const magnetD = 0.32;
  const y = magnetH / 2 + 0.02;
  const fixedX = -magnetW / 2 - 0.1;
  const movableX = fixedX + magnetW + magnetGap * 0.9 + 0.1;

  return (
    <SafeR3FCanvas height={288} shadows camera={{ position: [1.4, 1.6, 3.4], fov: 40 }}>
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 5, 2]} intensity={1.1} castShadow />
      <Ground color="#e2e8f0" />

      <Hotspot3D id="bar-magnet-fixed" label="Bar Magnet" position={[fixedX, y, 0]} hoveredId={hoveredId} onHover={onHover} onUnhover={onUnhover} onClick={onClick}>
        <BarMagnet width={magnetW} height={magnetH} depth={magnetD} sOnLeft />
      </Hotspot3D>

      <Hotspot3D id="bar-magnet-movable" label="Bar Magnet" position={[movableX, y, 0]} hoveredId={hoveredId} onHover={onHover} onUnhover={onUnhover} onClick={onClick}>
        <BarMagnet width={magnetW} height={magnetH} depth={magnetD} sOnLeft={!attract} />
      </Hotspot3D>

      <OrbitControls enablePan={false} minDistance={1.8} maxDistance={6} target={[0, 0.3, 0]} makeDefault />
    </SafeR3FCanvas>
  );
}

function BarMagnet({ width, height, depth, sOnLeft }: { width: number; height: number; depth: number; sOnLeft: boolean }) {
  const half = width / 2;
  return (
    <group>
      <mesh position={[-width / 4, 0, 0]} castShadow>
        <boxGeometry args={[half, height, depth]} />
        <meshStandardMaterial color={sOnLeft ? '#3b82f6' : '#ef4444'} metalness={0.35} roughness={0.4} />
      </mesh>
      <mesh position={[width / 4, 0, 0]} castShadow>
        <boxGeometry args={[half, height, depth]} />
        <meshStandardMaterial color={sOnLeft ? '#ef4444' : '#3b82f6'} metalness={0.35} roughness={0.4} />
      </mesh>
      <Text position={[-width / 4, 0, depth / 2 + 0.01]} fontSize={0.16} color="white" anchorX="center" anchorY="middle">
        {sOnLeft ? 'S' : 'N'}
      </Text>
      <Text position={[width / 4, 0, depth / 2 + 0.01]} fontSize={0.16} color="white" anchorX="center" anchorY="middle">
        {sOnLeft ? 'N' : 'S'}
      </Text>
    </group>
  );
}
