'use client';
import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';
import { Hotspot3D, Rod, Ground } from './Hotspot3D';

// A real 3D circuit loop -- a physical battery + bulb + wire loop instead
// of a schematic. current = ohmsLawCurrent(voltage/resistance) (unchanged,
// computed by PhysicsStage) drives both the bulb's real emissive glow
// brightness and the speed of small glowing "electron" dots animated
// around the loop -- current really does flow faster with more current,
// same physical idea Ohm's Law describes, not just decoration.
const CORNERS: [number, number][] = [
  [-0.9, 0.15], [-0.9, 1.35], [0.9, 1.35], [0.9, 0.15],
];

function perimeterPoint(u: number): THREE.Vector3 {
  // u in [0,1) walks the rectangle: bottom-left -> top-left -> top-right -> bottom-right -> back
  const pts = [...CORNERS, CORNERS[0]];
  const segLens = pts.slice(0, -1).map((p, i) => Math.hypot(pts[i + 1][0] - p[0], pts[i + 1][1] - p[1]));
  const total = segLens.reduce((a, b) => a + b, 0);
  let d = u * total;
  for (let i = 0; i < segLens.length; i++) {
    if (d <= segLens[i] || i === segLens.length - 1) {
      const t = segLens[i] > 0 ? d / segLens[i] : 0;
      const [x0, y0] = pts[i];
      const [x1, y1] = pts[i + 1];
      return new THREE.Vector3(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, 0);
    }
    d -= segLens[i];
  }
  return new THREE.Vector3(pts[0][0], pts[0][1], 0);
}

export default function Circuit3DScene({
  voltage, current, running, hoveredId, onHover, onUnhover, onClick,
}: {
  voltage: number;
  current: number;
  running: boolean;
  hoveredId: string | null;
  onHover: (id: string) => void;
  onUnhover: () => void;
  onClick: (id: string) => void;
}) {
  const brightness = Math.min(1, current / 4);

  return (
    <SafeR3FCanvas height={288} shadows camera={{ position: [2.6, 1.6, 3.2], fov: 40 }}>
      <ambientLight intensity={0.75} />
      <directionalLight position={[3, 5, 2]} intensity={1} castShadow />
      <Ground color="#e2e8f0" />

      {CORNERS.map((c, i) => {
        const next = CORNERS[(i + 1) % CORNERS.length];
        return <Rod key={i} a={new THREE.Vector3(c[0], c[1], 0)} b={new THREE.Vector3(next[0], next[1], 0)} radius={0.02} color="#94a3b8" />;
      })}

      <CurrentDots running={running} current={current} />

      <Hotspot3D id="battery" label="Battery Cell" position={[-0.9, 0.75, 0]} hoveredId={hoveredId} onHover={onHover} onUnhover={onUnhover} onClick={onClick}>
        <mesh castShadow>
          <boxGeometry args={[0.32, 0.5, 0.24]} />
          <meshStandardMaterial color="#334155" metalness={0.4} roughness={0.4} />
        </mesh>
        <Text position={[0, 0, 0.13]} fontSize={0.11} color="white" anchorX="center" anchorY="middle">{voltage}V</Text>
      </Hotspot3D>

      <Hotspot3D id="bulb" label="Light Bulb" position={[0, 1.35, 0]} hoveredId={hoveredId} onHover={onHover} onUnhover={onUnhover} onClick={onClick}>
        <mesh>
          <sphereGeometry args={[0.26, 20, 20]} />
          <meshStandardMaterial
            color="#fde68a"
            emissive="#fbbf24"
            emissiveIntensity={0.3 + brightness * 2.2}
            transparent
            opacity={0.35 + brightness * 0.55}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.06, 10, 10]} />
          <meshStandardMaterial color="#92400e" emissive="#f59e0b" emissiveIntensity={brightness * 3} />
        </mesh>
      </Hotspot3D>

      <Hotspot3D id="connecting-wire" label="Connecting Wire" position={[0.9, 0.75, 0]} hoveredId={hoveredId} onHover={onHover} onUnhover={onUnhover} onClick={onClick}>
        <mesh visible={false}>
          <boxGeometry args={[0.08, 1.2, 0.08]} />
          <meshStandardMaterial />
        </mesh>
      </Hotspot3D>

      <OrbitControls enablePan={false} minDistance={2} maxDistance={6} target={[0, 0.75, 0]} makeDefault />
    </SafeR3FCanvas>
  );
}

// Animated "electron" dots -- a real child of the Canvas, so useFrame has
// an R3F context to attach to (calling it in the parent component above
// would fire before Canvas even mounts, which is exactly the "Hooks can
// only be used within the Canvas component" error this was split out to
// avoid).
function CurrentDots({ running, current }: { running: boolean; current: number }) {
  const dotsRef = useRef<THREE.Group>(null);
  const phaseRef = useRef(0);
  const dotCount = 10;
  const positions = useMemo(() => new Array(dotCount).fill(0), []);

  useFrame((state, delta) => {
    if (!running || current <= 0) return;
    phaseRef.current += delta * (0.15 + current * 0.3);
    if (dotsRef.current) {
      dotsRef.current.children.forEach((child, i) => {
        const u = (phaseRef.current + i / dotCount) % 1;
        const p = perimeterPoint(u);
        child.position.set(p.x, p.y, p.z);
      });
    }
    state.invalidate();
  });

  return (
    <group ref={dotsRef}>
      {positions.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#2F5FE0" emissive="#2F5FE0" emissiveIntensity={1.2} />
        </mesh>
      ))}
    </group>
  );
}
