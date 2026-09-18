'use client';
import { Component, Fragment, ReactNode, Suspense, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { Loader2, RefreshCw } from 'lucide-react';

// A genuinely 3D, rotatable decision-boundary visualization -- direct
// response to feedback that the flat SVG line felt "not playful". The
// decision boundary of a perceptron IS literally a plane in 3-D space
// (height = w1*x + w2*z + bias over the two input axes); rendering it as
// an actual tiltable plane, rather than a 2-D projection of it, is a
// genuinely stronger teaching aid, not decoration -- a student can
// physically rotate the view and see why a point sits "above" (class A)
// or "below" (class B) the surface, and watch the whole plane visibly
// tilt as training runs.
//
// Reuses the WebGL resilience settings hard-won on Model3DViewer.tsx
// (frameloop="demand", failIfMajorPerformanceCaveat, a retrying error
// boundary) independently rather than sharing that file directly, so
// this new component can't regress the already-verified model viewer.
export interface DecisionPlanePoint {
  x: number;
  z: number;
  correct: boolean;
  colorClass: 'a' | 'b';
}

export default function DecisionPlaneScene({
  points, w1, w2, bias, xMax, zMax, height = 260,
}: {
  points: DecisionPlanePoint[];
  w1: number; w2: number; bias: number;
  xMax: number; zMax: number;
  height?: number;
}) {
  return (
    <div className="space-y-1.5">
      <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/60 dark:to-slate-950 overflow-hidden" style={{ height }}>
        <SceneErrorBoundary>
          <Suspense fallback={<LoadingPlaceholder />}>
            <Canvas
              frameloop="demand"
              camera={{ position: [4.5, 3.5, 4.5], fov: 42 }}
              dpr={[1, 1.5]}
              gl={{ powerPreference: 'default', antialias: true, failIfMajorPerformanceCaveat: false }}
              onCreated={({ gl }) => {
                gl.domElement.addEventListener('webglcontextlost', (e) => e.preventDefault());
              }}
            >
              <ambientLight intensity={0.8} />
              <directionalLight position={[3, 5, 4]} intensity={1.1} />
              <directionalLight position={[-3, 2, -2]} intensity={0.4} />
              <PlaneMesh w1={w1} w2={w2} bias={bias} xMax={xMax} zMax={zMax} />
              <SeaLevelGrid />
              {points.map((p, i) => (
                <PointMarker key={i} x={p.x} z={p.z} xMax={xMax} zMax={zMax} w1={w1} w2={w2} bias={bias} correct={p.correct} colorClass={p.colorClass} />
              ))}
              {/* frameloop="demand" (deliberate WebGL-stability choice, see
                  Model3DViewer's header for the full incident writeup) means
                  autoRotate can't animate on its own -- OrbitControls'
                  drag-to-orbit still invalidates and re-renders correctly,
                  it just needs the visitor's hand rather than ticking on its
                  own, hence the caption below instead of a spinning demo. */}
              <OrbitControls enablePan={false} enableZoom makeDefault />
            </Canvas>
          </Suspense>
        </SceneErrorBoundary>
      </div>
      <p className="text-center text-[10px] text-slate-400">Drag to rotate &middot; scroll or pinch to zoom</p>
    </div>
  );
}

// Maps a data-space coordinate to the fixed [-2.2, 2.2] display range, and
// squashes the (potentially unbounded, during real training) weighted-sum
// output smoothly into a always-reasonable visual height with tanh --
// monotonic, so sign and relative tilt direction stay honest; the exact
// raw f(x) value is always shown as text alongside every scene that uses
// this component, never hidden behind the squashed visual.
function toDisplay(x: number, z: number, xMax: number, zMax: number, w1: number, w2: number, bias: number) {
  const dispX = -2.2 + 4.4 * (x / xMax);
  const dispZ = -2.2 + 4.4 * (z / zMax);
  const raw = w1 * x + w2 * z + bias;
  const dispY = 2 * Math.tanh(raw / 4);
  return { dispX, dispY, dispZ, raw };
}

function PlaneMesh({ w1, w2, bias, xMax, zMax }: { w1: number; w2: number; bias: number; xMax: number; zMax: number }) {
  const segments = 14;
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];
    for (let i = 0; i <= segments; i++) {
      for (let j = 0; j <= segments; j++) {
        const x = (i / segments) * xMax;
        const z = (j / segments) * zMax;
        const { dispX, dispY, dispZ } = toDisplay(x, z, xMax, zMax, w1, w2, bias);
        positions.push(dispX, dispY, dispZ);
        // Amber above the zero-plane (predicted class A), sky blue below (class B).
        const c = dispY >= 0 ? [0.96, 0.62, 0.09] : [0.16, 0.55, 0.95];
        colors.push(...c);
      }
    }
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segments; j++) {
        const a = i * (segments + 1) + j;
        const b = a + 1;
        const c = a + (segments + 1);
        const d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }
    geo.setIndex(indices);
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, [w1, w2, bias, xMax, zMax]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial vertexColors transparent opacity={0.55} side={THREE.DoubleSide} roughness={0.4} />
    </mesh>
  );
}

function SeaLevelGrid() {
  // A flat reference plane at y=0 -- makes it visually obvious how far
  // (and which direction) the decision plane has tilted away from neutral.
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[4.6, 4.6, 1, 1]} />
      <meshBasicMaterial color="#94a3b8" transparent opacity={0.12} side={THREE.DoubleSide} />
    </mesh>
  );
}

function PointMarker({ x, z, xMax, zMax, w1, w2, bias, correct, colorClass }: { x: number; z: number; xMax: number; zMax: number; w1: number; w2: number; bias: number; correct: boolean; colorClass: 'a' | 'b' }) {
  const { dispX, dispY, dispZ } = toDisplay(x, z, xMax, zMax, w1, w2, bias);
  return (
    <group position={[dispX, dispY, dispZ]}>
      <mesh>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color={colorClass === 'a' ? '#f59e0b' : '#0ea5e9'} emissive={colorClass === 'a' ? '#f59e0b' : '#0ea5e9'} emissiveIntensity={0.3} />
      </mesh>
      {!correct && (
        <mesh>
          <ringGeometry args={[0.16, 0.2, 24]} />
          <meshBasicMaterial color="#dc2626" side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

function LoadingPlaceholder() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="text-xs font-bold">Loading 3D scene...</span>
      </div>
    </Html>
  );
}

function ReconnectingPlaceholder() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400 p-4 text-center">
      <Loader2 className="w-6 h-6 animate-spin" />
      <p className="text-xs font-bold">Reconnecting 3D view...</p>
    </div>
  );
}

function InterruptedPlaceholder({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400 p-4 text-center">
      <p className="text-xs font-bold">3D view interrupted</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-1 inline-flex items-center gap-1 rounded-full border border-slate-300 dark:border-slate-700 px-3 py-1 text-[10px] font-bold text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <RefreshCw className="w-3 h-3" /> Tap to reload
      </button>
    </div>
  );
}

// Same WebGL-context-loss auto-heal pattern verified on Model3DViewer.tsx
// (see that file's header for the full incident writeup): delayed
// auto-retries, silent while budget remains, a manual fallback once
// exhausted.
class SceneErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; retrying: boolean; retryKey: number }> {
  private timer: ReturnType<typeof setTimeout> | null = null;
  private delays = [400, 1000, 2000];
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, retrying: false, retryKey: 0 };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.warn('DecisionPlaneScene: failed to render', error);
    if (this.state.retryKey < this.delays.length) {
      this.setState({ retrying: true });
      this.timer = setTimeout(() => {
        this.setState((s) => ({ hasError: false, retrying: false, retryKey: s.retryKey + 1 }));
      }, this.delays[this.state.retryKey]);
    }
  }
  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer);
  }
  handleManualRetry = () => this.setState({ hasError: false, retrying: false, retryKey: 0 });
  render() {
    if (this.state.hasError) {
      if (this.state.retrying) return <ReconnectingPlaceholder />;
      return <InterruptedPlaceholder onRetry={this.handleManualRetry} />;
    }
    return <Fragment key={this.state.retryKey}>{this.props.children}</Fragment>;
  }
}
