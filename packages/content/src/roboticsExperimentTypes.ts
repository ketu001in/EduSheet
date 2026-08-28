// Shared types for Robotics Lab's "Hands-On Experiments Laboratory" tab --
// the direct response to blunt, fair feedback that the existing
// Fundamentals/Applications tabs, however real their content, are still
// fundamentally a knowledgebase with widgets embedded in it: every
// interactive there is a single-formula calculator isolated to one
// fact-card, nothing lets a student actually DESIGN something, run it,
// watch it succeed or fail, change a parameter, and run it again. This is
// that: a genuine experiment, one design-and-iterate loop at a time,
// each one combining real formulas already verified in
// roboticsEngineeringEngine.ts (or newly added there) into something you
// build rather than a value you read.
export type ExperimentCategory =
  | 'control-systems'
  | 'kinematics-motion'
  | 'mechanical-design'
  | 'sensing-navigation'
  | 'sound-light-output'
  | 'swarm-multi-robot';

export type ExperimentOutputType = 'motion' | 'sound' | 'light' | 'visual';
export type ExperimentDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type ExperimentPlaygroundType =
  | 'pid-line-follower'
  | 'arm-reach-grab'
  | 'gear-design-challenge'
  | 'stepper-precision'
  | 'buzzer-tone-lab'
  | 'morse-led-blinker'
  | 'rgb-pwm-mixer'
  | 'balance-pid-tuning'
  | 'maze-pathfinding'
  | 'obstacle-course'
  | 'swarm-playground';

export interface RoboticsExperiment {
  id: string;
  category: ExperimentCategory;
  name: string;
  tagline: string;
  overview: string;
  whatYoullDo: string[];
  realWorldTieIn: string;
  componentsUsed: string[];
  outputType: ExperimentOutputType;
  difficulty: ExperimentDifficulty;
  playgroundType: ExperimentPlaygroundType;
  playgroundConfig?: Record<string, unknown>;
}
