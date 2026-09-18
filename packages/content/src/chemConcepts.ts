import { ChemGradeBandId } from './types';

// Chemistry Concepts Corner -- mirrors Math Lab's Theorem Corner: the key
// laws and principles that everything else in the CBSE/ICSE chemistry
// curriculum builds on, each with a plain-English statement, a step-through
// explanation of WHY it's true (not just what it says), and a real
// historical/real-world note. Hand-verified, never AI-generated, same
// discipline as every other content file in this package.
// Every concept pairs with a genuine interactive "Try It Yourself" playground
// -- not just text -- shown immediately after the explanation, per direct
// user feedback that a text-only Concepts Corner felt "gimmicky". Two of
// these (mole-calculator, equilibrium) reuse the existing Physical Chemistry
// Calculators' ChemPhysicalStage scenes; the rest are new, purpose-built
// mini-playgrounds. See ChemConceptPlayground.tsx for the dispatch.
export type ChemConceptPlaygroundType =
  | 'mass-balance'
  | 'ratio-mixer'
  | 'mole-calculator'
  | 'equilibrium'
  | 'octet-builder'
  | 'periodicity-explorer'
  | 'electrolysis-calculator'
  | 'diffusion-race'
  | 'burette-reading';

export interface ChemConcept {
  id: string;
  name: string;
  gradeBand: ChemGradeBandId;
  board: 'CBSE' | 'ICSE' | 'both';
  chapterTags: string[];
  statement: string;
  whyItMatters: string;
  explanationSteps: string[];
  realLifeNote: string;
  playgroundType: ChemConceptPlaygroundType;
}

export const CHEM_CONCEPTS: ChemConcept[] = [
  {
    id: 'conservation-of-mass',
    name: 'Law of Conservation of Mass',
    gradeBand: 'middle',
    board: 'both',
    chapterTags: ['Chemical Reactions', 'Chemical Changes and Reactions', 'Physical and Chemical Changes'],
    statement: 'In a chemical reaction, the total mass of the reactants equals the total mass of the products -- matter is neither created nor destroyed, only rearranged.',
    whyItMatters: 'This is the entire reason chemical equations must be BALANCED -- every atom present at the start has to still be present at the end, just possibly in a different arrangement.',
    explanationSteps: [
      'A chemical reaction rearranges atoms into new combinations, but it never creates new atoms or destroys existing ones.',
      'Since mass is really just a count of atoms (each with its own fixed mass), if no atoms are created or destroyed, the total mass can\'t change either.',
      'This is why a burning log APPEARS to lose mass -- but if you captured and weighed the smoke, ash, and gases released, the total would match the log\'s original mass plus the oxygen it reacted with.',
      'Balancing a chemical equation is really just bookkeeping this law -- making sure the same number of each type of atom appears on both sides.',
    ],
    realLifeNote: 'French chemist Antoine Lavoisier established this law in 1789 through careful weighing experiments in sealed containers -- a genuinely revolutionary idea at the time, since burning had long seemed to make things simply vanish.',
    playgroundType: 'mass-balance',
  },
  {
    id: 'constant-proportions',
    name: 'Law of Constant (Definite) Proportions',
    gradeBand: 'senior',
    board: 'both',
    chapterTags: ['Mole Concept and Stoichiometry', 'Some Basic Concepts of Chemistry'],
    statement: 'A given chemical compound always contains the same elements combined in exactly the same proportion by mass, no matter how or where the sample was made.',
    whyItMatters: 'It\'s why a chemical FORMULA (like H2O) is meaningful and fixed -- water made in a lab, water from a river, and water from melted ice all have the exact same 1:8 mass ratio of hydrogen to oxygen.',
    explanationSteps: [
      'Water\'s formula, H2O, means every molecule has exactly 2 hydrogen atoms for every 1 oxygen atom -- a fixed ratio of atoms.',
      'Since hydrogen\'s atomic mass (~1) and oxygen\'s (~16) are fixed constants, that fixed 2:1 atom ratio always translates into the same 2:16, or 1:8, mass ratio.',
      'This holds true regardless of the TOTAL amount of water -- a raindrop and a swimming pool of water both have that same 1:8 mass ratio.',
      'This is a special case of an even broader law (Dalton\'s Law of Multiple Proportions) covering elements that can combine in more than one ratio, like carbon and oxygen forming both CO and CO2.',
    ],
    realLifeNote: 'French chemist Joseph Proust established this law around 1799 after years of painstaking analysis, directly contradicting a rival chemist (Claude Berthollet) who believed compound composition could vary continuously -- Proust turned out to be right, and this became one of the founding pillars of atomic theory.',
    playgroundType: 'ratio-mixer',
  },
  {
    id: 'avogadros-law',
    name: "Avogadro's Law",
    gradeBand: 'senior',
    board: 'both',
    chapterTags: ['Study of Gas Laws', 'States of Matter: Gases and Liquids', 'Mole Concept and Stoichiometry'],
    statement: 'Equal volumes of any gas, at the same temperature and pressure, contain equal numbers of molecules -- regardless of what the gas actually is.',
    whyItMatters: 'It\'s the reason 22.4 litres of ANY gas at STP contains exactly one mole of molecules, whether it\'s light hydrogen gas or heavy carbon dioxide -- the identity of the gas simply doesn\'t matter, only its amount does.',
    explanationSteps: [
      'Gas molecules are so far apart from each other (compared to their own tiny size) that the actual SIZE of the molecule barely affects how much space the gas as a whole takes up.',
      'What determines a gas\'s volume, at a given temperature and pressure, is almost entirely how much empty space the molecules are bouncing around in -- which is the same for light or heavy molecules alike.',
      'So if you have equal volumes of two different gases under the same conditions, they must contain the same NUMBER of molecules, even though one sample might weigh far more than the other.',
      'This directly connects gas volume to the mole concept: since one mole is a fixed molecule count (6.022x10^23), one mole of ANY gas takes up the same volume (22.4L at STP).',
    ],
    realLifeNote: "Amedeo Avogadro proposed this in 1811, but it was largely ignored for nearly 50 years until Stanislao Cannizzaro championed it at a famous 1860 chemistry conference -- it then quickly became one of the most important ideas in all of chemistry, and Avogadro's Number was later named in his honour even though he never actually calculated its value himself.",
    playgroundType: 'mole-calculator',
  },
  {
    id: 'le-chateliers-principle',
    name: "Le Chatelier's Principle",
    gradeBand: 'plusTwo',
    board: 'both',
    chapterTags: ['Equilibrium'],
    statement: 'If a system at chemical equilibrium is disturbed by a change in concentration, temperature, or pressure, the system shifts in whichever direction partly counteracts that change.',
    whyItMatters: 'It lets chemists PREDICT which way a reaction will shift without solving any equations at all -- and it\'s the entire reasoning behind why industrial reactions are run at specific, deliberately chosen pressures and temperatures.',
    explanationSteps: [
      'At equilibrium, the forward and reverse reactions are happening at exactly the same rate, so concentrations stay constant (not zero reaction, just no NET change).',
      'Disturbing that balance -- say, by adding more of a reactant -- temporarily speeds up the forward reaction more than the reverse.',
      'The system responds by consuming the extra reactant faster than before, shifting the balance point toward more product, until a new equilibrium is reached.',
      'The same reasoning applies to pressure (favours the side with fewer gas molecules) and temperature (favours whichever direction absorbs the extra heat).',
    ],
    realLifeNote: 'French chemist Henry Louis Le Chatelier proposed this in 1884 -- it remains one of the most widely applied principles in industrial chemistry today, directly guiding how reactions like ammonia synthesis (the Haber Process) are run at scale for maximum product yield.',
    playgroundType: 'equilibrium',
  },
  {
    id: 'octet-rule',
    name: 'The Octet Rule',
    gradeBand: 'senior',
    board: 'both',
    chapterTags: ['Chemical Bonding', 'Atomic Structure and Chemical Bonding', 'Chemical Bonding and Molecular Structure'],
    statement: 'Atoms tend to gain, lose, or share electrons in chemical bonding until they have 8 electrons in their outermost (valence) shell -- the same stable arrangement as a noble gas.',
    whyItMatters: 'It\'s the single rule that predicts WHY atoms bond the way they do -- why sodium loses exactly one electron, why chlorine gains exactly one, and why they form NaCl in a 1:1 ratio.',
    explanationSteps: [
      'Noble gases (like Neon and Argon) are exceptionally stable and unreactive -- they almost never form compounds -- and every one of them (except Helium) has exactly 8 electrons in its outer shell.',
      'Other atoms "want" that same stable arrangement, so they react in whatever way gets them there fastest -- losing electrons if they only have a few extra, gaining electrons if they\'re only a few short, or sharing electrons with another atom that has the same problem.',
      'Sodium has 1 outer electron -- losing it leaves the shell below (which already has 8) as the new outer shell, so sodium readily loses that 1 electron, becoming Na+.',
      'Chlorine has 7 outer electrons -- gaining just 1 more completes its octet, so chlorine readily gains an electron, becoming Cl-. The two opposite charges then attract, forming NaCl.',
    ],
    realLifeNote: 'The octet rule has real, well-known exceptions (Hydrogen and Helium are stable with just 2 electrons, and some larger atoms like Phosphorus and Sulfur can hold MORE than 8) -- it\'s an extremely useful predictive pattern, not an absolute law of physics, and good chemistry teaching says so explicitly rather than treating it as universal.',
    playgroundType: 'octet-builder',
  },
  {
    id: 'modern-periodic-law',
    name: 'Modern Periodic Law',
    gradeBand: 'senior',
    board: 'both',
    chapterTags: ['The Periodic Table', 'Periodic Properties and Variation of Properties', 'Classification of Elements and Periodicity in Properties'],
    statement: 'The properties of elements are a periodic (repeating) function of their atomic number -- not their atomic mass, as Mendeleev originally proposed.',
    whyItMatters: 'It\'s why the periodic table is arranged the way it is today -- elements in the same column share similar chemical properties because they have the same number of outer-shell electrons, which repeats in a regular pattern as atomic number increases.',
    explanationSteps: [
      'Dmitri Mendeleev\'s original 1869 table arranged elements by increasing ATOMIC MASS, and it worked remarkably well, correctly predicting several undiscovered elements.',
      'But atomic mass order occasionally put elements in the "wrong" column based on their actual chemical behaviour (for example, tellurium and iodine appear out of strict mass order).',
      'In 1913, Henry Moseley used X-ray experiments to determine each element\'s actual ATOMIC NUMBER (its proton count) for the first time, and rearranging the table by atomic number fixed every one of those mismatches.',
      'Atomic number order also explains WHY properties repeat periodically: it directly tracks how many electrons are added shell by shell, and elements with the same outer-shell pattern land in the same column.',
    ],
    realLifeNote: 'Henry Moseley\'s X-ray work, done when he was just 26, is considered one of the most important confirmations of atomic theory -- tragically, he was killed in action at Gallipoli in World War I just two years later, at only 27 years old.',
    playgroundType: 'periodicity-explorer',
  },
  {
    id: 'faradays-laws-electrolysis',
    name: "Faraday's Laws of Electrolysis",
    gradeBand: 'plusTwo',
    board: 'both',
    chapterTags: ['Electrolysis', 'Electrochemistry'],
    statement: 'First Law: the mass of a substance deposited or liberated at an electrode is directly proportional to the quantity of electric charge passed through the electrolyte. Second Law: for the same quantity of charge, the mass deposited is proportional to the substance\'s equivalent weight.',
    whyItMatters: 'These two laws let you calculate EXACTLY how much metal will be electroplated, or how much gas will be produced, just from knowing the current and time -- turning electrolysis from a qualitative demo into a precise, predictable process.',
    explanationSteps: [
      'Electric charge is carried by electrons, and depositing one atom at an electrode requires a fixed number of electrons (matching that ion\'s charge) -- so more total charge passed means proportionally more atoms deposited.',
      'This is the First Law: mass deposited is directly proportional to charge passed (mass = Z x current x time, where Z is a constant for that substance).',
      'Different substances need different amounts of charge to deposit the same mass, depending on their equivalent weight (atomic mass divided by the ion\'s charge) -- this is the Second Law.',
      'Together, the two laws mean electroplating and industrial electrolysis can be precisely controlled and timed to deposit an exact, predetermined mass of metal.',
    ],
    realLifeNote: 'Michael Faraday discovered these laws in 1833, decades before anyone knew what an electron actually was -- his careful, purely experimental measurements of mass and charge later became some of the strongest indirect evidence that electric charge itself comes in fixed, discrete units.',
    playgroundType: 'electrolysis-calculator',
  },
  {
    id: 'grahams-law-diffusion',
    name: "Graham's Law of Diffusion",
    gradeBand: 'senior',
    board: 'both',
    chapterTags: ['Study of Gas Laws', 'States of Matter: Gases and Liquids'],
    statement: 'The rate at which a gas diffuses (spreads out) is inversely proportional to the square root of its molar mass -- lighter gases diffuse faster than heavier ones.',
    whyItMatters: 'It explains a genuinely counterintuitive, testable result: two gases released at the same time from opposite ends of a tube don\'t meet in the middle -- they meet much closer to whichever end released the HEAVIER gas.',
    explanationSteps: [
      'At the same temperature, all gas molecules have the same average KINETIC ENERGY, not the same speed.',
      'Since kinetic energy = 1/2 x mass x speed^2, for the energy to be equal, a LIGHTER molecule must be moving FASTER than a heavier one.',
      'Faster-moving molecules spread out (diffuse) through a space more quickly, which is exactly why light gases diffuse faster.',
      'Working through the energy equation gives the precise relationship: rate is proportional to 1/sqrt(molar mass) -- not just "lighter is faster" but a real, calculable ratio.',
    ],
    realLifeNote: 'The classic classroom demonstration of this law uses ammonia (NH3, molar mass 17) and hydrogen chloride (HCl, molar mass 36.5) released from opposite ends of a glass tube -- they react where they meet to form a visible white ring of ammonium chloride smoke, and that ring always forms noticeably closer to the HCl end, since the lighter ammonia travels faster and covers more distance in the same time.',
    playgroundType: 'diffusion-race',
  },
];
