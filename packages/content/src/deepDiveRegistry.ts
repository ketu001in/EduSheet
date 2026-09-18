import { DeepDiveContent } from './deepDive';
import { CHEM_EQUIPMENT_DEEP_DIVES, CHEM_REAGENT_DEEP_DIVES, CHEM_ELEMENT_DEEP_DIVES } from './deepDiveChem';
import { MATH_DEEP_DIVES } from './deepDiveMath';
import { PHYSICS_DEEP_DIVES } from './deepDivePhysics';
import { BIOLOGY_DEEP_DIVES } from './deepDiveBiology';

// The single combined list every lab's useDeepDives() hook fetches CMS
// overrides against -- see deepDive.ts's header for why this is one
// universal system rather than a per-lab one. Adding a new lab's Deep
// Dives is just a new deepDive<Lab>.ts file plus one line here.
export const ALL_DEEP_DIVES: DeepDiveContent[] = [
  ...CHEM_EQUIPMENT_DEEP_DIVES,
  ...CHEM_REAGENT_DEEP_DIVES,
  ...CHEM_ELEMENT_DEEP_DIVES,
  ...MATH_DEEP_DIVES,
  ...PHYSICS_DEEP_DIVES,
  ...BIOLOGY_DEEP_DIVES,
];
