'use client';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';
import { Hotspot3D, Rod, Ground } from './Hotspot3D';

// A real 3D plane-mirror reflection -- the reflected ray's angle is the
// exact reflectedAngleDeg PhysicsStage already computed from
// reflectionAngleDeg() (angle of incidence = angle of reflection, the Law
// of Reflection). Rays stay in one vertical plane hitting a horizontal
// mirror, same honest-planar-motion note as the pendulum/projectile scenes.
export default function Mirror3DScene({
  incidenceAngleDeg, reflectedAngleDeg, travelPhase, hoveredId, onHover, onUnhover, onClick,
}: {
  incidenceAngleDeg: number;
  reflectedAngleDeg: number;
  travelPhase: number; // 0..1, animates a traveling dot along each ray
  hoveredId: string | null;
  onHover: (id: string) => void;
  onUnhover: () => void;
  onClick: (id: string) => void;
}) {
  const hit = new THREE.Vector3(0, 0.55, 0);
  const rayLen = 1.1;
  const rad = (incidenceAngleDeg * Math.PI) / 180;
  const reflRad = (reflectedAngleDeg * Math.PI) / 180;
  const source = hit.clone().add(new THREE.Vector3(-rayLen * Math.sin(rad), rayLen * Math.cos(rad), 0));
  const reflectedEnd = hit.clone().add(new THREE.Vector3(rayLen * Math.sin(reflRad), rayLen * Math.cos(reflRad), 0));
  const incidentDot = source.clone().lerp(hit, travelPhase);
  const reflectedDot = hit.clone().lerp(reflectedEnd, travelPhase);
  const normalTop = hit.clone().add(new THREE.Vector3(0, 1, 0));

  return (
    <SafeR3FCanvas height={288} shadows camera={{ position: [2.6, 1.8, 3.0], fov: 40 }}>
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 5, 2]} intensity={1.1} castShadow />
      <Ground color="#f1f5f9" />

      <Rod a={hit} b={normalTop} radius={0.006} color="#cbd5e1" />

      <Hotspot3D id="plane-mirror" label="Plane Mirror" position={[0, 0.53, 0]} hoveredId={hoveredId} onHover={onHover} onUnhover={onUnhover} onClick={onClick}>
        <mesh>
          <boxGeometry args={[1.8, 0.04, 0.6]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.1} />
        </mesh>
      </Hotspot3D>

      <Hotspot3D id="light-ray-source" label="Ray Box" position={[source.x, source.y, source.z]} hoveredId={hoveredId} onHover={onHover} onUnhover={onUnhover} onClick={onClick}>
        <mesh castShadow>
          <boxGeometry args={[0.16, 0.13, 0.16]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.3} />
        </mesh>
      </Hotspot3D>

      <Rod a={source} b={hit} radius={0.012} color="#f59e0b" />
      <Rod a={hit} b={reflectedEnd} radius={0.012} color="#f59e0b" />
      <mesh position={incidentDot}>
        <sphereGeometry args={[0.035, 10, 10]} />
        <meshStandardMaterial color="#fde68a" emissive="#fbbf24" emissiveIntensity={1} />
      </mesh>
      <mesh position={reflectedDot}>
        <sphereGeometry args={[0.035, 10, 10]} />
        <meshStandardMaterial color="#fde68a" emissive="#fbbf24" emissiveIntensity={1} />
      </mesh>

      <OrbitControls enablePan={false} minDistance={2} maxDistance={6} target={[0, 0.6, 0]} makeDefault />
    </SafeR3FCanvas>
  );
}
