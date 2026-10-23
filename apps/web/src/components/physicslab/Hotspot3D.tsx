'use client';
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { playHoverTick, playSelectChime } from '@/lib/uiSoundEngine';

// The 3D equivalent of labshared/LabHotspot.tsx's <Hotspot>+<HoverLabel> --
// wraps a group of meshes so it can be hovered/clicked exactly like the SVG
// hotspots PhysicsStage already used, but with a real scale-up "lift" on
// hover (via useFrame lerp, same technique as PeriodicTable3DScene's element
// bricks) and a floating drei <Html> tooltip instead of an SVG <text>
// bubble. onHover/onUnhover/onClick keep the exact same (id: string) => void
// signatures PhysicsStage already passes down, so wiring into the existing
// equipment-modal / hovered-state logic is a drop-in swap, not a rewrite.
export function Hotspot3D({
  id, label, position, hoveredId, onHover, onUnhover, onClick, children, sound = true,
}: {
  id: string;
  label: string;
  position: [number, number, number];
  hoveredId: string | null;
  onHover: (id: string) => void;
  onUnhover: () => void;
  onClick: (id: string) => void;
  children: React.ReactNode;
  sound?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const hovered = hoveredId === id;

  useFrame(() => {
    if (!groupRef.current) return;
    const target = hovered ? 1.1 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.25);
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(id);
        if (sound) playHoverTick();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onUnhover();
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(id);
        if (sound) playSelectChime();
      }}
    >
      {children}
      {hovered && (
        <Html center distanceFactor={7} style={{ pointerEvents: 'none' }}>
          <div className="px-2.5 py-1 rounded-full bg-slate-900/90 dark:bg-slate-50/90 text-white dark:text-slate-900 text-[11px] font-bold whitespace-nowrap shadow-lg -translate-y-6">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

// Shared helper: a cylinder mesh spanning two points -- used for pendulum
// strings, lever beams-as-rods, connecting rods, etc. Same quaternion
// alignment trick already verified in Benzene3DScene's Bond() helper.
export function Rod({ a, b, radius = 0.03, color = '#64748b', metalness = 0.3, roughness = 0.5 }: {
  a: THREE.Vector3; b: THREE.Vector3; radius?: number; color?: string; metalness?: number; roughness?: number;
}) {
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const length = a.distanceTo(b);
  const dir = b.clone().sub(a).normalize();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  return (
    <mesh position={mid} quaternion={quaternion}>
      <cylinderGeometry args={[radius, radius, length, 12]} />
      <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
    </mesh>
  );
}

// Ground/table plane shared by every scene for a consistent look.
export function Ground({ color = '#e2e8f0', y = 0, size = 6 }: { color?: string; y?: number; size?: number }) {
  return (
    <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
}
