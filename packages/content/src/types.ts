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

// A coarser grouping than `category` (which describes the TYPE of test/
// technique) -- this is the actual chemistry branch, matching how CBSE/ICSE
// Class 11-12 itself is organized (Physical/Inorganic/Organic). Deliberately
// two-valued, not three: at school level "physical chemistry" topics
// (thermodynamics, kinetics, equilibrium) don't have their own hands-on
// experiments in this app yet, so everything non-organic is grouped as
// 'inorganic' for now rather than adding a third bucket nothing populates.
export type ChemBranch = 'organic' | 'inorganic';

export interface ChemistryExperiment {
  id: string;
  title: string;
  branch: ChemBranch;
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
  // Marks a chemical that is only here for a safety lesson (real household
  // chemicals like bleach/ammonia that genuinely should never be mixed) --
  // the sandbox still lets a student pick them, since seeing WHY not to
  // mix them, safely, in a simulation, is the whole point.
  hazardOnly?: boolean;
}

export interface FreeMixReaction {
  chemicalIds: [string, string];
  result: ReactionVisualState;
  equation?: string;
  explanation: string;
  // When true, this pair is a genuine real-world hazard (e.g. bleach +
  // ammonia -> toxic chloramine gas) -- the UI renders it as a stark safety
  // warning instead of a fun "look what happened!" reaction, and it is
  // never framed as something to actually try.
  hazard?: boolean;
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

// Benzene/aromatic chemistry deliberately does NOT use the ChemistryExperiment
// shape -- there is no safe, honest way to frame "drag a reagent onto a
// benzene ring" as something to try, since real aromatic substitution
// reactions need genuinely hazardous reagents/conditions (fuming acids,
// anhydrous AlCl3) that no real school lab lets a student run by hand
// either. This is a structural/conceptual explainer instead: what the ring
// actually looks like, why it behaves differently from a normal alkene, and
// what its named reactions do -- shown as a before/after outcome, never as
// an interactive "mix this" invitation.
export interface AromaticReaction {
  name: string;
  reagentsAndConditions: string;
  productDescription: string;
  explanation: string;
}

export interface AromaticModule {
  id: string;
  title: string;
  gradeBand: ChemGradeBandId;
  board: 'CBSE' | 'ICSE' | 'both';
  chapterTags: string[];
  introduction: string;
  structureExplanation: string;
  whyStable: string;
  namedReactions: AromaticReaction[];
  realWorldOccurrence: string[];
  safetyNotes: string[];
  funFact: string;
}

// A substituent GROUP (not a hazardous reagent) that can replace one ring
// hydrogen -- dragging one of these onto a ring position is a structure-
// building exercise, not a "try mixing this" invitation, so it doesn't
// carry the same reaction-accuracy risk the rest of Chem Lab is built
// around avoiding. Still: only real, verified groups and only real,
// verified resulting compounds -- see BENZENE_DERIVATIVES.
export interface BenzeneSubstituent {
  id: string;
  formula: string;
  name: string;
}

export interface BenzeneDerivative {
  id: string;
  name: string;
  molecularFormula: string;
  // Fixed positions (0-5 around the ring) used only for drawing this
  // specific compound's diagram in "Explore" mode -- a benzene ring is
  // symmetric, so these are illustrative, not the one true numbering.
  substituents: { substituentId: string; position: number }[];
  category: string;
  description: string;
  commonUses: string[];
  safetyNotes?: string[];
  funFact?: string;
  // Compounds with more than 2 substituents (e.g. TNT) are real and shown
  // in the Explore gallery, but are excluded from the drag-and-drop
  // Builder's auto-recognition, which only reliably identifies 1- and
  // 2-substituent patterns -- see the Builder component for why.
  builderExcluded?: boolean;
}

export interface AtomicModel {
  id: string;
  name: string;
  year: string;
  scientist: string;
  description: string;
}

export interface SubatomicParticle {
  name: string;
  symbol: string;
  charge: string;
  relativeMass: string;
  location: string;
}

// Hand-verified electron shell (K, L, M, N...) distribution for a neutral
// atom -- deliberately only elements 1-20 (Hydrogen to Calcium). The simple
// "fill K to 2, L to 8, M to 8 before starting N" rule taught in CBSE/ICSE
// (the Bohr-Bury scheme) genuinely matches real atoms for this range, but
// starts diverging from real quantum-mechanical configurations right at the
// transition metals (Scandium onward, where d-orbitals complicate things) --
// rather than compute a shell breakdown algorithmically for all 118
// elements and risk it being wrong past element 20, this stays hand-checked
// and scoped to where the simple rule is actually correct. Full elements
// 1-118 factual lookup (mass, category, discovery, etc.) still lives in
// PERIODIC_TABLE -- this is the deep-dive layer on top for the range where
// shell-by-shell structure is actually taught.
export interface ElementShellConfig {
  atomicNumber: number;
  symbol: string;
  name: string;
  shells: number[];
  // Only set for elements with one well-established, school-taught common ion
  // (e.g. Sodium virtually always appears as Na+). Deliberately omitted for
  // elements that don't have a single obvious answer at this level.
  commonIon?: { charge: number; note: string };
}

// A single metal atom transferring its valence electron(s) to one or more
// nonmetal atoms to form an ionic compound -- a structure-building exercise
// like the Benzene Builder, not a "try mixing this" invitation, so it's
// exempt from the reaction-accuracy risk the rest of Chem Lab avoids. Only
// real, verified, commonly-taught 1:1 or 1:2 ratio compounds (see
// IONIC_BOND_PAIRS) -- more complex ratios (e.g. Al2O3) aren't included here.
export interface IonicBondPair {
  id: string;
  metalAtomicNumber: number;
  nonmetalAtomicNumber: number;
  nonmetalCount: number;
  electronsPerNonmetal: number;
  formula: string;
  compoundName: string;
  explanation: string;
  realWorldUse: string;
  funFact: string;
}

// A central atom sharing one electron pair (a single covalent bond) with
// each of one or more outer atoms. Deliberately scoped to single-bond
// molecules only (no double/triple bonds) -- see COVALENT_MOLECULES.
export interface CovalentMolecule {
  id: string;
  name: string;
  formula: string;
  centralAtomicNumber: number;
  outerAtomicNumbers: number[];
  explanation: string;
  realWorldUse: string;
  funFact: string;
}
