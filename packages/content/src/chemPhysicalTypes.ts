import { ChemGradeBandId } from './types';

// Physical Chemistry Calculators -- fills a real gap flagged in types.ts's
// header comment: "at school level physical chemistry topics don't have
// their own hands-on experiments in this app yet". These aren't drag-a-
// reagent experiments (there's no safe/honest lab-bench framing for "mix
// this to see a gas law"); they're parameterized calculators with a live
// formula readout, same pattern as Math Lab's Guided Experiments
// (calculate/graph simTypes) -- see apps/web/src/lib/chemEngine.ts for the
// verified math driving every one of them.
export type PhysicalChemSimType = 'mole-calculator' | 'gas-laws' | 'ph-calculator' | 'equilibrium' | 'kinetics' | 'electrochemistry';

export interface PhysicalChemParamConfig {
  key: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  choices?: { value: number; label: string }[];
}

export interface PhysicalChemExperimentStep {
  number: number;
  instruction: string;
  paramChanges?: Record<string, number>;
  hint?: string;
}

export interface PhysicalChemExperiment {
  id: string;
  title: string;
  gradeBand: ChemGradeBandId;
  board: 'CBSE' | 'ICSE' | 'both';
  chapterTags: string[];
  simType: PhysicalChemSimType;
  defaultParams: Record<string, number>;
  paramConfig: PhysicalChemParamConfig[];
  purpose: string;
  predictPrompt: string;
  predictOptions: string[];
  correctPredictIndex: number;
  keyIdea: string;
  steps: PhysicalChemExperimentStep[];
  observationPrompts: string[];
  explanation: string;
  realWorldApplications: string[];
  extensions: string[];
  realLifeNote: string;
}
