// Shared types for Math Lab's curated (NOT AI-generated) reference content
// -- same principle as Chem/Physics/Biology Lab: every theorem statement,
// formula, and mental-math trick here is hand-authored and verified against
// real CBSE/ICSE mathematics curriculum -- the exact NCERT/ICSE chapter
// names already used elsewhere in this app's curriculum database (see
// `chapterTags` on each entry) -- never generated at request time. A wrong
// theorem statement or a wrong worked example silently teaches a
// misconception, exactly the failure mode this package exists to avoid.

export type MathGradeBandId = 'early' | 'junior' | 'middle' | 'senior' | 'plusTwo';

export interface MathGradeBand {
  id: MathGradeBandId;
  label: string;
  classNumbers: number[];
}

// Same band boundaries as Chem/Physics/Biology Lab's grade bands, kept in
// sync deliberately.
export const MATH_GRADE_BANDS: MathGradeBand[] = [
  { id: 'early', label: 'Class 1-3', classNumbers: [1, 2, 3] },
  { id: 'junior', label: 'Class 4-6', classNumbers: [4, 5, 6] },
  { id: 'middle', label: 'Class 7-8', classNumbers: [7, 8] },
  { id: 'senior', label: 'Class 9-10', classNumbers: [9, 10] },
  { id: 'plusTwo', label: 'Class 11-12', classNumbers: [11, 12] },
];

export function mathGradeBandForClass(gradeNumber: number): MathGradeBand {
  return MATH_GRADE_BANDS.find((b) => b.classNumbers.includes(gradeNumber)) || MATH_GRADE_BANDS[MATH_GRADE_BANDS.length - 1];
}

// Deliberately includes 'vedic-maths' and 'math-history' even though Phase 1
// doesn't populate them yet -- see each data file's header for what's
// actually live, and why the rest is a clearly-flagged later phase rather
// than something silently missing (same discipline as Biology Lab's
// 'botany'/'zoology' placeholders).
export type MathBranch =
  | 'number-systems'
  | 'algebra'
  | 'geometry'
  | 'mensuration'
  | 'trigonometry'
  | 'statistics-probability'
  | 'calculus'
  | 'vedic-maths'
  | 'math-history';

export interface MathEquipment {
  id: string;
  name: string;
  category: MathBranch;
  description: string;
  deepDive: string;
}

// The interaction each experiment drives -- a small closed vocabulary (like
// Chem Lab's ReactionVisualState, Biology's SimType) so the Math Stage can
// dispatch each experiment to its own purpose-built scene, the same "one
// bespoke Scene per simType" pattern BiologyStage uses for microscope/
// foodtest/osmosis/punnett/explorer, rather than one generic renderer
// straining to cover very different visuals:
//  - divide: split a quantity into equal groups, with a remainder if any
//  - euclidean: HCF & LCM via the real step-by-step Euclidean algorithm
//  - progression: an Arithmetic Progression's terms and running sum
//  - quadratic: solve ax^2+bx+c=0, both algebraically and as a parabola
//  - probability: roll two dice repeatedly, watch the experimental
//    frequency converge toward the theoretical probability
//  - graph: a linear equation plotted live on a coordinate grid
//  - construct: a draggable-point geometric construction (reuses the same
//    live, re-computed geometry as Geometry Explorer)
//  - explorer: a labeled diagram/gallery where every part is clickable for
//    real facts, same pattern as Biology's 'explorer'
export type MathSimType = 'divide' | 'euclidean' | 'progression' | 'quadratic' | 'probability' | 'graph' | 'construct' | 'explorer';

export interface MathParamConfig {
  key: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  // When set, the slider is rendered as a row of labeled choice buttons
  // instead of a freeform range -- same convention as the other labs.
  choices?: { value: number; label: string }[];
}

export interface MathExperimentStep {
  number: number;
  instruction: string;
  paramChanges?: Record<string, number>;
  hint?: string;
}

export interface MathExperiment {
  id: string;
  title: string;
  branch: MathBranch;
  gradeBand: MathGradeBandId;
  board: 'CBSE' | 'ICSE' | 'both';
  // Real chapter names this maps to -- e.g. "Triangles" (CBSE Class 10),
  // "Pythagoras Theorem" (ICSE Class 7) -- pulled from the same curriculum
  // data that drives worksheet generation elsewhere in the app.
  chapterTags: string[];
  simType: MathSimType;
  defaultParams: Record<string, number>;
  paramConfig: MathParamConfig[];
  purpose: string;
  predictPrompt: string;
  predictOptions: string[];
  correctPredictIndex: number;
  keyIdea: string;
  steps: MathExperimentStep[];
  observationPrompts: string[];
  explanation: string;
  realWorldApplications: string[];
  extensions: string[];
  realLifeNote: string;
}

// -- Theorem Corner --
// A small closed vocabulary of the bespoke interactive proof visuals built
// for Theorem Corner (Phase 2) -- same "closed vocabulary dispatches to a
// bespoke Scene" pattern as MathSimType/PhysicsSimType. A theorem with no
// visualProofId (or one not yet built) still gets the full step-through
// text walkthrough -- not every theorem needs (or honestly benefits from)
// a bespoke diagram; a symbolic algebraic derivation is often clearer as
// clean text than a forced animation.
export type MathTheoremVisualId =
  | 'angle-sum' | 'exterior-angle' | 'pythagoras' | 'midpoint' | 'bpt'
  | 'circle-angle' | 'tangent-radius' | 'ap-pairing' | 'binomial-pascal'
  | 'unit-circle' | 'prime-factor-tree' | 'euler-polyhedron' | 'cone-cylinder-ratio';

export interface MathTheorem {
  id: string;
  name: string;
  branch: MathBranch;
  gradeBand: MathGradeBandId;
  board: 'CBSE' | 'ICSE' | 'both';
  chapterTags: string[];
  statement: string;
  whyItMatters: string;
  // Plain-English steps a visual proof sketch walks through, one at a time.
  proofSteps: string[];
  realLifeNote: string;
  // Which bespoke interactive component (if any) renders alongside the
  // step-through text -- see TheoremVisualProof.tsx.
  visualProofId?: MathTheoremVisualId;
  // Multiple real, concrete applications (not just one note) -- same
  // "realWorldApplications" depth precedent as Physics Lab's experiments.
  realWorldApplications: string[];
}

// -- Formula Reference --
export interface MathFormula {
  id: string;
  name: string;
  branch: MathBranch;
  gradeBand: MathGradeBandId;
  formula: string; // e.g. "Area = 1/2 x base x height"
  variables: { symbol: string; meaning: string }[];
  // A single real worked example with plugged-in numbers, shown as a live
  // substitution readout -- same "never hide the math" precedent as
  // Physics Lab's live formula panel.
  example: { values: Record<string, number>; result: string };
  note: string;
}
