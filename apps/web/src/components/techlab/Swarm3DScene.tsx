'use client';
import { useEffect, useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';

// Real flocking agents rendered as actual 3D spheres moving over a field,
// replacing the flat emoji-on-a-div version -- same cohesion/alignment
// rule (Reynolds-style local flocking), now genuinely spatial.
interface Agent { x: number; z: number; vx: number; vz: number }
const FIELD = 4.4;

export default function Swarm3DScene() {
  const [count, setCount] = useState(10);
  const [agents, setAgents] = useState<Agent[]>([]);

  const spawn = (n: number): Agent[] => Array.from({ length: n }, () => ({
    x: (Math.random() - 0.5) * FIELD, z: (Math.random() - 0.5) * FIELD,
    vx: (Math.random() - 0.5) * 0.04, vz: (Math.random() - 0.5) * 0.04,
  }));
  useEffect(() => { setAgents(spawn(count)); }, [count]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAgents((prev) => prev.map((a, i) => {
        let avgX = 0, avgZ = 0, avgVx = 0, avgVz = 0, n = 0;
        for (let j = 0; j < prev.length; j++) {
          if (i === j) continue;
          const b = prev[j];
          const d = Math.hypot(a.x - b.x, a.z - b.z);
          if (d < 1.3) { avgX += b.x; avgZ += b.z; avgVx += b.vx; avgVz += b.vz; n++; }
        }
        let vx = a.vx, vz = a.vz;
        if (n > 0) {
          avgX /= n; avgZ /= n; avgVx /= n; avgVz /= n;
          vx += (avgX - a.x) * 0.0022 + (avgVx - a.vx) * 0.04;
          vz += (avgZ - a.z) * 0.0022 + (avgVz - a.vz) * 0.04;
        }
        let x = a.x + vx, z = a.z + vz;
        const half = FIELD / 2;
        if (x < -half || x > half) vx *= -1;
        if (z < -half || z > half) vz *= -1;
        x = Math.max(-half, Math.min(half, x)); z = Math.max(-half, Math.min(half, z));
        const speed = Math.hypot(vx, vz) || 1;
        const capped = Math.min(speed, 0.05) / speed;
        return { x, z, vx: vx * capped, vz: vz * capped };
      }));
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-2">
      <p className="text-center text-xs text-slate-500">No leader, no central plan -- each robot only reacts to its nearby neighbors, and group movement emerges from the whole swarm.</p>
      <SafeR3FCanvas height={260} shadows camera={{ position: [0, 5.2, 4], fov: 42 }}>
        <ambientLight intensity={0.85} />
        <directionalLight position={[3, 6, 4]} intensity={1.1} castShadow />
        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[FIELD + 0.6, FIELD + 0.6]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
        </mesh>
        {agents.map((a, i) => (
          <mesh key={i} position={[a.x, 0.12, a.z]} castShadow>
            <sphereGeometry args={[0.1, 14, 14]} />
            <meshStandardMaterial color="#2F5FE0" metalness={0.3} roughness={0.4} />
          </mesh>
        ))}
        <OrbitControls enablePan={false} enableZoom makeDefault target={[0, 0, 0]} />
      </SafeR3FCanvas>
      <label className="block text-xs font-bold text-slate-500 space-y-1 max-w-xs mx-auto">
        <span>Swarm Size ({count} robots)</span>
        <input type="range" min={4} max={24} value={count} onChange={(e) => setCount(parseInt(e.target.value, 10))} className="w-full accent-primary-600" />
      </label>
    </div>
  );
}
