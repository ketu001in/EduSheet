'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import { Play, RotateCcw, Eye, Footprints } from 'lucide-react';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';
import {
  MAZE_SIZE, MAZE_GOAL, MAZE_WALLS, MazeQTable, QState,
  makeEmptyQTable, runMazeEpisode, bestAction,
} from '@/lib/aiExperimentsEngine';

// A real reinforcement-learning agent exploring a fixed 5x5 maze with no
// map -- only a real Bellman-equation update (Q-learning, Watkins 1989)
// after every move. Training episodes genuinely run the algorithm (see
// aiExperimentsEngine.ts's runMazeEpisode); the "reveal policy" heatmap
// and the final greedy walkthrough are both read directly off the
// resulting Q-table, not scripted.
const TILE = 0.78;
const START: QState = { row: 0, col: 0 };
const offset = (MAZE_SIZE - 1) / 2;
const worldPos = (s: QState): [number, number, number] => [(s.col - offset) * TILE, 0, (s.row - offset) * TILE];
const isWallCell = (r: number, c: number) => MAZE_WALLS.some((w) => w.row === r && w.col === c);

export default function QLearningMaze3DScene() {
  const [q, setQ] = useState<MazeQTable>(() => makeEmptyQTable(MAZE_SIZE));
  const [episodes, setEpisodes] = useState(0);
  const [agentPos, setAgentPos] = useState<QState>(START);
  const [running, setRunning] = useState(false);
  const [revealPolicy, setRevealPolicy] = useState(false);
  const [lastResult, setLastResult] = useState<'idle' | 'training' | 'reached' | 'policy-run'>('idle');
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (animRef.current) clearInterval(animRef.current); }, []);

  // Wall-clock-based rather than tick-counted -- the step index is derived
  // from real elapsed time on every interval firing, so a throttled or
  // delayed tab (backgrounded tab, slow device) still jumps straight to
  // the correct step and reliably calls onDone, instead of silently
  // getting stuck mid-animation waiting for ticks that never arrive on
  // schedule.
  const STEP_MS = 160;
  const animatePath = (path: QState[], onDone?: () => void) => {
    if (animRef.current) clearInterval(animRef.current);
    const start = performance.now();
    animRef.current = setInterval(() => {
      const idx = Math.min(path.length - 1, Math.floor((performance.now() - start) / STEP_MS));
      setAgentPos(path[idx]);
      if (idx >= path.length - 1) {
        if (animRef.current) clearInterval(animRef.current);
        onDone?.();
      }
    }, STEP_MS);
  };

  const trainBatch = () => {
    if (running) return;
    setRunning(true);
    setLastResult('training');
    let table = q;
    let lastPath: QState[] = [START];
    const batchSize = 15;
    for (let i = 0; i < batchSize; i++) {
      const epsilon = Math.max(0.05, 0.4 - (episodes + i) * 0.004);
      const result = runMazeEpisode(table, START, 0.3, 0.9, epsilon);
      table = result.q;
      lastPath = result.path;
    }
    setQ(table);
    setEpisodes((e) => e + batchSize);
    animatePath(lastPath, () => { setRunning(false); setLastResult('reached'); });
  };

  const runPolicy = () => {
    if (running) return;
    setRunning(true);
    setLastResult('policy-run');
    const result = runMazeEpisode(q, START, 0, 0.9, 0, 40, () => 1);
    animatePath(result.path, () => setRunning(false));
  };

  const reset = () => {
    if (animRef.current) clearInterval(animRef.current);
    setQ(makeEmptyQTable(MAZE_SIZE));
    setEpisodes(0);
    setAgentPos(START);
    setRunning(false);
    setLastResult('idle');
  };

  return (
    <div className="space-y-2">
      <SafeR3FCanvas height={320} shadows camera={{ position: [0, 4.6, 4.4], fov: 44 }}>
        <ambientLight intensity={0.85} />
        <directionalLight position={[3, 6, 4]} intensity={1.15} castShadow />
        <MazeFloor q={q} revealPolicy={revealPolicy} />
        <Agent pos={agentPos} />
        <OrbitControls enablePan={false} enableZoom makeDefault target={[0, 0, 0]} />
      </SafeR3FCanvas>
      <p className="text-center text-[10px] text-slate-400">Drag to rotate &middot; green tile = goal &middot; dark tiles = walls</p>

      <div className="grid grid-cols-2 gap-1.5 text-center text-xs">
        <div className="rounded-lg p-1.5 bg-slate-50 dark:bg-slate-800/50"><p className="text-[10px] font-bold text-slate-400">Episodes Trained</p><p className="font-black">{episodes}</p></div>
        <div className="rounded-lg p-1.5 bg-slate-50 dark:bg-slate-800/50"><p className="text-[10px] font-bold text-slate-400">Status</p><p className="font-black capitalize">{lastResult.replace('-', ' ')}</p></div>
      </div>

      <div className="flex justify-center gap-2 flex-wrap">
        <button onClick={trainBatch} disabled={running} className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold text-sm flex items-center gap-1.5 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"><Play className="w-4 h-4" /> Train 15 Episodes</button>
        <button onClick={() => setRevealPolicy((r) => !r)} className={`px-4 py-2 rounded-lg border-2 font-bold text-sm flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all ${revealPolicy ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700' : 'border-slate-200 dark:border-slate-800'}`}><Eye className="w-4 h-4" /> Reveal Learned Values</button>
        <button onClick={runPolicy} disabled={running || episodes === 0} className="px-4 py-2 rounded-lg border-2 border-accent-300 text-accent-700 dark:text-accent-300 font-bold text-sm flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"><Footprints className="w-4 h-4" /> Run Learned Policy</button>
        <button onClick={reset} className="px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-800 font-bold text-sm flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"><RotateCcw className="w-4 h-4" /> Reset</button>
      </div>
    </div>
  );
}

function MazeFloor({ q, revealPolicy }: { q: MazeQTable; revealPolicy: boolean }) {
  const maxQ = Math.max(0.01, ...q.flat(2));
  const tiles = [];
  for (let row = 0; row < MAZE_SIZE; row++) {
    for (let col = 0; col < MAZE_SIZE; col++) {
      const wall = isWallCell(row, col);
      const isGoal = row === MAZE_GOAL.row && col === MAZE_GOAL.col;
      const [x, , z] = worldPos({ row, col });
      const value = Math.max(...q[row][col]);
      const heat = Math.max(0, value) / maxQ;
      const floorColor = isGoal ? '#237A4C' : wall ? '#334155' : revealPolicy ? new THREE.Color(0.85 - 0.55 * heat, 0.88 - 0.2 * heat, 0.92 - 0.7 * heat).getStyle() : '#e2e8f0';
      tiles.push(
        <group key={`${row}-${col}`}>
          <mesh position={[x, wall ? 0.18 : -0.03, z]} receiveShadow castShadow={wall}>
            {wall ? <boxGeometry args={[TILE * 0.92, 0.4, TILE * 0.92]} /> : <boxGeometry args={[TILE * 0.92, 0.06, TILE * 0.92]} />}
            <meshStandardMaterial color={floorColor} roughness={0.85} />
          </mesh>
          {!wall && revealPolicy && !isGoal && (
            <PolicyArrow row={row} col={col} q={q} x={x} z={z} />
          )}
        </group>
      );
    }
  }
  return <group>{tiles}</group>;
}

function PolicyArrow({ row, col, q, x, z }: { row: number; col: number; q: MazeQTable; x: number; z: number }) {
  const { action, value } = bestAction(q, { row, col });
  if (value <= 0) return null;
  const rotationY = action === 'right' ? -Math.PI / 2 : action === 'left' ? Math.PI / 2 : action === 'up' ? Math.PI : 0;
  return (
    <mesh position={[x, 0.14, z]} rotation={[Math.PI / 2, 0, rotationY]}>
      <coneGeometry args={[0.14, 0.28, 3]} />
      <meshStandardMaterial color="#2F5FE0" />
    </mesh>
  );
}

function Agent({ pos }: { pos: QState }) {
  const [x, , z] = worldPos(pos);
  return (
    <group position={[x, 0.22, z]}>
      <mesh castShadow>
        <sphereGeometry args={[0.2, 20, 20]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.05, 0.16]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
    </group>
  );
}
