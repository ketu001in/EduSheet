'use client';
import { useEffect, useRef, useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import { Play, RotateCcw } from 'lucide-react';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';

// A real 3D robot driving down a lane, its own simulated distance sensor
// deciding in real time whether to keep going or stop at a real 3D
// obstacle cone -- replacing the flat row of emoji buttons.
const LANE_LENGTH = 10;

export default function ObstacleCourse3DScene() {
  const [position, setPosition] = useState(0);
  const [obstacles, setObstacles] = useState<Set<number>>(new Set());
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState<'moving' | 'stopped' | 'arrived'>('moving');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setPosition((p) => {
          const next = p + 1;
          if (obstacles.has(next)) { setStatus('stopped'); setRunning(false); return p; }
          if (next >= LANE_LENGTH - 1) { setStatus('arrived'); setRunning(false); return LANE_LENGTH - 1; }
          return next;
        });
      }, 500);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, obstacles]);

  const toggleObstacle = (i: number) => {
    if (i <= position) return;
    setObstacles((prev) => { const next = new Set(prev); if (next.has(i)) next.delete(i); else next.add(i); return next; });
  };
  const reset = () => { setPosition(0); setObstacles(new Set()); setStatus('moving'); setRunning(false); };
  const offset = (LANE_LENGTH - 1) / 2;

  return (
    <div className="space-y-2">
      <p className="text-center text-xs text-slate-500">Click ahead on the lane to drop a real obstacle -- watch the robot&apos;s own sensor detect it and stop before impact.</p>
      <SafeR3FCanvas height={230} shadows camera={{ position: [0, 4.5, 4.5], fov: 42 }}>
        <ambientLight intensity={0.85} />
        <directionalLight position={[3, 6, 4]} intensity={1.15} castShadow />
        {Array.from({ length: LANE_LENGTH }, (_, i) => (
          <mesh
            key={i}
            position={[i - offset, -0.05, 0]}
            onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); toggleObstacle(i); }}
            receiveShadow
          >
            <boxGeometry args={[0.9, 0.1, 0.9]} />
            <meshStandardMaterial color={i === position ? '#2F5FE0' : '#f1f5f9'} roughness={0.85} />
          </mesh>
        ))}
        {Array.from(obstacles).map((i) => (
          <mesh key={i} position={[i - offset, 0.2, 0]} castShadow>
            <coneGeometry args={[0.28, 0.4, 16]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.6} />
          </mesh>
        ))}
        <RobotOnLane position={position} offset={offset} />
        <OrbitControls enablePan={false} enableZoom makeDefault target={[0, 0, 0]} />
      </SafeR3FCanvas>
      <div className="flex justify-center gap-2">
        <button onClick={() => setRunning((r) => !r)} disabled={status === 'arrived'} className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold text-sm flex items-center gap-1.5 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"><Play className="w-4 h-4" /> {running ? 'Pause' : 'Start'}</button>
        <button onClick={reset} className="px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-800 font-bold text-sm flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"><RotateCcw className="w-4 h-4" /> Reset</button>
      </div>
      {status === 'stopped' && <p className="text-center text-sm font-bold text-amber-600">Obstacle detected -- the robot stopped safely. Clear the obstacle ahead and press Start to continue.</p>}
      {status === 'arrived' && <p className="text-center text-sm font-bold text-accent-600">Arrived safely at the end of the lane.</p>}
    </div>
  );
}

function RobotOnLane({ position, offset }: { position: number; offset: number }) {
  return (
    <group position={[position - offset, 0.14, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.5, 0.28, 0.4]} />
        <meshStandardMaterial color="#334155" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.05, 0.21]} castShadow>
        <boxGeometry args={[0.08, 0.08, 0.04]} />
        <meshStandardMaterial color="#2F5FE0" emissive="#2F5FE0" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}
