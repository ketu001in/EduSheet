'use client';
import { Component, Fragment, ReactNode, Suspense } from 'react';
import { Canvas, CanvasProps } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Loader2, RefreshCw } from 'lucide-react';

// A shared, hardened Canvas wrapper for AI Lab's 3D scenes -- extracted
// once DecisionPlaneScene.tsx's pattern was about to be duplicated a
// third time (kNN, k-means). Carries forward the WebGL resilience
// settings verified live on Model3DViewer.tsx and DecisionPlaneScene.tsx
// (frameloop="demand", failIfMajorPerformanceCaveat: false, a delayed
// auto-retry error boundary) -- new 3D scenes should wrap their
// lights/meshes/controls in this rather than re-deriving the same
// settings from scratch.
export default function SafeR3FCanvas({
  height = 280, children, camera, shadows = false,
}: {
  height?: number;
  children: ReactNode;
  camera?: CanvasProps['camera'];
  // Off by default (existing scenes are unaffected) -- opt in per-scene
  // for ones that actually place objects on a surface, where a real
  // shadow is a genuine, cheap depth cue, not decoration.
  shadows?: boolean;
}) {
  return (
    <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/60 dark:to-slate-950 overflow-hidden" style={{ height }}>
      <SceneErrorBoundary>
        <Suspense fallback={<LoadingPlaceholder />}>
          <Canvas
            frameloop="demand"
            shadows={shadows}
            camera={camera ?? { position: [4.5, 3.5, 4.5], fov: 42 }}
            dpr={[1, 1.5]}
            gl={{ powerPreference: 'default', antialias: true, failIfMajorPerformanceCaveat: false }}
            onCreated={({ gl }) => {
              gl.domElement.addEventListener('webglcontextlost', (e) => e.preventDefault());
            }}
          >
            {children}
          </Canvas>
        </Suspense>
      </SceneErrorBoundary>
    </div>
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
    console.warn('SafeR3FCanvas: scene failed to render', error);
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
