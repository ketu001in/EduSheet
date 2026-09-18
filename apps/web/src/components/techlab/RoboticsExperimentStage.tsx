'use client';
import dynamic from 'next/dynamic';
import { ExperimentPlaygroundType } from '@edusheets/content';

// Robotics Lab's Hands-On Experiments dispatcher. Every scene here is a
// real 3D scene (solid geometry, real materials, shadows, and continuous
// or eased animation via SafeR3FCanvas) -- direct response to fair
// feedback that the original flat-SVG/DOM versions read as wireframe
// diagrams, not a lab. Each scene stays backed by the exact same verified
// formulas as before (see roboticsEngineeringEngine.ts/roboticsEngine.ts)
// -- only the RENDERING changed, never the underlying math. Dynamically
// imported (ssr:false) so Three.js only downloads when a visitor
// actually opens one of these, same discipline as Model3DViewer.
const dyn = (loader: () => Promise<{ default: React.ComponentType<any> }>) => dynamic(loader, {
  ssr: false,
  loading: () => <div className="w-full h-64 rounded-2xl bg-slate-50 dark:bg-slate-900/40 animate-pulse" />,
});

const PidLineFollowerScene = dyn(() => import('@/components/techlab/LineFollower3DScene'));
const ArmScene = dyn(() => import('@/components/techlab/Arm3DScene'));
const GearScene = dyn(() => import('@/components/techlab/Gear3DScene'));
const StepperScene = dyn(() => import('@/components/techlab/Stepper3DScene'));
const BuzzerScene = dyn(() => import('@/components/techlab/Buzzer3DScene'));
const MorseScene = dyn(() => import('@/components/techlab/Morse3DScene'));
const RgbScene = dyn(() => import('@/components/techlab/Rgb3DScene'));
const BalanceScene = dyn(() => import('@/components/techlab/Balance3DScene'));
const MazeScene = dyn(() => import('@/components/techlab/Maze3DScene'));
const ObstacleScene = dyn(() => import('@/components/techlab/ObstacleCourse3DScene'));
const SwarmScene = dyn(() => import('@/components/techlab/Swarm3DScene'));

export default function RoboticsExperimentStage({ type, config }: { type: ExperimentPlaygroundType; config: Record<string, any> }) {
  switch (type) {
    case 'pid-line-follower': return <PidLineFollowerScene />;
    case 'arm-reach-grab': return <ArmScene />;
    case 'gear-design-challenge': return <GearScene config={config} />;
    case 'stepper-precision': return <StepperScene />;
    case 'buzzer-tone-lab': return <BuzzerScene />;
    case 'morse-led-blinker': return <MorseScene />;
    case 'rgb-pwm-mixer': return <RgbScene />;
    case 'balance-pid-tuning': return <BalanceScene />;
    case 'maze-pathfinding': return <MazeScene />;
    case 'obstacle-course': return <ObstacleScene />;
    case 'swarm-playground': return <SwarmScene />;
    default: return null;
  }
}
