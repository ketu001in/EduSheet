'use client';
import { OrbitControls, OrthographicCamera, Text } from '@react-three/drei';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';
import { Hotspot3D } from '@/components/physicslab/Hotspot3D';

// The Electronics Lab's Component Cupboard -- a real cabinet of labeled
// drawers, one per category, each holding every real part in that
// category (see ELECTRONICS_COMPONENTS -- 41 real, distinct parts across
// these 7 drawers, not one generic placeholder per category). Clicking a
// drawer opens it (see the page's drawer-contents panel); this scene only
// ever renders drawer FRONTS, never all 41 individual parts at once --
// keeps the geometry simple and correctly spaced instead of repeating the
// earlier flat-shelf alignment bug at 6x the item count.
//
// Same orthographic-camera fix as the shelf version before it (a
// PERSPECTIVE camera genuinely bows a wide flat layout like this), same
// real inter-drawer spacing so nothing visually collapses together.
export interface DrawerCategory {
  id: string;
  label: string;
  accentHex: string;
  count: number;
}

export default function ElectronicsCupboard3DScene({
  categories, openId, hoveredId, onHover, onUnhover, onClick,
}: {
  categories: DrawerCategory[];
  openId: string | null;
  hoveredId: string | null;
  onHover: (id: string) => void;
  onUnhover: () => void;
  onClick: (id: string) => void;
}) {
  const cols = 4;
  const spacingX = 2.1;
  const spacingY = 1.05;
  const rows = Math.ceil(categories.length / cols);

  return (
    <SafeR3FCanvas height={330} shadows>
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 5]} intensity={1.2} castShadow />
      <OrthographicCamera makeDefault position={[5, 4.2, 8]} zoom={92} near={0.1} far={100} />

      {/* Cabinet body -- a real box behind the drawer fronts, sized to the actual grid */}
      <mesh position={[0, -(rows - 1) * spacingY * 0.5, -0.35]} receiveShadow>
        <boxGeometry args={[cols * spacingX + 0.4, rows * spacingY + 0.6, 0.5]} />
        <meshStandardMaterial color="#5b3f2a" roughness={0.8} />
      </mesh>

      {categories.map((cat, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const itemsInThisRow = Math.min(cols, categories.length - row * cols);
        const x = (col - (itemsInThisRow - 1) / 2) * spacingX;
        const y = -row * spacingY;
        const isOpen = openId === cat.id;
        return (
          <group key={cat.id} position={[x, y, isOpen ? 0.35 : 0]}>
            <Hotspot3D id={cat.id} label={`${cat.label} (${cat.count})`} position={[0, 0, 0]} hoveredId={hoveredId} onHover={onHover} onUnhover={onUnhover} onClick={onClick}>
              {/* Drawer body -- real wood-tone front */}
              <mesh castShadow>
                <boxGeometry args={[1.85, 0.9, 0.6]} />
                <meshStandardMaterial color={isOpen ? '#8b6a4a' : '#7a5638'} roughness={0.75} />
              </mesh>
              {/* Color-coded nameplate -- a real label panel, not a thin
                  accent line, so each drawer's category reads at a glance */}
              <mesh position={[0, 0.16, 0.305]} castShadow>
                <boxGeometry args={[1.65, 0.42, 0.02]} />
                <meshStandardMaterial color={cat.accentHex} roughness={0.5} />
              </mesh>
              <Text position={[0, 0.16, 0.32]} fontSize={0.115} color="white" outlineWidth={0.006} outlineColor="#1a1a1a" anchorX="center" anchorY="middle" maxWidth={1.5}>
                {cat.label}
              </Text>
              <Text position={[0, -0.14, 0.32]} fontSize={0.09} color="#fde68a" anchorX="center" anchorY="middle">
                {cat.count} parts
              </Text>
              {/* Flush drawer pull -- a real recessed handle shape instead
                  of a floating rod (the earlier version read as a stray
                  pen sitting on the drawer, not a handle). */}
              <mesh position={[0, -0.32, 0.31]}>
                <boxGeometry args={[0.5, 0.09, 0.05]} />
                <meshStandardMaterial color="#2b2419" roughness={0.6} />
              </mesh>
              <mesh position={[0, -0.32, 0.335]}>
                <boxGeometry args={[0.42, 0.045, 0.02]} />
                <meshStandardMaterial color="#d4af37" metalness={0.65} roughness={0.35} />
              </mesh>
            </Hotspot3D>
          </group>
        );
      })}

      <OrbitControls enablePan={false} minZoom={55} maxZoom={160} target={[0, -(rows - 1) * spacingY * 0.5, 0]} makeDefault />
    </SafeR3FCanvas>
  );
}
