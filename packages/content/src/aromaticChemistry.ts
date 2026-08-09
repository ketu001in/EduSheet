import { AromaticModule } from './types';

// Benzene and its relatives deliberately live outside the normal
// ChemistryExperiment "drag a reagent into a beaker" model -- see the long
// comment on the AromaticModule type in types.ts for why. This is a
// structural/conceptual explainer, hand-researched like everything else in
// Chem Lab, never something framed as "try mixing this".
export const AROMATIC_MODULES: AromaticModule[] = [
  {
    id: 'aromatic-benzene',
    title: 'Benzene: The First Aromatic Hydrocarbon',
    gradeBand: 'plusTwo',
    board: 'both',
    chapterTags: ['Hydrocarbons'],
    introduction: 'Benzene (C6H6) is a ring of six carbon atoms, each carrying one hydrogen, first isolated by Michael Faraday in 1825. It is the simplest member of the "aromatic" family of hydrocarbons -- a name that originally came from the pleasant smell of many early-discovered ring compounds, not from any property of benzene itself (which is actually toxic, not fragrant).',
    structureExplanation: "In 1865, August Kekule proposed benzene's structure as a hexagonal ring with alternating single and double bonds. That picture is still taught as a useful shorthand, but it isn't quite accurate: all six carbon-carbon bonds in real benzene are exactly the same length, roughly halfway between a typical single and double bond. This happens because the six electrons that would otherwise form three separate double bonds are actually spread out (delocalized) evenly around the whole ring, not fixed in three specific places. That's why benzene is more often drawn today as a hexagon with a circle inside it, representing that shared cloud of electrons.",
    whyStable: "That ring of delocalized electrons gives benzene extra stability, called aromatic stability or resonance energy -- it takes noticeably more energy to break benzene's ring apart than a simple count of its bonds would predict. This is also why benzene behaves so differently from an alkene like the vegetable oil in the bromine water and Baeyer's tests elsewhere in Chem Lab: an alkene's double bond reacts eagerly to break open (addition), but benzene's ring strongly resists breaking open at all. Instead of addition reactions, benzene undergoes substitution reactions -- one hydrogen gets swapped out for something else, while the stable ring itself survives intact.",
    namedReactions: [
      {
        name: 'Nitration',
        reagentsAndConditions: 'Concentrated HNO3 + concentrated H2SO4 ("nitrating mixture"), gently warmed to 50-60°C',
        productDescription: 'Nitrobenzene -- one ring hydrogen is replaced by a -NO2 (nitro) group',
        explanation: 'The sulphuric acid generates a highly reactive nitronium ion (NO2+), which is what actually attacks the electron-rich ring and replaces one hydrogen.',
      },
      {
        name: 'Halogenation',
        reagentsAndConditions: 'Cl2 or Br2, with anhydrous AlCl3 (or FeCl3) as a catalyst',
        productDescription: 'Chlorobenzene or bromobenzene -- one ring hydrogen is replaced by a halogen atom',
        explanation: "Benzene doesn't react with chlorine or bromine on its own at all -- the catalyst is essential to generate an electrophile strong enough to attack the stable ring.",
      },
      {
        name: 'Sulphonation',
        reagentsAndConditions: 'Fuming or concentrated H2SO4, with heat',
        productDescription: 'Benzenesulphonic acid -- one ring hydrogen is replaced by a -SO3H group',
        explanation: 'An important industrial step in manufacturing detergents and synthetic dyes.',
      },
      {
        name: 'Friedel-Crafts Alkylation/Acylation',
        reagentsAndConditions: 'An alkyl or acyl halide, with anhydrous AlCl3 as a catalyst',
        productDescription: 'An alkylbenzene or a phenyl ketone -- a carbon side-chain is attached to the ring',
        explanation: 'This is the key step used to attach carbon side-chains onto an aromatic ring, and is central to manufacturing many drugs, plastics, and detergents.',
      },
    ],
    realWorldOccurrence: [
      'A natural component of crude oil and coal tar, discovered before anyone understood its structure.',
      'Historically used as an industrial solvent and, decades ago, as a gasoline additive -- both uses have since been phased out or heavily restricted.',
      'Still an essential industrial starting material today for plastics (like polystyrene), synthetic rubber, nylon, dyes, and detergents -- almost always handled in closed industrial systems, never in the open.',
    ],
    safetyNotes: [
      'Benzene is a proven human carcinogen, linked to leukemia with repeated long-term exposure -- exactly why it was removed from consumer products like paint thinners and glues once this was understood.',
      "It is never handled directly in a school lab, and even university labs treat it as a controlled, fume-hood-only substance today -- often substituted with safer alternatives (like toluene) for routine teaching. That's also why Chem Lab never offers it as something to \"try mixing\" -- this page is theory and structure only, on purpose.",
      'Real-world exposure sources include vehicle exhaust and cigarette smoke -- one real, practical reason not to idle a car engine in an enclosed garage, or linger breathing deeply at a petrol pump.',
    ],
    funFact: "Kekule's own account of how he pictured the ring is one of the most famous stories in chemistry: he said the idea came to him after daydreaming of a snake biting its own tail. Historians still debate how literally to take the story, but the ring structure it inspired turned out to be essentially correct.",
  },
];
