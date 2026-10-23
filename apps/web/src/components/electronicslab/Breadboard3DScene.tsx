'use client';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera, RoundedBox, ContactShadows } from '@react-three/drei';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';
import { Hotspot3D } from '@/components/physicslab/Hotspot3D';
import ComponentModel from './ComponentModel3D';
import ContinuousInvalidate from './ContinuousInvalidate';
import { ELECTRONICS_COMPONENTS, type ComponentPlacement, type WireConnection, type BreadboardPosition, type ComponentSpec } from '@edusheets/content';
import { type CircuitEvaluation } from '@/lib/circuitEngine';

// The real, hands-on breadboard, rendered as a genuine, modern 3D scene --
// a physical board the student can orbit, zoom, and click into. Placed
// components reuse the SAME real geometry the Component Cupboard's
// preview already uses (ComponentModel3D -- real resistor color bands,
// a real battery body, a real 555 DIP-8 chip) instead of flat
// placeholder boxes, for static parts; parts that need LIVE state (an
// LED that must actually blink, a switch that must actually change
// color when toggled, a buzzer/motor that must actually animate) get
// their own richer multi-part geometry here, since ComponentModel3D has
// no live-state hooks and is shared with the Cupboard -- not modified.
// Wires render as real jumper cables: a gently arched two-segment cord
// with an actual connector "boot" plug at each end, not a bare line.
//
// This component owns NO circuit logic of its own -- placements, wires,
// and evaluation all come in as props and every interaction is reported
// back up via the same onPositionClick/onComponentClick/onWireClick
// handlers the original SVG version used.
//
// Lighting is a local multi-light studio rig, not drei's <Environment>
// -- Model3DViewer.tsx already established why: Environment fetches its
// HDR map from a third-party CDN at runtime, and this app's 3D scenes
// must never depend on an external service being up just to render.

const COLS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'] as const;
const ROWS = 20;
const HOLE_GAP = 0.18;
const GUTTER = 0.16;
const BOARD_W = 9 * HOLE_GAP + GUTTER;
const BOARD_D = (ROWS - 1) * HOLE_GAP;
const CENTER_X = BOARD_W / 2;
const CENTER_Z = BOARD_D / 2;

const BODY_SCALE_BY_KIND: Record<string, number> = {
  resistor: 0.34, capacitor: 0.4, 'battery-9v': 0.24, 'battery-6v': 0.24, 'timer-555': 0.42, oscilloscope: 0.5,
};

function colX(col: string): number {
  const idx = COLS.indexOf(col as (typeof COLS)[number]);
  return idx * HOLE_GAP + (idx >= 5 ? GUTTER : 0) - CENTER_X;
}
function rowZ(row: number): number {
  return (row - 1) * HOLE_GAP - CENTER_Z;
}
function railZ(rail: string): number {
  if (rail === 'top-pos') return -CENTER_Z - 0.18;
  if (rail === 'top-neg') return -CENTER_Z - 0.34;
  if (rail === 'bottom-pos') return CENTER_Z + 0.18;
  return CENTER_Z + 0.34;
}
function posToVec(pos: BreadboardPosition, y: number, anchorX?: number): THREE.Vector3 {
  if ('rail' in pos) return new THREE.Vector3(anchorX ?? 0, y, railZ(pos.rail));
  return new THREE.Vector3(colX(pos.col), y, rowZ(pos.row));
}
function resolvePairVecs(a: BreadboardPosition, b: BreadboardPosition, y: number): [THREE.Vector3, THREE.Vector3] {
  const bIsRail = 'rail' in b;
  const aIsRail = 'rail' in a;
  const bV = !bIsRail ? posToVec(b, y) : null;
  const aV = !aIsRail ? posToVec(a, y) : null;
  return [aIsRail ? posToVec(a, y, bV?.x) : aV!, bIsRail ? posToVec(b, y, aV?.x) : bV!];
}

// A colored rod between two points that also reports clicks -- Rod
// (physicslab/Hotspot3D.tsx) already does the quaternion alignment but
// has no interaction props, so this is a local sibling rather than a
// modification of that shared helper.
function InteractiveRod({ a, b, radius, color, onClick, metalness = 0.1, roughness = 0.55 }: {
  a: THREE.Vector3; b: THREE.Vector3; radius: number; color: string; onClick?: () => void; metalness?: number; roughness?: number;
}) {
  const mid = useMemo(() => a.clone().add(b).multiplyScalar(0.5), [a, b]);
  const length = a.distanceTo(b);
  const quaternion = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize()), [a, b]);
  return (
    <mesh position={mid} quaternion={quaternion} onClick={(e) => { e.stopPropagation(); onClick?.(); }} castShadow>
      <cylinderGeometry args={[radius, radius, Math.max(length, 0.001), 10]} />
      <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
    </mesh>
  );
}

// A real jumper-wire connector "boot" -- the small plastic plug housing
// every real jumper wire has where it meets the pin, not a bare wire end.
function ConnectorPlug({ pos, color }: { pos: THREE.Vector3; color: string }) {
  return (
    <group position={pos}>
      <mesh position={[0, 0.011, 0]} castShadow>
        <cylinderGeometry args={[0.014, 0.016, 0.02, 10]} />
        <meshStandardMaterial color="#2a241c" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.026, 0]} castShadow>
        <boxGeometry args={[0.026, 0.016, 0.026]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.1} />
      </mesh>
    </group>
  );
}

// A real jumper cable: two rods meeting at a raised midpoint (a genuine
// arch, the way a real wire drapes instead of cutting a straight line
// through the board) with a connector plug at each end.
function WireCable({ a, b, color, deleteMode, onClick }: { a: THREE.Vector3; b: THREE.Vector3; color: string; deleteMode: boolean; onClick: () => void }) {
  const liftedA = a.clone().setY(a.y + 0.032);
  const liftedB = b.clone().setY(b.y + 0.032);
  const mid = liftedA.clone().add(liftedB).multiplyScalar(0.5);
  const lift = Math.min(0.13, 0.05 + a.distanceTo(b) * 0.06);
  const apex = mid.clone().setY(mid.y + lift);
  const radius = deleteMode ? 0.012 : 0.009;
  return (
    <group>
      <InteractiveRod a={liftedA} b={apex} radius={radius} color={color} onClick={onClick} roughness={0.35} />
      <InteractiveRod a={apex} b={liftedB} radius={radius} color={color} onClick={onClick} roughness={0.35} />
      <ConnectorPlug pos={a} color={color} />
      <ConnectorPlug pos={b} color={color} />
    </group>
  );
}

function LedGlow({ colorHex, lit, blinkPeriodSeconds, blinkDuty }: { colorHex: string; lit: boolean; blinkPeriodSeconds: number | null; blinkDuty: number }) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (!matRef.current) return;
    let on = lit;
    if (lit && blinkPeriodSeconds) {
      const phase = (clock.getElapsedTime() % blinkPeriodSeconds) / blinkPeriodSeconds;
      on = phase < blinkDuty;
    }
    matRef.current.emissiveIntensity = on ? 1.1 : 0;
    matRef.current.opacity = on ? 0.95 : 0.55;
  });
  return (
    <group>
      {/* Two real bent leads down to the board, like a real 5mm LED */}
      <mesh position={[-0.014, 0.025, 0]} castShadow><cylinderGeometry args={[0.0035, 0.0035, 0.05, 6]} /><meshStandardMaterial color="#9ca3af" metalness={0.6} roughness={0.4} /></mesh>
      <mesh position={[0.014, 0.021, 0]} castShadow><cylinderGeometry args={[0.0035, 0.0035, 0.042, 6]} /><meshStandardMaterial color="#9ca3af" metalness={0.6} roughness={0.4} /></mesh>
      {/* Opaque base + translucent dome, matching a real 5mm LED's two-part body */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.024, 0.024, 0.012, 16]} />
        <meshStandardMaterial color="#3f3f3f" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.068, 0]} castShadow>
        <sphereGeometry args={[0.024, 20, 20, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
        <meshStandardMaterial ref={matRef} color={lit ? colorHex : '#6b7280'} emissive={colorHex} transparent roughness={0.25} />
      </mesh>
    </group>
  );
}

function SwitchBody({ closed, isButton }: { closed: boolean; isButton: boolean }) {
  const leverRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!leverRef.current) return;
    const target = closed ? -0.35 : 0.35;
    leverRef.current.rotation.z = THREE.MathUtils.lerp(leverRef.current.rotation.z, target, 0.25);
  });
  return (
    <group>
      <mesh position={[0, 0.018, 0]} castShadow>
        <boxGeometry args={[0.055, 0.036, 0.05]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.15} />
      </mesh>
      {isButton ? (
        <mesh position={[0, 0.045, 0]} castShadow>
          <cylinderGeometry args={[0.016, 0.018, 0.016, 16]} />
          <meshStandardMaterial color={closed ? '#16a34a' : '#dc2626'} roughness={0.35} metalness={0.1} />
        </mesh>
      ) : (
        <group ref={leverRef} position={[0, 0.038, 0]}>
          <mesh castShadow position={[0, 0.016, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.032, 8]} />
            <meshStandardMaterial color={closed ? '#16a34a' : '#dc2626'} metalness={0.5} roughness={0.3} />
          </mesh>
          <mesh castShadow position={[0, 0.034, 0]}>
            <sphereGeometry args={[0.007, 10, 10]} />
            <meshStandardMaterial color={closed ? '#16a34a' : '#dc2626'} metalness={0.5} roughness={0.3} />
          </mesh>
        </group>
      )}
    </group>
  );
}

function BuzzerBody({ active }: { active: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const s = active ? 1 + Math.sin(clock.getElapsedTime() * 20) * 0.1 : 1;
    ref.current.scale.setScalar(s);
  });
  return (
    <group ref={ref}>
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.038, 20]} />
        <meshStandardMaterial color="#0f766e" roughness={0.45} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.003, 16]} />
        <meshStandardMaterial color="#0a2e2b" roughness={0.7} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[Math.cos((i / 4) * Math.PI * 2) * 0.014, 0.042, Math.sin((i / 4) * Math.PI * 2) * 0.014]}>
          <cylinderGeometry args={[0.003, 0.003, 0.002, 6]} />
          <meshStandardMaterial color="#000" />
        </mesh>
      ))}
    </group>
  );
}

function MotorBody({ active }: { active: boolean }) {
  const shaftRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!shaftRef.current) return;
    if (active) shaftRef.current.rotation.x = clock.getElapsedTime() * 10;
  });
  return (
    <group>
      <mesh position={[0, 0.032, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.032, 0.032, 0.075, 20]} />
        <meshStandardMaterial color="#475569" metalness={0.55} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.032, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.033, 0.033, 0.01, 20]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh ref={shaftRef} position={[0, 0.032, 0.045]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.006, 0.006, 0.03, 10]} />
        <meshStandardMaterial color="#d4d4d8" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

export interface Breadboard3DSceneProps {
  placements: ComponentPlacement[];
  wires: WireConnection[];
  pendingPos: BreadboardPosition | null;
  switchStates: Record<string, boolean>;
  evaluation: CircuitEvaluation;
  timing: { periodSeconds: number; dutyCycle: number } | null;
  onPositionClick: (pos: BreadboardPosition) => void;
  onComponentClick: (instanceId: string, kind: string) => void;
  onWireClick: (wireId: string) => void;
  deleteMode: boolean;
  height?: number;
}

export default function Breadboard3DScene({
  placements, wires, pendingPos, switchStates, evaluation, timing,
  onPositionClick, onComponentClick, onWireClick, deleteMode, height = 480,
}: Breadboard3DSceneProps) {
  const [hoveredHole, setHoveredHole] = useState<string | null>(null);
  const [hoveredComp, setHoveredComp] = useState<string | null>(null);
  const needsContinuousAnimation = !!timing || evaluation.loads.some((l) => l.active);

  return (
    <SafeR3FCanvas height={height} shadows>
      <ContinuousInvalidate active={needsContinuousAnimation} />
      {/* A local, network-free studio light rig -- key + fill + rim, the
          same recipe Model3DViewer.tsx uses instead of drei's Environment
          (which needs an external HDR fetch this app deliberately avoids). */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[2.6, 4.6, 2.2]} intensity={1.25} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-3, 2.4, -2.2]} intensity={0.45} color="#cfe0ff" />
      <directionalLight position={[0, -1.5, 3]} intensity={0.2} />
      <OrthographicCamera makeDefault position={[3.4, 3.7, 3.4]} zoom={195} near={0.1} far={30} />

      {/* Board -- rounded, two-tone, modern */}
      <RoundedBox args={[BOARD_W + 0.24, 0.09, BOARD_D + 1.1]} radius={0.022} smoothness={4} position={[0, -0.05, 0]} receiveShadow castShadow>
        <meshStandardMaterial color="#efeadd" roughness={0.55} metalness={0.04} />
      </RoundedBox>
      <RoundedBox args={[BOARD_W + 0.3, 0.028, BOARD_D + 1.16]} radius={0.018} smoothness={4} position={[0, -0.11, 0]} receiveShadow>
        <meshStandardMaterial color="#b9b19c" roughness={0.7} metalness={0.05} />
      </RoundedBox>
      {/* Gutter channel */}
      <mesh position={[(colX('e') + colX('f')) / 2, 0.001, 0]}>
        <boxGeometry args={[0.028, 0.004, BOARD_D + 0.06]} />
        <meshStandardMaterial color="#00000028" roughness={1} />
      </mesh>

      {/* Power rails -- modern bus-bar strips with a live glow accent */}
      {(['top-pos', 'top-neg', 'bottom-pos', 'bottom-neg'] as const).map((rail) => {
        const isHot = hoveredHole === `rail:${rail}` || (pendingPos != null && 'rail' in pendingPos && pendingPos.rail === rail);
        const isPos = rail.includes('pos');
        return (
          <mesh
            key={rail}
            position={[0, 0.003, railZ(rail)]}
            castShadow
            onClick={(e) => { e.stopPropagation(); onPositionClick({ rail }); }}
            onPointerOver={(e) => { e.stopPropagation(); setHoveredHole(`rail:${rail}`); document.body.style.cursor = 'pointer'; }}
            onPointerOut={(e) => { e.stopPropagation(); setHoveredHole(null); document.body.style.cursor = 'auto'; }}
          >
            <boxGeometry args={[BOARD_W + 0.16, 0.014, 0.1]} />
            <meshStandardMaterial
              color={isPos ? '#7a2020' : '#20242c'}
              metalness={0.5} roughness={0.3}
              emissive={isPos ? '#dc2626' : '#475569'}
              emissiveIntensity={isHot ? 0.85 : 0.16}
            />
          </mesh>
        );
      })}

      {/* Hole grid -- socket ring + real metal-look pin */}
      {Array.from({ length: ROWS }, (_, i) => i + 1).map((row) =>
        COLS.map((col) => {
          const key = `hole:${row}:${col}`;
          const isPending = pendingPos != null && !('rail' in pendingPos) && pendingPos.row === row && pendingPos.col === col;
          const isHovered = hoveredHole === key;
          const x = colX(col);
          const z = rowZ(row);
          const dotR = isPending ? 0.032 : isHovered ? 0.027 : 0.017;
          return (
            <group key={key} position={[x, 0, z]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0025, 0]}>
                <ringGeometry args={[0.026, 0.036, 20]} />
                <meshStandardMaterial color="#8a8578" roughness={0.65} side={THREE.DoubleSide} />
              </mesh>
              <mesh
                position={[0, 0.004, 0]}
                onClick={(e) => { e.stopPropagation(); onPositionClick({ row, col }); }}
                onPointerOver={(e) => { e.stopPropagation(); setHoveredHole(key); document.body.style.cursor = 'pointer'; }}
                onPointerOut={(e) => { e.stopPropagation(); setHoveredHole(null); document.body.style.cursor = 'auto'; }}
              >
                <cylinderGeometry args={[dotR, dotR, 0.012, 12]} />
                <meshStandardMaterial color={isPending || isHovered ? '#f59e0b' : '#4b4a45'} metalness={0.45} roughness={0.45} />
              </mesh>
            </group>
          );
        }),
      )}

      {/* Wires -- real arched jumper cables with connector boots */}
      {wires.map((w) => {
        const [p1, p2] = resolvePairVecs(w.from, w.to, 0.014);
        return <WireCable key={w.id} a={p1} b={p2} color={w.colorHex} deleteMode={deleteMode} onClick={() => onWireClick(w.id)} />;
      })}

      {/* Placed components */}
      {placements.map((p) => {
        const spec = ELECTRONICS_COMPONENTS.find((c) => c.id === p.componentId);
        if (!spec) return null;
        const pinIds = Object.keys(p.pinPositions);
        if (pinIds.length < 2) return null;
        const posA = p.pinPositions[pinIds[0]];
        const posB = p.pinPositions[pinIds[1]];
        const [pin1, pin2] = resolvePairVecs(posA, posB, 0.012);
        const mid = pin1.clone().add(pin2).multiplyScalar(0.5);
        const angleY = Math.atan2(pin2.z - pin1.z, pin2.x - pin1.x);

        const ledResult = evaluation.leds.find((l) => l.instanceId === p.instanceId);
        const loadResult = evaluation.loads.find((l) => l.instanceId === p.instanceId);
        const isClosed = !!switchStates[p.instanceId];
        const ohms = p.valueOverride?.resistanceOhms ?? spec.electrical?.resistanceOhms;
        const displaySpec: ComponentSpec = ohms != null && ohms !== spec.electrical?.resistanceOhms
          ? { ...spec, electrical: { ...spec.electrical, resistanceOhms: ohms } }
          : spec;

        let label = spec.name;
        if (ledResult) {
          label = ledResult.lit
            ? `${spec.name}: lit, ~${(ledResult.currentAmps * 1000).toFixed(1)} mA`
            : `${spec.name}: dark -- ${{
                'no-closed-path': 'no complete circuit path yet', reversed: 'wired backwards -- flip it around',
                'short-circuit': 'no resistor -- would burn out', 'over-current': 'current too high for this LED',
              }[ledResult.issue ?? 'no-closed-path']}`;
        } else if (loadResult) label = `${spec.name}: ${loadResult.active ? 'active' : 'off'}`;
        else if (spec.kind === 'switch-spst' || spec.kind === 'push-button') label = `${spec.name}: ${isClosed ? 'closed (on)' : 'open (off)'}`;

        const bodyScale = BODY_SCALE_BY_KIND[spec.kind];

        return (
          <group key={p.instanceId}>
            <InteractiveRod a={pin1} b={pin2} radius={0.005} color="#9ca3af" metalness={0.6} roughness={0.35} />
            <group position={mid} rotation={[0, -angleY, 0]}>
              <Hotspot3D
                id={p.instanceId} label={label} position={[0, 0, 0]}
                hoveredId={hoveredComp} onHover={setHoveredComp} onUnhover={() => setHoveredComp(null)}
                onClick={() => onComponentClick(p.instanceId, spec.kind)}
                sound={false}
              >
                {deleteMode && (
                  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
                    <ringGeometry args={[0.055, 0.068, 24]} />
                    <meshBasicMaterial color="#dc2626" side={THREE.DoubleSide} />
                  </mesh>
                )}

                {bodyScale != null ? (
                  <group scale={bodyScale}>
                    <ComponentModel spec={displaySpec} />
                  </group>
                ) : spec.kind === 'led' ? (
                  <LedGlow colorHex={spec.colorHex || '#dc2626'} lit={!!ledResult?.lit} blinkPeriodSeconds={timing ? Math.max(0.05, Math.min(10, timing.periodSeconds)) : null} blinkDuty={timing?.dutyCycle ?? 1} />
                ) : spec.kind === 'switch-spst' ? (
                  <SwitchBody closed={isClosed} isButton={false} />
                ) : spec.kind === 'push-button' ? (
                  <SwitchBody closed={isClosed} isButton />
                ) : spec.kind === 'buzzer' ? (
                  <BuzzerBody active={!!loadResult?.active} />
                ) : (spec.kind === 'dc-motor' || spec.kind === 'motor-servo' || spec.kind === 'motor-stepper') ? (
                  <MotorBody active={!!loadResult?.active} />
                ) : null}
              </Hotspot3D>
            </group>
          </group>
        );
      })}

      <ContactShadows position={[0, -0.145, 0]} opacity={0.4} scale={7} blur={2.4} far={0.6} resolution={512} />
      <OrbitControls enableDamping dampingFactor={0.12} enablePan minZoom={80} maxZoom={380} target={[0, 0, 0]} makeDefault />
    </SafeR3FCanvas>
  );
}
