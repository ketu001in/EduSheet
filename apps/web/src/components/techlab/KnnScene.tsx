'use client';
import { useMemo, useState } from 'react';
import * as THREE from 'three';
import { Zap } from 'lucide-react';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';
import { IRIS_STYLE_POINTS, kNearestNeighbors, majoritySpecies, IrisPoint } from '@/lib/aiCodingEngine';

// kNN's "distance" made literal: every point's height above the ground is
// its real Euclidean distance from the query marker -- genuinely closer
// points are genuinely shorter bars, which is exactly what "k nearest"
// means, rather than an abstract number. Click anywhere on the ground to
// move the query and watch every bar resize live.
const X_MAX = 5, Z_MAX = 2;
const BAR_SCALE = 0.4;
function toDisp(x: number, z: number) {
  return { dx: -2.2 + 4.4 * (x / X_MAX), dz: -2.2 + 4.4 * (z / Z_MAX) };
}
function fromDisp(dx: number, dz: number) {
  return { x: ((dx + 2.2) / 4.4) * X_MAX, z: ((dz + 2.2) / 4.4) * Z_MAX };
}
const SPECIES_COLOR: Record<IrisPoint['species'], string> = { 'Setosa-like': '#c026d3', 'Versicolor-like': '#0d9488' };

export default function KnnScene() {
  const [query, setQuery] = useState({ x: 3, z: 0.8 });
  const [k, setK] = useState(3);

  const neighbors = useMemo(() => kNearestNeighbors(IRIS_STYLE_POINTS, query.x, query.z, k), [query, k]);
  const nearestSet = useMemo(() => new Set(neighbors.map((n) => n.point)), [neighbors]);
  const winner = useMemo(() => majoritySpecies(neighbors), [neighbors]);

  return (
    <div className="rounded-2xl border-2 border-primary-200 dark:border-primary-900 bg-gradient-to-br from-primary-50/60 via-white to-accent-50/40 dark:from-primary-950/20 dark:via-slate-950 dark:to-accent-950/10 p-4 md:p-5 space-y-3 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
        <Zap className="w-4 h-4 text-primary-600" /> Classify by What&apos;s Nearest
      </div>
      <p className="text-center text-xs text-slate-500">Click the ground to move the query point -- every bar&apos;s height IS that flower&apos;s real distance from your query. Glowing bars are the k nearest.</p>
      <SafeR3FCanvas height={300}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 5, 4]} intensity={1.1} />
        <ClickPlane onPick={(dx, dz) => { const { x, z } = fromDisp(dx, dz); setQuery({ x: Math.max(0, Math.min(X_MAX, x)), z: Math.max(0, Math.min(Z_MAX, z)) }); }} />
        {IRIS_STYLE_POINTS.map((p, i) => {
          const { dx, dz } = toDisp(p.x, p.z);
          const d = neighbors.find((n) => n.point === p)?.distance ?? Math.sqrt((p.x - query.x) ** 2 + (p.z - query.z) ** 2);
          const barHeight = Math.min(2.2, d * BAR_SCALE);
          const isNear = nearestSet.has(p);
          return (
            <group key={i} position={[dx, 0, dz]}>
              <mesh position={[0, barHeight / 2, 0]}>
                <cylinderGeometry args={[isNear ? 0.05 : 0.025, isNear ? 0.05 : 0.025, barHeight, 8]} />
                <meshStandardMaterial color={SPECIES_COLOR[p.species]} transparent opacity={isNear ? 1 : 0.35} emissive={isNear ? SPECIES_COLOR[p.species] : '#000000'} emissiveIntensity={isNear ? 0.4 : 0} />
              </mesh>
              <mesh position={[0, barHeight, 0]}>
                <sphereGeometry args={[isNear ? 0.09 : 0.06, 12, 12]} />
                <meshStandardMaterial color={SPECIES_COLOR[p.species]} />
              </mesh>
            </group>
          );
        })}
        {(() => { const { dx, dz } = toDisp(query.x, query.z); return (
          <mesh position={[dx, 0.05, dz]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#f8fafc" emissive="#94a3b8" emissiveIntensity={0.3} />
          </mesh>
        ); })()}
      </SafeR3FCanvas>
      <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-slate-500 flex-wrap">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: SPECIES_COLOR['Setosa-like'] }} /> Setosa-like</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: SPECIES_COLOR['Versicolor-like'] }} /> Versicolor-like</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-200 border border-slate-400 inline-block" /> Query point</span>
      </div>
      <label className="block text-xs font-bold text-slate-500 space-y-1 max-w-xs mx-auto">
        <span>k = {k} nearest neighbors</span>
        <input type="range" min={1} max={7} step={1} value={k} onChange={(e) => setK(parseInt(e.target.value, 10))} className="w-full accent-primary-600" />
      </label>
      <p className="text-center text-sm font-bold" style={{ color: SPECIES_COLOR[winner] }}>
        Classified as: {winner} ({neighbors.filter((n) => n.point.species === winner).length}/{k} nearest votes)
      </p>
    </div>
  );
}

function ClickPlane({ onPick }: { onPick: (dx: number, dz: number) => void }) {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      onClick={(e) => { e.stopPropagation(); onPick(e.point.x, e.point.z); }}
    >
      <planeGeometry args={[4.6, 4.6]} />
      <meshBasicMaterial color="#94a3b8" transparent opacity={0.1} side={THREE.DoubleSide} />
    </mesh>
  );
}
