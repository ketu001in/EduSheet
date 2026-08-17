'use client';
import { useEffect, useRef, useState } from 'react';
import { Zap, Play, RotateCcw, Volume2, Sparkles, RefreshCw } from 'lucide-react';
import { ExperimentPlaygroundType } from '@edusheets/content';
import RoboticsStage from '@/components/techlab/RoboticsStage';
import {
  pidStep, PID_ZERO_STATE, PidState,
  forwardKinematics2Link, inverseKinematics2Link,
  MORSE_CODE_TABLE, morseTimeline,
  pianoKeyFrequencyHz, TONE_PRESETS,
  rgbDutyCyclesToCss,
  gearOutputTorque, gearOutputRPM,
  stepperDegreesPerStep,
} from '@/lib/roboticsEngineeringEngine';

// Robotics Lab's Hands-On Experiments dispatcher -- 8 newly built scenes
// plus 3 of the original 7 playable simulations (RoboticsStage.tsx)
// reused directly rather than re-implemented, per explicit instruction to
// keep what already exists. See roboticsExperimentTypes.ts's header for
// why this tab exists at all.
export default function RoboticsExperimentStage({ type, config }: { type: ExperimentPlaygroundType; config: Record<string, any> }) {
  switch (type) {
    case 'pid-line-follower': return <PidLineFollowerScene />;
    case 'arm-reach-grab': return <ArmReachGrabScene />;
    case 'gear-design-challenge': return <GearDesignChallengeScene config={config} />;
    case 'stepper-precision': return <StepperPrecisionScene />;
    case 'buzzer-tone-lab': return <BuzzerToneLabScene />;
    case 'morse-led-blinker': return <MorseLedBlinkerScene />;
    case 'rgb-pwm-mixer': return <RgbPwmMixerScene />;
    case 'balance-pid-tuning': return <BalancePidTuningScene />;
    case 'maze-pathfinding': return <RoboticsStage type="path-planning" config={config} />;
    case 'obstacle-course': return <RoboticsStage type="obstacle-avoidance" config={config} />;
    case 'swarm-playground': return <RoboticsStage type="swarm-simulation" config={config} />;
    default: return null;
  }
}

function StageCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-primary-200 dark:border-primary-900 bg-gradient-to-br from-primary-50/60 via-white to-accent-50/40 dark:from-primary-950/20 dark:via-slate-950 dark:to-accent-950/10 p-4 md:p-5 space-y-3 shadow-sm">
      {children}
    </div>
  );
}
function StageHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
      <Zap className="w-4 h-4 text-primary-600" /> {children}
    </div>
  );
}
const btnPrimary = 'px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold text-sm flex items-center gap-1.5 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100';
const btnSecondary = 'px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-800 font-bold text-sm flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all';

// ============================================================================
// 1. PID Line-Follower Tuning Lab
// ============================================================================
const TRACK_LEN = 320;
const trackLineY = (x: number) => 45 * Math.sin(x / 42);
function PidLineFollowerScene() {
  const [kp, setKp] = useState(0);
  const [ki, setKi] = useState(0);
  const [kd, setKd] = useState(0);
  const [running, setRunning] = useState(false);
  const [trail, setTrail] = useState<{ x: number; y: number; error: number }[]>([]);
  const [done, setDone] = useState(false);
  const stateRef = useRef<{ x: number; y: number; pid: PidState }>({ x: 0, y: 0, pid: PID_ZERO_STATE });

  const start = () => {
    stateRef.current = { x: 0, y: 0, pid: PID_ZERO_STATE };
    setTrail([{ x: 0, y: 0, error: 0 }]);
    setDone(false);
    setRunning(true);
  };
  const reset = () => { setRunning(false); setDone(false); setTrail([]); stateRef.current = { x: 0, y: 0, pid: PID_ZERO_STATE }; };

  useEffect(() => {
    if (!running) return;
    const dt = 0.15;
    const interval = setInterval(() => {
      const s = stateRef.current;
      const nextX = s.x + 6;
      const target = trackLineY(nextX);
      const error = target - s.y;
      const { output, state: pidState } = pidStep(s.pid, error, dt, kp, ki, kd);
      const nextY = s.y + output * dt;
      stateRef.current = { x: nextX, y: nextY, pid: pidState };
      setTrail((prev) => [...prev, { x: nextX, y: nextY, error }]);
      if (nextX >= TRACK_LEN) { setRunning(false); setDone(true); }
    }, 60);
    return () => clearInterval(interval);
  }, [running, kp, ki, kd]);

  const idealPath = Array.from({ length: 33 }, (_, i) => { const x = i * (TRACK_LEN / 32); return `${x + 10},${100 - trackLineY(x)}`; }).join(' ');
  const robotPath = trail.map((p) => `${p.x + 10},${100 - p.y}`).join(' ');
  const avgError = trail.length ? trail.reduce((s, p) => s + Math.abs(p.error), 0) / trail.length : 0;
  const maxError = trail.length ? Math.max(...trail.map((p) => Math.abs(p.error))) : 0;

  return (
    <StageCard>
      <StageHeading>Tune the Line-Follower</StageHeading>
      <p className="text-center text-xs text-slate-500">The dashed line is the track. The solid line is your robot&apos;s real path, driven by your PID gains -- watch it drift, oscillate, or track smoothly.</p>
      <div className="flex justify-center">
        <svg viewBox="0 0 340 200" className="w-full max-w-md h-40 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800">
          <polyline points={idealPath} className="stroke-slate-300 dark:stroke-slate-700" strokeWidth={2} strokeDasharray="5 4" fill="none" />
          {trail.length > 1 && <polyline points={robotPath} className="stroke-primary-600" strokeWidth={2.5} fill="none" strokeLinecap="round" />}
          {trail.length > 0 && (() => { const last = trail[trail.length - 1]; return <circle cx={last.x + 10} cy={100 - last.y} r={5} className="fill-accent-500" />; })()}
        </svg>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <label className="block text-xs font-bold text-slate-500 space-y-1">
          <span>Kp ({kp.toFixed(2)})</span>
          <input type="range" min={0} max={2} step={0.02} value={kp} onChange={(e) => setKp(parseFloat(e.target.value))} className="w-full accent-primary-600" />
        </label>
        <label className="block text-xs font-bold text-slate-500 space-y-1">
          <span>Ki ({ki.toFixed(3)})</span>
          <input type="range" min={0} max={0.05} step={0.001} value={ki} onChange={(e) => setKi(parseFloat(e.target.value))} className="w-full accent-primary-600" />
        </label>
        <label className="block text-xs font-bold text-slate-500 space-y-1">
          <span>Kd ({kd.toFixed(2)})</span>
          <input type="range" min={0} max={1} step={0.02} value={kd} onChange={(e) => setKd(parseFloat(e.target.value))} className="w-full accent-primary-600" />
        </label>
      </div>
      <div className="flex justify-center gap-2">
        <button onClick={start} disabled={running} className={btnPrimary}><Play className="w-4 h-4" /> Run</button>
        <button onClick={reset} className={btnSecondary}><RotateCcw className="w-4 h-4" /> Reset</button>
      </div>
      {done && (
        <p className="text-center text-sm font-bold text-slate-600 dark:text-slate-300">
          Average error: {avgError.toFixed(1)}px &middot; Max error: {maxError.toFixed(1)}px
          {avgError < 8 ? <span className="text-accent-600"> -- smooth tracking!</span> : avgError < 25 ? <span className="text-amber-600"> -- getting there, try raising Kd to damp the oscillation.</span> : <span className="text-red-600"> -- drifting badly, raise Kp.</span>}
        </p>
      )}
    </StageCard>
  );
}

// ============================================================================
// 2. Robotic Arm: Reach and Grab
// ============================================================================
const ARM_L1 = 70, ARM_L2 = 55, ARM_BASE = { x: 100, y: 185 };
const OBJECT_POS = { x: 40, y: 65 };
const DROP_POS = { x: -55, y: 55 };
const REACH_TOLERANCE = 12;
function ArmReachGrabScene() {
  const [angles, setAngles] = useState({ theta1: Math.PI / 2, theta2: 0 });
  const [phase, setPhase] = useState<'reach-object' | 'holding' | 'delivered'>('reach-object');
  const [message, setMessage] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const end = forwardKinematics2Link(ARM_L1, ARM_L2, angles.theta1, angles.theta2);

  useEffect(() => {
    const target = phase === 'reach-object' ? OBJECT_POS : phase === 'holding' ? DROP_POS : null;
    if (!target) return;
    const dist = Math.hypot(end.x - target.x, end.y - target.y);
    if (dist < REACH_TOLERANCE) {
      if (phase === 'reach-object') { setPhase('holding'); setMessage('Object gripped! Now reach the drop zone.'); }
      else if (phase === 'holding') { setPhase('delivered'); setMessage('Delivered! A real pick-and-place, start to finish.'); }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [angles]);

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const sx = ((e.clientX - rect.left) / rect.width) * 200;
    const sy = ((e.clientY - rect.top) / rect.height) * 200;
    const armX = sx - ARM_BASE.x, armY = ARM_BASE.y - sy;
    const solved = inverseKinematics2Link(ARM_L1, ARM_L2, armX, armY);
    if (!solved) { setMessage('Out of reach! Click closer to the arm.'); return; }
    setAngles(solved);
    setMessage(null);
  };
  const reset = () => { setAngles({ theta1: Math.PI / 2, theta2: 0 }); setPhase('reach-object'); setMessage(null); };

  const j1 = { x: ARM_BASE.x + ARM_L1 * Math.cos(angles.theta1), y: ARM_BASE.y - ARM_L1 * Math.sin(angles.theta1) };
  const j2 = { x: ARM_BASE.x + end.x, y: ARM_BASE.y - end.y };
  const heldPos = phase === 'holding' ? j2 : phase === 'reach-object' ? { x: ARM_BASE.x + OBJECT_POS.x, y: ARM_BASE.y - OBJECT_POS.y } : { x: ARM_BASE.x + DROP_POS.x, y: ARM_BASE.y - DROP_POS.y };

  return (
    <StageCard>
      <StageHeading>Click to Reach -- Real Inverse Kinematics</StageHeading>
      <p className="text-center text-xs text-slate-500">Click anywhere in reach -- the arm solves its own joint angles to get there. Grab the box, then deliver it to the drop zone.</p>
      <div className="flex justify-center">
        <svg ref={svgRef} viewBox="0 0 200 200" onClick={handleClick} className="w-64 h-64 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 cursor-crosshair">
          {phase !== 'delivered' && <circle cx={ARM_BASE.x + DROP_POS.x} cy={ARM_BASE.y - DROP_POS.y} r={REACH_TOLERANCE} className="fill-none stroke-accent-400" strokeWidth={1.5} strokeDasharray="3 3" style={{ opacity: phase === 'holding' ? 1 : 0.3 }} />}
          <circle cx={ARM_BASE.x} cy={ARM_BASE.y} r={6} className="fill-slate-700 dark:fill-slate-300" />
          <line x1={ARM_BASE.x} y1={ARM_BASE.y} x2={j1.x} y2={j1.y} className="stroke-primary-600" strokeWidth={6} strokeLinecap="round" />
          <line x1={j1.x} y1={j1.y} x2={j2.x} y2={j2.y} className="stroke-primary-400" strokeWidth={5} strokeLinecap="round" />
          <circle cx={j1.x} cy={j1.y} r={4} className="fill-slate-700 dark:fill-slate-300" />
          <circle cx={j2.x} cy={j2.y} r={5} className="fill-accent-500" />
          <text x={heldPos.x} y={heldPos.y + 4} textAnchor="middle" fontSize={16}>{phase === 'delivered' ? '' : '\u{1F4E6}'}</text>
        </svg>
      </div>
      <div className="flex justify-center gap-2">
        <button onClick={reset} className={btnSecondary}><RotateCcw className="w-4 h-4" /> Reset</button>
      </div>
      <p className={`text-center text-sm font-bold ${phase === 'delivered' ? 'text-accent-600' : 'text-slate-500'}`}>
        {phase === 'delivered' && <Sparkles className="w-4 h-4 inline mr-1 -mt-0.5" />}
        {message ?? (phase === 'reach-object' ? 'Click the \u{1F4E6} to grip it.' : 'Reach the dashed drop zone.')}
      </p>
    </StageCard>
  );
}

// ============================================================================
// 3. Gear Train Design Challenge
// ============================================================================
const GEAR_OPTIONS = [10, 15, 20, 25, 30, 40];
function GearDesignChallengeScene({ config }: { config: any }) {
  const requiredTorque = config.requiredTorqueNcm ?? 45;
  const inputTorque = config.inputTorqueNcm ?? 12;
  const inputRPM = config.inputRPM ?? 300;
  const [inputTeeth, setInputTeeth] = useState(10);
  const [outputTeeth, setOutputTeeth] = useState(10);

  const achievedTorque = gearOutputTorque(inputTorque, inputTeeth, outputTeeth);
  const achievedRPM = gearOutputRPM(inputRPM, inputTeeth, outputTeeth);
  const solved = achievedTorque >= requiredTorque;

  return (
    <StageCard>
      <StageHeading>Design a Gear Train</StageHeading>
      <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3 text-center">
        <p className="text-xs text-slate-500">Your motor delivers <span className="font-bold">{inputTorque} N&middot;cm</span> at <span className="font-bold">{inputRPM} RPM</span> -- but this task needs at least <span className="font-bold text-primary-600">{requiredTorque} N&middot;cm</span> of torque. Pick gears to get there.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <label className="block text-xs font-bold text-slate-500 space-y-1">
          <span>Input gear teeth ({inputTeeth})</span>
          <input type="range" min={0} max={GEAR_OPTIONS.length - 1} step={1} value={GEAR_OPTIONS.indexOf(inputTeeth)} onChange={(e) => setInputTeeth(GEAR_OPTIONS[parseInt(e.target.value, 10)])} className="w-full accent-primary-600" />
        </label>
        <label className="block text-xs font-bold text-slate-500 space-y-1">
          <span>Output gear teeth ({outputTeeth})</span>
          <input type="range" min={0} max={GEAR_OPTIONS.length - 1} step={1} value={GEAR_OPTIONS.indexOf(outputTeeth)} onChange={(e) => setOutputTeeth(GEAR_OPTIONS[parseInt(e.target.value, 10)])} className="w-full accent-primary-600" />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className={`rounded-xl p-3 ${solved ? 'bg-accent-50 dark:bg-accent-900/20' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
          <p className="text-[9px] font-bold text-slate-400 uppercase">Achieved Torque</p>
          <p className={`text-base font-mono font-bold ${solved ? 'text-accent-600' : 'text-slate-700 dark:text-slate-200'}`}>{achievedTorque.toFixed(1)} N&middot;cm</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3">
          <p className="text-[9px] font-bold text-slate-400 uppercase">Achieved Speed</p>
          <p className="text-base font-mono font-bold text-slate-700 dark:text-slate-200">{achievedRPM.toFixed(0)} RPM</p>
        </div>
      </div>
      <p className={`text-center text-sm font-bold ${solved ? 'text-accent-600' : 'text-slate-500'}`}>
        {solved ? <><Sparkles className="w-4 h-4 inline mr-1 -mt-0.5" />Torque target met -- but notice the speed cost: {inputRPM} RPM down to {achievedRPM.toFixed(0)} RPM.</> : 'Not enough torque yet -- try a bigger output gear relative to the input.'}
      </p>
    </StageCard>
  );
}

// ============================================================================
// 4. Stepper Motor Precision Positioning
// ============================================================================
function StepperPrecisionScene() {
  const [target, setTarget] = useState(137);
  const [mode, setMode] = useState<'full' | 'half'>('full');
  const stepsPerRev = mode === 'full' ? 200 : 400;
  const degPerStep = stepperDegreesPerStep(stepsPerRev);
  const [steps, setSteps] = useState(0);

  const achieved = (steps * degPerStep) % 360;
  const error = Math.min(Math.abs(achieved - target), 360 - Math.abs(achieved - target));
  const onTarget = error < 2;

  const newTarget = () => { setTarget(Math.floor(Math.random() * 350) + 5); setSteps(0); };

  return (
    <StageCard>
      <StageHeading>Land the Stepper on Target</StageHeading>
      <p className="text-center text-xs text-slate-500">Target: {target}&deg;. Each step moves exactly {degPerStep.toFixed(2)}&deg; ({mode === 'full' ? '200' : '400'} steps/rev) -- pick a step count that lands as close as possible.</p>
      <div className="flex justify-center">
        <svg viewBox="0 0 200 200" className="w-52 h-52">
          <circle cx={100} cy={100} r={85} className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth={2} />
          <line x1={100} y1={100} x2={100 + 75 * Math.sin((target * Math.PI) / 180)} y2={100 - 75 * Math.cos((target * Math.PI) / 180)} className="stroke-accent-400" strokeWidth={2} strokeDasharray="4 3" />
          <line x1={100} y1={100} x2={100 + 65 * Math.sin((achieved * Math.PI) / 180)} y2={100 - 65 * Math.cos((achieved * Math.PI) / 180)} className={onTarget ? 'stroke-accent-600' : 'stroke-primary-600'} strokeWidth={4} strokeLinecap="round" />
          <circle cx={100} cy={100} r={5} className="fill-slate-700 dark:fill-slate-300" />
        </svg>
      </div>
      <div className="flex justify-center gap-1.5">
        <button onClick={() => setMode('full')} className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${mode === 'full' ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-200 dark:border-slate-800'}`}>Full step (1.8&deg;)</button>
        <button onClick={() => setMode('half')} className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${mode === 'half' ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-200 dark:border-slate-800'}`}>Half step (0.9&deg;)</button>
      </div>
      <label className="block text-xs font-bold text-slate-500 space-y-1 max-w-sm mx-auto">
        <span>Step count ({steps} steps = {(steps * degPerStep).toFixed(1)}&deg;)</span>
        <input type="range" min={0} max={stepsPerRev} step={1} value={steps} onChange={(e) => setSteps(parseInt(e.target.value, 10))} className="w-full accent-primary-600" />
      </label>
      <div className="flex justify-center">
        <button onClick={newTarget} className={btnSecondary}><RefreshCw className="w-4 h-4" /> New Target</button>
      </div>
      <p className={`text-center text-sm font-bold ${onTarget ? 'text-accent-600' : 'text-slate-500'}`}>
        Achieved: {achieved.toFixed(1)}&deg; &middot; Off by {error.toFixed(1)}&deg;{onTarget ? ' -- on target!' : ''}
      </p>
    </StageCard>
  );
}

// ============================================================================
// 5. Buzzer Tone & Alarm Lab (real Web Audio sound)
// ============================================================================
function useTonePlayer() {
  const ctxRef = useRef<AudioContext | null>(null);
  const play = (freqHz: number, durationMs = 400) => {
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
  };
  return play;
}
function BuzzerToneLabScene() {
  const play = useTonePlayer();
  const [freq, setFreq] = useState(440);

  return (
    <StageCard>
      <StageHeading>Play a Real, Audible Tone</StageHeading>
      <p className="text-center text-xs text-slate-500">Each preset is a real named musical pitch, computed from the actual equal-temperament frequency formula. Turn your sound on.</p>
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
        <button onClick={() => play(freq)} className={btnPrimary}><Volume2 className="w-4 h-4" /> Play {freq} Hz</button>
      </div>
    </StageCard>
  );
}

// ============================================================================
// 6. Morse Code LED Blinker
// ============================================================================
function MorseLedBlinkerScene() {
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
    <StageCard>
      <StageHeading>Blink It Out in Real Morse Code</StageHeading>
      <p className="text-center text-xs text-slate-500">Real ITU timing: a dash lasts exactly 3x a dot, with correctly-proportioned gaps between letters.</p>
      <div className="flex justify-center">
        <div className={`w-16 h-16 rounded-full border-4 transition-all ${on ? 'bg-amber-400 border-amber-500 shadow-[0_0_24px_8px_rgba(251,191,36,0.6)]' : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700'}`} />
      </div>
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
        <button onClick={play} disabled={playing || !text.trim()} className={btnPrimary}><Play className="w-4 h-4" /> Blink It</button>
      </div>
    </StageCard>
  );
}

// ============================================================================
// 7. RGB LED Color Mixer
// ============================================================================
function RgbPwmMixerScene() {
  const [r, setR] = useState(255);
  const [g, setG] = useState(180);
  const [b, setB] = useState(0);
  const color = rgbDutyCyclesToCss(r, g, b);

  return (
    <StageCard>
      <StageHeading>Mix a Real Status LED Color</StageHeading>
      <p className="text-center text-xs text-slate-500">Each slider is a real 0-255 PWM duty cycle -- the exact range a microcontroller uses to drive an RGB LED&apos;s brightness per channel.</p>
      <div className="flex justify-center">
        <div className="w-24 h-24 rounded-full border-4 border-slate-900 dark:border-slate-200 shadow-lg" style={{ background: color }} />
      </div>
      <div className="space-y-2 max-w-sm mx-auto">
        <label className="block text-xs font-bold text-red-500 space-y-1">
          <span>Red ({r})</span>
          <input type="range" min={0} max={255} value={r} onChange={(e) => setR(parseInt(e.target.value, 10))} className="w-full accent-red-500" />
        </label>
        <label className="block text-xs font-bold text-accent-600 space-y-1">
          <span>Green ({g})</span>
          <input type="range" min={0} max={255} value={g} onChange={(e) => setG(parseInt(e.target.value, 10))} className="w-full accent-accent-500" />
        </label>
        <label className="block text-xs font-bold text-primary-600 space-y-1">
          <span>Blue ({b})</span>
          <input type="range" min={0} max={255} value={b} onChange={(e) => setB(parseInt(e.target.value, 10))} className="w-full accent-primary-600" />
        </label>
      </div>
      <p className="text-center text-sm font-mono font-bold text-slate-600 dark:text-slate-300">{color}</p>
    </StageCard>
  );
}

// ============================================================================
// 8. Self-Balancing Robot: PID Tuning
// ============================================================================
function BalancePidTuningScene() {
  const [kp, setKp] = useState(0);
  const [ki, setKi] = useState(0);
  const [kd, setKd] = useState(0);
  const [angle, setAngle] = useState(0);
  const [running, setRunning] = useState(false);
  const [fallen, setFallen] = useState(false);
  const [survivedMs, setSurvivedMs] = useState(0);
  const stateRef = useRef({ angle: 0, pid: PID_ZERO_STATE });

  const start = () => { stateRef.current = { angle: 0, pid: PID_ZERO_STATE }; setAngle(0); setFallen(false); setSurvivedMs(0); setRunning(true); };

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
      setAngle(nextAngle);
      setSurvivedMs(Date.now() - startTime);
      if (Math.abs(nextAngle) > 45) { setFallen(true); setRunning(false); }
    }, 100);
    return () => clearInterval(interval);
  }, [running, kp, ki, kd]);

  return (
    <StageCard>
      <StageHeading>Tune the Balance Controller</StageHeading>
      <p className="text-center text-xs text-slate-500">No buttons to tap -- the PID controller reacts on its own. Find the gains that keep it upright against random pushes.</p>
      <div className="relative h-32 flex items-end justify-center">
        <div className="w-20 h-20 origin-bottom transition-transform" style={{ transform: `rotate(${angle}deg)` }}>
          <Bot className={`w-full h-full ${fallen ? 'text-red-500' : 'text-primary-600'}`} />
        </div>
        <div className="absolute bottom-0 w-40 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
      </div>
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
        <button onClick={start} className={btnPrimary}><Play className="w-4 h-4" /> {running ? 'Restart' : 'Start Balancing'}</button>
      </div>
      <p className="text-center text-sm font-bold text-slate-500">
        {fallen ? `Fell after ${(survivedMs / 1000).toFixed(1)}s -- try raising Kp, or adding a little Kd to damp the wobble.` : running ? `Balancing for ${(survivedMs / 1000).toFixed(1)}s...` : 'Press Start to begin.'}
      </p>
    </StageCard>
  );
}

// Minimal local Bot icon (avoids importing the whole lucide Bot just for
// this one glyph reuse -- kept identical in spirit to RoboticsStage.tsx's
// balance scene).
function Bot({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
    </svg>
  );
}
