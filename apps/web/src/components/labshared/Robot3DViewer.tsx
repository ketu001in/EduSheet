'use client';
import { Component, ReactNode, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bounds, Center, Html, OrbitControls, useGLTF } from '@react-three/drei';
import { Box, Loader2, RotateCcw } from 'lucide-react';

// A real, hold-and-spin 3D model viewer for any real, license-verified .glb
// file -- the direct upgrade from RotatableImageCard's single-photo tilt
// illusion (see that file's header) to an actual volumetric model the
// student can genuinely orbit around and inspect from any angle. Built
// deliberately defensive: if the model file isn't present yet (a real,
// licensed download the user sources and drops into
// public/models/robotics/, see that folder's MANIFEST.md), this renders a
// calm "coming soon" placeholder instead of crashing the page -- so this
// component is safe to wire into content today and will light up
// automatically the moment each file lands, no code changes needed.
export default function Robot3DViewer({ src, alt, height = 260 }: { src: string; alt: string; height?: number }) {
  return (
    <div className="space-y-2">
      <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 overflow-hidden" style={{ height }}>
        <ModelErrorBoundary fallback={<ComingSoonPlaceholder alt={alt} />}>
          <Suspense fallback={<LoadingPlaceholder />}>
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
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

function ComingSoonPlaceholder({ alt }: { alt: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400 p-4 text-center">
      <Box className="w-8 h-8" />
      <p className="text-xs font-bold">3D model coming soon</p>
      <p className="text-[10px] text-slate-400">{alt}</p>
    </div>
  );
}

// React error boundaries have no hook equivalent yet -- this is the
// standard, minimal class-based pattern, used ONLY to catch a failed
// model load (a missing file, a malformed GLTF) and swap in the calm
// placeholder above instead of taking down the whole page.
class ModelErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.warn('Robot3DViewer: model failed to load', error);
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
