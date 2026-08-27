'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera, Text } from '@react-three/drei';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';
import { Hotspot3D } from '@/components/physicslab/Hotspot3D';
import ContinuousInvalidate from './ContinuousInvalidate';
import { resistorColorBands, BAND_HEX } from '@/lib/circuitEngine';
import type { ComponentSpec } from '@edusheets/content';

// The Electronics Lab's Component Cupboard -- a real cabinet of labeled
// drawers, one per category, each holding every real part in that
// category. A drawer genuinely SLIDES open (a real lerp-animated pull,
// not an instant snap), and picking a part happens INSIDE the open
// drawer in 3D -- every item rendered as a real small object you click
// directly in the scene, not a flat 2D card list dropped in below it.
//
// This scene is reused in two places: the Cupboard tab (browse
// everything, `onPickItem` opens the full detail modal) and embedded
// inside a project's Breadboard Workbench (browse to PICK a part to
// place -- `emphasizedCategoryIds` highlights the drawers this specific
// project actually needs, `onPickItem` selects that part for
// placement instead), so "the drawer section is consistent throughout
// the experiments" the way it was always meant to be, instead of the
// workbench having its own disconnected flat parts-bin list.
export interface DrawerCategory {
  id: string;
  label: string;
  accentHex: string;
  count: number;
}

function itemColor(spec: ComponentSpec): string {
  return spec.colorHex || '#94a3b8';
}

// A small, genuinely-3D (not a flat card) representation of one part,
// sized to read clearly even packed many-to-a-drawer -- distinctive per
// real kind rather than one generic pebble shape for everything.
function MiniItemShape({ spec }: { spec: ComponentSpec }) {
  const color = itemColor(spec);
  switch (spec.modelHint) {
    case 'cylinder': {
      const ohms = spec.electrical?.resistanceOhms;
      const bandColor = ohms ? BAND_HEX[resistorColorBands(ohms).multiplier] : null;
      return (
        <group rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.024, 0.024, 0.085, 12]} />
            <meshStandardMaterial color={spec.kind === 'capacitor' ? color : '#D2B48C'} roughness={0.55} />
          </mesh>
          {bandColor && (
            <mesh position={[0, 0.018, 0]}>
              <cylinderGeometry args={[0.0245, 0.0245, 0.012, 12]} />
              <meshStandardMaterial color={bandColor} />
            </mesh>
          )}
        </group>
      );
    }
    case 'led-dome':
      return (
        <mesh castShadow position={[0, 0.02, 0]}>
          <sphereGeometry args={[0.028, 14, 14]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} roughness={0.3} />
        </mesh>
      );
    case 'ic-dip8':
      return (
        <mesh castShadow>
          <boxGeometry args={[0.05, 0.02, 0.09]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
      );
    case 'switch-toggle':
    case 'push-button':
      return (
        <group>
          <mesh castShadow><boxGeometry args={[0.05, 0.03, 0.05]} /><meshStandardMaterial color="#1e293b" roughness={0.5} /></mesh>
          <mesh position={[0, 0.026, 0]} castShadow><cylinderGeometry args={[0.012, 0.012, 0.02, 10]} /><meshStandardMaterial color={color} roughness={0.4} /></mesh>
        </group>
      );
    case 'motor': case 'servo': case 'stepper':
      return (
        <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.026, 0.026, 0.06, 14]} />
          <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
        </mesh>
      );
    case 'buzzer':
      return (
        <mesh castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.026, 16]} />
          <meshStandardMaterial color={color} roughness={0.5} />
        </mesh>
      );
    case 'breadboard': case 'perfboard': case 'pcb-blank':
      return (
        <mesh castShadow>
          <boxGeometry args={[0.09, 0.012, 0.06]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
      );
    case 'soldering-iron': case 'solder-spool':
      return (
        <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.014, 0.02, 0.075, 10]} />
          <meshStandardMaterial color={color} metalness={0.4} roughness={0.5} />
        </mesh>
      );
    default:
      return (
        <mesh castShadow>
          <boxGeometry args={[0.055, 0.04, 0.03]} />
          <meshStandardMaterial color={color} roughness={0.5} />
        </mesh>
      );
  }
}

const SLIDE_OPEN_Z = 1.0;

function DrawerUnit({
  cat, x, y, isOpen, items, hoveredId, onHover, onUnhover, onClick, onPickItem, emphasized, hoveredItemId, onHoverItem,
}: {
  cat: DrawerCategory; x: number; y: number; isOpen: boolean;
  items: ComponentSpec[];
  hoveredId: string | null; onHover: (id: string) => void; onUnhover: () => void; onClick: (id: string) => void;
  onPickItem: (id: string) => void;
  emphasized: boolean;
  hoveredItemId: string | null; onHoverItem: (id: string | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const targetZ = isOpen ? SLIDE_OPEN_Z : 0;
  // The interior/items only appear once the drawer has genuinely slid
  // open far enough to reveal them -- real state (not just reading the
  // ref during render, which wouldn't react to a per-frame-mutated
  // value) so this actually re-renders exactly when the animated slide
  // crosses the threshold, matching the real physical motion instead of
  // popping the contents in the instant isOpen flips.
  const [interiorVisible, setInteriorVisible] = useState(false);
  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.14);
    const shouldShow = groupRef.current.position.z > 0.12;
    if (shouldShow !== interiorVisible) setInteriorVisible(shouldShow);
  });

  const cols = Math.min(8, Math.max(4, Math.ceil(Math.sqrt(items.length * 2.4))));
  const rows = Math.ceil(items.length / cols);
  const cellW = 1.7 / cols;
  const cellH = 0.62 / Math.max(rows, 1);

  return (
    <group ref={groupRef} position={[x, y, 0]}>
      <Hotspot3D id={cat.id} label={`${cat.label} (${cat.count})`} position={[0, 0, 0]} hoveredId={hoveredId} onHover={onHover} onUnhover={onUnhover} onClick={onClick}>
        {/* Drawer body -- real wood-tone front */}
        <mesh castShadow>
          <boxGeometry args={[1.85, 0.9, 0.6]} />
          <meshStandardMaterial color={isOpen ? '#8b6a4a' : '#7a5638'} roughness={0.75} />
        </mesh>
        {emphasized && !isOpen && (
          <mesh position={[0, 0, 0.305]}>
            <ringGeometry args={[0.75, 0.79, 4]} />
            <meshBasicMaterial color="#22c55e" transparent opacity={0.6} />
          </mesh>
        )}
        {/* Color-coded nameplate */}
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
        {/* Flush drawer pull */}
        <mesh position={[0, -0.32, 0.31]}>
          <boxGeometry args={[0.5, 0.09, 0.05]} />
          <meshStandardMaterial color="#2b2419" roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.32, 0.335]}>
          <boxGeometry args={[0.42, 0.045, 0.02]} />
          <meshStandardMaterial color="#d4af37" metalness={0.65} roughness={0.35} />
        </mesh>
      </Hotspot3D>

      {/* Drawer interior -- the real parts, laid out on a real tray that
          slides out IN FRONT of the drawer face once it's pulled open,
          each a genuine clickable 3D object. Positioned well clear of
          the front panel's own box geometry (which spans local z -0.3
          to +0.3) -- an earlier version placed items inside that same
          depth range, which put them geometrically INSIDE the opaque
          front panel, rendered but fully occluded (the real cause of
          "no parts are listed" -- caught from live use, not visible in
          this session's own non-visual verification). Only mounted
          once meaningfully open, so a closed drawer costs nothing. */}
      {interiorVisible && (
        <group position={[0, 0, 0.62]}>
          {/* A real tray surface the parts visibly sit on */}
          <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <boxGeometry args={[1.9, 0.85, 0.02]} />
            <meshStandardMaterial color="#3a2a1c" roughness={0.85} />
          </mesh>
          {items.map((item, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const ix = (col - (cols - 1) / 2) * cellW;
            const iz = 0.28 - row * cellH;
            const itemHovered = hoveredItemId === item.id;
            return (
              <group key={item.id} position={[ix, 0, iz]}>
                <Hotspot3D
                  id={item.id} label={item.name} position={[0, 0, 0]}
                  hoveredId={hoveredItemId} onHover={(id) => onHoverItem(id)} onUnhover={() => onHoverItem(null)}
                  onClick={() => onPickItem(item.id)}
                  sound
                >
                  <MiniItemShape spec={item} />
                  {itemHovered && (
                    <mesh position={[0, -0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                      <ringGeometry args={[0.032, 0.04, 16]} />
                      <meshBasicMaterial color="#f59e0b" side={THREE.DoubleSide} />
                    </mesh>
                  )}
                </Hotspot3D>
              </group>
            );
          })}
        </group>
      )}
    </group>
  );
}

export default function ElectronicsCupboard3DScene({
  categories, items, openId, hoveredId, onHover, onUnhover, onClick, onPickItem, emphasizedCategoryIds, height = 380,
}: {
  categories: DrawerCategory[];
  items: ComponentSpec[];
  openId: string | null;
  hoveredId: string | null;
  onHover: (id: string) => void;
  onUnhover: () => void;
  onClick: (id: string) => void;
  onPickItem: (componentId: string) => void;
  emphasizedCategoryIds?: string[];
  height?: number;
}) {
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const cols = 4;
  const spacingX = 2.1;
  const spacingY = 1.05;
  const rows = Math.ceil(categories.length / cols);

  const [transitioning, setTransitioning] = useState(false);
  useEffect(() => {
    setTransitioning(true);
    const t = setTimeout(() => setTransitioning(false), 550);
    return () => clearTimeout(t);
  }, [openId]);

  return (
    <SafeR3FCanvas height={height} shadows>
      <ContinuousInvalidate active={transitioning || hoveredId != null || hoveredItemId != null} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 5]} intensity={1.2} castShadow />
      <OrthographicCamera makeDefault position={[5, 4.2, 9]} zoom={92} near={0.1} far={100} />

      {/* Cabinet body */}
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
          <DrawerUnit
            key={cat.id}
            cat={cat} x={x} y={y} isOpen={isOpen}
            items={isOpen ? items.filter((it) => it.category === cat.id) : []}
            hoveredId={hoveredId} onHover={onHover} onUnhover={onUnhover} onClick={onClick}
            onPickItem={onPickItem}
            emphasized={!!emphasizedCategoryIds?.includes(cat.id)}
            hoveredItemId={hoveredItemId} onHoverItem={setHoveredItemId}
          />
        );
      })}

      <OrbitControls enablePan={false} minZoom={55} maxZoom={200} target={[0, -(rows - 1) * spacingY * 0.5, 0]} makeDefault />
    </SafeR3FCanvas>
  );
}
