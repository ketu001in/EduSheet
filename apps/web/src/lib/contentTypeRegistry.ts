import { MATH_THEOREMS, MATH_FORMULAS, VEDIC_SUTRAS, MATH_HISTORY_FIGURES } from '@edusheets/content';

// Every content type an admin can edit at /admin/content. Adding a new lab's
// content here (plus swapping its consuming component's direct import for
// useContent(), see mathlab/TheoremCorner.tsx etc. for the pattern) is the
// entire cost of extending CMS Phase 2 to that content -- deliberately
// designed so the FIRST few types (Math Lab, wired up now) prove the whole
// system, and every type after that is small, repeatable follow-on work
// rather than a new one-off feature each time.
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
];
