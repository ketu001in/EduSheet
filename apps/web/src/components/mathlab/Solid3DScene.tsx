'use client';
import { useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls, Text } from '@react-three/drei';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';
import { SolidType } from '@/lib/mensurationEngine';

// Real 3D mensuration solids -- a cube, cuboid, cylinder, cone, and sphere,
// each built with genuinely correct proportions from the same dimensions
// driving the live volume/surface-area readout (mensurationEngine.ts), not
// a fixed decorative shape with numbers pasted next to it. Rotating the
// solid with OrbitControls is a real way to confirm "yes, this cone
// genuinely has this height and this base radius", the same honesty
// standard as Chem Lab's Benzene3DScene.
const SCALE = 0.55; // world units per real dimension unit, keeps solids framed at typical 1-10 unit dimensions

export default function Solid3DScene({ solidType, dims }: { solidType: SolidType; dims: Record<string, number> }) {
  return (
    <SafeR3FCanvas height={300} shadows camera={{ position: [3.4, 2.6, 3.8], fov: 40 }}>
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 5, 3]} intensity={1.1} castShadow />
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
      </mesh>

      {solidType === 'cube' && <CubeSolid a={dims.a ?? 3} />}
      {solidType === 'cuboid' && <CuboidSolid l={dims.l ?? 4} w={dims.w ?? 3} h={dims.h ?? 2} />}
      {solidType === 'cylinder' && <CylinderSolid r={dims.r ?? 2} h={dims.h ?? 4} />}
      {solidType === 'cone' && <ConeSolid r={dims.r ?? 2} h={dims.h ?? 4} />}
      {solidType === 'sphere' && <SphereSolid r={dims.r ?? 2.5} />}

      <OrbitControls enablePan={false} minDistance={2.5} maxDistance={9} target={[0, 1, 0]} makeDefault />
    </SafeR3FCanvas>
  );
}

const SOLID_COLOR = '#2F5FE0';

function DimLabel({ position, text }: { position: [number, number, number]; text: string }) {
  return (
    <Text position={position} fontSize={0.22} color="#1e293b" outlineWidth={0.012} outlineColor="white" anchorX="center" anchorY="middle">
      {text}
    </Text>
  );
}

function CubeSolid({ a }: { a: number }) {
  const s = a * SCALE;
  const geometry = useMemo(() => new THREE.BoxGeometry(s, s, s), [s]);
  return (
    <group position={[0, s / 2, 0]}>
      <mesh geometry={geometry} castShadow>
        <meshStandardMaterial color={SOLID_COLOR} metalness={0.25} roughness={0.4} />
      </mesh>
      <lineSegments geometry={new THREE.EdgesGeometry(geometry)}>
        <lineBasicMaterial color="#1e293b" />
      </lineSegments>
      <DimLabel position={[0, s / 2 + 0.35, s / 2 + 0.1]} text={`a = ${a}`} />
    </group>
  );
}

function CuboidSolid({ l, w, h }: { l: number; w: number; h: number }) {
  const L = l * SCALE, W = w * SCALE, H = h * SCALE;
  const geometry = useMemo(() => new THREE.BoxGeometry(L, H, W), [L, H, W]);
  return (
    <group position={[0, H / 2, 0]}>
      <mesh geometry={geometry} castShadow>
        <meshStandardMaterial color={SOLID_COLOR} metalness={0.25} roughness={0.4} />
      </mesh>
      <lineSegments geometry={new THREE.EdgesGeometry(geometry)}>
        <lineBasicMaterial color="#1e293b" />
      </lineSegments>
      <DimLabel position={[0, H / 2 + 0.35, W / 2 + 0.1]} text={`l=${l}, w=${w}, h=${h}`} />
    </group>
  );
}

function CylinderSolid({ r, h }: { r: number; h: number }) {
  const R = r * SCALE, H = h * SCALE;
  const geometry = useMemo(() => new THREE.CylinderGeometry(R, R, H, 36), [R, H]);
  return (
    <group position={[0, H / 2, 0]}>
      <mesh geometry={geometry} castShadow>
        <meshStandardMaterial color={SOLID_COLOR} metalness={0.25} roughness={0.4} />
      </mesh>
      <lineSegments geometry={new THREE.EdgesGeometry(geometry)}>
        <lineBasicMaterial color="#1e293b" transparent opacity={0.35} />
      </lineSegments>
      <DimLabel position={[0, H / 2 + 0.35, 0]} text={`r=${r}, h=${h}`} />
    </group>
  );
}

function ConeSolid({ r, h }: { r: number; h: number }) {
  const R = r * SCALE, H = h * SCALE;
  const geometry = useMemo(() => new THREE.ConeGeometry(R, H, 36), [R, H]);
  return (
    <group position={[0, H / 2, 0]}>
      <mesh geometry={geometry} castShadow>
        <meshStandardMaterial color={SOLID_COLOR} metalness={0.25} roughness={0.4} />
      </mesh>
      <lineSegments geometry={new THREE.EdgesGeometry(geometry)}>
        <lineBasicMaterial color="#1e293b" transparent opacity={0.35} />
      </lineSegments>
      <DimLabel position={[0, H / 2 + 0.35, 0]} text={`r=${r}, h=${h}`} />
    </group>
  );
}

function SphereSolid({ r }: { r: number }) {
  const R = r * SCALE;
  return (
    <group position={[0, R, 0]}>
      <mesh castShadow>
        <sphereGeometry args={[R, 32, 32]} />
        <meshStandardMaterial color={SOLID_COLOR} metalness={0.25} roughness={0.4} />
      </mesh>
      <DimLabel position={[0, R + 0.35, 0]} text={`r = ${r}`} />
    </group>
  );
}
