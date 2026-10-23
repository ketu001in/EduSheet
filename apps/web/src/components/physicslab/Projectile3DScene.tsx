'use client';
import * as THREE from 'three';
import { OrbitControls, Trail } from '@react-three/drei';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';
import { Hotspot3D, Ground } from './Hotspot3D';

// A real 3D projectile arc -- x(t)/y(t) come straight from
// physicsEngine.ts's projectileState() (unchanged), just placed in a 3D
// scene with a real launcher, a real ball, and a real fading trail (drei's
// <Trail>) instead of an SVG dashed path. Motion stays in one vertical
// plane, same honesty note as the pendulum.
export default function Projectile3DScene({
  angleDeg, ballX, ballY, range, maxHeight, landed, running, hoveredId, onHover, onUnhover, onClick,
}: {
  angleDeg: number;
  ballX: number; // metres
  ballY: number; // metres
  range: number;
  maxHeight: number;
  landed: boolean;
  running: boolean;
  hoveredId: string | null;
  onHover: (id: string) => void;
  onUnhover: () => void;
  onClick: (id: string) => void;
}) {
  const scale = Math.min(1.2, 3.6 / Math.max(range, 0.5), 2.4 / Math.max(maxHeight, 0.5));
  const launchX = -1.4;
  const ballPos: [number, number, number] = [launchX + ballX * scale, Math.max(0.09, ballY * scale) , 0];
  const landingX = launchX + range * scale;

  return (
    <SafeR3FCanvas height={288} shadows camera={{ position: [1.2, 2.2, 5.4], fov: 42 }}>
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 5, 2]} intensity={1.1} castShadow />
      <Ground color="#e2e8f0" size={9} />

      <Hotspot3D id="launcher" label="Projectile Launcher" position={[launchX, 0, 0]} hoveredId={hoveredId} onHover={onHover} onUnhover={onUnhover} onClick={onClick}>
        <mesh position={[0, 0.2, 0]} rotation={[0, 0, (angleDeg * Math.PI) / 180]} castShadow>
          <boxGeometry args={[0.09, 0.4, 0.09]} />
          <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.4} />
        </mesh>
      </Hotspot3D>

      {landed && (
        <mesh position={[landingX, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.09, 0.13, 24]} />
          <meshBasicMaterial color="#2F9560" />
        </mesh>
      )}

      <Hotspot3D id="ball" label="Steel Ball" position={ballPos} hoveredId={hoveredId} onHover={onHover} onUnhover={onUnhover} onClick={onClick}>
        {running ? (
          <Trail width={2.5} length={5} color="#2F5FE0" attenuation={(t) => t * t}>
            <mesh castShadow>
              <sphereGeometry args={[0.09, 20, 20]} />
              <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.25} />
            </mesh>
          </Trail>
        ) : (
          <mesh castShadow>
            <sphereGeometry args={[0.09, 20, 20]} />
            <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.25} />
          </mesh>
        )}
      </Hotspot3D>

      <OrbitControls enablePan={false} minDistance={3} maxDistance={9} target={[0.4, 0.5, 0]} makeDefault />
    </SafeR3FCanvas>
  );
}
