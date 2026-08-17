import {
  MATH_THEOREMS, MATH_FORMULAS, VEDIC_SUTRAS, MATH_HISTORY_FIGURES,
  CHEMISTRY_EXPERIMENTS, CHEM_EQUIPMENT, CHEM_REAGENTS, CHEM_PHYSICAL_EXPERIMENTS, CHEM_CONCEPTS,
  CHEM_REFERENCE_CHARTS, AROMATIC_MODULES, BENZENE_DERIVATIVES, ATOMIC_MODELS, IONIC_BOND_PAIRS, COVALENT_MOLECULES,
  ALL_DEEP_DIVES, ROBOTICS_APPLICATIONS,
  ROBOTICS_SENSORS, ROBOTICS_ACTUATORS, ROBOTICS_CONTROL_SYSTEMS, ROBOTICS_MECHANISMS,
  ROBOTICS_ELECTRONICS, ROBOTICS_CLASSIFICATION, ROBOTICS_HISTORY, ROBOTICS_EXPERIMENTS,
  AI_FOUNDATIONS, CODING_CONCEPTS, AI_EXPERIMENTS, CODING_EXPERIMENTS,
} from '@edusheets/content';

// Every content type an admin can edit at /admin/content. Adding a new lab's
// content here (plus swapping its consuming component's direct import for
// useContent(), see mathlab/TheoremCorner.tsx / chemlab/ChemConceptsCorner.tsx
// for the pattern) is the entire cost of extending CMS Phase 2 to that
// content -- deliberately designed so the FIRST few types (Math Lab, then
// Chem Lab) prove the whole system, and every type after that is small,
// repeatable follow-on work rather than a new one-off feature each time.
//
// Not every content type is registered yet: PeriodicElement, SubatomicParticle,
// and ElementShellConfig are keyed by atomicNumber/symbol rather than a plain
// `id` field, which the merge logic in useContent.ts relies on -- registering
// those needs a small adapter (or a schema tweak) as a follow-on, not
// attempted in this pass.
export interface ContentTypeDef {
  id: string;
  label: string;
  // Just needs an `id` field for the merge/lookup logic -- the raw-JSON
  // editor only needs `unknown` for everything else, so no index signature
  // (and no fighting each content interface's own exact shape) is required.
  items: { id: string }[];
}

export const CONTENT_TYPE_REGISTRY: ContentTypeDef[] = [
  { id: 'math-theorem', label: 'Math Lab: Theorems', items: MATH_THEOREMS },
  { id: 'math-formula', label: 'Math Lab: Formulas', items: MATH_FORMULAS },
  { id: 'vedic-sutra', label: 'Math Lab: Vedic Sutras', items: VEDIC_SUTRAS },
  { id: 'math-history-figure', label: 'Math Lab: Ancient Mathematicians', items: MATH_HISTORY_FIGURES },

  { id: 'chem-experiment', label: 'Chem Lab: Experiments', items: CHEMISTRY_EXPERIMENTS },
  { id: 'chem-equipment', label: 'Chem Lab: Equipment', items: CHEM_EQUIPMENT },
  { id: 'chem-reagent', label: 'Chem Lab: Reagents', items: CHEM_REAGENTS },
  { id: 'chem-physical-experiment', label: 'Chem Lab: Physical Chemistry Calculators', items: CHEM_PHYSICAL_EXPERIMENTS },
  { id: 'chem-concept', label: 'Chem Lab: Concepts Corner', items: CHEM_CONCEPTS },
  { id: 'chem-reference-chart', label: 'Chem Lab: Reference Charts', items: CHEM_REFERENCE_CHARTS },
  { id: 'aromatic-module', label: 'Chem Lab: Aromatic Chemistry', items: AROMATIC_MODULES },
  { id: 'benzene-derivative', label: 'Chem Lab: Benzene Derivatives', items: BENZENE_DERIVATIVES },
  { id: 'atomic-model', label: 'Chem Lab: Atomic Models', items: ATOMIC_MODELS },
  { id: 'ionic-bond-pair', label: 'Chem Lab: Ionic Bonding Pairs', items: IONIC_BOND_PAIRS },
  { id: 'covalent-molecule', label: 'Chem Lab: Covalent Molecules', items: COVALENT_MOLECULES },

  // The universal Deep Dive layer -- one content type backs the "Explore"
  // trigger everywhere in the app, across every lab. See deepDive.ts.
  { id: 'topic-deep-dive', label: 'Deep Dives (all labs)', items: ALL_DEEP_DIVES },

  { id: 'robotics-application', label: 'Tech Lab: Robotics Applications', items: ROBOTICS_APPLICATIONS },
  { id: 'robotics-sensor', label: 'Tech Lab: Robotics Sensors', items: ROBOTICS_SENSORS },
  { id: 'robotics-actuator', label: 'Tech Lab: Robotics Actuators', items: ROBOTICS_ACTUATORS },
  { id: 'robotics-control-system', label: 'Tech Lab: Robotics Control Systems', items: ROBOTICS_CONTROL_SYSTEMS },
  { id: 'robotics-mechanism', label: 'Tech Lab: Robotics Mechanisms', items: ROBOTICS_MECHANISMS },
  { id: 'robotics-electronics', label: 'Tech Lab: Robotics Electronics', items: ROBOTICS_ELECTRONICS },
  { id: 'robotics-classification', label: 'Tech Lab: Robot Classification', items: ROBOTICS_CLASSIFICATION },
  { id: 'robotics-history', label: 'Tech Lab: Robotics History', items: ROBOTICS_HISTORY },
  { id: 'robotics-experiment', label: 'Tech Lab: Robotics Hands-On Experiments', items: ROBOTICS_EXPERIMENTS },
  { id: 'ai-concept', label: 'Tech Lab: AI Concepts', items: AI_FOUNDATIONS },
  { id: 'ai-experiment', label: 'Tech Lab: AI Hands-On Experiments', items: AI_EXPERIMENTS },
  { id: 'coding-concept', label: 'Tech Lab: Coding Concepts', items: CODING_CONCEPTS },
  { id: 'coding-experiment', label: 'Tech Lab: Coding Hands-On Experiments', items: CODING_EXPERIMENTS },
];
