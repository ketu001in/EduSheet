'use client';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';

// A real 3D benzene ring -- six real carbon atoms in a genuine hexagon,
// all sitting at the same height, so rotating the view is a real way to
// confirm the actual, well-known fact that benzene is a planar molecule
// (not just an SVG hexagon drawn flat because it's easy to draw). Kekule
// mode alternates real single/double-bond cylinders (double bonds drawn
// as two parallel cylinders, same real alternating pattern as the
// existing 2D theory diagram); delocalized mode replaces them with a
// real glowing torus representing the pi-electron cloud spread evenly
// around the ring -- the actual reason the real molecule is more stable
// and completely uniform than Kekule's 1865 guess.
const RADIUS = 1.1;
const RING_POINTS = Array.from({ length: 6 }, (_, i) => {
  const angle = (Math.PI / 180) * (60 * i - 90);
  return new THREE.Vector3(RADIUS * Math.cos(angle), 0, RADIUS * Math.sin(angle));
});

export default function Benzene3DScene({ delocalized }: { delocalized: boolean }) {
  return (
    <SafeR3FCanvas height={260} camera={{ position: [2.6, 2.2, 2.6], fov: 42 }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 5, 3]} intensity={1.1} />
      {RING_POINTS.map((p, i) => (
        <group key={i}>
          <mesh position={p}>
            <sphereGeometry args={[0.14, 20, 20]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} />
          </mesh>
          <Hydrogen carbon={p} />
        </group>
      ))}
      {RING_POINTS.map((p, i) => {
        const next = RING_POINTS[(i + 1) % 6];
        const isDoubleInKekule = i % 2 === 0;
        return <Bond key={i} a={p} b={next} double={!delocalized && isDoubleInKekule} />;
      })}
      {delocalized && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[RADIUS * 0.6, 0.05, 16, 48]} />
          <meshStandardMaterial color="#2F5FE0" emissive="#2F5FE0" emissiveIntensity={0.6} transparent opacity={0.55} />
        </mesh>
      )}
      <OrbitControls enablePan={false} enableZoom minDistance={2} maxDistance={7} makeDefault />
    </SafeR3FCanvas>
  );
}

function Hydrogen({ carbon }: { carbon: THREE.Vector3 }) {
  const dir = carbon.clone().normalize();
  const pos = carbon.clone().add(dir.multiplyScalar(0.55));
  return (
    <mesh position={pos}>
      <sphereGeometry args={[0.07, 14, 14]} />
      <meshStandardMaterial color="#94a3b8" roughness={0.5} />
    </mesh>
  );
}

function Bond({ a, b, double: isDouble }: { a: THREE.Vector3; b: THREE.Vector3; double: boolean }) {
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const length = a.distanceTo(b);
  const dir = b.clone().sub(a).normalize();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  const perp = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize().multiplyScalar(0.06);

  const cylinder = (offset: THREE.Vector3) => (
    <mesh position={mid.clone().add(offset)} quaternion={quaternion}>
      <cylinderGeometry args={[0.035, 0.035, length * 0.85, 10]} />
      <meshStandardMaterial color="#475569" metalness={0.3} roughness={0.5} />
    </mesh>
  );

  if (!isDouble) return cylinder(new THREE.Vector3());
  return (
    <>
      {cylinder(perp)}
      {cylinder(perp.clone().negate())}
    </>
  );
}
