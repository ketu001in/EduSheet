'use client';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import { Play, RotateCcw } from 'lucide-react';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';
import { pidStep, PID_ZERO_STATE, PidState } from '@/lib/roboticsEngineeringEngine';

// A real 3D robot car actually driving a curvy track, replacing the flat
// SVG line plot -- the same PID formula as before, but now you watch an
// actual car body drift, oscillate, or track smoothly along a real tube-
// shaped track on a table, from an angled 3/4 view.
const TRACK_LEN = 7;
const trackY = (x: number) => 0.55 * Math.sin(x * 1.3);

export default function LineFollower3DScene() {
  const [kp, setKp] = useState(0);
  const [ki, setKi] = useState(0);
  const [kd, setKd] = useState(0);
  const [running, setRunning] = useState(false);
  const [trail, setTrail] = useState<{ x: number; y: number; error: number }[]>([{ x: 0, y: 0, error: 0 }]);
  const [done, setDone] = useState(false);
  const stateRef = useRef<{ x: number; y: number; pid: PidState }>({ x: 0, y: 0, pid: PID_ZERO_STATE });
  const carRef = useRef<THREE.Group>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    stateRef.current = { x: 0, y: 0, pid: PID_ZERO_STATE };
    setTrail([{ x: 0, y: 0, error: 0 }]);
    setDone(false);
    setRunning(true);
    const dt = 0.15;
    intervalRef.current = setInterval(() => {
      const s = stateRef.current;
      const nextX = s.x + 0.13;
      const target = trackY(nextX);
      const error = target - s.y;
      const { output, state: pidState } = pidStep(s.pid, error, dt, kp, ki, kd);
      const nextY = s.y + output * dt;
      stateRef.current = { x: nextX, y: nextY, pid: pidState };
      setTrail((prev) => [...prev, { x: nextX, y: nextY, error }]);
      if (carRef.current) {
        carRef.current.position.set(nextX - TRACK_LEN / 2, 0.09, nextY);
        carRef.current.rotation.y = Math.atan2(target - trackY(s.x), nextX - s.x) || 0;
      }
      if (nextX >= TRACK_LEN) {
        setRunning(false); setDone(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 60);
  };
  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false); setDone(false); setTrail([{ x: 0, y: 0, error: 0 }]);
    stateRef.current = { x: 0, y: 0, pid: PID_ZERO_STATE };
    if (carRef.current) carRef.current.position.set(-TRACK_LEN / 2, 0.09, 0);
  };

  const trackPoints = useMemo(() => Array.from({ length: 60 }, (_, i) => {
    const x = (i / 59) * TRACK_LEN;
    return new THREE.Vector3(x - TRACK_LEN / 2, 0.005, trackY(x));
  }), []);
  const trackCurve = useMemo(() => new THREE.CatmullRomCurve3(trackPoints), [trackPoints]);
  const trailLine = useMemo(() => trail.length > 1 ? trail.map((p) => new THREE.Vector3(p.x - TRACK_LEN / 2, 0.05, p.y)) : null, [trail]);

  const avgError = trail.length ? trail.reduce((s, p) => s + Math.abs(p.error), 0) / trail.length : 0;
  const maxError = trail.length ? Math.max(...trail.map((p) => Math.abs(p.error))) : 0;

  return (
    <div className="space-y-2">
      <p className="text-center text-xs text-slate-500">The gold ribbon is the track. Watch the car itself drift, oscillate, or track smoothly, driven live by your PID gains.</p>
      <SafeR3FCanvas height={300} shadows camera={{ position: [0, 4.5, 3.8], fov: 45 }}>
        <ambientLight intensity={0.85} />
        <directionalLight position={[3, 6, 3]} intensity={1.2} castShadow />
        <mesh position={[0, -0.05, 0]} receiveShadow>
          <boxGeometry args={[TRACK_LEN + 1, 0.1, 2.4]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.9} />
        </mesh>
        <mesh>
          <tubeGeometry args={[trackCurve, 80, 0.035, 8, false]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.2} />
        </mesh>
        {trailLine && (
          <line>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[new Float32Array(trailLine.flatMap((v) => [v.x, v.y, v.z])), 3]} />
            </bufferGeometry>
            <lineBasicMaterial color="#2F5FE0" linewidth={2} />
          </line>
        )}
        <group ref={carRef} position={[-TRACK_LEN / 2, 0.09, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.28, 0.14, 0.2]} />
            <meshStandardMaterial color="#2F5FE0" metalness={0.4} roughness={0.4} />
          </mesh>
          {[[-0.1, -0.09], [0.1, -0.09], [-0.1, 0.09], [0.1, 0.09]].map(([x, z], i) => (
            <mesh key={i} position={[x, -0.07, z]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.04, 12]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
          ))}
        </group>
        <OrbitControls enablePan={false} enableZoom makeDefault target={[0, 0, 0]} />
      </SafeR3FCanvas>
      <div className="grid grid-cols-3 gap-3">
        <label className="block text-xs font-bold text-slate-500 space-y-1">
          <span>Kp ({kp.toFixed(2)})</span>
          <input type="range" min={0} max={2} step={0.02} value={kp} onChange={(e) => setKp(parseFloat(e.target.value))} disabled={running} className="w-full accent-primary-600" />
        </label>
        <label className="block text-xs font-bold text-slate-500 space-y-1">
          <span>Ki ({ki.toFixed(3)})</span>
          <input type="range" min={0} max={0.05} step={0.001} value={ki} onChange={(e) => setKi(parseFloat(e.target.value))} disabled={running} className="w-full accent-primary-600" />
        </label>
        <label className="block text-xs font-bold text-slate-500 space-y-1">
          <span>Kd ({kd.toFixed(2)})</span>
          <input type="range" min={0} max={1} step={0.02} value={kd} onChange={(e) => setKd(parseFloat(e.target.value))} disabled={running} className="w-full accent-primary-600" />
        </label>
      </div>
      <div className="flex justify-center gap-2">
        <button onClick={start} disabled={running} className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold text-sm flex items-center gap-1.5 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"><Play className="w-4 h-4" /> Run</button>
        <button onClick={reset} className="px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-800 font-bold text-sm flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"><RotateCcw className="w-4 h-4" /> Reset</button>
      </div>
      {done && (
        <p className="text-center text-sm font-bold text-slate-600 dark:text-slate-300">
          Average error: {avgError.toFixed(2)} &middot; Max error: {maxError.toFixed(2)}
          {avgError < 0.1 ? <span className="text-accent-600"> -- smooth tracking!</span> : avgError < 0.3 ? <span className="text-amber-600"> -- getting there, try raising Kd to damp the oscillation.</span> : <span className="text-red-600"> -- drifting badly, raise Kp.</span>}
        </p>
      )}
    </div>
  );
}
