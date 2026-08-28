'use client';
import { useMemo, useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import { Zap, Play, RefreshCw, Sparkles } from 'lucide-react';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';
import { STUDY_HABITS_POINTS, assignToCentroids, updateCentroids, Centroid } from '@/lib/aiCodingEngine';

// A genuinely 3-feature toy dataset (hours studied, hours slept, screen
// time) -- true 3D, not a fake third axis bolted on for visual effect.
// Seeded so the first couple of "Run Iteration" clicks visibly reshuffle
// before settling, rather than converging instantly.
const INITIAL_CENTROIDS: Centroid[] = [{ x: 5, y: 7, z: 2.5 }, { x: 6, y: 6.5, z: 2 }];
const CLUSTER_COLOR = ['#4f46e5', '#f97316'];

const RANGES = (() => {
  const xs = STUDY_HABITS_POINTS.map((p) => p.x), ys = STUDY_HABITS_POINTS.map((p) => p.y), zs = STUDY_HABITS_POINTS.map((p) => p.z);
  return {
    x: [Math.min(...xs) - 0.5, Math.max(...xs) + 0.5],
    y: [Math.min(...ys) - 0.5, Math.max(...ys) + 0.5],
    z: [Math.min(...zs) - 0.5, Math.max(...zs) + 0.5],
  };
})();
function toDisp(p: { x: number; y: number; z: number }) {
  const norm = (v: number, [lo, hi]: number[]) => -2 + 4 * ((v - lo) / (hi - lo));
  return [norm(p.x, RANGES.x), norm(p.y, RANGES.y), norm(p.z, RANGES.z)] as [number, number, number];
}

export default function KMeansScene() {
  const [centroids, setCentroids] = useState<Centroid[]>(INITIAL_CENTROIDS);
  const [iteration, setIteration] = useState(0);
  const [converged, setConverged] = useState(false);

  const assignments = useMemo(() => assignToCentroids(STUDY_HABITS_POINTS, centroids), [centroids]);

  const runIteration = () => {
    if (converged) return;
    const nextCentroids = updateCentroids(STUDY_HABITS_POINTS, assignments, 2, centroids);
    const moved = nextCentroids.some((c, i) => Math.abs(c.x - centroids[i].x) > 0.001 || Math.abs(c.y - centroids[i].y) > 0.001 || Math.abs(c.z - centroids[i].z) > 0.001);
    setCentroids(nextCentroids);
    setIteration((n) => n + 1);
    if (!moved) setConverged(true);
  };
  const reset = () => { setCentroids(INITIAL_CENTROIDS); setIteration(0); setConverged(false); };

  return (
    <div className="rounded-2xl border-2 border-primary-200 dark:border-primary-900 bg-gradient-to-br from-primary-50/60 via-white to-accent-50/40 dark:from-primary-950/20 dark:via-slate-950 dark:to-accent-950/10 p-4 md:p-5 space-y-3 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
        <Zap className="w-4 h-4 text-primary-600" /> Find Hidden Groups -- No Labels Given
      </div>
      <p className="text-center text-xs text-slate-500">Three real axes: hours studied, hours slept, hours of screen time -- no student is labeled, k-Means finds the two natural groups on its own. Rotate to see all 3 dimensions.</p>
      <SafeR3FCanvas height={300}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 5, 4]} intensity={1.1} />
        {STUDY_HABITS_POINTS.map((p, i) => {
          const [dx, dy, dz] = toDisp(p);
          const color = CLUSTER_COLOR[assignments[i]];
          return (
            <mesh key={i} position={[dx, dy, dz]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25} />
            </mesh>
          );
        })}
        {centroids.map((c, i) => {
          const [dx, dy, dz] = toDisp(c);
          return (
            <mesh key={i} position={[dx, dy, dz]}>
              <octahedronGeometry args={[0.22, 0]} />
              <meshStandardMaterial color={CLUSTER_COLOR[i]} emissive={CLUSTER_COLOR[i]} emissiveIntensity={0.6} wireframe={false} />
            </mesh>
          );
        })}
        <OrbitControls enablePan={false} enableZoom makeDefault />
      </SafeR3FCanvas>
      <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-slate-500 flex-wrap">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: CLUSTER_COLOR[0] }} /> Cluster A</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: CLUSTER_COLOR[1] }} /> Cluster B</span>
        <span>Diamonds = centroids</span>
      </div>
      <div className="flex justify-center gap-2">
        <button onClick={runIteration} disabled={converged} className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold text-sm flex items-center gap-1.5 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"><Play className="w-4 h-4" /> Run Iteration</button>
        <button onClick={reset} className="px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-800 font-bold text-sm flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"><RefreshCw className="w-4 h-4" /> Reset</button>
      </div>
      <p className={`text-center text-sm font-bold transition-all ${converged ? 'text-accent-600 scale-105' : 'text-slate-500'}`}>
        {converged && <Sparkles className="w-4 h-4 inline mr-1 -mt-0.5" />}
        Iteration {iteration}{converged ? ' -- centroids stopped moving, converged!' : ''}
      </p>
    </div>
  );
}
