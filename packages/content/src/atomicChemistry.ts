import { AtomicModel, SubatomicParticle, ElementShellConfig, IonicBondPair, CovalentMolecule } from './types';

export const ATOMIC_MODELS: AtomicModel[] = [
  {
    id: 'dalton',
    name: "Dalton's Solid Sphere Model",
    year: '1803',
    scientist: 'John Dalton',
    description: 'The first real atomic theory: atoms are tiny, solid, indivisible spheres -- like miniature billiard balls -- and all atoms of one element are identical. It correctly explained why elements combine in fixed ratios, but had no idea atoms contained anything smaller inside them.',
  },
  {
    id: 'thomson',
    name: '"Plum Pudding" Model',
    year: '1897',
    scientist: 'J.J. Thomson',
    description: "After discovering the electron, Thomson pictured the atom as a positively charged sphere with tiny negative electrons scattered through it, like plums in a pudding. It was the first model to admit atoms have smaller parts inside them, but it got the arrangement wrong.",
  },
  {
    id: 'rutherford',
    name: 'Nuclear Model',
    year: '1911',
    scientist: 'Ernest Rutherford',
    description: "Rutherford's famous gold foil experiment -- firing particles at thin gold foil and watching a few bounce straight back -- proved atoms are mostly empty space with a tiny, dense, positively charged nucleus at the center, and electrons somewhere around it. A huge leap, but it didn't explain why the electrons don't just spiral into the nucleus.",
  },
  {
    id: 'bohr',
    name: 'Shell Model',
    year: '1913',
    scientist: 'Niels Bohr',
    description: "Bohr proposed that electrons travel in fixed, specific circular paths (shells) around the nucleus, each shell holding a set maximum number of electrons, and that electrons don't lose energy while staying in a shell. This is the model actually used to draw the K, L, M, N shell diagrams in the Build an Atom tool above -- simple, visual, and still how atomic structure is first taught in school today.",
  },
  {
    id: 'quantum',
    name: 'Quantum Mechanical Model',
    year: '1920s onward',
    scientist: 'Schrodinger, Heisenberg, and others',
    description: "The modern, most accurate picture: electrons don't travel in neat fixed circles at all -- they exist in fuzzy, cloud-like regions of probability called orbitals, where you can only ever calculate the CHANCE of finding an electron in a given spot, never its exact path. It explains real atomic behavior precisely, but is much harder to visualize than Bohr's neat shells -- which is exactly why Bohr's simpler picture is still taught first.",
  },
];

export const SUBATOMIC_PARTICLES: SubatomicParticle[] = [
  { name: 'Proton', symbol: 'p+', charge: '+1 (positive)', relativeMass: '1', location: 'Inside the nucleus' },
  { name: 'Neutron', symbol: 'n0', charge: '0 (neutral)', relativeMass: '1 (very slightly more than a proton)', location: 'Inside the nucleus' },
  { name: 'Electron', symbol: 'e-', charge: '-1 (negative)', relativeMass: '1/1836 (about 2000 times lighter than a proton)', location: 'In shells around the nucleus' },
];

// K, L, M, N shell distribution for the neutral atom of each element,
// hand-checked against the real, well-established configuration for every
// one of these 20 elements -- see the ElementShellConfig type comment for
// why this stops at Calcium (Z=20).
export const ELEMENT_SHELL_CONFIGS: ElementShellConfig[] = [
  { atomicNumber: 1, symbol: 'H', name: 'Hydrogen', shells: [1], commonIon: { charge: 1, note: 'Hydrogen loses its only electron to become H+ -- the ion that makes acids acidic (it\'s literally what "acid" means chemically).' } },
  { atomicNumber: 2, symbol: 'He', name: 'Helium', shells: [2] },
  { atomicNumber: 3, symbol: 'Li', name: 'Lithium', shells: [2, 1], commonIon: { charge: 1, note: 'Lithium loses its 1 outer electron to become Li+, reaching a full, stable shell just like Helium.' } },
  { atomicNumber: 4, symbol: 'Be', name: 'Beryllium', shells: [2, 2] },
  { atomicNumber: 5, symbol: 'B', name: 'Boron', shells: [2, 3] },
  { atomicNumber: 6, symbol: 'C', name: 'Carbon', shells: [2, 4] },
  { atomicNumber: 7, symbol: 'N', name: 'Nitrogen', shells: [2, 5] },
  { atomicNumber: 8, symbol: 'O', name: 'Oxygen', shells: [2, 6], commonIon: { charge: -2, note: 'Oxygen gains 2 electrons to become O2-, filling its outer shell to look like Neon -- this is the ion in most metal oxides and in water.' } },
  { atomicNumber: 9, symbol: 'F', name: 'Fluorine', shells: [2, 7], commonIon: { charge: -1, note: 'Fluorine gains 1 electron to become F-, completing its outer shell to match Neon.' } },
  { atomicNumber: 10, symbol: 'Ne', name: 'Neon', shells: [2, 8] },
  { atomicNumber: 11, symbol: 'Na', name: 'Sodium', shells: [2, 8, 1], commonIon: { charge: 1, note: 'Sodium loses its 1 outer electron to become Na+, reaching a full shell just like Neon -- this is the ion in table salt.' } },
  { atomicNumber: 12, symbol: 'Mg', name: 'Magnesium', shells: [2, 8, 2], commonIon: { charge: 2, note: 'Magnesium loses both its outer electrons to become Mg2+, reaching a full shell like Neon.' } },
  { atomicNumber: 13, symbol: 'Al', name: 'Aluminium', shells: [2, 8, 3], commonIon: { charge: 3, note: 'Aluminium loses all 3 outer electrons to become Al3+, reaching a full shell like Neon.' } },
  { atomicNumber: 14, symbol: 'Si', name: 'Silicon', shells: [2, 8, 4] },
  { atomicNumber: 15, symbol: 'P', name: 'Phosphorus', shells: [2, 8, 5] },
  { atomicNumber: 16, symbol: 'S', name: 'Sulfur', shells: [2, 8, 6], commonIon: { charge: -2, note: 'Sulfur gains 2 electrons to become S2-, filling its outer shell to look like Argon.' } },
  { atomicNumber: 17, symbol: 'Cl', name: 'Chlorine', shells: [2, 8, 7], commonIon: { charge: -1, note: 'Chlorine gains 1 electron to become Cl-, completing its outer shell to match Argon -- this is the other ion in table salt.' } },
  { atomicNumber: 18, symbol: 'Ar', name: 'Argon', shells: [2, 8, 8] },
  { atomicNumber: 19, symbol: 'K', name: 'Potassium', shells: [2, 8, 8, 1], commonIon: { charge: 1, note: 'Potassium loses its 1 outer electron to become K+, reaching a full shell like Argon.' } },
  { atomicNumber: 20, symbol: 'Ca', name: 'Calcium', shells: [2, 8, 8, 2], commonIon: { charge: 2, note: 'Calcium loses both its outer electrons to become Ca2+, reaching a full shell like Argon -- this is the ion your bones and teeth are built from.' } },
];

// Metal + nonmetal pairs where the metal transfers its valence electron(s)
// to the nonmetal to form a real, commonly-taught ionic compound. Scoped to
// 1:1 and 1:2 ratios only -- see IonicBondPair's comment in types.ts.
export const IONIC_BOND_PAIRS: IonicBondPair[] = [
  {
    id: 'nacl',
    metalAtomicNumber: 11,
    nonmetalAtomicNumber: 17,
    nonmetalCount: 1,
    electronsPerNonmetal: 1,
    formula: 'NaCl',
    compoundName: 'Sodium Chloride (Table Salt)',
    explanation: "Sodium has 1 lonely electron in its outer shell and \"wants\" to get rid of it to reach a stable full shell like Neon. Chlorine has 7 outer electrons and just needs 1 more to look like Argon. Sodium hands its electron over -- Sodium becomes a positively charged Na+ ion, Chlorine becomes a negatively charged Cl- ion, and the strong attraction between the opposite charges is the ionic bond.",
    realWorldUse: 'The salt in your kitchen -- essential for nerve signaling and fluid balance in the human body, and one of the most-mined minerals on Earth.',
    funFact: 'Salt was once so valuable that Roman soldiers were partly paid in it -- the word "salary" comes from the Latin word for salt.',
  },
  {
    id: 'lif',
    metalAtomicNumber: 3,
    nonmetalAtomicNumber: 9,
    nonmetalCount: 1,
    electronsPerNonmetal: 1,
    formula: 'LiF',
    compoundName: 'Lithium Fluoride',
    explanation: 'Lithium has 1 outer electron to lose, Fluorine has 7 and needs just 1 more. Lithium transfers its electron to Fluorine, forming Li+ and F- ions held together by their electrostatic attraction.',
    realWorldUse: "Used in specialized optical components (it's transparent to a wide range of light, including UV), ceramic glazes, and welding flux.",
    funFact: 'Lithium Fluoride has one of the highest melting points of any lithium compound -- over 845 degrees Celsius.',
  },
  {
    id: 'kcl',
    metalAtomicNumber: 19,
    nonmetalAtomicNumber: 17,
    nonmetalCount: 1,
    electronsPerNonmetal: 1,
    formula: 'KCl',
    compoundName: 'Potassium Chloride',
    explanation: 'Potassium has 1 outer electron to lose, Chlorine has 7 and needs 1 more. Potassium transfers its electron to Chlorine, forming K+ and Cl- ions.',
    realWorldUse: 'Used as a low-sodium salt substitute and as a key ingredient in potash fertilizer that feeds crops worldwide.',
    funFact: "It tastes salty like table salt but slightly bitter too -- that's the subtle aftertaste in \"low sodium\" salt substitutes.",
  },
  {
    id: 'mgo',
    metalAtomicNumber: 12,
    nonmetalAtomicNumber: 8,
    nonmetalCount: 1,
    electronsPerNonmetal: 2,
    formula: 'MgO',
    compoundName: 'Magnesium Oxide',
    explanation: 'Magnesium has 2 outer electrons to lose, Oxygen has 6 and needs 2 more. Magnesium transfers both its electrons to a single Oxygen atom -- Mg becomes Mg2+, O becomes O2-, and their strong mutual attraction forms the bond.',
    realWorldUse: 'A refractory material that lines industrial furnaces because it can withstand extreme heat, and a common ingredient in antacid and supplement tablets.',
    funFact: 'Magnesium Oxide can withstand temperatures over 2800 degrees Celsius -- hotter than most substances can survive.',
  },
  {
    id: 'cacl2',
    metalAtomicNumber: 20,
    nonmetalAtomicNumber: 17,
    nonmetalCount: 2,
    electronsPerNonmetal: 1,
    formula: 'CaCl2',
    compoundName: 'Calcium Chloride',
    explanation: 'Calcium has 2 outer electrons to lose, but each Chlorine atom only needs 1. So Calcium gives 1 electron to one Chlorine atom and its other electron to a second Chlorine atom -- forming one Ca2+ ion and two separate Cl- ions, in a 1:2 ratio.',
    realWorldUse: 'Spread on roads in winter to melt ice, and used as a drying agent to keep things moisture-free.',
    funFact: 'Dissolving Calcium Chloride in water releases heat -- the same chemistry used in some instant hand-warmer packets.',
  },
];

// Central atom + outer atoms sharing one electron pair per bond -- scoped to
// single covalent bonds only (no double/triple bonds), see CovalentMolecule's
// comment in types.ts.
export const COVALENT_MOLECULES: CovalentMolecule[] = [
  {
    id: 'h2',
    name: 'Hydrogen Gas',
    formula: 'H2',
    centralAtomicNumber: 1,
    outerAtomicNumbers: [1],
    explanation: "Each Hydrogen atom has just 1 electron and needs 1 more to match Helium's full shell of 2. Neither can just take the other's electron -- so instead, both share their electrons, holding them together as one shared pair. That shared pair is a covalent bond.",
    realWorldUse: 'Used as rocket fuel and increasingly explored as a clean energy carrier for fuel cells.',
    funFact: 'Hydrogen is the most abundant element in the entire universe -- most of every star, including the Sun, is hydrogen.',
  },
  {
    id: 'hcl',
    name: 'Hydrogen Chloride',
    formula: 'HCl',
    centralAtomicNumber: 1,
    outerAtomicNumbers: [17],
    explanation: 'Hydrogen needs 1 more electron to fill its shell, and Chlorine needs 1 more too. They share one electron each, forming a single shared pair -- a covalent bond between H and Cl.',
    realWorldUse: 'Dissolved in water it forms hydrochloric acid -- the same acid your stomach makes naturally to digest food, and an industrial chemical used to clean metal surfaces.',
    funFact: "Your stomach's acid is strong enough to dissolve metal, but a special mucus lining protects your stomach walls from it.",
  },
  {
    id: 'h2o',
    name: 'Water',
    formula: 'H2O',
    centralAtomicNumber: 8,
    outerAtomicNumbers: [1, 1],
    explanation: 'Oxygen needs 2 more electrons to complete its outer shell. It forms one covalent bond with each of two separate Hydrogen atoms, sharing one electron pair with each.',
    realWorldUse: 'The universal solvent, and the single molecule every known form of life depends on.',
    funFact: 'Water is one of the very few substances where the solid form (ice) is less dense than the liquid -- which is why ice floats.',
  },
  {
    id: 'nh3',
    name: 'Ammonia',
    formula: 'NH3',
    centralAtomicNumber: 7,
    outerAtomicNumbers: [1, 1, 1],
    explanation: 'Nitrogen needs 3 more electrons to complete its outer shell, so it forms 3 separate covalent bonds, one with each of 3 Hydrogen atoms.',
    realWorldUse: 'A key ingredient in fertilizers that feed most of the world\'s crops, and in household cleaning products.',
    funFact: "Ammonia's sharp smell is deliberately used in \"smelling salts\" to snap people back to alertness.",
  },
  {
    id: 'ch4',
    name: 'Methane',
    formula: 'CH4',
    centralAtomicNumber: 6,
    outerAtomicNumbers: [1, 1, 1, 1],
    explanation: 'Carbon needs 4 more electrons to complete its outer shell, so it forms 4 separate covalent bonds, one with each of 4 Hydrogen atoms -- this ability to form 4 bonds at once is exactly why carbon can build such a huge variety of molecules.',
    realWorldUse: 'The main component of natural gas, burned for heating and electricity generation worldwide.',
    funFact: 'Methane traps over 25 times more heat than CO2 over a 100-year period, which is why methane leaks are such a big climate concern.',
  },
];

// The K-L-M-N filling rule that produces the table above -- correct for any
// electron count from 0 to 20 (covering every neutral atom in the table
// AND any ion you could reasonably build from them, e.g. Na+ has 10
// electrons and should show the same shells as neutral Neon: [2, 8]).
// Deliberately not extended past 20 -- see ElementShellConfig's comment.
export function bohrBuryShells(electronCount: number): number[] {
  const shells: number[] = [];
  let remaining = Math.max(0, electronCount);
  const capacities = [2, 8, 8];
  for (const capacity of capacities) {
    if (remaining <= 0) break;
    const fill = Math.min(capacity, remaining);
    shells.push(fill);
    remaining -= fill;
  }
  if (remaining > 0) shells.push(remaining);
  return shells;
}
