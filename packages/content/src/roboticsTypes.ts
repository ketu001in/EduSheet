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
}
