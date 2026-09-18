// Shared types for Physics Lab's curated (NOT AI-generated) reference content
// -- same principle as Chem Lab's types.ts: every experiment here is
// hand-authored and verified against standard CBSE/ICSE textbook formulas,
// never generated at request time. A wrong formula silently teaches a
// misconception, which is exactly the failure mode this package is built to
// avoid. Framework-free so it can be imported by both apps/api (PDF lab
// reports) and apps/web (the interactive Physics Stage + Playground).

export type PhysicsGradeBandId = 'early' | 'junior' | 'middle' | 'senior' | 'plusTwo';

export interface PhysicsGradeBand {
  id: PhysicsGradeBandId;
  label: string;
  classNumbers: number[];
}

// Same band boundaries as Chem Lab's CHEM_GRADE_BANDS and Tech Lab's
// GRADE_BANDS, kept in sync deliberately -- one mental model for "what age
// group is this" across every lab in the app.
export const PHYSICS_GRADE_BANDS: PhysicsGradeBand[] = [
  { id: 'early', label: 'Class 1-3', classNumbers: [1, 2, 3] },
  { id: 'junior', label: 'Class 4-6', classNumbers: [4, 5, 6] },
  { id: 'middle', label: 'Class 7-8', classNumbers: [7, 8] },
  { id: 'senior', label: 'Class 9-10', classNumbers: [9, 10] },
  { id: 'plusTwo', label: 'Class 11-12', classNumbers: [11, 12] },
];

export function physicsGradeBandForClass(gradeNumber: number): PhysicsGradeBand {
  return PHYSICS_GRADE_BANDS.find((b) => b.classNumbers.includes(gradeNumber)) || PHYSICS_GRADE_BANDS[PHYSICS_GRADE_BANDS.length - 1];
}

// Deliberately small for this first pass -- see physicsExperiments.ts header
// for which branches actually have content yet.
export type PhysicsBranch = 'mechanics' | 'optics' | 'electricity' | 'waves-sound';

export interface PhysicsEquipment {
  id: string;
  name: string;
  category: PhysicsBranch;
  description: string;
  // A longer, still-factual paragraph shown behind the popup's "Deep Dive"
  // button -- working principle, real lab technique, or historical note.
  deepDive: string;
}

// The closed-form (or numerically-integrated) simulation each experiment
// drives -- see apps/web/src/lib/physicsEngine.ts for the actual math. Kept
// as a small closed vocabulary (like Chem Lab's ReactionVisualState) so the
// Physics Stage can render any experiment generically instead of needing
// bespoke per-experiment UI code.
export type PhysicsSimType = 'pendulum' | 'spring' | 'projectile' | 'lever' | 'buoyancy' | 'circuit' | 'mirror' | 'magnet';

// Describes one adjustable input as a slider -- drives both the guided
// experiment flow's per-step parameter changes and the free-play Playground.
export interface PhysicsParamConfig {
  key: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
}

export interface PhysicsExperimentStep {
  number: number;
  instruction: string;
  // Sets one or more simulation parameters when the student reaches this
  // step (e.g. { length: 2 } to have them try a longer pendulum).
  paramChanges?: Record<string, number>;
  action?: 'release' | 'measure' | 'observe' | 'reset';
  hint?: string;
}

export interface PhysicsExperiment {
  id: string;
  title: string;
  branch: PhysicsBranch;
  gradeBand: PhysicsGradeBandId;
  board: 'CBSE' | 'ICSE' | 'both';
  chapterTags: string[];
  simType: PhysicsSimType;
  defaultParams: Record<string, number>;
  paramConfig: PhysicsParamConfig[];
  apparatusIds: string[];
  // Only the pendulum uses this today -- toggling it swaps the small-angle
  // closed-form formula for a numerically-integrated nonlinear one, so
  // older students can see exactly where the textbook approximation
  // stops matching reality.
  hasSmallAngleToggle?: boolean;
  purpose: string;
  predictPrompt: string;
  predictOptions: string[];
  correctPredictIndex: number;
  formula: string;
  // Keys into defaultParams/live params, in the order they should appear
  // in the live "formula with numbers plugged in" readout panel.
  formulaVars: string[];
  steps: PhysicsExperimentStep[];
  observationPrompts: string[];
  explanation: string;
  realWorldApplications: string[];
  safetyNotes: string[];
  extensions: string[];
  realLifeNote: string;
}
