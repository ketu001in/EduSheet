// Shared types for Biology Lab's curated (NOT AI-generated) reference
// content -- same principle as Chem Lab and Physics Lab: every experiment
// here is hand-authored and verified against standard CBSE/ICSE biology,
// never generated at request time. A wrong food-test color or a wrong
// Punnett-square ratio silently teaches a misconception, exactly the
// failure mode this package is built to avoid.

export type BiologyGradeBandId = 'early' | 'junior' | 'middle' | 'senior' | 'plusTwo';

export interface BiologyGradeBand {
  id: BiologyGradeBandId;
  label: string;
  classNumbers: number[];
}

// Same band boundaries as Chem Lab's CHEM_GRADE_BANDS and Physics Lab's
// PHYSICS_GRADE_BANDS, kept in sync deliberately.
export const BIOLOGY_GRADE_BANDS: BiologyGradeBand[] = [
  { id: 'early', label: 'Class 1-3', classNumbers: [1, 2, 3] },
  { id: 'junior', label: 'Class 4-6', classNumbers: [4, 5, 6] },
  { id: 'middle', label: 'Class 7-8', classNumbers: [7, 8] },
  { id: 'senior', label: 'Class 9-10', classNumbers: [9, 10] },
  { id: 'plusTwo', label: 'Class 11-12', classNumbers: [11, 12] },
];

export function biologyGradeBandForClass(gradeNumber: number): BiologyGradeBand {
  return BIOLOGY_GRADE_BANDS.find((b) => b.classNumbers.includes(gradeNumber)) || BIOLOGY_GRADE_BANDS[BIOLOGY_GRADE_BANDS.length - 1];
}

// Deliberately includes 'botany' and 'zoology' even though this first pass
// doesn't populate them yet -- see biologyExperiments.ts's header for which
// branches actually have content, and why the rest is a clearly-flagged
// next pass rather than something silently missing.
export type BiologyBranch = 'human-biology' | 'cell-biology' | 'ecology' | 'genetics' | 'botany' | 'zoology';

export interface BiologyEquipment {
  id: string;
  name: string;
  category: BiologyBranch;
  description: string;
  // A longer, still-factual paragraph shown behind the popup's "Deep Dive"
  // button -- working principle, real lab technique, or historical note.
  deepDive: string;
}

// The interaction each experiment drives -- a small closed vocabulary (like
// Chem Lab's ReactionVisualState, Physics Lab's PhysicsSimType) so the
// Biology Stage can render any experiment generically:
//  - microscope: adjust focus/magnification, a specimen resolves into view
//  - foodtest: add a reagent to a food sample, see the real, curated color
//    change that reagent produces for that food (or none, if negative)
//  - osmosis: a cell/tissue sample placed in a solution swells or shrinks
//    toward a real equilibrium size based on the concentration gradient
//  - punnett: cross two parents' alleles, compute the real Mendelian
//    genotype/phenotype ratio (pure combinatorics, not a guess)
//  - explorer: a labeled diagram (cell, body system, food chain) where
//    every part is clickable for real facts -- no "simulation" as such,
//    but the same hover/click/deep-dive equipment pattern as everywhere
//    else in the app
export type BiologySimType = 'microscope' | 'foodtest' | 'osmosis' | 'punnett' | 'explorer';

export interface BiologyParamConfig {
  key: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  // When set, the slider is rendered as a row of labeled choice buttons
  // instead of a freeform range -- used for categorical params (which
  // reagent, which parent allele) that only make sense as discrete
  // real-vocabulary options, not an arbitrary number.
  choices?: { value: number; label: string }[];
}

export interface BiologyExperimentStep {
  number: number;
  instruction: string;
  paramChanges?: Record<string, number>;
  action?: 'release' | 'measure' | 'observe' | 'reset';
  hint?: string;
}

// One labeled, clickable part of an 'explorer'-type diagram (a cell, a
// body system, a food chain) -- the Biology Stage looks up each part's
// screen position by `id` per diagramId (pure layout, kept in the
// component), and shows this curated text when it's clicked.
export interface BiologyExplorerPart {
  id: string;
  label: string;
  info: string;
  deepDive: string;
}

export interface BiologyExperiment {
  id: string;
  title: string;
  branch: BiologyBranch;
  gradeBand: BiologyGradeBandId;
  board: 'CBSE' | 'ICSE' | 'both';
  chapterTags: string[];
  simType: BiologySimType;
  defaultParams: Record<string, number>;
  paramConfig: BiologyParamConfig[];
  apparatusIds: string[];
  // Only set for simType: 'explorer' -- which hand-drawn diagram the
  // Biology Stage should render, and the curated facts for each of its
  // labeled parts.
  diagramId?: 'plant-cell' | 'digestive-system' | 'food-chain';
  explorerParts?: BiologyExplorerPart[];
  purpose: string;
  predictPrompt: string;
  predictOptions: string[];
  correctPredictIndex: number;
  // The one-line takeaway rule, in plain English rather than an equation
  // (e.g. "Iodine turns blue-black in the presence of starch") -- shown
  // the same way Physics Lab shows its formula, just not always algebraic.
  keyIdea: string;
  keyIdeaVars: string[];
  steps: BiologyExperimentStep[];
  observationPrompts: string[];
  explanation: string;
  realWorldApplications: string[];
  safetyNotes: string[];
  extensions: string[];
  realLifeNote: string;
}
