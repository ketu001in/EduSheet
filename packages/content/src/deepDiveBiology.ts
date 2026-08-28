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
  {
    id: 'bio-equip-water-bath',
    lab: 'biology',
    title: 'Water Bath',
    tagline: 'Gentle, even heating capped at 100°C -- exactly what delicate biological samples need.',
    overview: 'A water bath heats samples gently and evenly by surrounding them with temperature-controlled water, rather than exposing them to a direct flame.',
    deepFacts: [
      'A water bath heats things far more gently and evenly than a direct flame, since water can only get as hot as its boiling point (100°C at normal pressure) -- ideal for warming delicate biological samples like enzymes or living cells that direct, uneven flame heating would damage.',
      'Many biological enzymes work fastest at a temperature close to normal body temperature, around 37°C -- a water bath is the standard way to hold a reaction at that exact, stable temperature long enough to clearly observe an enzyme\'s effect.',
      'Modern lab water baths are usually thermostatically controlled, automatically switching a heater on and off to hold a chosen temperature steady over time, rather than needing constant manual adjustment.',
      'The same basic principle -- surrounding something with temperature-controlled fluid rather than heating it directly -- is used in cooking too, in the technique called sous-vide.',
    ],
    realWorldApplications: [
      'Incubating enzyme reactions at a controlled temperature in biology experiments',
      'Gently warming reagents or samples in a lab',
      'Sous-vide cooking, the same principle applied to food',
      'Industrial processes that need precise, even temperature control',
    ],
    commonMisconceptions: [
      '"A water bath and heating something directly over a flame achieve the same result, just differently" -- a water bath specifically provides gentle, even, temperature-LIMITED heating capped at water\'s boiling point, exactly why it\'s chosen for delicate biological material that flame heating would damage.',
    ],
    relatedIds: ['bio-equip-benedicts-solution'],
    visualType: 'none',
  },
  {
    id: 'bio-equip-biuret-reagent',
    lab: 'biology',
    title: 'Biuret Reagent',
    tagline: 'Turns violet in the presence of protein -- by reacting with the bonds that link amino acids together.',
    overview: "Biuret reagent is the standard biology test for protein, changing from pale blue to violet wherever protein is present.",
    deepFacts: [
      'Biuret reagent turns from its normal pale blue color to a distinctive violet/purple specifically in the presence of protein -- the color change happens because copper ions in the reagent form a complex with the peptide bonds linking amino acids together in a protein chain.',
      'Because the test detects peptide bonds directly, it works on virtually ANY protein, unlike some other biological tests that are specific to just one particular molecule -- exactly why it\'s the standard general-purpose test for protein.',
      'The reagent is named after biuret, a small chemical compound made from two joined urea molecules, which happens to give the exact same purple color reaction since it also contains peptide-bond-like linkages -- the test\'s name comes from that original chemical, not from what it detects.',
      'The intensity of the violet color roughly reflects how much protein is present, so the test can give a rough, visual sense of concentration, not just a yes/no answer.',
    ],
    realWorldApplications: [
      'Testing food samples for protein content in biology and food science',
      'Quality control and research in the food industry',
      'A foundational technique behind more advanced, precise protein-quantification methods in biochemistry labs',
    ],
    commonMisconceptions: [
      '"Biuret reagent only detects the specific chemical biuret" -- it\'s named after that compound because it gives the same reaction, but in practice the test is used to detect protein\'s peptide bonds, not biuret itself.',
    ],
    relatedIds: ['bio-equip-benedicts-solution'],
    visualType: 'none',
  },
  {
    id: 'bio-equip-sudan-iii-reagent',
    lab: 'biology',
    title: 'Sudan III Reagent',
    tagline: 'A dye that only dissolves into fat -- staining oil droplets red while leaving water clear.',
    overview: 'Sudan III is the standard biology test for fats, staining fat and oil droplets a visible red-orange while leaving watery solution unaffected.',
    deepFacts: [
      'Sudan III is a fat-soluble dye that dissolves specifically into fat and oil droplets rather than into water, staining them a visible red-orange color while leaving the surrounding watery solution essentially clear -- exactly why it\'s used as the standard test for fats.',
      'When Sudan III is added to a sample containing fat mixed with water, the stained fat droplets typically float to the top and form a distinct red-orange layer, since fats are generally less dense than water -- a visible, physical confirmation alongside the color change.',
      'Sudan dyes were originally developed and used mainly as textile and industrial colorants, not as biology reagents -- their usefulness as a fat-specific biological stain was a secondary discovery based on how selectively they dissolve into fatty substances.',
      'Because Sudan III specifically targets fat and won\'t stain proteins, starches, or sugars, a positive result is a reasonably reliable, specific indicator of fat content, not a general "something organic is present" signal.',
    ],
    realWorldApplications: [
      'Testing food samples for fat content in biology and food science',
      'Forensic science, identifying fatty or oily residues',
      'Textile dyeing, its original, non-biological industrial use',
    ],
    commonMisconceptions: [
      '"Sudan III turns anything organic a different color" -- it specifically and selectively stains fats and oils; proteins, starches, and sugars don\'t react with it the same way.',
    ],
    relatedIds: ['bio-equip-iodine-solution-bio'],
    visualType: 'none',
  },
  {
    id: 'bio-equip-glass-slide',
    lab: 'biology',
    title: 'Glass Slide',
    tagline: 'A precisely standardized rectangle of glass -- so any sample fits any microscope, anywhere.',
    overview: 'The glass slide holds a specimen flat and thin for microscope observation, prepared together with a thin cover slip on top.',
    deepFacts: [
      'Standard microscope glass slides are made to an internationally standardized size, about 75mm by 25mm, specifically so slides, mounting equipment, and microscope stages from completely different manufacturers all reliably fit together.',
      'A thin, separate cover slip placed on top of the sample does more than protect it -- it flattens a liquid sample into an even, thin layer and helps keep the microscope\'s objective lens from ever touching, and contaminating, the actual specimen.',
      'Preparing a "wet mount" -- placing a sample in a drop of water or stain under a glass slide and cover slip -- deliberately traps a thin film of liquid that keeps delicate biological samples, like onion skin or cheek cells, from drying out while under observation.',
      'Some slides are specially "frosted" at one end specifically to provide a writable surface for labeling the sample in pencil, since ink can smudge or be dissolved by lab chemicals.',
    ],
    realWorldApplications: [
      'Preparing biological specimens for microscope observation in labs and classrooms',
      'Medical diagnostic labs, examining blood smears and tissue biopsies',
      'Forensic science, examining trace evidence',
    ],
    commonMisconceptions: [
      '"Any small piece of glass works fine as a microscope slide" -- standard slides are precisely sized, cleaned, and manufactured to a consistent thinness so they interact correctly with a microscope\'s specific focal distance and stage clips.',
    ],
    relatedIds: ['bio-equip-microscope'],
    visualType: 'none',
  },
];
