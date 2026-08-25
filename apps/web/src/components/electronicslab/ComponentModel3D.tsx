'use client';
import { useMemo } from 'react';
import { resistorColorBands, BAND_HEX } from '@/lib/circuitEngine';
import type { ComponentSpec } from '@edusheets/content';

// The real, shared 3D geometry for one component -- used both by the
// single-item preview scene (ComponentPreview3DScene.tsx) and, for the
// resistor color-band math specifically, verified independently before
// shipping (see circuitEngine.ts's header). A resistor's bands are
// computed LIVE from its real resistanceOhms value, never hand-typed per
// catalog item, so a band can never silently drift out of sync with the
// stated value.
export default function ComponentModel({ spec }: { spec: ComponentSpec }) {
  const color = spec.colorHex || '#94a3b8';
  const bands = useMemo(
    () => (spec.kind === 'resistor' && spec.electrical?.resistanceOhms ? resistorColorBands(spec.electrical.resistanceOhms) : null),
    [spec],
  );

  switch (spec.modelHint) {
    case 'box':
      return (
        <group>
          <mesh castShadow position={[0, 0.35, 0]}>
            <boxGeometry args={[0.5, 0.7, 0.28]} />
            <meshStandardMaterial color={color} metalness={0.3} roughness={0.5} />
          </mesh>
          <mesh position={[-0.08, 0.72, 0]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.06, 10]} />
            <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0.08, 0.72, 0]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.06, 10]} />
            <meshStandardMaterial color="#c0c0c0" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      );
    case 'cylinder':
      return (
        <group>
          <mesh castShadow position={[0, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.13, 0.13, 0.55, 20]} />
            <meshStandardMaterial color={color} roughness={0.6} />
          </mesh>
          {bands && (
            <>
              <mesh position={[-0.16, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.132, 0.132, 0.04, 20]} />
                <meshStandardMaterial color={BAND_HEX[bands.band1]} />
              </mesh>
              <mesh position={[-0.08, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.132, 0.132, 0.04, 20]} />
                <meshStandardMaterial color={BAND_HEX[bands.band2]} />
              </mesh>
              <mesh position={[0, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.132, 0.132, 0.04, 20]} />
                <meshStandardMaterial color={BAND_HEX[bands.multiplier]} />
              </mesh>
              <mesh position={[0.14, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.132, 0.132, 0.04, 20]} />
                <meshStandardMaterial color={BAND_HEX.Gold} metalness={0.6} />
              </mesh>
            </>
          )}
          <mesh castShadow position={[-0.32, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.22, 8]} />
            <meshStandardMaterial color="#9ca3af" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh castShadow position={[0.32, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.22, 8]} />
            <meshStandardMaterial color="#9ca3af" metalness={0.6} roughness={0.4} />
          </mesh>
        </group>
      );
    case 'led-dome':
      return (
        <group>
          <mesh castShadow position={[0, 0.42, 0]}>
            <sphereGeometry args={[0.16, 20, 20, 0, Math.PI * 2, 0, Math.PI / 1.6]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} transparent opacity={0.85} />
          </mesh>
          <mesh position={[-0.05, 0.15, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.3, 6]} />
            <meshStandardMaterial color="#9ca3af" metalness={0.6} />
          </mesh>
          <mesh position={[0.05, 0.15, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.24, 6]} />
            <meshStandardMaterial color="#9ca3af" metalness={0.6} />
          </mesh>
        </group>
      );
    case 'ic-dip8':
      return (
        <group>
          <mesh castShadow position={[0, 0.14, 0]}>
            <boxGeometry args={[0.4, 0.16, 0.9]} />
            <meshStandardMaterial color={color} roughness={0.5} />
          </mesh>
          {Array.from({ length: 4 }, (_, i) => (
            <group key={i}>
              <mesh position={[-0.24, 0.05, -0.32 + i * 0.22]}>
                <boxGeometry args={[0.08, 0.03, 0.04]} />
                <meshStandardMaterial color="#c0c0c0" metalness={0.7} />
              </mesh>
              <mesh position={[0.24, 0.05, -0.32 + i * 0.22]}>
                <boxGeometry args={[0.08, 0.03, 0.04]} />
                <meshStandardMaterial color="#c0c0c0" metalness={0.7} />
              </mesh>
            </group>
          ))}
        </group>
      );
    case 'switch-toggle':
      return (
        <group>
          <mesh castShadow position={[0, 0.1, 0]}>
            <boxGeometry args={[0.3, 0.2, 0.3]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} />
          </mesh>
          <mesh castShadow position={[0, 0.32, 0]} rotation={[0.35, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.28, 10]} />
            <meshStandardMaterial color={color} metalness={0.4} roughness={0.4} />
          </mesh>
        </group>
      );
    case 'push-button':
      return (
        <group>
          <mesh castShadow position={[0, 0.08, 0]}>
            <boxGeometry args={[0.32, 0.16, 0.32]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.5} />
          </mesh>
          <mesh castShadow position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.08, 16]} />
            <meshStandardMaterial color={color} roughness={0.4} />
          </mesh>
        </group>
      );
    case 'motor':
      return (
        <group>
          <mesh castShadow position={[0, 0.22, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.4, 20]} />
            <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
          </mesh>
          <mesh castShadow position={[0.24, 0.22, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.035, 0.035, 0.18, 10]} />
            <meshStandardMaterial color="#d4d4d8" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      );
    case 'servo':
      return (
        <group>
          <mesh castShadow position={[0, 0.15, 0]}>
            <boxGeometry args={[0.34, 0.3, 0.18]} />
            <meshStandardMaterial color={color} roughness={0.5} />
          </mesh>
          <mesh castShadow position={[0, 0.32, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.06, 16]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
          </mesh>
          <mesh castShadow position={[0.19, 0.06, 0]}>
            <boxGeometry args={[0.08, 0.06, 0.16]} />
            <meshStandardMaterial color="#334155" roughness={0.5} />
          </mesh>
        </group>
      );
    case 'stepper':
      return (
        <group>
          <mesh castShadow position={[0, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.32, 24]} />
            <meshStandardMaterial color={color} metalness={0.4} roughness={0.5} />
          </mesh>
          <mesh castShadow position={[0.18, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.03, 0.03, 0.16, 10]} />
            <meshStandardMaterial color="#d4d4d8" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      );
    case 'breadboard':
      return (
        <group>
          <mesh castShadow position={[0, 0.06, 0]}>
            <boxGeometry args={[0.85, 0.1, 0.55]} />
            <meshStandardMaterial color={color} roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.115, -0.18]}>
            <boxGeometry args={[0.78, 0.01, 0.06]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
          <mesh position={[0, 0.115, 0.18]}>
            <boxGeometry args={[0.78, 0.01, 0.06]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>
      );
    default:
      return (
        <mesh castShadow position={[0, 0.3, 0]}>
          <boxGeometry args={[0.35, 0.35, 0.35]} />
          <meshStandardMaterial color={color} />
        </mesh>
      );
  }
}
