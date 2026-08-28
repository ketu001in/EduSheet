'use client';
import { useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';

// Real 3D polyhedra for Euler's Formula (V - E + F = 2) -- a cube and a
// tetrahedron, matching the exact two examples the theorem's proof text
// already walks through. Vertices are real corner coordinates (not
// decorative dots), edges are real cylinders between real corners, so
// counting V/E/F on screen is counting the actual rendered geometry, not
// reading numbers off a caption.
export type PolyhedronId = 'cube' | 'tetrahedron';

export const POLYHEDRON_COUNTS: Record<PolyhedronId, { V: number; E: number; F: number }> = {
  cube: { V: 8, E: 12, F: 6 },
  tetrahedron: { V: 4, E: 6, F: 4 },
};

const CUBE_VERTS: [number, number, number][] = [
  [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
  [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
];
const CUBE_EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7],
];

// A regular tetrahedron's 4 vertices, the standard alternating-cube-corner
// construction (each pair among these 4 points is equidistant).
const TET_VERTS: [number, number, number][] = [
  [1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1],
];
const TET_EDGES: [number, number][] = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
const TET_FACES: [number, number, number][] = [[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3]];

export default function EulerPolyhedron3DScene({ polyhedron }: { polyhedron: PolyhedronId }) {
  return (
    <SafeR3FCanvas height={300} camera={{ position: [3, 2.4, 3.4], fov: 42 }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 5, 3]} intensity={1.1} />
      {polyhedron === 'cube' ? <CubeShape /> : <TetrahedronShape />}
      <OrbitControls enablePan={false} minDistance={2} maxDistance={7} makeDefault />
    </SafeR3FCanvas>
  );
}

function CubeShape() {
  const s = 1.4;
  const geometry = useMemo(() => new THREE.BoxGeometry(s, s, s), [s]);
  const edgePairs = useMemo(
    () => CUBE_EDGES.map(([a, b]) => [
      new THREE.Vector3(...CUBE_VERTS[a]).multiplyScalar(s / 2),
      new THREE.Vector3(...CUBE_VERTS[b]).multiplyScalar(s / 2),
    ] as const),
    [s],
  );
  return (
    <group>
      <mesh geometry={geometry}>
        <meshStandardMaterial color="#2F5FE0" transparent opacity={0.55} metalness={0.2} roughness={0.5} />
      </mesh>
      {edgePairs.map(([a, b], i) => <EdgeRod key={i} a={a} b={b} />)}
      {CUBE_VERTS.map((v, i) => <VertexDot key={i} position={new THREE.Vector3(...v).multiplyScalar(s / 2)} />)}
    </group>
  );
}

function TetrahedronShape() {
  const scale = 1.1;
  const verts = useMemo(() => TET_VERTS.map((v) => new THREE.Vector3(...v).multiplyScalar(scale)), [scale]);
  const faceGeometry = useMemo(() => {
    const positions: number[] = [];
    TET_FACES.forEach(([a, b, c]) => {
      positions.push(...verts[a].toArray(), ...verts[b].toArray(), ...verts[c].toArray());
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.computeVertexNormals();
    return geo;
  }, [verts]);

  return (
    <group>
      <mesh geometry={faceGeometry}>
        <meshStandardMaterial color="#E8474C" transparent opacity={0.55} metalness={0.2} roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
      {TET_EDGES.map(([a, b], i) => <EdgeRod key={i} a={verts[a]} b={verts[b]} />)}
      {verts.map((v, i) => <VertexDot key={i} position={v} />)}
    </group>
  );
}

function EdgeRod({ a, b }: { a: THREE.Vector3; b: THREE.Vector3 }) {
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const length = a.distanceTo(b);
  const dir = b.clone().sub(a).normalize();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  return (
    <mesh position={mid} quaternion={quaternion}>
      <cylinderGeometry args={[0.03, 0.03, length, 8]} />
      <meshStandardMaterial color="#1e293b" />
    </mesh>
  );
}

function VertexDot({ position }: { position: THREE.Vector3 }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.07, 16, 16]} />
      <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.3} />
    </mesh>
  );
}
