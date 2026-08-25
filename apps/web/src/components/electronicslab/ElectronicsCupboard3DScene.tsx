'use client';
import { OrbitControls, OrthographicCamera } from '@react-three/drei';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';
import { Hotspot3D } from '@/components/physicslab/Hotspot3D';
import type { ComponentSpec } from '@edusheets/content';

// The Electronics Lab's Component Cupboard -- every part on its own shelf
// slot, each a real (simplified) 3D representation of its actual shape
// and real color, clickable for the same hover-lift/click-sound/info-
// popup pattern already proven across Physics/Math Lab (Hotspot3D,
// reused here unmodified, cross-imported the same way SafeR3FCanvas
// already is across every lab -- its own built-in hover tooltip is the
// ONLY label shown; an earlier version also drew a permanent floating
// <Text> per item, which is exactly what caused the overlapping-label
// bug reported live.
//
// A PERSPECTIVE camera on a wide flat layout like this genuinely warps/
// bows straight rows near the edges (the same real optical effect that
// broke the Periodic Table's brick grid earlier) -- fixed the same way:
// an orthographic camera, real spacing between rows so depth differences
// don't visually collapse into each other, and no oversized decorative
// plane fighting the actual shelf items for attention (the previous
// "back wall" box was mis-scaled and mis-angled badly enough to read as
// a broken ramp instead of a wall, so it's removed rather than patched).
export default function ElectronicsCupboard3DScene({
  components, hoveredId, onHover, onUnhover, onClick,
}: {
  components: ComponentSpec[];
  hoveredId: string | null;
  onHover: (id: string) => void;
  onUnhover: () => void;
  onClick: (id: string) => void;
}) {
  const cols = 4;
  const spacingX = 1.9;
  const spacingZ = 2.3;
  const rows = Math.ceil(components.length / cols);

  return (
    <SafeR3FCanvas height={380} shadows>
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 7, 4]} intensity={1.2} castShadow />
      <OrthographicCamera makeDefault position={[6, 6.5, 8.5]} zoom={78} near={0.1} far={100} />

      <mesh position={[0, -0.02, -spacingZ * (rows - 1) * 0.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[cols * spacingX + 2, rows * spacingZ + 2]} />
        <meshStandardMaterial color="#e7ded0" roughness={0.9} />
      </mesh>

      {Array.from({ length: rows }, (_, r) => (
        <mesh key={`shelf-${r}`} position={[0, -0.005, -r * spacingZ]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[cols * spacingX - 0.4, spacingZ - 0.5]} />
          <meshStandardMaterial color="#8b5e3c" roughness={0.85} />
        </mesh>
      ))}

      {components.map((c, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const itemsInThisRow = Math.min(cols, components.length - row * cols);
        const x = (col - (itemsInThisRow - 1) / 2) * spacingX;
        const z = -row * spacingZ;
        return (
          <Hotspot3D
            key={c.id}
            id={c.id}
            label={c.name}
            position={[x, 0, z]}
            hoveredId={hoveredId}
            onHover={onHover}
            onUnhover={onUnhover}
            onClick={onClick}
          >
            <ComponentModel spec={c} />
          </Hotspot3D>
        );
      })}

      <OrbitControls enablePan={false} minZoom={45} maxZoom={140} target={[0, 0.2, -spacingZ * (rows - 1) * 0.5]} makeDefault />
    </SafeR3FCanvas>
  );
}

function ComponentModel({ spec }: { spec: ComponentSpec }) {
  const color = spec.colorHex || '#94a3b8';
  switch (spec.modelHint) {
    case 'box':
      return (
        <group>
          <mesh castShadow position={[0, 0.35, 0]}>
            <boxGeometry args={[0.5, 0.7, 0.28]} />
            <meshStandardMaterial color={color} metalness={0.3} roughness={0.5} />
          </mesh>
          <mesh position={[-0.08, 0.72, 0]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.06, 10]} />
            <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0.08, 0.72, 0]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.06, 10]} />
            <meshStandardMaterial color="#c0c0c0" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      );
    case 'cylinder':
      return (
        <group>
          <mesh castShadow position={[0, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.13, 0.13, 0.55, 20]} />
            <meshStandardMaterial color={color} roughness={0.6} />
          </mesh>
          <mesh castShadow position={[-0.32, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.22, 8]} />
            <meshStandardMaterial color="#9ca3af" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh castShadow position={[0.32, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.22, 8]} />
            <meshStandardMaterial color="#9ca3af" metalness={0.6} roughness={0.4} />
          </mesh>
        </group>
      );
    case 'led-dome':
      return (
        <group>
          <mesh castShadow position={[0, 0.42, 0]}>
            <sphereGeometry args={[0.16, 20, 20, 0, Math.PI * 2, 0, Math.PI / 1.6]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} transparent opacity={0.85} />
          </mesh>
          <mesh position={[-0.05, 0.15, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.3, 6]} />
            <meshStandardMaterial color="#9ca3af" metalness={0.6} />
          </mesh>
          <mesh position={[0.05, 0.15, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.24, 6]} />
            <meshStandardMaterial color="#9ca3af" metalness={0.6} />
          </mesh>
        </group>
      );
    case 'ic-dip8':
      return (
        <group>
          <mesh castShadow position={[0, 0.14, 0]}>
            <boxGeometry args={[0.4, 0.16, 0.9]} />
            <meshStandardMaterial color={color} roughness={0.5} />
          </mesh>
          {Array.from({ length: 4 }, (_, i) => (
            <group key={i}>
              <mesh position={[-0.24, 0.05, -0.32 + i * 0.22]}>
                <boxGeometry args={[0.08, 0.03, 0.04]} />
                <meshStandardMaterial color="#c0c0c0" metalness={0.7} />
              </mesh>
              <mesh position={[0.24, 0.05, -0.32 + i * 0.22]}>
                <boxGeometry args={[0.08, 0.03, 0.04]} />
                <meshStandardMaterial color="#c0c0c0" metalness={0.7} />
              </mesh>
            </group>
          ))}
        </group>
      );
    case 'switch-toggle':
      return (
        <group>
          <mesh castShadow position={[0, 0.1, 0]}>
            <boxGeometry args={[0.3, 0.2, 0.3]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} />
          </mesh>
          <mesh castShadow position={[0, 0.32, 0]} rotation={[0.35, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.28, 10]} />
            <meshStandardMaterial color={color} metalness={0.4} roughness={0.4} />
          </mesh>
        </group>
      );
    case 'breadboard':
      return (
        <group>
          <mesh castShadow position={[0, 0.06, 0]}>
            <boxGeometry args={[0.85, 0.1, 0.55]} />
            <meshStandardMaterial color={color} roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.115, -0.18]}>
            <boxGeometry args={[0.78, 0.01, 0.06]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
          <mesh position={[0, 0.115, 0.18]}>
            <boxGeometry args={[0.78, 0.01, 0.06]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>
      );
    default:
      return (
        <mesh castShadow position={[0, 0.3, 0]}>
          <boxGeometry args={[0.35, 0.35, 0.35]} />
          <meshStandardMaterial color={color} />
        </mesh>
      );
  }
}
