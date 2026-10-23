// Real, curated food-composition results for each food-test experiment --
// which foods actually contain starch/fat/protein, and what color change
// that specific reagent really produces. Keyed by experiment id, then by
// the matching experiment's `foodSample` paramConfig choice value. Kept
// separate from biologyEngine.ts deliberately: this is curated FACT data
// (like Chem Lab's reaction tables), not computed logic.
export interface FoodTestResult {
  positive: boolean;
  colorChange: string;
  colorHex: string;
}

export const FOOD_TEST_RESULTS: Record<string, Record<number, FoodTestResult>> = {
  'exp-starch-test': {
    0: { positive: true, colorChange: 'Blue-black', colorHex: '#1e2a4a' }, // Boiled Potato
    1: { positive: true, colorChange: 'Blue-black', colorHex: '#1e2a4a' }, // Rice
    2: { positive: false, colorChange: 'No change (stays orange-brown)', colorHex: '#c2410c' }, // Egg White
    3: { positive: false, colorChange: 'No change (stays orange-brown)', colorHex: '#c2410c' }, // Cooking Oil
  },
  'exp-fat-test': {
    0: { positive: true, colorChange: 'Translucent grease spot forms', colorHex: '#fef3c7' }, // Cooking Oil
    1: { positive: true, colorChange: 'Translucent grease spot forms', colorHex: '#fef3c7' }, // Butter
    2: { positive: false, colorChange: 'No lasting mark (dries clear)', colorHex: '#f8fafc' }, // Boiled Potato
    3: { positive: false, colorChange: 'No lasting mark (dries clear)', colorHex: '#f8fafc' }, // Egg White
  },
  'exp-protein-test': {
    0: { positive: true, colorChange: 'Violet / purple', colorHex: '#7c3aed' }, // Egg White
    1: { positive: true, colorChange: 'Violet / purple', colorHex: '#7c3aed' }, // Milk
    2: { positive: false, colorChange: 'No change (stays pale blue)', colorHex: '#93c5fd' }, // Boiled Potato
    3: { positive: false, colorChange: 'No change (stays pale blue)', colorHex: '#93c5fd' }, // Cooking Oil
  },
  'exp-sugar-test': {
    0: { positive: true, colorChange: 'Brick-red precipitate (after heating)', colorHex: '#b91c1c' }, // Glucose solution
    1: { positive: true, colorChange: 'Brick-red precipitate (after heating)', colorHex: '#b91c1c' }, // Grape juice
    2: { positive: false, colorChange: 'No change (stays blue)', colorHex: '#1d4ed8' }, // Boiled Potato (starch, not a reducing sugar)
    3: { positive: false, colorChange: 'No change (stays blue)', colorHex: '#1d4ed8' }, // Cooking Oil
  },
};
