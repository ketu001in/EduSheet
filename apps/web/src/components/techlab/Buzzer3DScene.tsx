'use client';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Volume2 } from 'lucide-react';
import SafeR3FCanvas from '@/components/techlab/SafeR3FCanvas';
import { pianoKeyFrequencyHz, TONE_PRESETS } from '@/lib/roboticsEngineeringEngine';

// A real 3D piezo buzzer that visibly pulses and sends out expanding
// sound-wave rings exactly when a REAL audible tone plays (Web Audio),
// replacing the flat "press button, hope you hear something" UI.
function useTonePlayer(onStart: (durationMs: number) => void) {
  const ctxRef = useRef<AudioContext | null>(null);
  const play = (freqHz: number, durationMs = 450) => {
    if (!ctxRef.current) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      ctxRef.current = new AC();
    }
    const ctx = ctxRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = freqHz;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + durationMs / 1000 + 0.02);
    onStart(durationMs);
  };
  return play;
}

export default function Buzzer3DScene() {
  const [freq, setFreq] = useState(440);
  const [pulseTrigger, setPulseTrigger] = useState(0);
  const [pulseDuration, setPulseDuration] = useState(450);
  const play = useTonePlayer((durationMs) => { setPulseDuration(durationMs); setPulseTrigger((n) => n + 1); });

  return (
    <div className="space-y-2">
      <p className="text-center text-xs text-slate-500">Each preset is a real named musical pitch, computed from the actual equal-temperament frequency formula. Turn your sound on.</p>
      <SafeR3FCanvas height={230} shadows camera={{ position: [1.8, 1.3, 1.9], fov: 40 }}>
        <ambientLight intensity={0.65} />
        <directionalLight position={[2, 4, 3]} intensity={1} castShadow />
        <mesh position={[0, -0.3, 0]} receiveShadow>
          <boxGeometry args={[1.2, 0.1, 1.2]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
        </mesh>
        <BuzzerBody pulseTrigger={pulseTrigger} pulseDurationMs={pulseDuration} />
        <OrbitControls enablePan={false} enableZoom makeDefault target={[0, 0, 0]} />
      </SafeR3FCanvas>
      <div className="grid grid-cols-2 gap-2">
        {TONE_PRESETS.map((preset) => (
          <button key={preset.label} onClick={() => play(pianoKeyFrequencyHz(preset.keyNumber))} className="px-3 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 text-xs font-bold hover:border-primary-400 flex items-center gap-2">
            <Volume2 className="w-3.5 h-3.5 text-primary-600 shrink-0" /> {preset.label}
          </button>
        ))}
      </div>
      <label className="block text-xs font-bold text-slate-500 space-y-1 max-w-sm mx-auto">
        <span>Custom frequency ({freq} Hz)</span>
        <input type="range" min={100} max={1200} step={5} value={freq} onChange={(e) => setFreq(parseInt(e.target.value, 10))} className="w-full accent-primary-600" />
      </label>
      <div className="flex justify-center">
        <button onClick={() => play(freq)} className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold text-sm flex items-center gap-1.5 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all"><Volume2 className="w-4 h-4" /> Play {freq} Hz</button>
      </div>
    </div>
  );
}

function BuzzerBody({ pulseTrigger, pulseDurationMs }: { pulseTrigger: number; pulseDurationMs: number }) {
  const bodyRef = useRef<THREE.Mesh>(null);
  const startRef = useRef<number | null>(null);
  const durationRef = useRef(pulseDurationMs);
  const lastTrigger = useRef(0);
  durationRef.current = pulseDurationMs;

  useFrame((state) => {
    // A fresh play() bumps pulseTrigger -- start a new pulse from now.
    if (pulseTrigger !== lastTrigger.current) {
      lastTrigger.current = pulseTrigger;
      startRef.current = state.clock.elapsedTime * 1000;
    }
    if (startRef.current === null) return;
    const elapsed = state.clock.elapsedTime * 1000 - startRef.current;
    const t = Math.min(1, elapsed / durationRef.current);
    const pulse = t < 1 ? 1 + Math.sin(t * Math.PI) * 0.12 : 1;
    if (bodyRef.current) bodyRef.current.scale.setScalar(pulse);
    if (t < 1) state.invalidate(); else startRef.current = null;
  });

  return (
    <group>
      <mesh ref={bodyRef} position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.34, 0.18, 28]} />
        <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.02, 28]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}
