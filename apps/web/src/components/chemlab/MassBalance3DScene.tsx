'use client';
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';

// A real 3D two-pan balance for the Law of Conservation of Mass -- the
// beam genuinely stays level at every mass value, because the underlying
// formula (verified: massMg + massO2 == massMgO algebraically, for
// 2Mg + O2 -> 2MgO) makes reactant and product mass exactly equal no
// matter what the slider is set to. This is the real physical meaning of
// "mass is conserved," shown as an actual balance rather than two bar
// charts side by side.
export interface MassBalance3DProps {
  reactantMass: number; // massMg + massO2
  productMass: number;  // massMgO
  maxScale: number;
}

export default function MassBalance3DScene({ reactantMass, productMass, maxScale }: MassBalance3DProps) {
  return (
    <SafeR3FCanvas height={260} shadows camera={{ position: [3.4, 2.2, 4.2], fov: 40 }}>
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 6, 4]} intensity={1.15} castShadow />
      <Stand />
      <Beam reactantMass={reactantMass} productMass={productMass} maxScale={maxScale} />
    </SafeR3FCanvas>
  );
}

function Stand() {
  return (
    <group>
      <mesh position={[0, -0.02, 0]} receiveShadow>
        <boxGeometry args={[1.4, 0.06, 0.7]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.65, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 1.3, 12]} />
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.3, 0]} castShadow>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

const ARM = 0.9;

function Beam({ reactantMass, productMass, maxScale }: MassBalance3DProps) {
  const beamRef = useRef<THREE.Group>(null);
  const leftPanRef = useRef<THREE.Group>(null);
  const rightPanRef = useRef<THREE.Group>(null);
  const angleRef = useRef(0);

  useFrame((state, delta) => {
    // Real tilt proportional to the (tiny, floating-point-only) mass
    // difference -- in practice this stays ~0 (level) because reactant
    // and product mass are algebraically equal for every slider value.
    const diff = reactantMass - productMass;
    const targetAngle = THREE.MathUtils.clamp(diff * 0.02, -0.12, 0.12);
    angleRef.current += (targetAngle - angleRef.current) * Math.min(1, delta * 6);
    if (beamRef.current) beamRef.current.rotation.z = angleRef.current;
    // Keep both pans hanging level (counter-rotate against the beam tilt)
    if (leftPanRef.current) leftPanRef.current.rotation.z = -angleRef.current;
    if (rightPanRef.current) rightPanRef.current.rotation.z = -angleRef.current;
    if (Math.abs(targetAngle - angleRef.current) > 0.0005) state.invalidate();
  });

  return (
    <group position={[0, 1.3, 0]}>
      <group ref={beamRef}>
        <mesh castShadow>
          <boxGeometry args={[ARM * 2, 0.03, 0.03]} />
          <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.4} />
        </mesh>
        <group ref={leftPanRef} position={[-ARM, 0, 0]}>
          <PanWithLoad mass={reactantMass} maxScale={maxScale} color="#2F5FE0" label="reactants" />
        </group>
        <group ref={rightPanRef} position={[ARM, 0, 0]}>
          <PanWithLoad mass={productMass} maxScale={maxScale} color="#237A4C" label="product" />
        </group>
      </group>
    </group>
  );
}

function PanWithLoad({ mass, maxScale, color }: { mass: number; maxScale: number; color: string; label: string }) {
  const stackHeight = Math.max(0.02, (mass / maxScale) * 0.7);
  const chains = [-0.18, 0.18];
  return (
    <group>
      {chains.map((x) => (
        <mesh key={x} position={[x, -0.2, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 0.4, 6]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
      ))}
      <mesh position={[0, -0.42, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.32, 0.28, 0.04, 24]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.4 + stackHeight / 2, 0]} castShadow>
        <boxGeometry args={[0.38, stackHeight, 0.38]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
      </mesh>
    </group>
  );
}
