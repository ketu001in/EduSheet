'use client';
import { useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import { Search, RotateCcw } from 'lucide-react';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';
import { bfsShortestPath, GridCell } from '@/lib/roboticsEngine';

// A real 3D maze -- click a tile to raise a real wall block, then run the
// actual BFS search and watch the shortest path light up, replacing the
// flat colored-button grid.
const SIZE = 7;
const START: GridCell = [0, 0];
const GOAL: GridCell = [SIZE - 1, SIZE - 1];
const key = (r: number, c: number) => `${r},${c}`;

export default function Maze3DScene() {
  const [blocked, setBlocked] = useState<Set<string>>(new Set());
  const [path, setPath] = useState<GridCell[] | null>(null);
  const [searched, setSearched] = useState(false);

  const toggle = (r: number, c: number) => {
    if ((r === START[0] && c === START[1]) || (r === GOAL[0] && c === GOAL[1])) return;
    setPath(null); setSearched(false);
    setBlocked((prev) => { const next = new Set(prev); const k = key(r, c); if (next.has(k)) next.delete(k); else next.add(k); return next; });
  };
  const findPath = () => { setPath(bfsShortestPath(SIZE, SIZE, blocked, START, GOAL)); setSearched(true); };
  const clear = () => { setBlocked(new Set()); setPath(null); setSearched(false); };

  const pathSet = new Set((path || []).map(([r, c]) => key(r, c)));
  const offset = (SIZE - 1) / 2;

  return (
    <div className="space-y-2">
      <p className="text-center text-xs text-slate-500">Click tiles to raise real walls, then find the real shortest path (breadth-first search -- the same class of algorithm that plans these robots&apos; actual routes).</p>
      <SafeR3FCanvas height={300} shadows camera={{ position: [0, 6.5, 5.5], fov: 42 }}>
        <ambientLight intensity={0.85} />
        <directionalLight position={[3, 6, 4]} intensity={1.15} castShadow />
        {Array.from({ length: SIZE }, (_, r) => Array.from({ length: SIZE }, (_, c) => {
          const isStart = r === START[0] && c === START[1];
          const isGoal = r === GOAL[0] && c === GOAL[1];
          const isBlocked = blocked.has(key(r, c));
          const onPath = pathSet.has(key(r, c));
          const color = isStart ? '#237A4C' : isGoal ? '#2F5FE0' : onPath ? '#93c5fd' : '#f1f5f9';
          return (
            <group key={key(r, c)} position={[c - offset, 0, r - offset]}>
              <mesh
                position={[0, -0.05, 0]}
                onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); toggle(r, c); }}
                receiveShadow
              >
                <boxGeometry args={[0.92, 0.1, 0.92]} />
                <meshStandardMaterial color={color} roughness={0.85} />
              </mesh>
              {isBlocked && (
                <mesh position={[0, 0.25, 0]} castShadow>
                  <boxGeometry args={[0.8, 0.5, 0.8]} />
                  <meshStandardMaterial color="#475569" metalness={0.3} roughness={0.6} />
                </mesh>
              )}
            </group>
          );
        }))}
        <OrbitControls enablePan={false} enableZoom makeDefault target={[0, 0, 0]} />
      </SafeR3FCanvas>
      <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-slate-500">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full inline-block bg-accent-600" /> Start</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full inline-block bg-primary-600" /> Goal</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block bg-slate-500" /> Wall</span>
      </div>
      <div className="flex justify-center gap-2">
        <button onClick={findPath} className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold text-sm flex items-center gap-1.5 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all"><Search className="w-4 h-4" /> Find Path</button>
        <button onClick={clear} className="px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-800 font-bold text-sm flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"><RotateCcw className="w-4 h-4" /> Clear</button>
      </div>
      {searched && (
        <p className="text-center text-sm font-bold text-slate-600 dark:text-slate-300">
          {path ? `Shortest path found: ${path.length - 1} steps from Start to Goal.` : 'No path exists -- these walls completely seal off the goal. Remove some and try again.'}
        </p>
      )}
    </div>
  );
}
