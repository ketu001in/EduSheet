'use client';
import { useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { Text, OrbitControls } from '@react-three/drei';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { PeriodicElement } from '@edusheets/content';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';
import { playHoverTick, playSelectChime } from '@/lib/uiSoundEngine';

// A real 3D periodic table -- every element is a genuine standing brick
// you can rotate around, hover to lift and glow, and click (with a real
// sound) to open its details -- direct response to feedback that a flat
// grid of colored buttons "opens simply a 2D box with information".
// Search/filter state is computed the same way as before (unchanged
// logic); only the rendering became spatial.
// Tile size is deliberately well short of the spacing (0.78 vs 1.05) and
// noticeably tall (0.62) -- caught live that a near-flush, thin tile
// grid viewed from a steep near-top-down angle reads as one continuous
// tilted photo, not individual bricks. A visible gap (so the dark table
// shows through as real seams between tiles) plus real height plus a
// more oblique camera angle are what actually make each element read as
// its own standing 3D object.
const TILE_SPACING = 1.05;
const TILE_W = 0.78;
const TILE_D = 0.78;
const TILE_H = 0.62;
const LANTHANIDE_ROW = 8.6;
const ACTINIDE_ROW = 9.7;

const CATEGORY_HEX: Record<string, string> = {
  'alkali metal': '#f87171',
  'alkaline earth metal': '#fb923c',
  'transition metal': '#fbbf24',
  'post-transition metal': '#a3e635',
  metalloid: '#2dd4bf',
  nonmetal: '#34d399',
  halogen: '#38bdf8',
  'noble gas': '#a78bfa',
  lanthanide: '#f472b6',
  actinide: '#e879f9',
  unknown: '#94a3b8',
};
function colorFor(category: string): string {
  return CATEGORY_HEX[category] || CATEGORY_HEX.unknown;
}

export interface PeriodicTable3DSceneProps {
  elements: PeriodicElement[];
  matches: (el: PeriodicElement) => boolean;
  isFiltering: boolean;
  onSelect: (el: PeriodicElement) => void;
}

export default function PeriodicTable3DScene({ elements, matches, isFiltering, onSelect }: PeriodicTable3DSceneProps) {
  const laid = useMemo(() => elements.map((el) => {
    let x: number, z: number;
    if (el.category === 'lanthanide') {
      const idx = elements.filter((e) => e.category === 'lanthanide').findIndex((e) => e.atomicNumber === el.atomicNumber);
      x = (idx - 7) * TILE_SPACING;
      z = LANTHANIDE_ROW * TILE_SPACING - 8 * TILE_SPACING;
    } else if (el.category === 'actinide') {
      const idx = elements.filter((e) => e.category === 'actinide').findIndex((e) => e.atomicNumber === el.atomicNumber);
      x = (idx - 7) * TILE_SPACING;
      z = ACTINIDE_ROW * TILE_SPACING - 8 * TILE_SPACING;
    } else {
      x = ((el.group ?? 1) - 9.5) * TILE_SPACING;
      z = (el.period - 4) * TILE_SPACING;
    }
    return { el, x, z };
  }), [elements]);

  return (
    <div className="space-y-1.5">
      <SafeR3FCanvas height={560} shadows camera={{ position: [0, 8.5, 15.5], fov: 42 }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 10, 6]} intensity={1.15} castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-4, 6, -4]} intensity={0.35} />
        {/* Dark table so the real gaps between tiles show up as visible
            seams, not the same flat color as the tiles' backdrop. */}
        <mesh position={[0, -0.06, 0.3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[24, 14]} />
          <meshStandardMaterial color="#1e293b" roughness={0.85} />
        </mesh>
        {laid.map(({ el, x, z }) => (
          <ElementBrick
            key={el.atomicNumber}
            el={el}
            position={[x, 0, z]}
            active={matches(el)}
            dimmed={isFiltering && !matches(el)}
            onSelect={onSelect}
          />
        ))}
        <OrbitControls enablePan={false} enableZoom minDistance={6} maxDistance={26} makeDefault />
      </SafeR3FCanvas>
      <p className="text-center text-[10px] text-slate-400">Drag to rotate &middot; scroll to zoom &middot; hover a brick, then click for the full story</p>
    </div>
  );
}

function ElementBrick({
  el, position, active, dimmed, onSelect,
}: {
  el: PeriodicElement; position: [number, number, number]; active: boolean; dimmed: boolean; onSelect: (el: PeriodicElement) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const liftRef = useRef(0);
  const color = colorFor(el.category);
  const baseOpacity = dimmed ? 0.22 : 1;

  useFrame((_state, delta) => {
    const target = hovered ? 1 : 0;
    liftRef.current += (target - liftRef.current) * Math.min(1, delta * 10);
    if (groupRef.current) {
      groupRef.current.position.y = liftRef.current * 0.35;
      groupRef.current.rotation.x = -liftRef.current * 0.12;
      const s = 1 + liftRef.current * 0.12;
      groupRef.current.scale.set(s, s, s);
    }
    if (Math.abs(target - liftRef.current) > 0.001) _state.invalidate();
  });

  const handleOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!hovered) playHoverTick();
    setHovered(true);
  };
  const handleOut = (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setHovered(false); };
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    playSelectChime();
    onSelect(el);
  };

  return (
    <group position={position}>
      <group ref={groupRef}>
        <mesh
          castShadow receiveShadow
          onPointerOver={handleOver}
          onPointerOut={handleOut}
          onClick={handleClick}
        >
          <boxGeometry args={[TILE_W, TILE_H, TILE_D]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 0.55 : 0.08}
            transparent
            opacity={baseOpacity}
            roughness={0.45}
            metalness={0.15}
          />
        </mesh>
        <Text
          position={[0, TILE_H / 2 + 0.005, -0.09]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.3}
          color="#0f172a"
          anchorX="center"
          anchorY="middle"
          fillOpacity={baseOpacity}
        >
          {el.symbol}
        </Text>
        <Text
          position={[0, TILE_H / 2 + 0.005, 0.23]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.12}
          color="#334155"
          anchorX="center"
          anchorY="middle"
          fillOpacity={baseOpacity}
        >
          {el.atomicNumber}
        </Text>
      </group>
    </group>
  );
}
