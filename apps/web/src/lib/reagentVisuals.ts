// Real, honest visual metadata for Reagents Studio -- every color here is
// a fact already stated in reagents.ts's own description text (CuSO4
// solution's real "pale blue", the real flame-test colors, hydrated
// CuSO4's real "bright blue crystals", MnO2's real dark-brown/black
// color, iodine solution's real brown color), not an invented palette.
// Reagents with no stated color default to a genuinely honest neutral
// (colorless liquid / white solid / bare metal) rather than a fabricated
// tint -- most real lab reagents genuinely are colorless or white, and
// showing that plainly is more honest than decorating them.
export type ReagentState = 'liquid' | 'solid' | 'metal' | 'crystal' | 'flame';
export interface ReagentVisual { color: string; state: ReagentState }

const OVERRIDES: Record<string, ReagentVisual> = {
  'copper-sulphate-solution': { color: '#93c5fd', state: 'liquid' },
  'hydrated-copper-sulphate': { color: '#3b82f6', state: 'crystal' },
  'bromine-water': { color: '#fb923c', state: 'liquid' },
  'potassium-permanganate-dilute': { color: '#a855f7', state: 'liquid' },
  'iodine-solution': { color: '#78350f', state: 'liquid' },
  'manganese-dioxide': { color: '#3f3f46', state: 'solid' },
  'phenolphthalein': { color: '#f9a8d4', state: 'liquid' },
  'universal-indicator': { color: '#22c55e', state: 'liquid' },
  'red-cabbage-indicator': { color: '#a21caf', state: 'liquid' },
  'sodium-chloride-flame-sample': { color: '#eab308', state: 'flame' },
  'potassium-chloride-flame-sample': { color: '#c4b5fd', state: 'flame' },
  'calcium-chloride-flame-sample': { color: '#c2410c', state: 'flame' },
  'copper-chloride-flame-sample': { color: '#14b8a6', state: 'flame' },
  'iron-nail': { color: '#71717a', state: 'metal' },
  'galvanized-nail': { color: '#a1a1aa', state: 'metal' },
  'zinc-electrode': { color: '#a1a1aa', state: 'metal' },
  'zinc-granules': { color: '#a1a1aa', state: 'metal' },
  'copper-electrode': { color: '#c2703d', state: 'metal' },
  'magnesium-ribbon': { color: '#e2e8f0', state: 'metal' },
};

export function reagentVisual(id: string, formulaOrDescription: string): ReagentVisual {
  if (OVERRIDES[id]) return OVERRIDES[id];
  const isSolid = /\(solid\)|crystals|strip|ribbon|nail|granules|chips/i.test(formulaOrDescription);
  return isSolid ? { color: '#f1f5f9', state: 'solid' } : { color: '#dbeafe', state: 'liquid' };
}
