'use client';
import { useEffect, useRef, useState } from 'react';
import { Cpu, Zap } from 'lucide-react';
import { RoboticsFundamentalPlaygroundType, FormulaLabConfig } from '@edusheets/content';
import {
  ultrasonicEchoTimeUs, servoPulseWidthMsToAngle, stepperRPM, gearOutputRPM,
  encoderDistanceCm, pControllerOutput, differentialAngularVelocity,
} from '@/lib/roboticsEngineeringEngine';

// The playable layer behind Robotics Lab's Fundamentals section -- every
// number shown is computed from a real, verified engineering formula (see
// roboticsEngineeringEngine.ts), not an illustrative animation. Three
// dispatch types: 'formula-lab' is a single generic slider-in/formula-out
// component reused across 6 different real formulas (ultrasonic timing,
// servo PWM, stepper RPM, gear ratios, encoder odometry, P-control),
// 'differential-drive' and 'board-compare' are bespoke.
export default function RoboticsFundamentalStage({ type, config }: { type: RoboticsFundamentalPlaygroundType; config: Record<string, unknown> }) {
  switch (type) {
    case 'formula-lab': return <FormulaLabScene config={config as unknown as FormulaLabConfig} />;
    case 'differential-drive': return <DifferentialDriveScene />;
    case 'board-compare': return <BoardCompareScene />;
    default: return null;
  }
}

function StageCard({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border-2 border-dashed border-primary-300 dark:border-primary-800 bg-primary-50/40 dark:bg-primary-950/10 p-4 md:p-5 space-y-3">{children}</div>;
}

// -- Generic formula lab ------------------------------------------------------
function computeFormula(formulaKey: FormulaLabConfig['formulaKey'], input: number): number {
  switch (formulaKey) {
    case 'ultrasonic': return ultrasonicEchoTimeUs(input);
    case 'servo': return servoPulseWidthMsToAngle(input);
    case 'stepper': return stepperRPM(input, 200); // standard 200 steps/rev (1.8deg/step)
    case 'gear': return gearOutputRPM(100, 20, input); // fixed 20-tooth input gear @ 100 RPM
    case 'encoder': return encoderDistanceCm(input, 360, 6.5); // fixed 360 PPR, 6.5cm wheel
    case 'p-controller': return pControllerOutput(2.0, input); // fixed Kp = 2.0
    default: return 0;
  }
}

function FormulaLabScene({ config }: { config: FormulaLabConfig }) {
  const { inputLabel, inputUnit, inputMin, inputMax, inputDefault, outputLabel, outputUnit, formulaDisplay, extraNote, formulaKey } = config;
  const [input, setInput] = useState(inputDefault);
  const output = computeFormula(formulaKey, input);
  const step = inputMax - inputMin > 50 ? 1 : 0.1;

  return (
    <StageCard>
      <div className="flex items-center gap-2 text-sm font-bold text-primary-700 dark:text-primary-300">
        <Zap className="w-4 h-4" /> Try It Yourself
      </div>
      <p className="text-center font-mono text-xs bg-slate-900 text-slate-50 dark:bg-slate-950 rounded-lg px-3 py-2 overflow-x-auto">{formulaDisplay}</p>
      {extraNote && <p className="text-center text-[11px] text-slate-400">{extraNote}</p>}
      <label className="block text-xs font-bold text-slate-500 space-y-1.5">
        <span>{inputLabel} ({input}{inputUnit})</span>
        <input type="range" min={inputMin} max={inputMax} step={step} value={input} onChange={(e) => setInput(parseFloat(e.target.value))} className="w-full accent-primary-600" />
      </label>
      <div className="rounded-xl bg-white dark:bg-slate-900 border-2 border-primary-200 dark:border-primary-800 p-4 text-center">
        <p className="text-[10px] font-bold text-primary-600 uppercase">{outputLabel}</p>
        <p className="font-display text-2xl font-bold">{Number.isFinite(output) ? output.toFixed(output % 1 === 0 ? 0 : 2) : '--'} {outputUnit}</p>
      </div>
    </StageCard>
  );
}

// -- Differential drive steering ----------------------------------------------
function DifferentialDriveScene() {
  const WHEELBASE = 20;
  const [left, setLeft] = useState(5);
  const [right, setRight] = useState(5);
  const [heading, setHeading] = useState(0);
  const omega = differentialAngularVelocity(left, right, WHEELBASE);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeading((h) => (h + omega * 6) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, [omega]);

  return (
    <StageCard>
      <div className="flex items-center gap-2 text-sm font-bold text-primary-700 dark:text-primary-300">
        <Zap className="w-4 h-4" /> Try It Yourself
      </div>
      <p className="text-center font-mono text-xs bg-slate-900 text-slate-50 dark:bg-slate-950 rounded-lg px-3 py-2">ω = (right − left) ÷ wheelbase</p>
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center transition-transform" style={{ transform: `rotate(${heading}deg)` }}>
          <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[16px] border-b-white" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <label className="block text-xs font-bold text-slate-500 space-y-1.5">
          <span>Left Wheel Speed ({left})</span>
          <input type="range" min={-10} max={10} value={left} onChange={(e) => setLeft(parseFloat(e.target.value))} className="w-full accent-primary-600" />
        </label>
        <label className="block text-xs font-bold text-slate-500 space-y-1.5">
          <span>Right Wheel Speed ({right})</span>
          <input type="range" min={-10} max={10} value={right} onChange={(e) => setRight(parseFloat(e.target.value))} className="w-full accent-primary-600" />
        </label>
      </div>
      <p className="text-center text-sm font-bold text-slate-600 dark:text-slate-300">
        ω = {omega.toFixed(2)} °/tick -- {omega === 0 ? 'driving straight' : omega > 0 ? 'curving left' : 'curving right'}
      </p>
    </StageCard>
  );
}

// -- Board compare mini-game --------------------------------------------------
const BOARD_TASKS: { task: string; answer: 'arduino' | 'raspberry-pi'; reason: string }[] = [
  { task: 'Read an ultrasonic sensor and instantly stop a motor before a collision', answer: 'arduino', reason: 'Needs fast, predictable real-time response -- no operating system to introduce delay.' },
  { task: "Run a computer-vision model to recognize objects from a camera feed", answer: 'raspberry-pi', reason: 'Needs real processing power and often a full OS-level vision library -- an 8-bit microcontroller cannot run this.' },
  { task: 'Precisely time a servo motor pulse down to the microsecond', answer: 'arduino', reason: "A microcontroller's predictable timing (no OS interrupting it) is exactly suited to this." },
  { task: 'Host a webpage so a phone can control the robot over WiFi', answer: 'raspberry-pi', reason: 'Running a web server is a multi-program, OS-level task -- straightforward for a full computer, not for a microcontroller.' },
  { task: 'Keep a self-balancing robot upright with a tight PID control loop', answer: 'arduino', reason: 'Balance control needs a guaranteed, jitter-free update rate -- exactly what a dedicated microcontroller with no OS overhead provides.' },
];

function BoardCompareScene() {
  const [idx, setIdx] = useState(0);
  const [answered, setAnswered] = useState<'arduino' | 'raspberry-pi' | null>(null);
  const task = BOARD_TASKS[idx];
  const correct = answered === task.answer;

  const answer = (choice: 'arduino' | 'raspberry-pi') => setAnswered(choice);
  const next = () => { setIdx((i) => (i + 1) % BOARD_TASKS.length); setAnswered(null); };

  return (
    <StageCard>
      <div className="flex items-center gap-2 text-sm font-bold text-primary-700 dark:text-primary-300">
        <Cpu className="w-4 h-4" /> Try It Yourself
      </div>
      <p className="text-center text-sm font-bold">{task.task}</p>
      <div className="flex justify-center gap-3">
        <button onClick={() => answer('arduino')} disabled={!!answered} className="px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 font-bold text-sm hover:border-primary-400 disabled:opacity-60">Arduino (microcontroller)</button>
        <button onClick={() => answer('raspberry-pi')} disabled={!!answered} className="px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 font-bold text-sm hover:border-primary-400 disabled:opacity-60">Raspberry Pi (microprocessor)</button>
      </div>
      {answered && (
        <div className={`rounded-xl p-3 text-center text-sm font-bold ${correct ? 'bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-300' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'}`}>
          {correct ? 'Right choice!' : `Better fit: ${task.answer === 'arduino' ? 'Arduino' : 'Raspberry Pi'}.`} {task.reason}
        </div>
      )}
      <div className="flex justify-center">
        {answered && <button onClick={next} className="px-4 py-2 rounded-lg bg-primary-600 text-white font-bold text-xs">Next Task</button>}
      </div>
    </StageCard>
  );
}
