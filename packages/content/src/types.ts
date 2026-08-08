// Shared types for Chem Lab's curated (NOT AI-generated) reference content.
// Every experiment/reaction here is hand-authored and research-grounded --
// see the safety rationale in experiments.ts's header comment. This package
// is imported by both apps/api (PDF lab reports) and apps/web (interactive
// lab bench), so it stays framework-free.

export type ChemGradeBandId = 'early' | 'junior' | 'middle' | 'senior' | 'plusTwo';

export interface ChemGradeBand {
  id: ChemGradeBandId;
  label: string;
  classNumbers: number[];
}

// Same band boundaries as apps/web's Tech Lab GRADE_BANDS, kept in sync
// deliberately -- one mental model for "what age group is this" across
// every generator/lab in the app.
export const CHEM_GRADE_BANDS: ChemGradeBand[] = [
  { id: 'early', label: 'Class 1-3', classNumbers: [1, 2, 3] },
  { id: 'junior', label: 'Class 4-6', classNumbers: [4, 5, 6] },
  { id: 'middle', label: 'Class 7-8', classNumbers: [7, 8] },
  { id: 'senior', label: 'Class 9-10', classNumbers: [9, 10] },
  { id: 'plusTwo', label: 'Class 11-12', classNumbers: [11, 12] },
];

export function chemGradeBandForClass(gradeNumber: number): ChemGradeBand {
  return CHEM_GRADE_BANDS.find((b) => b.classNumbers.includes(gradeNumber)) || CHEM_GRADE_BANDS[CHEM_GRADE_BANDS.length - 1];
}

export interface ChemApparatus {
  id: string;
  name: string;
  description: string;
}

export interface ChemReagent {
  id: string;
  name: string;
  formulaOrDescription: string;
  hazardNote?: string;
}

// Drives the lab-bench animation. Deliberately a small, closed vocabulary of
// visual effects (not free-form) so the interactive engine and the PDF
// report can both render it deterministically without any per-experiment
// custom code.
export interface ReactionVisualState {
  colorChange?: { from: string; to: string };
  gasBubbles?: boolean;
  precipitate?: { color: string; description: string };
  flameColor?: string;
  tempChange?: 'warms' | 'cools' | 'none';
  smoke?: boolean;
  description: string;
}

export interface ExperimentStep {
  number: number;
  instruction: string;
  dragReagentId?: string;
  dragTargetApparatusId?: string;
  reaction?: ReactionVisualState;
  hint?: string;
}

export type ChemExperimentCategory =
  | 'physical-change' | 'chemical-reaction' | 'acid-base' | 'gas-test' | 'electrochemistry' | 'organic' | 'analysis';

export interface ChemistryExperiment {
  id: string;
  title: string;
  gradeBand: ChemGradeBandId;
  board: 'CBSE' | 'ICSE' | 'both';
  chapterTags: string[];
  category: ChemExperimentCategory;
  purpose: string;
  predictPrompt: string;
  predictOptions: string[];
  correctPredictIndex: number;
  apparatusIds: string[];
  reagentIds: string[];
  steps: ExperimentStep[];
  balancedEquation?: string;
  observationPrompts: string[];
  explanation: string;
  realWorldApplications: string[];
  safetyNotes: string[];
  extensions: string[];
  realLifeNote: string;
}

export interface FreeMixChemical {
  id: string;
  name: string;
  description: string;
}

export interface FreeMixReaction {
  chemicalIds: [string, string];
  result: ReactionVisualState;
  equation?: string;
  explanation: string;
}

export interface PeriodicElement {
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMass: string;
  category: string;
  group: number | null;
  period: number;
  // State at room temperature (~25C). 'unknown (synthetic)' for superheavy
  // synthetic elements made in such tiny, short-lived quantities that bulk
  // properties like state have never actually been measured -- better to
  // say so than to guess.
  state: 'solid' | 'liquid' | 'gas' | 'unknown (synthetic)';
  // Standard melting/boiling points in Celsius, as display-ready strings
  // (e.g. "-259.16", "Sublimes (~-78 at 1 atm)") since a few elements are
  // best described rather than given a bare number. 'Unknown (synthetic)'
  // for superheavy elements whose bulk properties have never actually been
  // measured -- same honesty rule as `state`.
  meltingPointC: string;
  boilingPointC: string;
  summary: string;
  // A short, real, verifiable discovery note -- who/when/where, or "known
  // since ancient times" for elements with no single discoverer.
  discovery: string;
}

export interface ReferenceChartRow {
  label: string;
  value: string;
}

export interface ReferenceChart {
  id: string;
  title: string;
  description: string;
  rows: ReferenceChartRow[];
}
