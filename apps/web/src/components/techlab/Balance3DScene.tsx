'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import { Play } from 'lucide-react';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';
import { pidStep, PID_ZERO_STATE, PidState } from '@/lib/roboticsEngineeringEngine';

// A real 3D self-balancing robot body -- replacing the flat rotating
// icon with an actual two-wheeled robot that visibly tips, rights
// itself, or topples over, driven live by the same PID formula.
export default function Balance3DScene() {
  const [kp, setKp] = useState(0);
  const [ki, setKi] = useState(0);
  const [kd, setKd] = useState(0);
  const [angleDeg, setAngleDeg] = useState(0);
  const [running, setRunning] = useState(false);
  const [fallen, setFallen] = useState(false);
  const [survivedMs, setSurvivedMs] = useState(0);
  const stateRef = useRef<{ angle: number; pid: PidState }>({ angle: 0, pid: PID_ZERO_STATE });

  const start = () => { stateRef.current = { angle: 0, pid: PID_ZERO_STATE }; setAngleDeg(0); setFallen(false); setSurvivedMs(0); setRunning(true); };

  useEffect(() => {
    if (!running) return;
    const dt = 0.1;
    const startTime = Date.now();
    const interval = setInterval(() => {
      const s = stateRef.current;
      const disturbance = (Math.random() - 0.5) * 8;
      const { output, state: pidState } = pidStep(s.pid, -s.angle, dt, kp, ki, kd);
      const nextAngle = Math.max(-90, Math.min(90, s.angle + disturbance + output * dt));
      stateRef.current = { angle: nextAngle, pid: pidState };
      setAngleDeg(nextAngle);
      setSurvivedMs(Date.now() - startTime);
      if (Math.abs(nextAngle) > 45) { setFallen(true); setRunning(false); }
    }, 100);
    return () => clearInterval(interval);
  }, [running, kp, ki, kd]);

  return (
    <div className="space-y-2">
      <p className="text-center text-xs text-slate-500">No buttons to tap -- the PID controller reacts on its own. Find the gains that keep it upright against random pushes.</p>
      <SafeR3FCanvas height={280} shadows camera={{ position: [2.6, 1.6, 2.6], fov: 42 }}>
        <ambientLight intensity={0.85} />
        <directionalLight position={[3, 5, 4]} intensity={1.2} castShadow />
        <mesh position={[0, -0.02, 0]} receiveShadow>
          <boxGeometry args={[3, 0.05, 2]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
        </mesh>
        <RobotBody angleDeg={angleDeg} fallen={fallen} />
        <OrbitControls enablePan={false} enableZoom makeDefault target={[0, 0.6, 0]} />
      </SafeR3FCanvas>
      <div className="grid grid-cols-3 gap-3">
        <label className="block text-xs font-bold text-slate-500 space-y-1">
          <span>Kp ({kp.toFixed(2)})</span>
          <input type="range" min={0} max={3} step={0.05} value={kp} onChange={(e) => setKp(parseFloat(e.target.value))} className="w-full accent-primary-600" />
        </label>
        <label className="block text-xs font-bold text-slate-500 space-y-1">
          <span>Ki ({ki.toFixed(3)})</span>
          <input type="range" min={0} max={0.1} step={0.002} value={ki} onChange={(e) => setKi(parseFloat(e.target.value))} className="w-full accent-primary-600" />
        </label>
        <label className="block text-xs font-bold text-slate-500 space-y-1">
          <span>Kd ({kd.toFixed(2)})</span>
          <input type="range" min={0} max={1.5} step={0.03} value={kd} onChange={(e) => setKd(parseFloat(e.target.value))} className="w-full accent-primary-600" />
        </label>
      </div>
      <div className="flex justify-center">
        <button onClick={start} className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold text-sm flex items-center gap-1.5 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all"><Play className="w-4 h-4" /> {running ? 'Restart' : 'Start Balancing'}</button>
      </div>
      <p className="text-center text-sm font-bold text-slate-500">
        {fallen ? `Fell after ${(survivedMs / 1000).toFixed(1)}s -- try raising Kp, or adding a little Kd to damp the wobble.` : running ? `Balancing for ${(survivedMs / 1000).toFixed(1)}s...` : 'Press Start to begin.'}
      </p>
    </div>
  );
}

function RobotBody({ angleDeg, fallen }: { angleDeg: number; fallen: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const rad = (angleDeg * Math.PI) / 180;
  if (ref.current) ref.current.rotation.z = -rad;
  const color = fallen ? '#dc2626' : '#2F5FE0';
  return (
    <group ref={ref} position={[0, 0.16, 0]}>
      {[-0.22, 0.22].map((z, i) => (
        <mesh key={i} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.16, 0.08, 20]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      ))}
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[0.24, 1.0, 0.3]} />
        <meshStandardMaterial color={color} metalness={0.35} roughness={0.45} />
      </mesh>
      <mesh position={[0, 1.12, 0]} castShadow>
        <sphereGeometry args={[0.16, 20, 20]} />
        <meshStandardMaterial color={color} metalness={0.35} roughness={0.45} />
      </mesh>
    </group>
  );
}
