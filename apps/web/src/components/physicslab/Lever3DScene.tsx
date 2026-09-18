'use client';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';
import { Hotspot3D, Ground } from './Hotspot3D';

// A real 3D balance beam for the Principle of Moments -- tilts by the exact
// leverAngle PhysicsStage already computed from leverTargetAngleDeg()
// (F1*d1 vs F2*d2). Positive angle means the right side's moment wins and
// dips down, matching the sign convention the original SVG scene used.
export default function Lever3DScene({
  leftForce, leftDistance, rightForce, rightDistance, leverAngle, hoveredId, onHover, onUnhover, onClick,
}: {
  leftForce: number;
  leftDistance: number;
  rightForce: number;
  rightDistance: number;
  leverAngle: number; // degrees
  hoveredId: string | null;
  onHover: (id: string) => void;
  onUnhover: () => void;
  onClick: (id: string) => void;
}) {
  const pivot = new THREE.Vector3(0, 0.9, 0);
  const beamHalfLen = 1.3;
  const rad = (leverAngle * Math.PI) / 180;
  const rightDir = new THREE.Vector3(Math.cos(rad), -Math.sin(rad), 0);
  const leftDir = rightDir.clone().negate();
  const maxDist = 4;
  const leftT = Math.min(1, leftDistance / maxDist);
  const rightT = Math.min(1, rightDistance / maxDist);
  const leftPos = pivot.clone().add(leftDir.clone().multiplyScalar(beamHalfLen * leftT));
  const rightPos = pivot.clone().add(rightDir.clone().multiplyScalar(beamHalfLen * rightT));
  const leftSize = 0.12 + leftForce * 0.006;
  const rightSize = 0.12 + rightForce * 0.006;

  return (
    <SafeR3FCanvas height={288} shadows camera={{ position: [2.8, 1.9, 3.2], fov: 40 }}>
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 5, 2]} intensity={1.1} castShadow />
      <Ground color="#e2e8f0" />

      <Hotspot3D id="lever-pivot" label="Fulcrum" position={[0, 0.4, 0]} hoveredId={hoveredId} onHover={onHover} onUnhover={onUnhover} onClick={onClick}>
        <mesh castShadow>
          <coneGeometry args={[0.35, 0.9, 4]} />
          <meshStandardMaterial color="#1e293b" metalness={0.3} roughness={0.5} />
        </mesh>
      </Hotspot3D>

      <Hotspot3D id="lever-beam" label="Lever Beam" position={[pivot.x, pivot.y, pivot.z]} hoveredId={hoveredId} onHover={onHover} onUnhover={onUnhover} onClick={onClick}>
        <mesh rotation={[0, 0, -rad]} castShadow>
          <boxGeometry args={[beamHalfLen * 2, 0.09, 0.16]} />
          <meshStandardMaterial color="#64748b" metalness={0.4} roughness={0.4} />
        </mesh>
      </Hotspot3D>

      <Hotspot3D id="lever-weight-left" label="Slotted Weight" position={[leftPos.x, leftPos.y + leftSize / 2, leftPos.z]} hoveredId={hoveredId} onHover={onHover} onUnhover={onUnhover} onClick={onClick}>
        <mesh castShadow>
          <boxGeometry args={[leftSize, leftSize, leftSize]} />
          <meshStandardMaterial color="#2F5FE0" metalness={0.3} roughness={0.4} />
        </mesh>
      </Hotspot3D>
      <Hotspot3D id="lever-weight-right" label="Slotted Weight" position={[rightPos.x, rightPos.y + rightSize / 2, rightPos.z]} hoveredId={hoveredId} onHover={onHover} onUnhover={onUnhover} onClick={onClick}>
        <mesh castShadow>
          <boxGeometry args={[rightSize, rightSize, rightSize]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.3} roughness={0.4} />
        </mesh>
      </Hotspot3D>

      <OrbitControls enablePan={false} minDistance={2.5} maxDistance={7} target={[0, 0.7, 0]} makeDefault />
    </SafeR3FCanvas>
  );
}
