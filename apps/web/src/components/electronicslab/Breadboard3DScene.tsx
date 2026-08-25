'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera, Html } from '@react-three/drei';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';
import { Hotspot3D } from '@/components/physicslab/Hotspot3D';
import { ELECTRONICS_COMPONENTS, type ComponentPlacement, type WireConnection, type BreadboardPosition } from '@edusheets/content';
import { resistorColorBands, BAND_HEX, type CircuitEvaluation } from '@/lib/circuitEngine';

// The real, hands-on breadboard, rendered as a genuine 3D scene -- a
// physical board the student can orbit, zoom, and click into, not a flat
// schematic. Every click still resolves through the exact same real
// BreadboardPosition/instanceId model BreadboardWorkbench.tsx already
// uses (this component owns NO circuit logic of its own -- placements,
// wires, and evaluation all come in as props and every interaction is
// reported back up via the same onPositionClick/onComponentClick/
// onWireClick handlers the SVG version used) -- only the RENDERING
// target changed, so the verified evaluateCircuit() pipeline underneath
// is untouched. Same orthographic-camera + OrbitControls recipe already
// proven on this app's other wide, flat grids (Periodic Table, the
// Cupboard shelf and drawers) -- a perspective camera genuinely bows a
// layout this wide and flat.

const COLS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'] as const;
const ROWS = 20;
const HOLE_GAP = 0.18;
const GUTTER = 0.16;
const BOARD_W = 9 * HOLE_GAP + GUTTER;
const BOARD_D = (ROWS - 1) * HOLE_GAP;
const CENTER_X = BOARD_W / 2;
const CENTER_Z = BOARD_D / 2;

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
function posKey(pos: BreadboardPosition): string {
  return 'rail' in pos ? `rail:${pos.rail}` : `hole:${pos.row}:${pos.col}`;
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

// A colored rod between two points that also reports clicks/hover --
// Rod (physicslab/Hotspot3D.tsx) already does the quaternion alignment
// but has no interaction props, so this is a local sibling rather than a
// modification of that shared helper.
function InteractiveRod({ a, b, radius, color, onClick, title }: {
  a: THREE.Vector3; b: THREE.Vector3; radius: number; color: string; onClick?: () => void; title?: string;
}) {
  const mid = useMemo(() => a.clone().add(b).multiplyScalar(0.5), [a, b]);
  const length = a.distanceTo(b);
  const quaternion = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize()), [a, b]);
  return (
    <mesh position={mid} quaternion={quaternion} onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
      <cylinderGeometry args={[radius, radius, Math.max(length, 0.001), 10]} />
      <meshStandardMaterial color={color} roughness={0.5} />
      {title && <Html center distanceFactor={8} style={{ pointerEvents: 'none' }}><span style={{ display: 'none' }}>{title}</span></Html>}
    </mesh>
  );
}

// SafeR3FCanvas runs frameloop="demand" (renders only when explicitly
// invalidated -- a real, deliberate perf choice for every other scene in
// this app, most of which are static until hovered/clicked). A blinking
// LED or a spinning motor needs a REAL continuous tick, which useFrame
// alone won't provide in demand mode (nothing schedules a next frame on
// its own). This drives that continuous tick from outside R3F's own
// loop via a genuine requestAnimationFrame, calling the real invalidate()
// R3F exposes for exactly this -- and stops it the instant nothing on
// the board actually needs to animate, so an idle board stays cheap.
function ContinuousInvalidate({ active }: { active: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const tick = () => { invalidate(); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, invalidate]);
  return null;
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
    matRef.current.emissiveIntensity = on ? 0.9 : 0;
    matRef.current.opacity = on ? 1 : 0.55;
  });
  return (
    <mesh position={[0, 0.05, 0]} castShadow>
      <sphereGeometry args={[0.045, 16, 16]} />
      <meshStandardMaterial ref={matRef} color={lit ? colorHex : '#6b7280'} emissive={colorHex} transparent roughness={0.4} />
    </mesh>
  );
}

function PulsingBody({ active, color, shape, speed = 8 }: { active: boolean; color: string; shape: 'cylinder' | 'box'; speed?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    if (!active) { ref.current.scale.setScalar(1); ref.current.rotation.y = 0; return; }
    if (shape === 'cylinder') ref.current.rotation.y = clock.getElapsedTime() * speed; // motor: real spin
    else { const s = 1 + Math.sin(clock.getElapsedTime() * 18) * 0.12; ref.current.scale.setScalar(s); } // buzzer: real pulse
  });
  return (
    <mesh ref={ref} position={[0, 0.045, 0]} castShadow>
      {shape === 'cylinder' ? <cylinderGeometry args={[0.045, 0.045, 0.07, 16]} /> : <boxGeometry args={[0.08, 0.06, 0.08]} />}
      <meshStandardMaterial color={color} roughness={0.5} />
    </mesh>
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
}

export default function Breadboard3DScene({
  placements, wires, pendingPos, switchStates, evaluation, timing,
  onPositionClick, onComponentClick, onWireClick, deleteMode,
}: Breadboard3DSceneProps) {
  const [hoveredHole, setHoveredHole] = useState<string | null>(null);
  const [hoveredComp, setHoveredComp] = useState<string | null>(null);

  const needsContinuousAnimation = !!timing || evaluation.loads.some((l) => l.active);

  return (
    <SafeR3FCanvas height={360} shadows>
      <ContinuousInvalidate active={needsContinuousAnimation} />
      <ambientLight intensity={0.85} />
      <directionalLight position={[2.5, 4, 2]} intensity={1.1} castShadow />
      <OrthographicCamera makeDefault position={[3.2, 3.6, 3.2]} zoom={220} near={0.1} far={30} />

      {/* Board body */}
      <mesh position={[0, -0.035, 0]} receiveShadow>
        <boxGeometry args={[BOARD_W + 0.2, 0.07, BOARD_D + 1.05]} />
        <meshStandardMaterial color="#e8e4da" roughness={0.85} />
      </mesh>
      {/* Gutter marker */}
      <mesh position={[(colX('e') + colX('f')) / 2, 0.001, 0]}>
        <boxGeometry args={[0.02, 0.001, BOARD_D + 0.05]} />
        <meshStandardMaterial color="#00000022" />
      </mesh>

      {/* Power rails */}
      {(['top-pos', 'top-neg', 'bottom-pos', 'bottom-neg'] as const).map((rail) => (
        <mesh
          key={rail}
          position={[0, 0.002, railZ(rail)]}
          onClick={(e) => { e.stopPropagation(); onPositionClick({ rail }); }}
          onPointerOver={(e) => { e.stopPropagation(); setHoveredHole(`rail:${rail}`); document.body.style.cursor = 'pointer'; }}
          onPointerOut={(e) => { e.stopPropagation(); setHoveredHole(null); document.body.style.cursor = 'auto'; }}
        >
          <boxGeometry args={[BOARD_W + 0.15, 0.008, 0.1]} />
          <meshStandardMaterial
            color={rail.includes('pos') ? '#dc2626' : '#1a1a1a'}
            opacity={hoveredHole === `rail:${rail}` || (pendingPos && 'rail' in pendingPos && pendingPos.rail === rail) ? 0.65 : 0.28}
            transparent
          />
        </mesh>
      ))}

      {/* Hole grid */}
      {Array.from({ length: ROWS }, (_, i) => i + 1).map((row) =>
        COLS.map((col) => {
          const key = `hole:${row}:${col}`;
          const isPending = pendingPos && !('rail' in pendingPos) && pendingPos.row === row && pendingPos.col === col;
          const isHovered = hoveredHole === key;
          return (
            <mesh
              key={key}
              position={[colX(col), 0.002, rowZ(row)]}
              onClick={(e) => { e.stopPropagation(); onPositionClick({ row, col }); }}
              onPointerOver={(e) => { e.stopPropagation(); setHoveredHole(key); document.body.style.cursor = 'pointer'; }}
              onPointerOut={(e) => { e.stopPropagation(); setHoveredHole(null); document.body.style.cursor = 'auto'; }}
            >
              <cylinderGeometry args={[isPending ? 0.026 : isHovered ? 0.022 : 0.014, isPending ? 0.026 : isHovered ? 0.022 : 0.014, 0.01, 10]} />
              <meshStandardMaterial color={isPending ? '#f59e0b' : isHovered ? '#f59e0b' : '#78716c'} />
            </mesh>
          );
        }),
      )}

      {/* Wires -- real 3D leads arching slightly above the board */}
      {wires.map((w) => {
        const [p1, p2] = resolvePairVecs(w.from, w.to, 0.028);
        return (
          <InteractiveRod
            key={w.id}
            a={p1} b={p2}
            radius={deleteMode ? 0.011 : 0.008}
            color={w.colorHex}
            onClick={() => onWireClick(w.id)}
          />
        );
      })}

      {/* Placed components */}
      {placements.map((p) => {
        const spec = ELECTRONICS_COMPONENTS.find((c) => c.id === p.componentId);
        if (!spec) return null;
        const pinIds = Object.keys(p.pinPositions);
        if (pinIds.length < 2) return null;
        const posA = p.pinPositions[pinIds[0]];
        const posB = p.pinPositions[pinIds[1]];
        const [pin1, pin2] = resolvePairVecs(posA, posB, 0.014);
        const mid = pin1.clone().add(pin2).multiplyScalar(0.5);
        const angleY = Math.atan2(pin2.z - pin1.z, pin2.x - pin1.x);

        const ledResult = evaluation.leds.find((l) => l.instanceId === p.instanceId);
        const loadResult = evaluation.loads.find((l) => l.instanceId === p.instanceId);
        const isClosed = !!switchStates[p.instanceId];
        const ohms = p.valueOverride?.resistanceOhms ?? spec.electrical?.resistanceOhms;
        const bands = spec.kind === 'resistor' && ohms ? resistorColorBands(ohms) : null;

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

        return (
          <group key={p.instanceId}>
            <InteractiveRod a={pin1} b={pin2} radius={0.006} color="#71717a" />
            <group position={mid} rotation={[0, -angleY, 0]}>
              <Hotspot3D
                id={p.instanceId} label={label} position={[0, 0, 0]}
                hoveredId={hoveredComp} onHover={setHoveredComp} onUnhover={() => setHoveredComp(null)}
                onClick={() => onComponentClick(p.instanceId, spec.kind)}
                sound={false}
              >
                {deleteMode && (
                  <mesh position={[0, 0.045, 0]}>
                    <ringGeometry args={[0.05, 0.062, 20]} />
                    <meshBasicMaterial color="#dc2626" side={THREE.DoubleSide} />
                  </mesh>
                )}

                {spec.kind === 'resistor' && (
                  <group>
                    <mesh position={[0, 0.03, 0]} castShadow>
                      <boxGeometry args={[0.09, 0.045, 0.045]} />
                      <meshStandardMaterial color="#D2B48C" roughness={0.6} />
                    </mesh>
                    {bands && [bands.band1, bands.band2, bands.multiplier].map((b, i) => (
                      <mesh key={i} position={[-0.028 + i * 0.02, 0.03, 0.023]}>
                        <boxGeometry args={[0.008, 0.047, 0.001]} />
                        <meshStandardMaterial color={BAND_HEX[b]} />
                      </mesh>
                    ))}
                  </group>
                )}

                {spec.kind === 'led' && <LedGlow colorHex={spec.colorHex || '#dc2626'} lit={!!ledResult?.lit} blinkPeriodSeconds={timing ? Math.max(0.05, Math.min(10, timing.periodSeconds)) : null} blinkDuty={timing?.dutyCycle ?? 1} />}

                {(spec.kind === 'switch-spst' || spec.kind === 'push-button') && (
                  <mesh position={[0, 0.025, 0]} castShadow>
                    <boxGeometry args={[0.06, 0.05, 0.06]} />
                    <meshStandardMaterial color={isClosed ? '#16a34a' : '#dc2626'} roughness={0.5} />
                  </mesh>
                )}

                {spec.kind === 'buzzer' && <PulsingBody active={!!loadResult?.active} color="#0f766e" shape="box" />}
                {(spec.kind === 'dc-motor' || spec.kind === 'motor-servo' || spec.kind === 'motor-stepper') && <PulsingBody active={!!loadResult?.active} color="#475569" shape="cylinder" />}

                {(spec.kind === 'battery-9v' || spec.kind === 'battery-6v') && (
                  <mesh position={[0, 0.035, 0]} castShadow>
                    <boxGeometry args={[0.12, 0.07, 0.06]} />
                    <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
                  </mesh>
                )}
                {spec.kind === 'timer-555' && (
                  <mesh position={[0, 0.03, 0]} castShadow>
                    <boxGeometry args={[0.07, 0.05, 0.07]} />
                    <meshStandardMaterial color="#1e293b" roughness={0.5} />
                  </mesh>
                )}
                {spec.kind === 'capacitor' && (
                  <mesh position={[0, 0.035, 0]} castShadow>
                    <boxGeometry args={[0.055, 0.07, 0.03]} />
                    <meshStandardMaterial color="#2563eb" roughness={0.4} />
                  </mesh>
                )}
              </Hotspot3D>
            </group>
          </group>
        );
      })}

      <OrbitControls enablePan={true} minZoom={90} maxZoom={420} target={[0, 0, 0]} makeDefault />
    </SafeR3FCanvas>
  );
}
