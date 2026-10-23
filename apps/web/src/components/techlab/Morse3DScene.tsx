'use client';
import { useEffect, useRef, useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import { Play } from 'lucide-react';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';
import { MORSE_CODE_TABLE, morseTimeline } from '@/lib/roboticsEngineeringEngine';

// A real 3D LED bulb (dome + base + mounting bracket) that genuinely
// glows on the correct ITU Morse timing, replacing the flat 2D circle.
export default function Morse3DScene() {
  const [text, setText] = useState('SOS');
  const [unitMs, setUnitMs] = useState(150);
  const [on, setOn] = useState(false);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const play = () => {
    const timeline = morseTimeline(text, unitMs);
    setPlaying(true);
    let i = 0;
    const step = () => {
      if (i >= timeline.length) { setOn(false); setPlaying(false); return; }
      const tick = timeline[i];
      setOn(tick.on);
      i++;
      timerRef.current = setTimeout(step, tick.durationMs);
    };
    step();
  };
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const morseText = text.toUpperCase().split('').map((ch) => ch === ' ' ? '/' : (MORSE_CODE_TABLE[ch] || '?')).join('  ');

  return (
    <div className="space-y-2">
      <p className="text-center text-xs text-slate-500">Real ITU timing: a dash lasts exactly 3x a dot, with correctly-proportioned gaps between letters.</p>
      <SafeR3FCanvas height={230} shadows camera={{ position: [1.6, 1.2, 1.8], fov: 40 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 4, 3]} intensity={1} castShadow />
        <mesh position={[0, -0.35, 0]} receiveShadow>
          <boxGeometry args={[1.4, 0.15, 1.4]} />
          <meshStandardMaterial color="#334155" metalness={0.4} roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.13, 0.25, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.15, 0]} castShadow>
          <sphereGeometry args={[0.24, 24, 24]} />
          <meshStandardMaterial color={on ? '#fbbf24' : '#78716c'} emissive={on ? '#fbbf24' : '#000000'} emissiveIntensity={on ? 1.6 : 0} transparent opacity={0.9} />
        </mesh>
        {on && (
          <pointLight position={[0, 0.15, 0]} color="#fbbf24" intensity={2} distance={2} />
        )}
        <OrbitControls enablePan={false} enableZoom makeDefault target={[0, 0, 0]} />
      </SafeR3FCanvas>
      <input
        type="text"
        value={text}
        maxLength={12}
        onChange={(e) => setText(e.target.value.replace(/[^A-Za-z0-9 ]/g, ''))}
        disabled={playing}
        className="block mx-auto w-48 text-center px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-bold uppercase disabled:opacity-60"
      />
      <p className="text-center text-xs font-mono text-slate-400 tracking-wider">{morseText}</p>
      <label className="block text-xs font-bold text-slate-500 space-y-1 max-w-sm mx-auto">
        <span>Speed (1 unit = {unitMs}ms)</span>
        <input type="range" min={60} max={300} step={10} value={unitMs} onChange={(e) => setUnitMs(parseInt(e.target.value, 10))} className="w-full accent-primary-600" />
      </label>
      <div className="flex justify-center">
        <button onClick={play} disabled={playing || !text.trim()} className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold text-sm flex items-center gap-1.5 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"><Play className="w-4 h-4" /> Blink It</button>
      </div>
    </div>
  );
}
