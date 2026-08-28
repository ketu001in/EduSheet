'use client';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera, Text } from '@react-three/drei';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';
import { Hotspot3D } from '@/components/physicslab/Hotspot3D';
import ContinuousInvalidate from './ContinuousInvalidate';
import { formatOhms, formatFarads } from '@/lib/componentFormat';
import type { ComponentSpec } from '@edusheets/content';

// The Electronics Lab's Component Cupboard -- a real cabinet of labeled
// drawers, one per category. Clicking a drawer slides it open (a real
// lerp-animated pull) inside the 3D scene. Picking a real part, though,
// happens in a plain React/DOM panel rendered OUTSIDE the WebGL canvas
// entirely -- not a design choice made for its own sake: two earlier
// attempts rendered the part list as content INSIDE the 3D scene (first
// as raw WebGL meshes, then as drei's <Html> portal anchored to a 3D
// point) and both failed live for the user ("no parts are listed", then
// "nothing is working"). Instrumenting the actual render loop live
// showed why: this scene's frame updates were not reliably ticking,
// which starves anything gated on that loop -- a WebGL mesh's
// visibility state, or an animation-anchored Html portal. A plain
// sibling DOM panel driven directly by ordinary React state has no
// dependency on the R3F frame loop or WebGL rendering at all, so it
// cannot fail that way. The drawer itself still genuinely slides in 3D;
// only the part-picking step moved to guaranteed-reliable ground.
//
// This scene is reused in two places: the Cupboard tab (browse
// everything, `onPickItem` opens the full detail modal) and embedded
// inside a project's Breadboard Workbench (browse to PICK a part to
// place -- `emphasizedCategoryIds` highlights the drawers this specific
// project actually needs, `onPickItem` selects that part for placement
// instead), so the component library is genuinely the same one across
// every experiment.
export interface DrawerCategory {
  id: string;
  label: string;
  accentHex: string;
  count: number;
}

function itemSpecLine(item: ComponentSpec): string | null {
  const e = item.electrical;
  if (!e) return null;
  if (e.resistanceOhms != null) return formatOhms(e.resistanceOhms);
  if (e.capacitanceFarads != null) return formatFarads(e.capacitanceFarads);
  if (e.forwardVoltage != null) return `Vf ≈ ${e.forwardVoltage}V`;
  if (e.voltage != null) return `${e.voltage}V`;
  return null;
}

const SLIDE_OPEN_Z = 1.0;

function DrawerUnit({
  cat, x, y, isOpen, hoveredId, onHover, onUnhover, onClick, emphasized,
}: {
  cat: DrawerCategory; x: number; y: number; isOpen: boolean;
  hoveredId: string | null; onHover: (id: string) => void; onUnhover: () => void; onClick: (id: string) => void;
  emphasized: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const targetZ = isOpen ? SLIDE_OPEN_Z : 0;
  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.14);
  });

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

  const openCategory = openId ? categories.find((c) => c.id === openId) : null;
  const openItems = openId ? items.filter((it) => it.category === openId) : [];

  return (
    <div className="relative">
      <SafeR3FCanvas height={height} shadows>
        <ContinuousInvalidate active={hoveredId != null} />
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
          return (
            <DrawerUnit
              key={cat.id}
              cat={cat} x={x} y={y} isOpen={openId === cat.id}
              hoveredId={hoveredId} onHover={onHover} onUnhover={onUnhover} onClick={onClick}
              emphasized={!!emphasizedCategoryIds?.includes(cat.id)}
            />
          );
        })}

        <OrbitControls enablePan={false} minZoom={55} maxZoom={200} target={[0, -(rows - 1) * spacingY * 0.5, 0]} makeDefault />
      </SafeR3FCanvas>

      {/* The real part-picking panel -- plain React/DOM, a sibling of the
          canvas rather than content rendered inside it. See the file
          header for why: this is the piece that failed twice when it
          lived inside the WebGL/R3F layer. */}
      {openId && openCategory && (
        <div className="absolute inset-x-2 bottom-2 md:inset-x-4 md:bottom-4 z-10 bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 rounded-2xl shadow-2xl p-3 max-h-[55%] overflow-y-auto">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2 px-0.5">{openCategory.label} -- {openItems.length} real parts -- click one to pick it</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
            {openItems.map((item) => {
              const specLine = itemSpecLine(item);
              return (
                <button
                  key={item.id}
                  onClick={() => onPickItem(item.id)}
                  onMouseEnter={() => setHoveredItemId(item.id)}
                  onMouseLeave={() => setHoveredItemId(null)}
                  className={`text-left p-1.5 rounded-lg border-2 transition-colors ${hoveredItemId === item.id ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'}`}
                >
                  <span className="block text-[11px] font-bold text-slate-700 dark:text-slate-200 leading-tight line-clamp-2">{item.name}</span>
                  {specLine && <span className="block text-[10px] font-mono text-primary-600 mt-0.5">{specLine}</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
