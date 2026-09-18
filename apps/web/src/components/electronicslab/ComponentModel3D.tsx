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
    case 'oscilloscope':
      return (
        <group>
          {/* Real bench-instrument body */}
          <mesh castShadow position={[0, 0.28, 0]}>
            <boxGeometry args={[0.55, 0.4, 0.4]} />
            <meshStandardMaterial color={color} roughness={0.5} />
          </mesh>
          {/* The real screen -- a dark bezel with a glowing green trace-colored panel */}
          <mesh position={[0, 0.3, 0.201]}>
            <boxGeometry args={[0.42, 0.28, 0.01]} />
            <meshStandardMaterial color="#0a0f0a" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.3, 0.207]}>
            <boxGeometry args={[0.36, 0.22, 0.005]} />
            <meshStandardMaterial color="#052e16" emissive="#22c55e" emissiveIntensity={0.35} roughness={0.4} />
          </mesh>
          {/* Control knobs (VOLTS/DIV, TIME/DIV) */}
          <mesh position={[-0.18, 0.12, 0.201]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.02, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.4} roughness={0.4} />
          </mesh>
          <mesh position={[0.18, 0.12, 0.201]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.02, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.4} roughness={0.4} />
          </mesh>
        </group>
      );
    case 'buzzer':
      return (
        <group>
          <mesh castShadow position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.24, 0.24, 0.16, 24]} />
            <meshStandardMaterial color={color} roughness={0.5} />
          </mesh>
          {/* The real sound-hole grille on top of a piezo buzzer */}
          <mesh position={[0, 0.245, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.01, 16]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
          </mesh>
          <mesh position={[-0.06, 0.05, 0.2]}>
            <cylinderGeometry args={[0.012, 0.012, 0.14, 6]} />
            <meshStandardMaterial color="#dc2626" metalness={0.5} />
          </mesh>
          <mesh position={[0.06, 0.05, 0.2]}>
            <cylinderGeometry args={[0.012, 0.012, 0.14, 6]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.5} />
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
    case 'perfboard':
      return (
        <group>
          <mesh castShadow position={[0, 0.06, 0]}>
            <boxGeometry args={[0.85, 0.08, 0.55]} />
            <meshStandardMaterial color={color} roughness={0.85} />
          </mesh>
          {/* A real perfboard's grid of drilled holes, each with its own
              copper pad -- rendered as a genuine grid, not a texture. */}
          {Array.from({ length: 8 }, (_, row) =>
            Array.from({ length: 12 }, (_, col) => (
              <mesh key={`${row}-${col}`} position={[-0.36 + col * 0.065, 0.105, -0.2 + row * 0.058]}>
                <cylinderGeometry args={[0.012, 0.012, 0.02, 8]} />
                <meshStandardMaterial color="#d4af37" metalness={0.6} roughness={0.4} />
              </mesh>
            )),
          )}
        </group>
      );
    case 'pcb-blank':
      return (
        <group>
          <mesh castShadow position={[0, 0.05, 0]}>
            <boxGeometry args={[0.85, 0.06, 0.55]} />
            <meshStandardMaterial color="#0f4c2c" roughness={0.6} />
          </mesh>
          {/* Bare copper cladding on top -- the real starting material
              before any traces are etched or cut into it. */}
          <mesh position={[0, 0.086, 0]}>
            <boxGeometry args={[0.8, 0.01, 0.5]} />
            <meshStandardMaterial color={color} metalness={0.85} roughness={0.3} />
          </mesh>
        </group>
      );
    case 'soldering-iron':
      return (
        <group>
          {/* Handle */}
          <mesh castShadow position={[-0.1, 0.18, 0]} rotation={[0, 0, Math.PI / 5]}>
            <cylinderGeometry args={[0.055, 0.065, 0.5, 16]} />
            <meshStandardMaterial color="#1e293b" roughness={0.6} />
          </mesh>
          {/* Heating element barrel */}
          <mesh castShadow position={[0.14, 0.36, 0]} rotation={[0, 0, Math.PI / 5]}>
            <cylinderGeometry args={[0.028, 0.028, 0.28, 12]} />
            <meshStandardMaterial color="#71717a" metalness={0.7} roughness={0.35} />
          </mesh>
          {/* Fine metal tip */}
          <mesh castShadow position={[0.27, 0.47, 0]} rotation={[0, 0, Math.PI / 5]}>
            <coneGeometry args={[0.016, 0.12, 10]} />
            <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
      );
    case 'solder-spool':
      return (
        <group>
          <mesh castShadow position={[0, 0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.28, 0.28, 0.1, 24]} />
            <meshStandardMaterial color="#334155" roughness={0.6} />
          </mesh>
          {/* Wound solder wire, visible as a slightly narrower coil between the flanges */}
          <mesh position={[0, 0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.24, 0.24, 0.07, 24]} />
            <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
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
