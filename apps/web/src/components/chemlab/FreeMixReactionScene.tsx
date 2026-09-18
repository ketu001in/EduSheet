'use client';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ReactionVisualState } from '@edusheets/content';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';
import { playFizz, playThud, playWarnBuzz, playSuccessChime } from '@/lib/uiSoundEngine';

// A real 3D beaker for Free Mix Sandbox -- a genuine glass vessel with a
// real liquid level and color, real rising bubble particles, a real
// flame, and real sound cues, replacing the flat colored-div-with-CSS-
// bubbles version. Built as its own dedicated component (not a rewrite
// of the shared ReactionStage.tsx, which LabBench.tsx also depends on)
// so this upgrade can't regress the guided-experiment flow. Every visual
// still reads directly off the same real ReactionVisualState data the
// flat version used -- only the rendering changed.
const COLOR_MAP: Record<string, string> = {
  purple: '#8b5cf6', pink: '#f472b6', 'pink/red': '#f472b6', red: '#ef4444',
  'blue/green': '#22c55e', green: '#22c55e', blue: '#3b82f6', 'pale blue': '#93c5fd',
  'pale green': '#86efac', colorless: '#e2e8f0', 'faint permanent pink': '#f9a8d4',
  'orange-brown': '#c2703d', 'dark blue-black': '#1e293b', 'reddish-brown': '#b45309',
  white: '#f8fafc', 'white, curdy': '#f1f5f9', 'brick-red': '#c2410c', lilac: '#c4b5fd',
  'blue-green': '#14b8a6', 'strong yellow': '#eab308', 'dark blue': '#1e293b',
};
function resolveColor(name?: string): string {
  if (!name) return '#cbd5e1';
  return COLOR_MAP[name.toLowerCase().trim()] || '#cbd5e1';
}

export interface FreeMixReactionSceneProps {
  reaction?: ReactionVisualState;
  idle?: boolean;
  hazard?: boolean;
}

export default function FreeMixReactionScene({ reaction, idle, hazard }: FreeMixReactionSceneProps) {
  const animate = !idle;
  const liquidColor = reaction?.colorChange ? resolveColor(reaction.colorChange.to) : '#cbd5e1';
  const reactionKey = `${reaction?.description ?? 'idle'}-${idle}`;

  // Fire the one real sound cue for this specific reaction exactly once,
  // when it first appears -- not on every re-render.
  const firedFor = useRef<string | null>(null);
  useEffect(() => {
    if (idle || firedFor.current === reactionKey) return;
    firedFor.current = reactionKey;
    if (hazard) playWarnBuzz();
    else if (reaction?.gasBubbles) playFizz();
    else if (reaction?.precipitate) playThud();
    else if (reaction) playSuccessChime();
  }, [reactionKey, idle, hazard, reaction]);

  return (
    <SafeR3FCanvas height={260} shadows camera={{ position: [0, 1.7, 4.3], fov: 38 }}>
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 5, 3]} intensity={1.1} castShadow />
      <Table />
      <Beaker liquidColor={liquidColor} fillLevel={idle ? 0.32 : 0.55} />
      {reaction?.gasBubbles && animate && <Bubbles />}
      {reaction?.smoke && animate && <Smoke />}
      {reaction?.precipitate && !idle && <Precipitate color={resolveColor(reaction.precipitate.color)} settle={!animate} />}
      {reaction?.flameColor && !idle && <Flame color={resolveColor(reaction.flameColor)} />}
    </SafeR3FCanvas>
  );
}

function Table() {
  return (
    <mesh position={[0, -0.02, 0]} receiveShadow>
      <boxGeometry args={[5, 0.06, 3]} />
      <meshStandardMaterial color="#e2e8f0" roughness={0.85} />
    </mesh>
  );
}

function Beaker({ liquidColor, fillLevel }: { liquidColor: string; fillLevel: number }) {
  const beakerHeight = 1.5;
  const radius = 0.55;
  return (
    <group position={[0, 0.03, 0]}>
      {/* Glass wall -- open cylinder, transparent */}
      <mesh position={[0, beakerHeight / 2, 0]}>
        <cylinderGeometry args={[radius, radius * 0.92, beakerHeight, 32, 1, true]} />
        <meshPhysicalMaterial color="#dbeafe" transparent opacity={0.18} roughness={0.05} metalness={0} side={THREE.DoubleSide} />
      </mesh>
      {/* Base */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[radius * 0.93, radius * 0.93, 0.04, 32]} />
        <meshPhysicalMaterial color="#dbeafe" transparent opacity={0.3} roughness={0.05} />
      </mesh>
      {/* Liquid */}
      <mesh position={[0, (beakerHeight * fillLevel) / 2 + 0.03, 0]} castShadow>
        <cylinderGeometry args={[radius * 0.88, radius * 0.85, beakerHeight * fillLevel, 32]} />
        <meshStandardMaterial color={liquidColor} transparent opacity={0.88} roughness={0.25} />
      </mesh>
    </group>
  );
}

function Bubbles() {
  const groupRef = useRef<THREE.Group>(null);
  const bubbles = useMemo(() => Array.from({ length: 10 }, () => ({
    x: (Math.random() - 0.5) * 0.7,
    z: (Math.random() - 0.5) * 0.5,
    speed: 0.4 + Math.random() * 0.5,
    offset: Math.random() * 2,
    size: 0.02 + Math.random() * 0.035,
  })), []);
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const b = bubbles[i];
      const t = (state.clock.elapsedTime * b.speed + b.offset) % 1.4;
      child.position.y = 0.1 + t * 0.9;
      (child as THREE.Mesh).scale.setScalar(1 - t * 0.3);
    });
    state.invalidate();
  });
  return (
    <group ref={groupRef}>
      {bubbles.map((b, i) => (
        <mesh key={i} position={[b.x, 0.1, b.z]}>
          <sphereGeometry args={[b.size, 8, 8]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.7} roughness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

function Smoke() {
  const groupRef = useRef<THREE.Group>(null);
  const wisps = useMemo(() => Array.from({ length: 5 }, () => ({
    x: (Math.random() - 0.5) * 0.5,
    z: (Math.random() - 0.5) * 0.4,
    speed: 0.15 + Math.random() * 0.15,
    offset: Math.random() * 3,
  })), []);
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const w = wisps[i];
      const t = (state.clock.elapsedTime * w.speed + w.offset) % 2.2;
      child.position.y = 1.55 + t * 0.6;
      const material = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
      material.opacity = Math.max(0, 0.4 - t * 0.18);
    });
    state.invalidate();
  });
  return (
    <group ref={groupRef}>
      {wisps.map((w, i) => (
        <mesh key={i} position={[w.x, 1.55, w.z]}>
          <sphereGeometry args={[0.16, 10, 10]} />
          <meshStandardMaterial color="#cbd5e1" transparent opacity={0.35} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function Precipitate({ color, settle }: { color: string; settle: boolean }) {
  const positions = useMemo(() => Array.from({ length: 12 }, () => ({
    x: (Math.random() - 0.5) * 0.7,
    z: (Math.random() - 0.5) * 0.5,
    y: settle ? 0.06 + Math.random() * 0.03 : 0.1 + Math.random() * 0.3,
    size: 0.02 + Math.random() * 0.025,
  })), [settle]);
  return (
    <group>
      {positions.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[p.size, 6, 6]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function Flame({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const s = 1 + Math.sin(t * 12) * 0.08;
    ref.current.scale.set(s, 1 + Math.sin(t * 9) * 0.12, s);
    state.invalidate();
  });
  return (
    <mesh ref={ref} position={[0, -0.12, 0]}>
      <coneGeometry args={[0.13, 0.32, 12]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} transparent opacity={0.85} />
    </mesh>
  );
}
