// The Deep Dive layer -- one universal system, reused by EVERY lab, that
// turns any item (a piece of equipment, a reagent, a theorem, a periodic
// element, a historical figure, a physics apparatus, a biology structure)
// into an actual "doorway" instead of a dead end: click it, and get
// everything genuinely worth knowing about that one thing, not just the
// curriculum-minimum line the rest of the lab UI already shows.
//
// Direct response to user feedback: "if some topic is there, the topic
// itself should be expandable to the maximum extent of all the information
// available in the world about that particular topic" -- applied as a
// system-wide capability, not a one-off feature on one section.
//
// Same non-negotiable discipline as every other content file in this
// package: every fact here is hand-researched and hand-verified, never
// generated at request time. Images follow the same real,
// license-verified sourcing process as mathHistoryFigures.ts and
// anatomyModels.ts (see each entry's `credit`, and CREDITS.md next to the
// image files) -- items without a sourced real image simply have
// visualType: 'none' or 'diagram' rather than a faked photo.
//
// `id` is namespaced per-lab (e.g. 'chem-equip-burette') to stay globally
// unique across the whole tool, since this one registry backs every lab's
// "Explore" trigger through a single useContent('topic-deep-dive', ...) call.
export type DeepDiveLab = 'chemistry' | 'physics' | 'biology' | 'math' | 'tech';
export type DeepDiveVisualType = 'rotate-3d' | 'diagram' | 'none';

// Matches each lab's existing playground-dispatch convention (e.g.
// ChemConceptPlaygroundType) -- kept as a loose string here since the
// dispatch component (TopicDeepDivePlayground.tsx) is the single place
// that has to know every lab's real union type.
export type DeepDivePlaygroundType = string;

export interface DeepDiveContent {
  id: string;
  lab: DeepDiveLab;
  title: string;
  tagline: string; // one-line hook shown on the trigger/header
  overview: string;
  deepFacts: string[]; // real facts beyond what the curriculum-level card already says
  history?: string;
  realWorldApplications: string[];
  commonMisconceptions?: string[];
  safetyNotes?: string;
  relatedIds: string[]; // other DeepDiveContent ids, cross-linked as "Explore Next"
  visualType: DeepDiveVisualType;
  imageSrc?: string; // local /public path, only ever a real sourced image
  imageAlt?: string;
  credit?: { author: string; license: string; url: string };
  playgroundType?: DeepDivePlaygroundType;
}
