import { FreeMixChemical, FreeMixReaction } from './types';

// The "Free Mix" open sandbox -- a small, closed set of common household/
// kitchen items (nothing here is a real lab reagent), with a hand-verified
// pairwise reaction table. Any pair NOT listed in FREE_MIX_REACTIONS is real
// information too -- it means "no visible reaction" for this specific pair,
// and the UI should say exactly that rather than guessing. This table is
// intentionally never extended with an AI call -- see the Chem Lab
// architecture note in experiments.ts.
//
// Two items (bleach, ammonia-cleaner) are marked hazardOnly: true. They are
// real household chemicals with a genuinely important, widely-taught safety
// warning attached ("never mix bleach and ammonia" is printed on bleach
// bottles for a reason). Including them lets a student safely discover WHY
// that warning exists -- the toxic-gas outcome is shown as a stark hazard
// card, never styled like the fun reactions, and never framed as something
// to actually try.
export const FREE_MIX_CHEMICALS: FreeMixChemical[] = [
  { id: 'fm-vinegar', name: 'Vinegar', description: 'A mild household acid.' },
  { id: 'fm-baking-soda', name: 'Baking Soda', description: 'A mild household base (as a powder or dissolved).' },
  { id: 'fm-baking-powder', name: 'Baking Powder', description: 'Baking soda pre-mixed with a mild acid -- fizzes on its own with water.' },
  { id: 'fm-washing-soda', name: 'Washing Soda', description: 'A stronger relative of baking soda, used for laundry and cleaning.' },
  { id: 'fm-lemon-juice', name: 'Lemon Juice', description: 'A natural, mild acid.' },
  { id: 'fm-salt', name: 'Table Salt', description: 'Sodium chloride -- generally unreactive with the other items here.' },
  { id: 'fm-sugar', name: 'Sugar', description: 'Sucrose -- generally unreactive with the other items here.' },
  { id: 'fm-water', name: 'Water', description: 'The universal solvent.' },
  { id: 'fm-dish-soap', name: 'Dish Soap', description: 'A mild household surfactant.' },
  { id: 'fm-red-cabbage-juice', name: 'Red Cabbage Juice', description: 'A natural pH indicator -- changes color with acids and bases.' },
  { id: 'fm-iodine-solution', name: 'Dilute Iodine Solution', description: 'Used here as a starch indicator, and to test for vitamin C.' },
  { id: 'fm-cornstarch', name: 'Cornstarch (in water)', description: 'A starch, used to demonstrate the iodine-starch test.' },
  { id: 'fm-chalk-powder', name: 'Chalk Powder', description: 'Calcium carbonate -- reacts with acids like a milder version of marble chips.' },
  { id: 'fm-epsom-salt', name: 'Epsom Salt (in water)', description: 'Magnesium sulfate solution -- generally unreactive with the other items here.' },
  { id: 'fm-milk', name: 'Milk', description: 'Contains a protein (casein) that curdles when the milk turns acidic.' },
  { id: 'fm-hydrogen-peroxide', name: 'Dilute Hydrogen Peroxide', description: 'A mild household antiseptic -- releases oxygen gas when broken down by a catalyst.' },
  { id: 'fm-yeast', name: 'Yeast (mixed with warm water)', description: 'A living catalyst -- speeds up the breakdown of hydrogen peroxide.' },
  { id: 'fm-vitamin-c-tablet', name: 'Crushed Vitamin C Tablet', description: 'A natural reducing agent, dissolved in water.' },
  { id: 'fm-antacid-tablet', name: 'Antacid Tablet', description: 'Contains its own built-in acid and base -- fizzes the moment it touches water.' },
  { id: 'fm-rubbing-alcohol', name: 'Rubbing Alcohol', description: 'Evaporates quickly and does not mix the same way water does with oil.' },
  { id: 'fm-bleach', name: 'Bleach', description: 'A strong household disinfectant -- never mix with ammonia or acids in real life.', hazardOnly: true },
  { id: 'fm-ammonia-cleaner', name: 'Ammonia Cleaner', description: 'A strong household cleaner -- never mix with bleach in real life.', hazardOnly: true },
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
    chemicalIds: ['fm-vinegar', 'fm-washing-soda'],
    result: { gasBubbles: true, description: 'A much stronger, more energetic fizz than baking soda -- and the mixture warms up slightly.' },
    equation: '2CH3COOH + Na2CO3 -> 2CH3COONa + H2O + CO2',
    explanation: 'Washing soda (sodium carbonate) is a stronger base than baking soda, so it reacts with acid more vigorously, releasing carbon dioxide faster.',
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
  {
    chemicalIds: ['fm-iodine-solution', 'fm-vitamin-c-tablet'],
    result: { colorChange: { from: 'orange-brown', to: 'colorless' }, description: 'The orange-brown iodine solution fades to colorless as you add more.' },
    explanation: 'Vitamin C (ascorbic acid) is a reducing agent that converts iodine into a colorless form -- this is the real test labs use to measure how much vitamin C is in a juice or fruit.',
  },
  {
    chemicalIds: ['fm-milk', 'fm-vinegar'],
    result: { precipitate: { color: 'white', description: 'Soft white lumps (curds) form and separate from the liquid (whey).' }, description: 'The milk curdles -- solid white lumps form almost immediately.' },
    explanation: 'Milk contains a protein called casein that stays dissolved at milk\'s normal pH. Adding acid changes the pH enough that the casein unfolds and clumps together (curdles) -- the same basic chemistry behind making paneer or cheese.',
  },
  {
    chemicalIds: ['fm-antacid-tablet', 'fm-water'],
    result: { gasBubbles: true, description: 'Rapid, energetic fizzing as the tablet dissolves.' },
    explanation: 'An antacid tablet already contains both a mild acid and a base in one dry tablet -- as soon as water dissolves it, they react with each other and release carbon dioxide gas.',
  },
  {
    chemicalIds: ['fm-yeast', 'fm-hydrogen-peroxide'],
    result: { gasBubbles: true, smoke: true, description: 'Fast, foamy bubbling as oxygen gas is released -- warmer to the touch too.' },
    equation: '2H2O2 -(catalyzed by yeast)-> 2H2O + O2',
    explanation: 'Yeast contains an enzyme (catalase) that speeds up the natural breakdown of hydrogen peroxide into water and oxygen gas -- a small, safe, home version of the famous "elephant toothpaste" demo.',
  },
  {
    chemicalIds: ['fm-bleach', 'fm-ammonia-cleaner'],
    hazard: true,
    result: { smoke: true, description: 'Produces toxic chloramine gas -- this pair must NEVER actually be mixed.' },
    explanation: 'Bleach and ammonia react to form chloramine vapors, which are toxic to breathe even in small amounts. This is exactly why bleach bottles carry a "never mix with ammonia" warning -- it is safe to learn this here, in simulation, and never safe to test for real.',
  },
  {
    chemicalIds: ['fm-bleach', 'fm-vinegar'],
    hazard: true,
    result: { smoke: true, description: 'Produces toxic chlorine gas -- this pair must NEVER actually be mixed.' },
    explanation: 'Bleach reacts with any acid (including vinegar) to release chlorine gas, which is toxic even in small amounts. Real cleaning products should never be mixed with each other for exactly this reason.',
  },
];
