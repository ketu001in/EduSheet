// Shared types for Robotics Lab (the first deep-dive section of Tech Lab)
// -- curated (NOT AI-generated) real-world robotics applications, distinct
// from Tech Lab's existing "New Build" flow (techProjectIdeas.ts), which
// sends a prompt to an AI to generate a DIY build guide. This is the other
// half of Tech Lab the standing brief called for: a genuine, hands-on,
// play-based lab like Chem/Math/Physics/Biology Lab, built around real
// robots doing real jobs in the world today -- not projects a student
// builds at home, but the actual industrial/medical/space/agricultural
// robots those DIY builds are miniature versions of. Every fact here is
// hand-researched, grounded in real, well-documented robots and companies
// (Boston Dynamics, ISRO/NASA, Amazon Robotics, Intuitive Surgical, DJI,
// iRobot, etc.), never generated at request time.

export type RoboticsGradeBandId = 'early' | 'junior' | 'middle' | 'senior' | 'plusTwo';

export interface RoboticsGradeBand {
  id: RoboticsGradeBandId;
  label: string;
  classNumbers: number[];
}

// Same band boundaries as every other lab's grade bands, kept in sync
// deliberately -- one mental model for "what age group is this" across the
// whole app.
export const ROBOTICS_GRADE_BANDS: RoboticsGradeBand[] = [
  { id: 'early', label: 'Class 1-3', classNumbers: [1, 2, 3] },
  { id: 'junior', label: 'Class 4-6', classNumbers: [4, 5, 6] },
  { id: 'middle', label: 'Class 7-8', classNumbers: [7, 8] },
  { id: 'senior', label: 'Class 9-10', classNumbers: [9, 10] },
  { id: 'plusTwo', label: 'Class 11-12', classNumbers: [11, 12] },
];

export function roboticsGradeBandForClass(gradeNumber: number): RoboticsGradeBand {
  return ROBOTICS_GRADE_BANDS.find((b) => b.classNumbers.includes(gradeNumber)) || ROBOTICS_GRADE_BANDS[ROBOTICS_GRADE_BANDS.length - 1];
}

export type RoboticsCategory =
  | 'industrial' | 'agriculture' | 'medical' | 'space'
  | 'home' | 'disaster-safety' | 'transportation' | 'swarm-social';

export const ROBOTICS_CATEGORY_LABEL: Record<RoboticsCategory, string> = {
  industrial: 'Industrial & Manufacturing',
  agriculture: 'Agriculture',
  medical: 'Medical & Healthcare',
  space: 'Space & Exploration',
  home: 'Home & Daily Life',
  'disaster-safety': 'Disaster Response & Safety',
  transportation: 'Transportation',
  'swarm-social': 'Swarm & Social Robots',
};

// The seven playable simulation mechanisms every real robot below is
// mapped to -- reused across many entries (the same way Chem Lab's
// ChemPhysicalStage reuses 6 scenes across dozens of experiments), each
// parameterized per-project via `playgroundConfig` so the actual "play
// around" experience is genuinely specific to that robot, not generic.
export type RoboticsPlaygroundType =
  | 'pick-and-place'
  | 'path-planning'
  | 'sensor-threshold'
  | 'obstacle-avoidance'
  | 'swarm-simulation'
  | 'gesture-match'
  | 'balance-control';

// -- Robotics Fundamentals -- the actual academic subject matter of
// robotics (sensors, actuators, control theory, mechanisms, electronics,
// classification, history), as opposed to RoboticsApplication above (real
// robots doing real jobs). Direct response to feedback that the lab needed
// real study-level depth -- "facts and figures... not only available
// widely knowledge, that is anyhow anyone can search" -- so every entry
// here carries genuine datasheet/textbook specs, not just trivia.
export type RoboticsFundamentalSection = 'sensors' | 'actuators' | 'control-systems' | 'mechanisms' | 'electronics';

export type RoboticsFundamentalPlaygroundType =
  | 'formula-lab' | 'differential-drive' | 'board-compare' | 'none';

export interface RoboticsSpec {
  label: string;
  value: string;
}

// A real, license-verified .glb file the student can hold and orbit around
// in true 3D (see Robot3DViewer.tsx) -- the upgrade path from the
// slider-and-formula-only "Try It Yourself" panels, per direct feedback
// that those alone "looks very gimmicky". `src` is the expected path under
// apps/web/public/models/robotics/ -- see that folder's MANIFEST.md for
// where each file actually comes from and its license. Deliberately
// optional: entries without a sourced file yet simply don't show a 3D
// viewer, they keep today's formula panel exactly as it is.
export interface Model3DConfig {
  src: string;
  credit: { author: string; license: string; url: string };
}

export interface RoboticsFundamental {
  id: string;
  section: RoboticsFundamentalSection;
  name: string;
  tagline: string;
  overview: string;
  realSpecs: RoboticsSpec[];
  howItWorks: string[];
  keyFacts: string[];
  commonUse: string[];
  playgroundType: RoboticsFundamentalPlaygroundType;
  playgroundConfig: Record<string, unknown>;
  model3d?: Model3DConfig;
}

// A formula-lab's config identifies which verified engine formula drives
// it (see roboticsEngineeringEngine.ts) plus the input slider and output
// display it's wrapped in.
export interface FormulaLabConfig {
  formulaKey: 'ultrasonic' | 'servo' | 'stepper' | 'gear' | 'encoder' | 'p-controller';
  inputLabel: string;
  inputUnit: string;
  inputMin: number;
  inputMax: number;
  inputDefault: number;
  outputLabel: string;
  outputUnit: string;
  formulaDisplay: string; // the real formula, shown as text
  // gear/encoder need a couple of fixed secondary values to display alongside
  extraNote?: string;
}

// Real classification systems taught in robotics/mechanical engineering
// curricula (the Japan Industrial Robot Association's generation-based
// scheme is the most widely cited) -- genuinely different from a list of
// "cool robots", this is how robotics as a FIELD organizes and studies
// itself.
export interface RoboticsClassificationType {
  id: string;
  name: string;
  definition: string;
  characteristics: string[];
  realExample: string;
}

// A real, dated history of robotics -- verifiable milestones, named
// people, and actual years, not vague "robots have existed for a while"
// framing.
export interface RoboticsHistoryMilestone {
  id: string;
  year: string;
  title: string;
  description: string;
  whyItMatters: string;
}

export interface RoboticsApplication {
  id: string;
  name: string;
  category: RoboticsCategory;
  gradeBand: RoboticsGradeBandId;
  tagline: string;
  overview: string;
  howItWorks: string[]; // the real sensors/actuators/logic pipeline, step by step
  realExamples: string[]; // real, named companies/products/missions
  curriculumTie: string; // how this connects to CBSE/ICSE robotics/AI/CS topics
  deepFacts: string[];
  realWorldImpact: string;
  careersAndFutures: string;
  playgroundType: RoboticsPlaygroundType;
  playgroundConfig: Record<string, unknown>;
  model3d?: Model3DConfig;
}
