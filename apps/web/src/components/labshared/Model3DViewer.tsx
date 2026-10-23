'use client';
import { Component, Fragment, ReactNode, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bounds, Center, Html, OrbitControls, useGLTF } from '@react-three/drei';
import { Box, Loader2, RefreshCw, RotateCcw } from 'lucide-react';

// A real, hold-and-spin 3D model viewer for any real, license-verified glTF
// file -- the direct upgrade from RotatableImageCard's single-photo tilt
// illusion (see that file's header) to an actual volumetric model the
// student can genuinely orbit around and inspect from any angle. Started
// as Robotics Lab's Robot3DViewer, renamed here once Chem Lab's Equipment
// Studio needed the exact same viewer for real apparatus models -- nothing
// about it is robot-specific, `src`/`alt` are the only inputs. Built
// deliberately defensive on two separate fronts:
//   1. Missing file: if the model isn't present yet (a real, licensed
//      download the user sources and drops into
//      public/models/<lab>/<name>/, see that folder's MANIFEST.md), this
//      renders a calm placeholder instead of crashing the page.
//   2. WebGL context loss ("THREE.WebGLRenderer: Context Lost", real
//      device console): confirmed via live testing that an *instant*
//      remount retry still failed identically -- so this isn't a one-off
//      timing race, it's the browser refusing the context outright. By
//      default WebGL drops a context rather than hand back a
//      degraded/software one; `failIfMajorPerformanceCaveat: false` below
//      is the standard opt-in to accept that degraded context instead of
//      losing it, which matters most exactly in restricted browsing modes
//      (private/incognito, VPN/proxy browsers) that limit GPU access.
//      Paired with delayed (not instant) auto-retries, since a real
//      driver-level recovery needs actual wall-clock time, not just a
//      same-tick remount.
export default function Model3DViewer({ src, alt, height = 260 }: { src: string; alt: string; height?: number }) {
  useGLTF.preload(src);
  return (
    <div className="space-y-2">
      <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 overflow-hidden" style={{ height }}>
        <ModelErrorBoundary alt={alt} retryDelaysMs={[400, 1000, 2000]}>
          <Suspense fallback={<LoadingPlaceholder />}>
            <Canvas
              frameloop="demand"
              camera={{ position: [0, 0, 5], fov: 45 }}
              dpr={[1, 1.5]}
              gl={{
                powerPreference: 'default',
                antialias: true,
                // Accept a degraded (e.g. software/ANGLE) context instead
                // of the browser refusing to create one at all -- the
                // default `true` is what causes an outright context loss
                // in GPU-restricted browsing modes.
                failIfMajorPerformanceCaveat: false,
              }}
              onCreated={({ gl }) => {
                // Telling the browser we intend to handle context loss
                // ourselves (instead of it silently giving up) makes it
                // more likely to actually fire 'webglcontextrestored'.
                gl.domElement.addEventListener('webglcontextlost', (e) => e.preventDefault());
              }}
            >
              {/* A locally-composed studio-style light rig, deliberately used
                  instead of drei's <Environment preset="studio">: that preset
                  fetches its HDR lighting map from a third-party CDN
                  (raw.githack.com/pmndrs/drei-assets) at runtime, and if that
                  fetch is slow, blocked, or unreachable, the load rejects and
                  every model on the page falls back to "coming soon" at once.
                  This rig needs no network call, so rendering never depends
                  on an external service being up. */}
              <ambientLight intensity={0.7} />
              <directionalLight position={[3, 4, 5]} intensity={1.2} />
              <directionalLight position={[-4, 2, -3]} intensity={0.5} />
              <directionalLight position={[0, -3, 2]} intensity={0.35} />
              <Bounds fit clip observe margin={1.3}>
                <Center>
                  <GltfModel src={src} />
                </Center>
              </Bounds>
              <OrbitControls enablePan={false} enableZoom autoRotate={false} makeDefault />
            </Canvas>
          </Suspense>
        </ModelErrorBoundary>
      </div>
      <p className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
        <RotateCcw className="w-3 h-3" /> Drag to rotate &middot; scroll or pinch to zoom
      </p>
    </div>
  );
}

function GltfModel({ src }: { src: string }) {
  const { scene } = useGLTF(src);
  return <primitive object={scene} />;
}

function LoadingPlaceholder() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="text-xs font-bold">Loading 3D model...</span>
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

function ComingSoonPlaceholder({ alt, onRetry }: { alt: string; onRetry: () => void }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400 p-4 text-center">
      <Box className="w-8 h-8" />
      <p className="text-xs font-bold">3D view interrupted</p>
      <p className="text-[10px] text-slate-400">{alt}</p>
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

// React error boundaries have no hook equivalent yet -- this is the
// standard, minimal class-based pattern, extended to auto-heal from
// WebGL context loss: each entry in `retryDelaysMs` is one auto-retry,
// waiting that many milliseconds (real wall-clock time, for the
// browser/driver to actually recover) before remounting the subtree via
// a key bump. A "Reconnecting..." placeholder shows during that wait, so
// it never looks broken or blank. Only once every auto-retry is
// exhausted does it show "3D view interrupted" with a manual "Tap to
// reload" -- for a user to trigger on a genuinely persistent problem
// (e.g. an actually missing or malformed file), separate from a
// recoverable context loss.
class ModelErrorBoundary extends Component<
  { children: ReactNode; alt: string; retryDelaysMs: number[] },
  { hasError: boolean; retrying: boolean; retryKey: number }
> {
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(props: { children: ReactNode; alt: string; retryDelaysMs: number[] }) {
    super(props);
    this.state = { hasError: false, retrying: false, retryKey: 0 };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.warn('Model3DViewer: model failed to load', error);
    const { retryDelaysMs } = this.props;
    if (this.state.retryKey < retryDelaysMs.length) {
      this.setState({ retrying: true });
      this.timer = setTimeout(() => {
        this.setState((s) => ({ hasError: false, retrying: false, retryKey: s.retryKey + 1 }));
      }, retryDelaysMs[this.state.retryKey]);
    }
  }
  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer);
  }
  handleManualRetry = () => {
    this.setState({ hasError: false, retrying: false, retryKey: 0 });
  };
  render() {
    if (this.state.hasError) {
      if (this.state.retrying) return <ReconnectingPlaceholder />;
      return <ComingSoonPlaceholder alt={this.props.alt} onRetry={this.handleManualRetry} />;
    }
    return <Fragment key={this.state.retryKey}>{this.props.children}</Fragment>;
  }
}
