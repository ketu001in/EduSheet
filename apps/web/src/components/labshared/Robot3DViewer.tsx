'use client';
import { Component, Fragment, ReactNode, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bounds, Center, Html, OrbitControls, useGLTF } from '@react-three/drei';
import { Box, Loader2, RefreshCw, RotateCcw } from 'lucide-react';

// A real, hold-and-spin 3D model viewer for any real, license-verified glTF
// file -- the direct upgrade from RotatableImageCard's single-photo tilt
// illusion (see that file's header) to an actual volumetric model the
// student can genuinely orbit around and inspect from any angle. Built
// deliberately defensive on two separate fronts:
//   1. Missing file: if the model isn't present yet (a real, licensed
//      download the user sources and drops into public/models/robotics/,
//      see that folder's MANIFEST.md), this renders a calm placeholder
//      instead of crashing the page.
//   2. WebGL context loss on the *first* canvas of a session: confirmed
//      via a real device's console ("THREE.WebGLRenderer: Context Lost"
//      immediately followed by "R3F: Hooks can only be used within the
//      Canvas component!"), reproducing reliably on first open and never
//      on retry. That pattern is a race, not a hardware ceiling: the GLTF
//      fetch is still in flight when the GPU process (cold-starting for
//      this page's very first WebGL context) hiccups and R3F tears down
//      its internal context; the fetch then resolves into a torn-down
//      tree. On retry the file is already cached, so it resolves
//      instantly with no window left for that race -- which is exactly
//      why a manual retry always fixed it. Two fixes close the gap:
//      `useGLTF.preload` starts the fetch immediately, before the Canvas
//      even mounts, shrinking that race window; and the boundary below
//      auto-heals once on its own (silently remounting, no user tap
//      needed) since by then the file is cached and the retry is instant.
export default function Robot3DViewer({ src, alt, height = 260 }: { src: string; alt: string; height?: number }) {
  useGLTF.preload(src);
  return (
    <div className="space-y-2">
      <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 overflow-hidden" style={{ height }}>
        <ModelErrorBoundary alt={alt} maxAutoRetries={1}>
          <Suspense fallback={<LoadingPlaceholder />}>
            <Canvas
              frameloop="demand"
              camera={{ position: [0, 0, 5], fov: 45 }}
              dpr={[1, 1.5]}
              gl={{ powerPreference: 'default', antialias: true }}
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
// standard, minimal class-based pattern, extended to auto-heal from the
// cold-start WebGL race described above: the first `maxAutoRetries`
// failures remount the subtree silently (no fallback UI shown -- by
// then the model is already cached, via useGLTF.preload above, so the
// remount resolves instantly); only a failure *after* that budget is
// exhausted shows the "3D view interrupted" placeholder, with a manual
// "Tap to reload" for a user to trigger on a genuinely persistent
// problem (e.g. an actually missing or malformed file).
class ModelErrorBoundary extends Component<
  { children: ReactNode; alt: string; maxAutoRetries?: number },
  { hasError: boolean; retryKey: number }
> {
  constructor(props: { children: ReactNode; alt: string; maxAutoRetries?: number }) {
    super(props);
    this.state = { hasError: false, retryKey: 0 };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.warn('Robot3DViewer: model failed to load', error);
    const maxAutoRetries = this.props.maxAutoRetries ?? 1;
    if (this.state.retryKey < maxAutoRetries) {
      this.setState((s) => ({ hasError: false, retryKey: s.retryKey + 1 }));
    }
  }
  handleManualRetry = () => {
    this.setState({ hasError: false, retryKey: 0 });
  };
  render() {
    const maxAutoRetries = this.props.maxAutoRetries ?? 1;
    if (this.state.hasError) {
      if (this.state.retryKey >= maxAutoRetries) {
        return <ComingSoonPlaceholder alt={this.props.alt} onRetry={this.handleManualRetry} />;
      }
      // Still within the auto-retry budget: componentDidCatch above is
      // about to clear hasError and bump retryKey in the same commit
      // cycle, so this renders for effectively zero perceptible time.
      return null;
    }
    return <Fragment key={this.state.retryKey}>{this.props.children}</Fragment>;
  }
}
