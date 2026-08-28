import { ReferenceChart } from './types';

// Static, well-established reference charts -- same "no AI, no accuracy
// risk" principle as the periodic table. Downloadable as PDF posters too.
export const CHEM_REFERENCE_CHARTS: ReferenceChart[] = [
  {
    id: 'reactivity-series',
    title: 'Reactivity Series of Metals',
    description: 'Metals arranged from most to least reactive -- a metal higher up can displace one below it from its compound.',
    rows: [
      { label: '1', value: 'Potassium (K)' },
      { label: '2', value: 'Sodium (Na)' },
      { label: '3', value: 'Calcium (Ca)' },
      { label: '4', value: 'Magnesium (Mg)' },
      { label: '5', value: 'Aluminium (Al)' },
      { label: '6', value: 'Zinc (Zn)' },
      { label: '7', value: 'Iron (Fe)' },
      { label: '8', value: 'Lead (Pb)' },
      { label: '9', value: 'Hydrogen (H) -- reference point' },
      { label: '10', value: 'Copper (Cu)' },
      { label: '11', value: 'Silver (Ag)' },
      { label: '12', value: 'Gold (Au)' },
    ],
  },
  {
    id: 'valency-ions',
    title: 'Common Valency & Ions Table',
    description: 'The charge/valency of frequently used ions -- needed to write correct chemical formulae.',
    rows: [
      { label: 'Sodium', value: 'Na+ (1)' },
      { label: 'Potassium', value: 'K+ (1)' },
      { label: 'Calcium', value: 'Ca2+ (2)' },
      { label: 'Magnesium', value: 'Mg2+ (2)' },
      { label: 'Aluminium', value: 'Al3+ (3)' },
      { label: 'Iron(II) / Iron(III)', value: 'Fe2+ (2) / Fe3+ (3)' },
      { label: 'Copper(II)', value: 'Cu2+ (2)' },
      { label: 'Zinc', value: 'Zn2+ (2)' },
      { label: 'Chloride', value: 'Cl- (1)' },
      { label: 'Sulphate', value: 'SO4^2- (2)' },
      { label: 'Nitrate', value: 'NO3- (1)' },
      { label: 'Carbonate', value: 'CO3^2- (2)' },
      { label: 'Hydroxide', value: 'OH- (1)' },
      { label: 'Ammonium', value: 'NH4+ (1)' },
    ],
  },
  {
    id: 'ph-scale',
    title: 'The pH Scale',
    description: '0 is strongly acidic, 7 is neutral, 14 is strongly alkaline (basic).',
    rows: [
      { label: '0-2', value: 'Strongly acidic (e.g. battery acid, gastric acid)' },
      { label: '3-6', value: 'Weakly acidic (e.g. vinegar, lemon juice, tomato)' },
      { label: '7', value: 'Neutral (e.g. pure water)' },
      { label: '8-11', value: 'Weakly alkaline (e.g. baking soda, seawater, soap)' },
      { label: '12-14', value: 'Strongly alkaline (e.g. bleach, drain cleaner, sodium hydroxide)' },
    ],
  },
  {
    id: 'hazard-symbols',
    title: 'Common Laboratory Hazard Symbols',
    description: 'Standard warning symbols found on chemical containers -- always read these before handling anything.',
    rows: [
      { label: 'Flame', value: 'Flammable -- keep away from open flame or spark' },
      { label: 'Skull and Crossbones', value: 'Toxic -- can cause serious harm if swallowed, inhaled, or absorbed' },
      { label: 'Corrosion', value: 'Corrosive -- can damage skin, eyes, or metal on contact' },
      { label: 'Exclamation Mark', value: 'Irritant/Harmful -- causes irritation or mild health effects' },
      { label: 'Gas Cylinder', value: 'Gas under pressure -- container may rupture if heated' },
      { label: 'Flame Over Circle', value: 'Oxidizer -- can intensify fire' },
      { label: 'Environment', value: 'Hazardous to aquatic life or the environment' },
    ],
  },
  {
    id: 'gas-tests',
    title: 'Common Gas Preparation & Confirmatory Tests',
    description: 'How each common school-lab gas is usually made and how you confirm it is really present.',
    rows: [
      { label: 'Hydrogen (H2)', value: 'Made from a metal + dilute acid. Test: brings a lit splint near the mouth of the tube -- a "pop" sound confirms it.' },
      { label: 'Oxygen (O2)', value: 'Made by decomposing hydrogen peroxide with a catalyst. Test: relights a glowing (not flaming) splint.' },
      { label: 'Carbon Dioxide (CO2)', value: 'Made from a carbonate + dilute acid. Test: turns limewater milky/cloudy.' },
      { label: 'Ammonia (NH3)', value: 'Made by heating an ammonium salt with an alkali. Test: turns damp red litmus paper blue, and has a sharp smell.' },
      { label: 'Chlorine (Cl2)', value: 'Test: bleaches damp litmus paper white; has a sharp, choking smell -- handle only under supervision with good ventilation.' },
    ],
  },
];
