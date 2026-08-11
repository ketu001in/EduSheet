import { DeepDiveContent } from './deepDive';

// Biology Lab's first wave of Deep Dives -- same shared EquipmentModal
// wiring as Physics (see deepDivePhysics.ts's header). Note Biology's
// Anatomy Explorer already has its own rich per-hotspot deepDive field
// (see anatomyModels.ts / AnatomyExplorer.tsx) which already meets the
// "expand on click" bar for anatomy specifically -- this file targets the
// equipment/reagent items used in guided experiments instead, which
// previously only had a single short deepDive sentence.
export const BIOLOGY_DEEP_DIVES: DeepDiveContent[] = [
  {
    id: 'bio-equip-microscope',
    lab: 'biology',
    title: 'Microscope',
    tagline: 'The instrument that first revealed an entire invisible world of living things.',
    overview: 'The microscope uses lenses to magnify tiny objects far beyond what the naked eye can see -- the essential tool for observing cells and microorganisms.',
    deepFacts: [
      'The word "microscope" comes from the Greek words for "small" (mikros) and "to look at" (skopein) -- literally, "to look at small things."',
      'Antonie van Leeuwenhoek, a Dutch cloth merchant with no formal scientific training, built simple but extremely precise single-lens microscopes in the 1670s and was the first person in history to observe living bacteria and single-celled organisms, which he called "animalcules."',
      'A compound microscope, the kind used in most school labs, uses TWO lenses working together -- the objective lens near the sample and the eyepiece lens -- and its total magnification is the two lenses\' powers multiplied together, not added.',
      'Light microscopes are fundamentally limited by the wavelength of visible light itself -- no matter how good the lenses are, they can\'t resolve details much smaller than about 200 nanometres, which is why seeing individual viruses clearly requires a completely different technology (electron microscopes).',
    ],
    realWorldApplications: [
      'Diagnosing disease from blood and tissue samples in medicine',
      'Forensic science, analysing fibres and trace materials',
      'Quality control in manufacturing',
      'Basic biological and materials research',
    ],
    commonMisconceptions: [
      '"A bigger magnification number always means a better, clearer image" -- past a certain point, higher magnification without matching resolution just produces a bigger, blurrier image; useful detail depends on resolution, not magnification alone.',
    ],
    relatedIds: [],
    visualType: 'none',
  },
  {
    id: 'bio-equip-iodine-solution-bio',
    lab: 'biology',
    title: 'Iodine Solution',
    tagline: 'Turns deep blue-black in the presence of one specific thing: starch.',
    overview: 'Iodine solution is the standard biology test for starch, turning from its usual brown-orange color to a distinctive deep blue-black wherever starch is present.',
    deepFacts: [
      'The blue-black color change happens because iodine molecules slot inside the coiled, spiral structure of the starch molecule (amylose) -- the color literally comes from that specific physical fit, which is why iodine doesn\'t turn blue-black with other carbohydrates like glucose or table sugar that don\'t have the same coiled shape.',
      'This is a genuinely specific test, not a general "sugar" test -- it detects starch and essentially nothing else in a typical food sample.',
      'The same underlying iodine-starch reaction is used outside biology too -- some chemistry indicator reactions (like the "iodine clock reaction") rely on exactly this color change to visibly mark a reaction\'s endpoint.',
    ],
    realWorldApplications: [
      'Testing foods for starch content in biology and food science',
      'The classic photosynthesis experiment -- testing a leaf for starch to show photosynthesis has been happening',
      'Iodine\'s separate antimicrobial properties are used in some antiseptic solutions, a completely different use of the same element',
    ],
    commonMisconceptions: [
      '"Iodine solution tests for sugar in general" -- it specifically detects starch; testing for simple sugars like glucose actually requires a completely different reagent, Benedict\'s solution.',
    ],
    relatedIds: ['bio-equip-benedicts-solution'],
    visualType: 'none',
  },
  {
    id: 'bio-equip-benedicts-solution',
    lab: 'biology',
    title: "Benedict's Solution",
    tagline: 'A blue solution that turns brick-red with sugar -- and the exact shade tells you roughly how much.',
    overview: "Benedict's solution is the standard biology test for reducing sugars like glucose, changing color from blue through green, yellow, and orange to a brick-red precipitate when heated with a positive sample.",
    deepFacts: [
      'The exact final color (green through brick-red) actually indicates roughly how MUCH sugar is present, not just whether any is present at all -- it\'s a semi-quantitative test, not just a yes/no one.',
      'It was developed by American chemist Stanley Rossiter Benedict in 1908 as an improvement on an earlier, less stable copper-based sugar test called Fehling\'s solution, making it easier to store and use reliably.',
      'The color change happens because copper(II) ions in the blue solution are chemically reduced to copper(I) oxide, an insoluble brick-red solid, by the sugar -- which is why the sample must be heated, since the reaction needs that energy to proceed.',
      'Before modern electronic glucose meters existed, a very similar copper-reduction chemistry was used in over-the-counter urine test kits to help people with diabetes monitor their sugar levels at home.',
    ],
    realWorldApplications: [
      'Testing food and drink samples for reducing sugars in biology and food science',
      'Historically used in diabetes urine testing, before modern blood glucose meters',
      'Quality testing in the food and brewing industries',
    ],
    commonMisconceptions: [
      "\"Benedict's test works on any sugar, including table sugar\" -- it only detects REDUCING sugars like glucose and fructose; ordinary table sugar (sucrose) is a non-reducing sugar and gives a negative result unless it's first broken down.",
    ],
    relatedIds: ['bio-equip-iodine-solution-bio'],
    visualType: 'none',
  },
];
