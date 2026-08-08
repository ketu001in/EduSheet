import { FreeMixChemical, FreeMixReaction } from './types';

// The "Free Mix" open sandbox -- deliberately a SMALL, closed set of common,
// genuinely safe household/kitchen chemicals (nothing here is a real lab
// reagent), with a hand-verified pairwise reaction table. Any pair NOT
// listed in FREE_MIX_REACTIONS is real information too -- it means "no
// visible reaction" for this specific pair, and the UI should say exactly
// that rather than guessing. This table is intentionally never extended
// with an AI call -- see the Chem Lab architecture note in experiments.ts.
export const FREE_MIX_CHEMICALS: FreeMixChemical[] = [
  { id: 'fm-vinegar', name: 'Vinegar', description: 'A mild household acid.' },
  { id: 'fm-baking-soda', name: 'Baking Soda', description: 'A mild household base (as a powder or dissolved).' },
  { id: 'fm-lemon-juice', name: 'Lemon Juice', description: 'A natural, mild acid.' },
  { id: 'fm-salt', name: 'Table Salt', description: 'Sodium chloride -- generally unreactive with the other items here.' },
  { id: 'fm-sugar', name: 'Sugar', description: 'Sucrose -- generally unreactive with the other items here.' },
  { id: 'fm-water', name: 'Water', description: 'The universal solvent.' },
  { id: 'fm-dish-soap', name: 'Dish Soap', description: 'A mild household surfactant.' },
  { id: 'fm-red-cabbage-juice', name: 'Red Cabbage Juice', description: 'A natural pH indicator -- changes color with acids and bases.' },
  { id: 'fm-iodine-solution', name: 'Dilute Iodine Solution', description: 'Used here only as a starch indicator.' },
  { id: 'fm-cornstarch', name: 'Cornstarch (in water)', description: 'A starch, used to demonstrate the iodine-starch test.' },
  { id: 'fm-chalk-powder', name: 'Chalk Powder', description: 'Calcium carbonate -- reacts with acids like a milder version of marble chips.' },
  { id: 'fm-epsom-salt', name: 'Epsom Salt (in water)', description: 'Magnesium sulfate solution -- generally unreactive with the other items here.' },
  { id: 'fm-milk', name: 'Milk', description: 'A mild household liquid -- generally unreactive with the other items here.' },
];

export const FREE_MIX_REACTIONS: FreeMixReaction[] = [
  {
    chemicalIds: ['fm-vinegar', 'fm-baking-soda'],
    result: { gasBubbles: true, description: 'Vigorous fizzing as carbon dioxide gas is released.' },
    equation: 'CH3COOH + NaHCO3 -> CH3COONa + H2O + CO2',
    explanation: 'The acid in vinegar reacts with the base in baking soda, producing carbon dioxide gas -- the same reaction behind a classic baking-soda volcano.',
  },
  {
    chemicalIds: ['fm-lemon-juice', 'fm-baking-soda'],
    result: { gasBubbles: true, description: 'Fizzing as carbon dioxide gas is released, milder than with vinegar.' },
    equation: 'Citric acid + NaHCO3 -> CO2 + water + a citrate salt',
    explanation: 'Lemon juice is also a mild acid, so it reacts with baking soda the same way vinegar does, just a little less vigorously.',
  },
  {
    chemicalIds: ['fm-vinegar', 'fm-chalk-powder'],
    result: { gasBubbles: true, description: 'Steady fizzing as carbon dioxide gas is released and the chalk slowly dissolves.' },
    equation: '2CH3COOH + CaCO3 -> (CH3COO)2Ca + H2O + CO2',
    explanation: 'Chalk is calcium carbonate, which reacts with any acid to release carbon dioxide -- the same reaction used to test for carbonates in salt analysis.',
  },
  {
    chemicalIds: ['fm-vinegar', 'fm-red-cabbage-juice'],
    result: { colorChange: { from: 'purple', to: 'pink/red' }, description: 'The purple indicator turns pink to red.' },
    explanation: 'Red cabbage juice is a natural pH indicator that turns red/pink in the presence of an acid.',
  },
  {
    chemicalIds: ['fm-baking-soda', 'fm-red-cabbage-juice'],
    result: { colorChange: { from: 'purple', to: 'blue/green' }, description: 'The purple indicator turns blue to green.' },
    explanation: 'Red cabbage juice turns blue/green in the presence of a base, which is why it can be used to test for both acids and bases.',
  },
  {
    chemicalIds: ['fm-iodine-solution', 'fm-cornstarch'],
    result: { colorChange: { from: 'orange-brown', to: 'dark blue-black' }, description: 'The mixture turns a deep blue-black color almost instantly.' },
    explanation: 'Iodine forms a distinctive dark blue-black complex with starch -- this is the standard test used to check whether a food contains starch.',
  },
];
