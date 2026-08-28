'use client';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';
import { Hotspot3D, Rod, Ground } from './Hotspot3D';

// A real 3D simple pendulum -- the bob's position each frame is the exact
// same theta PhysicsStage already computed (small-angle closed form or the
// RK4-integrated nonlinear step), just placed in a 3D scene instead of an
// SVG one. Motion stays in a single vertical plane (a real pendulum's
// motion IS planar) -- the "3D" comes from real depth, lighting, and a
// camera you can orbit, not from fabricating out-of-plane motion.
export default function Pendulum3DScene({
  length, mass, theta, hoveredId, onHover, onUnhover, onClick,
}: {
  length: number;
  mass: number;
  theta: number;
  hoveredId: string | null;
  onHover: (id: string) => void;
  onUnhover: () => void;
  onClick: (id: string) => void;
}) {
  const pivot = new THREE.Vector3(0, 1.85, 0);
  const dispLength = Math.min(1.7, Math.max(0.5, length));
  const bob = pivot.clone().add(new THREE.Vector3(dispLength * Math.sin(theta), -dispLength * Math.cos(theta), 0));
  const bobRadius = 0.09 + mass * 0.16;

  return (
    <SafeR3FCanvas height={288} shadows camera={{ position: [2.6, 1.8, 3.2], fov: 40 }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 5, 2]} intensity={1.1} castShadow />
      <Ground color="#e2e8f0" />

      <Hotspot3D id="pendulum-stand" label="Pendulum Stand" position={[0, 0, 0]} hoveredId={hoveredId} onHover={onHover} onUnhover={onUnhover} onClick={onClick}>
        <mesh position={[0, 0.925, 0]} castShadow>
          <boxGeometry args={[0.1, 1.85, 0.1]} />
          <meshStandardMaterial color="#475569" metalness={0.4} roughness={0.5} />
        </mesh>
        <mesh position={[0, 1.85, 0]} castShadow>
          <boxGeometry args={[1.1, 0.09, 0.09]} />
          <meshStandardMaterial color="#1e293b" metalness={0.4} roughness={0.4} />
        </mesh>
      </Hotspot3D>

      <Hotspot3D id="pendulum-string" label="Inextensible String" position={[0, 0, 0]} hoveredId={hoveredId} onHover={onHover} onUnhover={onUnhover} onClick={onClick}>
        <Rod a={pivot} b={bob} radius={0.012} color="#94a3b8" />
      </Hotspot3D>

      <Hotspot3D id="pendulum-bob" label="Pendulum Bob" position={[bob.x, bob.y, bob.z]} hoveredId={hoveredId} onHover={onHover} onUnhover={onUnhover} onClick={onClick}>
        <mesh castShadow>
          <sphereGeometry args={[bobRadius, 24, 24]} />
          <meshStandardMaterial color="#2F5FE0" metalness={0.3} roughness={0.35} />
        </mesh>
      </Hotspot3D>

      <OrbitControls enablePan={false} minDistance={2} maxDistance={7} target={[0, 1, 0]} makeDefault />
    </SafeR3FCanvas>
  );
}
