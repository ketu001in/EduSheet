'use client';
import { useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls, Text } from '@react-three/drei';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';

// A real cylinder and a real cone, side by side, sharing the exact same
// base radius and height -- so seeing the cone visually take up "about a
// third" of the same footprint is a real geometric fact you can rotate and
// check, not an illustration. One shared Canvas (not two separate ones)
// keeps this to a single WebGL context.
export default function ConeCylinderRatio3DScene({ r, h }: { r: number; h: number }) {
  const R = r * 0.5, H = h * 0.5;
  const cylGeo = useMemo(() => new THREE.CylinderGeometry(R, R, H, 32), [R, H]);
  const coneGeo = useMemo(() => new THREE.ConeGeometry(R, H, 32), [R, H]);

  return (
    <SafeR3FCanvas height={280} shadows camera={{ position: [3.2, 2.2, 4], fov: 40 }}>
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 5, 3]} intensity={1.1} castShadow />
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
      </mesh>

      <group position={[-1.1, H / 2, 0]}>
        <mesh geometry={cylGeo} castShadow>
          <meshStandardMaterial color="#38bdf8" metalness={0.25} roughness={0.4} />
        </mesh>
        <lineSegments geometry={new THREE.EdgesGeometry(cylGeo)}>
          <lineBasicMaterial color="#1e293b" transparent opacity={0.35} />
        </lineSegments>
        <Text position={[0, H / 2 + 0.35, 0]} fontSize={0.2} color="#1e293b" outlineWidth={0.01} outlineColor="white">Cylinder</Text>
      </group>

      <group position={[1.1, H / 2, 0]}>
        <mesh geometry={coneGeo} castShadow>
          <meshStandardMaterial color="#f59e0b" metalness={0.25} roughness={0.4} />
        </mesh>
        <lineSegments geometry={new THREE.EdgesGeometry(coneGeo)}>
          <lineBasicMaterial color="#1e293b" transparent opacity={0.35} />
        </lineSegments>
        <Text position={[0, H / 2 + 0.35, 0]} fontSize={0.2} color="#1e293b" outlineWidth={0.01} outlineColor="white">Cone</Text>
      </group>

      <OrbitControls enablePan={false} minDistance={2.5} maxDistance={9} target={[0, 1, 0]} makeDefault />
    </SafeR3FCanvas>
  );
}
