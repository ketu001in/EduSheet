'use client';
import { useEffect, useRef, useState } from 'react';
import { Hand, Play, RotateCcw, Zap, Bot } from 'lucide-react';
import { RoboticsPlaygroundType } from '@edusheets/content';
import { bfsShortestPath, GridCell } from '@/lib/roboticsEngine';

// Renders whichever of Robotics Lab's 7 playable simulations matches the
// current playgroundType, parameterized per-robot via `config` -- same
// "one Scene per type, reused across many curated entries" pattern as
// ChemPhysicalStage.tsx. Every simulation here is a genuine interaction,
// not a static diagram: the user places obstacles, drags a claw, tunes a
// sensor threshold, or keeps a robot balanced, and sees a real, immediate
// result -- direct response to "let him have the option to play around".
export default function RoboticsStage({ type, config }: { type: RoboticsPlaygroundType; config: Record<string, any> }) {
  switch (type) {
    case 'pick-and-place': return <PickAndPlaceScene config={config} />;
    case 'path-planning': return <PathPlanningScene config={config} />;
    case 'sensor-threshold': return <SensorThresholdScene config={config} />;
    case 'obstacle-avoidance': return <ObstacleAvoidanceScene config={config} />;
    case 'swarm-simulation': return <SwarmSimulationScene config={config} />;
    case 'gesture-match': return <GestureMatchScene config={config} />;
    case 'balance-control': return <BalanceControlScene config={config} />;
    default: return null;
  }
}

function StageCard({ children }: { children: React.ReactNode }) {
  return <div className="glass-card rounded-3xl p-5 md:p-7 space-y-4">{children}</div>;
}

// -- 1. Pick and Place -------------------------------------------------------
type PickStep = 'at-pick' | 'gripped' | 'at-place' | 'done';
function PickAndPlaceScene({ config }: { config: any }) {
  const { itemLabel, itemColor, pickZoneLabel, placeZoneLabel, scenario } = config;
  const [step, setStep] = useState<PickStep>('at-pick');

  const reset = () => setStep('at-pick');
  const itemX = step === 'at-pick' || step === 'gripped' ? '18%' : '78%';

  return (
    <StageCard>
      <p className="text-center text-sm text-slate-500">{scenario}</p>
      <div className="relative h-40 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border-2 border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1/2 border-r-2 border-dashed border-slate-300 dark:border-slate-700 flex items-end justify-center pb-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase">{pickZoneLabel}</span>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-end justify-center pb-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase">{placeZoneLabel}</span>
        </div>
        <div
          className="absolute top-8 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-700 ease-in-out"
          style={{ left: itemX, transform: 'translateX(-50%)', backgroundColor: itemColor }}
        >
          <span className="text-[9px] font-bold text-white text-center leading-none">{itemLabel.slice(0, 2)}</span>
        </div>
        <Hand className={`absolute top-2 w-6 h-6 transition-all duration-700 ease-in-out ${step === 'gripped' || step === 'at-place' || step === 'done' ? 'text-primary-600' : 'text-slate-400'}`} style={{ left: itemX, transform: 'translateX(-50%)' }} />
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <button onClick={() => setStep('gripped')} disabled={step !== 'at-pick'} className="px-3.5 py-2 rounded-lg text-xs font-bold border-2 border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:border-primary-400">1. Grip {itemLabel}</button>
        <button onClick={() => setStep('at-place')} disabled={step !== 'gripped'} className="px-3.5 py-2 rounded-lg text-xs font-bold border-2 border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:border-primary-400">2. Move to {placeZoneLabel}</button>
        <button onClick={() => setStep('done')} disabled={step !== 'at-place'} className="px-3.5 py-2 rounded-lg text-xs font-bold border-2 border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:border-primary-400">3. Release</button>
        <button onClick={reset} className="px-3.5 py-2 rounded-lg text-xs font-bold border-2 border-slate-200 dark:border-slate-800 flex items-center gap-1.5"><RotateCcw className="w-3.5 h-3.5" /> Reset</button>
      </div>
      {step === 'done' && (
        <div className="rounded-xl p-3 text-center text-sm font-bold bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-300">
          Delivered! That precise grip-move-release sequence is exactly what a real robotic arm repeats thousands of times a day.
        </div>
      )}
    </StageCard>
  );
}

// -- 2. Path Planning (verified BFS) -----------------------------------------
function PathPlanningScene({ config }: { config: any }) {
  const [gw, gh] = config.gridSize as [number, number];
  const { startLabel, goalLabel, obstacleLabel } = config;
  const start: GridCell = [0, 0];
  const goal: GridCell = [gh - 1, gw - 1];
  const [blocked, setBlocked] = useState<Set<string>>(new Set());
  const [path, setPath] = useState<GridCell[] | null>(null);
  const [searched, setSearched] = useState(false);

  const key = (r: number, c: number) => `${r},${c}`;

  const toggle = (r: number, c: number) => {
    if ((r === start[0] && c === start[1]) || (r === goal[0] && c === goal[1])) return;
    setSearched(false);
    setPath(null);
    setBlocked((prev) => {
      const next = new Set(prev);
      const k = key(r, c);
      if (next.has(k)) next.delete(k); else next.add(k);
      return next;
    });
  };

  const findPath = () => {
    const result = bfsShortestPath(gh, gw, blocked, start, goal);
    setPath(result);
    setSearched(true);
  };

  const pathSet = new Set((path || []).map(([r, c]) => key(r, c)));

  return (
    <StageCard>
      <p className="text-center text-xs text-slate-500">Click cells to place {obstacleLabel.toLowerCase()}s, then find the real shortest path (breadth-first search -- the same class of algorithm that plans these robots' actual routes).</p>
      <div className="flex justify-center">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${gw}, minmax(0, 1fr))` }}>
          {Array.from({ length: gh }, (_, r) => Array.from({ length: gw }, (_, c) => {
            const isStart = r === start[0] && c === start[1];
            const isGoal = r === goal[0] && c === goal[1];
            const isBlocked = blocked.has(key(r, c));
            const onPath = pathSet.has(key(r, c));
            return (
              <button
                key={key(r, c)}
                onClick={() => toggle(r, c)}
                title={isStart ? startLabel : isGoal ? goalLabel : undefined}
                className={`w-8 h-8 rounded-md border-2 text-[9px] font-bold flex items-center justify-center transition-colors ${
                  isStart ? 'bg-accent-500 border-accent-600 text-white'
                  : isGoal ? 'bg-primary-600 border-primary-700 text-white'
                  : isBlocked ? 'bg-slate-700 border-slate-800 dark:bg-slate-600'
                  : onPath ? 'bg-primary-200 dark:bg-primary-800 border-primary-400'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-primary-300'
                }`}
              >
                {isStart ? 'S' : isGoal ? 'G' : ''}
              </button>
            );
          }))}
        </div>
      </div>
      <div className="flex justify-center gap-2">
        <button onClick={findPath} className="px-4 py-2 rounded-lg bg-primary-600 text-white font-bold text-sm flex items-center gap-1.5"><Play className="w-4 h-4" /> Find Path</button>
        <button onClick={() => { setBlocked(new Set()); setPath(null); setSearched(false); }} className="px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-800 font-bold text-sm flex items-center gap-1.5"><RotateCcw className="w-4 h-4" /> Clear</button>
      </div>
      {searched && (
        <p className={`text-center text-sm font-bold ${path ? 'text-accent-600' : 'text-amber-600'}`}>
          {path ? `Shortest path found: ${path.length - 1} steps from ${startLabel} to ${goalLabel}.` : `No path exists -- these obstacles completely seal off the ${goalLabel.toLowerCase()}. Remove some and try again.`}
        </p>
      )}
    </StageCard>
  );
}

// -- 3. Sensor + Threshold ----------------------------------------------------
function SensorThresholdScene({ config }: { config: any }) {
  const { sensorLabel, sensorUnit, sensorMin, sensorMax, thresholdDefault, actuatorLabel, actuatorOnText, actuatorOffText, higherTriggers } = config;
  const [reading, setReading] = useState<number>(thresholdDefault);
  const [threshold, setThreshold] = useState<number>(thresholdDefault);
  const triggered = higherTriggers ? reading >= threshold : reading <= threshold;

  return (
    <StageCard>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-500">{sensorLabel} ({reading}{sensorUnit})</span>
          <input type="range" min={sensorMin} max={sensorMax} value={reading} onChange={(e) => setReading(parseFloat(e.target.value))} className="w-full accent-primary-600" />
        </div>
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-500">Trigger Threshold ({threshold}{sensorUnit})</span>
          <input type="range" min={sensorMin} max={sensorMax} value={threshold} onChange={(e) => setThreshold(parseFloat(e.target.value))} className="w-full accent-amber-500" />
        </div>
      </div>
      <div className="relative h-6 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div className="absolute inset-y-0 bg-primary-400 dark:bg-primary-700 transition-all" style={{ width: `${((reading - sensorMin) / (sensorMax - sensorMin)) * 100}%` }} />
        <div className="absolute inset-y-0 w-0.5 bg-amber-500" style={{ left: `${((threshold - sensorMin) / (sensorMax - sensorMin)) * 100}%` }} />
      </div>
      <div className={`rounded-xl p-4 text-center font-bold flex items-center justify-center gap-2 ${triggered ? 'bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-300' : 'bg-slate-50 dark:bg-slate-800/50 text-slate-500'}`}>
        <Zap className="w-4 h-4" /> {actuatorLabel}: {triggered ? actuatorOnText : actuatorOffText}
      </div>
    </StageCard>
  );
}

// -- 4. Obstacle Avoidance ----------------------------------------------------
function ObstacleAvoidanceScene({ config }: { config: any }) {
  const { vehicleLabel, laneLength, obstacleEmoji } = config;
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
          if (next >= laneLength - 1) { setStatus('arrived'); setRunning(false); return laneLength - 1; }
          return next;
        });
      }, 500);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, obstacles, laneLength]);

  const toggleObstacle = (i: number) => {
    if (i <= position) return;
    setObstacles((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const reset = () => { setPosition(0); setObstacles(new Set()); setStatus('moving'); setRunning(false); };

  return (
    <StageCard>
      <p className="text-center text-xs text-slate-500">Click ahead on the lane to drop an obstacle {obstacleEmoji} -- watch the {vehicleLabel.toLowerCase()}'s sensor detect it and stop before impact.</p>
      <div className="flex justify-center gap-1 flex-wrap">
        {Array.from({ length: laneLength }, (_, i) => (
          <button key={i} onClick={() => toggleObstacle(i)} className={`w-9 h-9 rounded-lg border-2 flex items-center justify-center text-base transition-colors ${
            i === position ? 'bg-primary-600 border-primary-700' : obstacles.has(i) ? 'bg-amber-100 dark:bg-amber-900/30 border-amber-400' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}>
            {i === position ? <Bot className="w-4 h-4 text-white" /> : obstacles.has(i) ? obstacleEmoji : ''}
          </button>
        ))}
      </div>
      <div className="flex justify-center gap-2">
        <button onClick={() => setRunning((r) => !r)} disabled={status === 'arrived'} className="px-4 py-2 rounded-lg bg-primary-600 text-white font-bold text-sm flex items-center gap-1.5 disabled:opacity-50"><Play className="w-4 h-4" /> {running ? 'Pause' : 'Start'}</button>
        <button onClick={reset} className="px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-800 font-bold text-sm flex items-center gap-1.5"><RotateCcw className="w-4 h-4" /> Reset</button>
      </div>
      {status === 'stopped' && <p className="text-center text-sm font-bold text-amber-600">Obstacle detected -- the {vehicleLabel.toLowerCase()} stopped safely. Clear the obstacle ahead and press Start to continue.</p>}
      {status === 'arrived' && <p className="text-center text-sm font-bold text-accent-600">Arrived safely at the end of the lane.</p>}
    </StageCard>
  );
}

// -- 5. Swarm Simulation ------------------------------------------------------
interface Agent { x: number; y: number; vx: number; vy: number; }
function SwarmSimulationScene({ config }: { config: any }) {
  const { agentLabel, agentEmoji, defaultCount, maxCount, behaviorLabel } = config;
  const [count, setCount] = useState<number>(defaultCount);
  const [agents, setAgents] = useState<Agent[]>([]);
  const W = 320, H = 200;

  const spawn = (n: number): Agent[] => Array.from({ length: n }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2,
  }));

  useEffect(() => { setAgents(spawn(count)); }, [count]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAgents((prev) => prev.map((a, i) => {
        // Simple flocking: steer toward the average position of nearby
        // neighbours (cohesion) and average their heading (alignment) --
        // the same class of local rule real swarm robots use.
        let avgX = 0, avgY = 0, avgVx = 0, avgVy = 0, n = 0;
        for (let j = 0; j < prev.length; j++) {
          if (i === j) continue;
          const b = prev[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 60) { avgX += b.x; avgY += b.y; avgVx += b.vx; avgVy += b.vy; n++; }
        }
        let vx = a.vx, vy = a.vy;
        if (n > 0) {
          avgX /= n; avgY /= n; avgVx /= n; avgVy /= n;
          vx += (avgX - a.x) * 0.0015 + (avgVx - a.vx) * 0.03;
          vy += (avgY - a.y) * 0.0015 + (avgVy - a.vy) * 0.03;
        }
        let x = a.x + vx, y = a.y + vy;
        if (x < 0 || x > W) vx *= -1;
        if (y < 0 || y > H) vy *= -1;
        x = Math.max(0, Math.min(W, x)); y = Math.max(0, Math.min(H, y));
        const speed = Math.hypot(vx, vy) || 1;
        const capped = Math.min(speed, 2.2) / speed;
        return { x, y, vx: vx * capped, vy: vy * capped };
      }));
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <StageCard>
      <p className="text-center text-xs text-slate-500">No leader, no central plan -- each {agentLabel.toLowerCase()} only reacts to its nearby neighbours, and {behaviorLabel.toLowerCase()} emerges from the whole group.</p>
      <div className="relative mx-auto rounded-2xl bg-slate-50 dark:bg-slate-900/40 border-2 border-slate-200 dark:border-slate-800 overflow-hidden" style={{ width: W, height: H }}>
        {agents.map((a, i) => (
          <span key={i} className="absolute text-sm transition-transform" style={{ left: a.x, top: a.y, transform: 'translate(-50%,-50%)' }}>{agentEmoji}</span>
        ))}
      </div>
      <div className="space-y-1.5 max-w-xs mx-auto">
        <span className="text-xs font-bold text-slate-500">Swarm Size ({count} {agentLabel.toLowerCase()}s)</span>
        <input type="range" min={4} max={maxCount} value={count} onChange={(e) => setCount(parseInt(e.target.value))} className="w-full accent-primary-600" />
      </div>
    </StageCard>
  );
}

// -- 6. Gesture / Command Match ----------------------------------------------
function GestureMatchScene({ config }: { config: any }) {
  const commands: { label: string; icon: string; actionLabel: string }[] = config.commands;
  const [promptIdx, setPromptIdx] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });

  const shuffle = (idx: number) => {
    setOptions([...commands.map((c) => c.actionLabel)].sort(() => Math.random() - 0.5));
    setPromptIdx(idx);
    setFeedback(null);
  };
  useEffect(() => { shuffle(0); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const answer = (choice: string) => {
    const correct = choice === commands[promptIdx].actionLabel;
    setFeedback(correct ? 'correct' : 'wrong');
    setScore((s) => ({ right: s.right + (correct ? 1 : 0), total: s.total + 1 }));
  };

  const next = () => shuffle(Math.floor(Math.random() * commands.length));
  const prompt = commands[promptIdx];

  return (
    <StageCard>
      <p className="text-center text-xs text-slate-500">Match each input to the correct response -- exactly the mapping this robot's software has to make in real time.</p>
      <div className="text-center space-y-1">
        <span className="text-3xl">{prompt.icon}</span>
        <p className="font-bold text-sm">{prompt.label}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {options.map((o) => (
          <button key={o} onClick={() => answer(o)} disabled={!!feedback} className="px-3 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 text-xs font-bold hover:border-primary-400 disabled:opacity-60">{o}</button>
        ))}
      </div>
      {feedback && (
        <div className={`rounded-xl p-3 text-center text-sm font-bold ${feedback === 'correct' ? 'bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-300' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'}`}>
          {feedback === 'correct' ? 'Correct!' : `Not quite -- the right response is "${prompt.actionLabel}".`}
        </div>
      )}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 font-bold">Score: {score.right}/{score.total}</span>
        {feedback && <button onClick={next} className="px-4 py-2 rounded-lg bg-primary-600 text-white font-bold text-xs">Next</button>}
      </div>
    </StageCard>
  );
}

// -- 7. Balance Control --------------------------------------------------------
function BalanceControlScene({ config }: { config: any }) {
  const { subjectLabel, disturbanceLabel, targetLabel } = config;
  const [angle, setAngle] = useState(0); // -45 (fallen left) to 45 (fallen right)
  const [running, setRunning] = useState(false);
  const [fallen, setFallen] = useState(false);
  const [survivedMs, setSurvivedMs] = useState(0);
  const angleRef = useRef(0);
  const correctionRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    const start = Date.now();
    const interval = setInterval(() => {
      const drift = (Math.random() - 0.5) * 6;
      angleRef.current += drift - correctionRef.current * 3;
      angleRef.current = Math.max(-60, Math.min(60, angleRef.current));
      setAngle(angleRef.current);
      setSurvivedMs(Date.now() - start);
      if (Math.abs(angleRef.current) > 45) {
        setFallen(true);
        setRunning(false);
      }
    }, 150);
    return () => clearInterval(interval);
  }, [running]);

  const start = () => { angleRef.current = 0; correctionRef.current = 0; setAngle(0); setFallen(false); setSurvivedMs(0); setRunning(true); };
  const correct = (dir: -1 | 1) => { correctionRef.current = dir; setTimeout(() => { correctionRef.current = 0; }, 200); };

  return (
    <StageCard>
      <p className="text-center text-xs text-slate-500">{disturbanceLabel} keeps knocking the {subjectLabel.toLowerCase()} off balance -- tap left/right to correct and hold {targetLabel.toLowerCase()} as long as you can.</p>
      <div className="relative h-32 flex items-end justify-center">
        <div className="w-24 h-24 origin-bottom transition-transform" style={{ transform: `rotate(${angle}deg)` }}>
          <Bot className={`w-full h-full ${fallen ? 'text-red-500' : 'text-primary-600'}`} />
        </div>
        <div className="absolute bottom-0 w-40 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
      </div>
      <div className="flex justify-center gap-3">
        <button onMouseDown={() => correct(-1)} disabled={!running} className="w-14 h-14 rounded-full border-2 border-slate-200 dark:border-slate-800 font-bold text-lg disabled:opacity-30">◀</button>
        <button onMouseDown={() => correct(1)} disabled={!running} className="w-14 h-14 rounded-full border-2 border-slate-200 dark:border-slate-800 font-bold text-lg disabled:opacity-30">▶</button>
      </div>
      <div className="flex justify-center">
        <button onClick={start} className="px-4 py-2 rounded-lg bg-primary-600 text-white font-bold text-sm flex items-center gap-1.5"><Play className="w-4 h-4" /> {running ? 'Restart' : 'Start Balancing'}</button>
      </div>
      <p className="text-center text-sm font-bold text-slate-500">
        {fallen ? `Fell after ${(survivedMs / 1000).toFixed(1)}s -- this is exactly why real balance control reacts many times per second, faster than a person tapping buttons ever could.` : running ? `Balanced for ${(survivedMs / 1000).toFixed(1)}s...` : 'Press Start to begin.'}
      </p>
    </StageCard>
  );
}
