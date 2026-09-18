import { BiologyBranch, BiologyGradeBandId } from './biologyTypes';

// The Anatomy Explorer -- a separate, deep-dive section (distinct from the
// guided predict/observe experiments) built around real, public-domain (or
// openly-licensed with attribution) anatomical reference images rather than
// hand-drawn illustrations, since for organs and body systems specifically
// a real reference image genuinely teaches better than a simplified icon.
// Every hotspot position was verified by rendering each source image and
// visually locating the structure before recording its coordinates -- see
// each model's `credit` field for the exact source and license.

export interface AnatomyHotspot {
  id: string;
  label: string;
  // Position as a percentage of the image's displayed width/height (0-100),
  // so hotspots stay correctly placed at any screen size without needing
  // pixel math per breakpoint.
  xPct: number;
  yPct: number;
  info: string;
  deepDive: string;
}

export interface AnatomyLevel {
  id: string;
  label: string;
  imageSrc: string;
  imageAlt: string;
  hotspots: AnatomyHotspot[];
}

export interface AnatomyCredit {
  source: string;
  author: string;
  license: string;
  url: string;
}

export interface AnatomyModel {
  id: string;
  name: string;
  branch: BiologyBranch;
  gradeBand: BiologyGradeBandId;
  board: 'CBSE' | 'ICSE' | 'both';
  chapterTags: string[];
  intro: string;
  // Only Brain has more than one level (Surface / Cross-Section / Deep
  // Structures) -- everything else is a single view.
  levels: AnatomyLevel[];
  credit: AnatomyCredit;
}

export const ANATOMY_MODELS: AnatomyModel[] = [
  {
    id: 'heart',
    name: 'The Heart',
    branch: 'human-biology',
    gradeBand: 'senior',
    board: 'both',
    chapterTags: ['Life Processes', 'Circulatory System', 'Heart'],
    intro: 'A real anatomical cutaway of the human heart, sliced open to show its chambers, valves, and major vessels -- the same view used in medical textbooks for over a century.',
    levels: [
      {
        id: 'internal',
        label: 'Internal View',
        imageSrc: '/anatomy/heart.png',
        imageAlt: 'Internal structure of the human heart, showing chambers and valves',
        hotspots: [
          { id: 'aorta', label: 'Aorta', xPct: 47, yPct: 9, info: 'The largest artery in the body, carrying oxygen-rich blood out of the heart to the rest of the body.', deepDive: "The aorta is roughly as wide as a garden hose where it leaves the heart -- it has to be, since every drop of blood your body uses (except what goes to the lungs) passes through it. It arches up and over the heart before running down through the chest and abdomen." },
          { id: 'left-auricula', label: 'Left Atrium', xPct: 80, yPct: 15, info: 'The upper-left chamber that receives oxygen-rich blood arriving from the lungs.', deepDive: 'The "auricula" (or auricle) is the small, wrinkled ear-shaped pouch of the atrium visible here -- it briefly stores blood as it waits to be pushed down into the left ventricle below.' },
          { id: 'aortic-valve', label: 'Aortic Valve', xPct: 82, yPct: 29, info: 'A one-way valve that lets blood flow from the left ventricle into the aorta, but not back.', deepDive: 'This valve opens and shuts roughly 100,000 times a day without you ever thinking about it. If it becomes narrowed or leaky (a common condition in older age), the heart has to work much harder to push blood through, which is why aortic valve problems are taken very seriously by doctors.' },
          { id: 'bicuspid-valve', label: 'Bicuspid (Mitral) Valve', xPct: 62, yPct: 40, info: 'The valve between the left atrium and left ventricle -- has two flaps ("bi-cuspid").', deepDive: "\"Bicuspid\" literally means \"two points\" -- this valve has exactly two flexible flaps that seal shut once blood has passed through, stopping it from flowing backward into the atrium when the ventricle squeezes." },
          { id: 'tricuspid-valve', label: 'Tricuspid Valve', xPct: 37, yPct: 49, info: 'The valve between the right atrium and right ventricle -- has three flaps ("tri-cuspid").', deepDive: 'Sitting on the right side of the heart (which pumps oxygen-POOR blood to the lungs, not the body), this valve has three flaps instead of the left side\'s two -- a real anatomical difference, not just a naming quirk.' },
          { id: 'inferior-vena-cava', label: 'Inferior Vena Cava', xPct: 17, yPct: 35, info: 'A large vein that returns oxygen-poor blood from the lower body back into the right atrium.', deepDive: 'This is the largest vein in the human body. Together with the superior vena cava (which drains the upper body), it delivers every drop of oxygen-depleted blood from your whole body back to the heart to be sent to the lungs for a fresh supply of oxygen.' },
          { id: 'wall-left-ventricle', label: 'Wall of the Left Ventricle', xPct: 87, yPct: 45, info: 'The thick muscular wall of the chamber that pumps blood all the way around the body.', deepDive: 'Notice how much thicker this wall is than the right ventricle\'s -- the left ventricle has to generate enough pressure to push blood through your ENTIRE body (fingers, toes, brain, everywhere), while the right ventricle only has to push blood the short distance to the nearby lungs.' },
        ],
      },
    ],
    credit: { source: 'Wikimedia Commons', author: "Henry Vandyke Carter, Gray's Anatomy (1918)", license: 'Public Domain', url: 'https://commons.wikimedia.org/wiki/File:Gray_internal_structure_of_heart.png' },
  },
  {
    id: 'digestive-system',
    name: 'The Digestive System',
    branch: 'human-biology',
    gradeBand: 'middle',
    board: 'both',
    chapterTags: ['Nutrition in Animals', 'Digestive System'],
    intro: 'A full front-view diagram of the human digestive tract, from mouth to exit -- click each organ to see exactly what it does to the food passing through.',
    levels: [
      {
        id: 'front',
        label: 'Front View',
        imageSrc: '/anatomy/digestive-system.svg',
        imageAlt: 'Diagram of the human digestive system',
        hotspots: [
          { id: 'mouth', label: 'Mouth', xPct: 42, yPct: 13, info: 'Chewing breaks food into smaller pieces, and saliva begins digesting starch.', deepDive: 'Saliva contains an enzyme called amylase that starts breaking down starch into simpler sugars right in the mouth -- which is why bread can start to taste faintly sweet if you chew it for a long time.' },
          { id: 'esophagus', label: 'Esophagus', xPct: 50, yPct: 33, info: 'A muscular tube that pushes food down to the stomach using wave-like contractions.', deepDive: 'These wave-like contractions (called peristalsis) are strong enough that you could actually swallow while upside down -- food doesn\'t rely on gravity to reach your stomach.' },
          { id: 'stomach', label: 'Stomach', xPct: 68, yPct: 54, info: 'Churns food and mixes it with acid and enzymes, starting protein digestion.', deepDive: "Stomach acid is strong enough to dissolve metal, but a thick mucus lining constantly protects the stomach's own walls from being digested by its own acid." },
          { id: 'liver', label: 'Liver', xPct: 34, yPct: 55, info: 'Produces bile, which helps break down fats in the small intestine.', deepDive: "The liver is the body's largest internal organ and performs hundreds of jobs beyond digestion, including filtering toxins from the blood and storing extra glucose as glycogen." },
          { id: 'pancreas', label: 'Pancreas', xPct: 66, yPct: 64, info: 'Produces digestive enzymes that are released into the small intestine to break down food.', deepDive: 'The pancreas has a second, completely separate job too -- it also produces insulin, the hormone that controls blood sugar levels throughout the body.' },
          { id: 'small-intestine', label: 'Small Intestine', xPct: 48, yPct: 78, info: 'Most digestion finishes here, and almost all nutrients are absorbed into the blood.', deepDive: 'The small intestine is lined with millions of tiny finger-like projections called villi -- if flattened out, its total absorbing surface area would be roughly the size of a tennis court.' },
          { id: 'large-intestine', label: 'Large Intestine', xPct: 15, yPct: 78, info: 'Absorbs leftover water from undigested waste before it leaves the body.', deepDive: 'Billions of harmless bacteria live in the large intestine and help break down material human enzymes can\'t digest alone -- they also produce some vitamins the body absorbs and uses.' },
        ],
      },
    ],
    credit: { source: 'Wikimedia Commons', author: 'Mariana Ruiz Villarreal (LadyofHats)', license: 'Public Domain', url: 'https://commons.wikimedia.org/wiki/File:Digestive_system_without_labels.svg' },
  },
  {
    id: 'respiratory-system',
    name: 'The Respiratory System',
    branch: 'human-biology',
    gradeBand: 'middle',
    board: 'both',
    chapterTags: ['Respiration in Organisms', 'Breathing'],
    intro: 'The pathway air takes from the moment you breathe in to the moment oxygen reaches your lungs.',
    levels: [
      {
        id: 'front',
        label: 'Front View',
        imageSrc: '/anatomy/respiratory-system.svg',
        imageAlt: 'Diagram of the human respiratory system',
        hotspots: [
          { id: 'nose', label: 'Nose', xPct: 68, yPct: 22, info: 'Filters, warms, and moistens the air you breathe in before it travels further.', deepDive: 'Tiny hairs and sticky mucus inside your nose trap dust, pollen, and germs before they can reach your lungs -- it\'s a genuine air filter, not just a passage.' },
          { id: 'mouth', label: 'Mouth', xPct: 68, yPct: 32, info: 'A second route for air to enter, especially during heavy breathing or exercise.', deepDive: "Breathing through your nose is generally healthier since it filters and warms air, but during hard exercise your body needs air faster than your nose alone can supply, so you switch to mouth breathing too." },
          { id: 'trachea', label: 'Trachea (Windpipe)', xPct: 52, yPct: 43, info: 'A tube reinforced with rings of cartilage that carries air down to the lungs.', deepDive: 'The C-shaped cartilage rings you can feel at the front of your throat keep the trachea permanently open, like the reinforced hose of a vacuum cleaner -- without them, it would collapse every time you inhaled.' },
          { id: 'lungs', label: 'Lungs', xPct: 30, yPct: 53, info: 'Where oxygen from the air passes into the blood, and carbon dioxide passes out.', deepDive: 'Each lung contains roughly 300-500 million tiny air sacs called alveoli -- if you spread all of them out flat, their combined surface area would cover roughly half a tennis court, giving oxygen a huge area to diffuse across.' },
          { id: 'diaphragm', label: 'Diaphragm', xPct: 18, yPct: 90, info: 'A dome-shaped muscle below the lungs that contracts to pull air in.', deepDive: 'When the diaphragm contracts, it flattens and moves downward, making more space in the chest cavity -- air rushes in to fill that extra space, which is the actual mechanism behind every breath you take.' },
        ],
      },
    ],
    credit: { source: 'Wikimedia Commons', author: 'Original by NCI, adapted by Häggström', license: 'CC BY-SA', url: 'https://commons.wikimedia.org/wiki/File:Respiratory_system.svg' },
  },
  {
    id: 'nervous-system',
    name: 'Neuron & Nervous System',
    branch: 'human-biology',
    gradeBand: 'senior',
    board: 'both',
    chapterTags: ['Control and Coordination', 'Nervous System', 'Neuron'],
    intro: 'A neuron (nerve cell) is the basic building block of your entire nervous system -- billions of these connect to carry every signal in your body.',
    levels: [
      {
        id: 'neuron',
        label: 'Neuron Structure',
        imageSrc: '/anatomy/neuron.svg',
        imageAlt: 'Complete diagram of a neuron cell',
        hotspots: [
          { id: 'dendrites', label: 'Dendrites', xPct: 30, yPct: 10, info: 'Branch-like extensions that receive signals from other neurons.', deepDive: 'A single neuron can have thousands of dendrites, each receiving signals from a different neighboring neuron -- this is how one neuron can be influenced by so many others at once.' },
          { id: 'cell-body', label: 'Cell Body (Soma)', xPct: 24, yPct: 42, info: 'Contains the nucleus and keeps the whole neuron alive and functioning.', deepDive: "The cell body does the same basic housekeeping any cell does (protein-making, energy production) -- it's the neuron's life-support center, even though the electrical signal itself doesn't originate here." },
          { id: 'nucleus', label: 'Nucleus', xPct: 33, yPct: 47, info: "Contains the neuron's DNA and directs all of its activities.", deepDive: 'Unlike many other cells in your body, most neurons are never replaced once you\'re born -- the neurons doing the work in your brain right now are largely the same ones you\'ve had since early childhood.' },
          { id: 'axon', label: 'Axon', xPct: 55, yPct: 39, info: 'A long fiber that carries the electrical signal away from the cell body.', deepDive: 'Some axons in your body (like the ones running from your spinal cord to your toes) can be over a metre long, despite starting from a cell body just a few thousandths of a millimetre wide.' },
          { id: 'myelin-sheath', label: 'Myelin Sheath', xPct: 72, yPct: 32, info: 'A fatty insulating layer around the axon that speeds up signal transmission.', deepDive: 'Myelinated axons can transmit signals over 100 times faster than unmyelinated ones -- the small gaps between myelin segments (called Nodes of Ranvier) let the signal "jump" from gap to gap instead of traveling continuously, dramatically speeding things up.' },
          { id: 'axon-terminal', label: 'Axon Terminal (Synapse)', xPct: 88, yPct: 16, info: 'The end of the axon, where the signal is passed to the next neuron across a tiny gap.', deepDive: 'At the synapse, the electrical signal triggers the release of chemical messengers called neurotransmitters, which cross the tiny gap and trigger a NEW electrical signal in the next neuron -- your nervous system switches between electrical and chemical signaling constantly.' },
        ],
      },
    ],
    credit: { source: 'Wikimedia Commons', author: 'Original by Holly Fischer, derivative by BruceBlaus', license: 'Public Domain', url: 'https://commons.wikimedia.org/wiki/File:Complete_neuron_cell_diagram_without_text.svg' },
  },
  {
    id: 'plant-cell',
    name: 'The Plant Cell',
    branch: 'cell-biology',
    gradeBand: 'middle',
    board: 'both',
    chapterTags: ['Cell Structure and Functions', 'Plant Cell'],
    intro: 'A real, standard diagram of a plant cell\'s internal structures -- the same structures you can find yourself under a microscope in the Onion Cell experiment.',
    levels: [
      {
        id: 'cell',
        label: 'Cell Structure',
        imageSrc: '/anatomy/plant-cell.svg',
        imageAlt: 'Diagram of a plant cell',
        hotspots: [
          { id: 'cell-wall', label: 'Cell Wall', xPct: 8, yPct: 50, info: 'A rigid outer layer made of cellulose that gives the cell its shape and support.', deepDive: 'Only plant cells (and some other organisms like fungi) have a cell wall -- animal cells never do, which is exactly why plant cells keep a fixed rectangular shape while animal cells are more flexible and rounded.' },
          { id: 'cell-membrane', label: 'Cell Membrane', xPct: 14, yPct: 50, info: 'A thin layer just inside the cell wall that controls exactly what enters and exits the cell.', deepDive: 'The cell membrane is "selectively permeable" -- it lets some substances (like water and oxygen) pass through freely while blocking others, acting like a smart gatekeeper rather than a simple wall.' },
          { id: 'nucleus', label: 'Nucleus', xPct: 35, yPct: 38, info: "Contains the cell's DNA and controls all of the cell's activities.", deepDive: "The nucleus is often called the cell's \"control center\" -- if it's removed, the cell can survive briefly but eventually dies, since it can no longer produce the proteins it needs to function." },
          { id: 'chloroplast', label: 'Chloroplast', xPct: 58, yPct: 15, info: 'The green organelle where photosynthesis happens, using sunlight to make food.', deepDive: 'Chloroplasts contain a green pigment called chlorophyll, which absorbs red and blue light for photosynthesis but reflects green light back to our eyes -- that reflected green light is literally why plants look green.' },
          { id: 'vacuole', label: 'Vacuole', xPct: 68, yPct: 50, info: 'A large, central, water-filled sac that stores water and nutrients and keeps the cell firm.', deepDive: "The pressure of water inside a plant cell's vacuole pushing against its cell wall (called turgor pressure) is what keeps a healthy plant standing upright -- lose that pressure, and the plant wilts, even though every cell is still alive." },
          { id: 'mitochondria', label: 'Mitochondria', xPct: 20, yPct: 62, info: 'Releases usable energy from food through a process called cellular respiration.', deepDive: 'Mitochondria are found in both plant and animal cells -- unlike chloroplasts, which only plants have, every living cell that needs energy relies on mitochondria to release it from food.' },
        ],
      },
    ],
    credit: { source: 'Wikimedia Commons', author: 'Vector8DIY', license: 'CC BY', url: 'https://commons.wikimedia.org/wiki/File:Simple_diagram_of_plant_cell_(blank).svg' },
  },
  {
    id: 'brain',
    name: 'The Brain',
    branch: 'human-biology',
    gradeBand: 'senior',
    board: 'both',
    chapterTags: ['Control and Coordination', 'Human Brain'],
    intro: 'The brain can be explored at three different depths -- start at the surface to see its four lobes, then go deeper to see what\'s inside.',
    levels: [
      {
        id: 'surface',
        label: 'Surface (Lobes)',
        imageSrc: '/anatomy/brain-surface.svg',
        imageAlt: 'Lateral view of the brain showing its four lobes',
        hotspots: [
          { id: 'frontal-lobe', label: 'Frontal Lobe', xPct: 25, yPct: 30, info: 'Handles decision-making, planning, personality, and voluntary movement.', deepDive: 'The frontal lobe is the last part of the brain to fully mature, often not finishing development until the mid-20s -- which is part of why judgment and impulse control keep improving through the teenage years.' },
          { id: 'parietal-lobe', label: 'Parietal Lobe', xPct: 60, yPct: 15, info: 'Processes touch, temperature, pain, and spatial awareness.', deepDive: 'This lobe contains a "map" of your entire body surface -- different regions of the parietal lobe correspond to sensations from different body parts, with especially large areas dedicated to sensitive spots like your hands and lips.' },
          { id: 'occipital-lobe', label: 'Occipital Lobe', xPct: 85, yPct: 40, info: 'Processes visual information from the eyes.', deepDive: 'Even though your eyes physically point forward, the occipital lobe that actually processes what you see sits at the very BACK of your brain -- visual signals travel all the way from the front of your head to the back before you consciously "see" anything.' },
          { id: 'temporal-lobe', label: 'Temporal Lobe', xPct: 50, yPct: 65, info: 'Processes hearing, and plays a major role in memory formation.', deepDive: 'The temporal lobe houses the hippocampus, a structure essential for forming new long-term memories -- damage here can leave someone able to recall their past perfectly but unable to form any new memories going forward.' },
          { id: 'cerebellum-surface', label: 'Cerebellum', xPct: 76, yPct: 78, info: 'Coordinates balance, posture, and precise, smooth movement.', deepDive: 'Despite making up only about 10% of the brain\'s total volume, the cerebellum contains more than half of all the neurons in the entire brain -- it\'s densely packed for the fine-tuned, split-second coordination it\'s responsible for.' },
        ],
      },
      {
        id: 'sagittal',
        label: 'Cross-Section',
        imageSrc: '/anatomy/brain-sagittal.svg',
        imageAlt: 'Sagittal cross-section of the brain',
        hotspots: [
          { id: 'cerebral-cortex', label: 'Cerebral Cortex', xPct: 30, yPct: 25, info: 'The folded, outer layer of grey matter responsible for higher thinking.', deepDive: "The cortex's deep folds and grooves exist purely to fit more surface area into the limited space of the skull -- flattened out, the human cortex would cover roughly the area of a large dinner napkin." },
          { id: 'corpus-callosum', label: 'Corpus Callosum', xPct: 47, yPct: 36, info: 'A thick band of nerve fibers connecting the brain\'s left and right hemispheres.', deepDive: 'This is the main communication highway between your two hemispheres, carrying roughly 200-300 million nerve fibers -- without it, the left and right sides of your brain would struggle to share information at all.' },
          { id: 'thalamus-sagittal', label: 'Thalamus', xPct: 52, yPct: 42, info: 'A relay station that routes almost all sensory information to the correct part of the cortex.', deepDive: 'Nearly every sense (except smell) passes through the thalamus before reaching the conscious, thinking parts of your brain -- it acts like a switchboard operator, directing incoming signals to exactly where they need to go.' },
          { id: 'brainstem', label: 'Brainstem', xPct: 60, yPct: 66, info: 'Controls automatic, life-sustaining functions like breathing and heartbeat.', deepDive: 'The brainstem keeps working even during deep sleep or unconsciousness -- it\'s responsible for functions your body genuinely cannot survive without for even a few minutes, unlike most of the rest of the brain.' },
          { id: 'cerebellum-sagittal', label: 'Cerebellum', xPct: 78, yPct: 58, info: 'The distinctively-textured structure that fine-tunes movement and balance.', deepDive: 'In cross-section, the cerebellum shows a unique branching, tree-like pattern of tissue (sometimes called the "tree of life") that is instantly recognizable and completely different from the cortex\'s folds elsewhere in the brain.' },
        ],
      },
      {
        id: 'deep',
        label: 'Deep Structures',
        imageSrc: '/anatomy/brain-deep.svg',
        imageAlt: 'Deep brain structures including the basal ganglia',
        hotspots: [
          { id: 'basal-ganglia', label: 'Basal Ganglia', xPct: 27, yPct: 48, info: 'A cluster of structures deep in the brain that helps initiate and smooth out voluntary movement.', deepDive: 'The basal ganglia don\'t generate movement on their own -- instead, they act like a filter, helping the cortex select ONE intended movement while suppressing competing, unwanted ones, which is why damage here (as in Parkinson\'s disease) causes tremors and difficulty initiating movement.' },
          { id: 'globus-pallidus', label: 'Globus Pallidus', xPct: 34, yPct: 53, info: 'Part of the basal ganglia that helps regulate voluntary movement.', deepDive: 'Its name literally means "pale globe" in Latin, describing its appearance in a real brain dissection -- it works closely with the substantia nigra to fine-tune movement signals before they reach the muscles.' },
          { id: 'thalamus-deep', label: 'Thalamus', xPct: 40, yPct: 57, info: 'The central relay structure that basal ganglia signals pass through on their way to the cortex.', deepDive: 'The thalamus sits at the very center of this whole circuit -- signals from the basal ganglia loop back through the thalamus before reaching the cortex again, forming a feedback loop that keeps movement smooth and controlled.' },
          { id: 'substantia-nigra', label: 'Substantia Nigra', xPct: 49, yPct: 74, info: 'Produces dopamine, a chemical essential for smooth, controlled movement.', deepDive: 'Its name means "black substance" in Latin, since this structure is visibly darker than surrounding tissue in a real dissected brain. The loss of dopamine-producing cells here is the direct cause of Parkinson\'s disease.' },
          { id: 'cerebellum-deep', label: 'Cerebellum', xPct: 63, yPct: 65, info: 'Works alongside the basal ganglia to coordinate smooth, precise movement.', deepDive: 'While the basal ganglia help SELECT which movement to make, the cerebellum fine-tunes HOW that movement is carried out in real time, constantly comparing intended movement to actual movement and correcting small errors as they happen.' },
        ],
      },
    ],
    credit: { source: 'Wikimedia Commons', author: "Gray's Anatomy (1918); NIH/public domain diagram for deep structures", license: 'Public Domain', url: 'https://commons.wikimedia.org/wiki/File:Brain_diagram_without_text.svg' },
  },
  {
    id: 'eye',
    name: 'The Eye',
    branch: 'human-biology',
    gradeBand: 'senior',
    board: 'both',
    chapterTags: ['Control and Coordination', 'Human Eye', 'The Human Eye and the Colourful World'],
    intro: 'A cutaway of the human eyeball, showing the layers of tissue light passes through on its way to forming an image on the retina.',
    levels: [
      {
        id: 'cross-section',
        label: 'Cross-Section',
        imageSrc: '/anatomy/eye.svg',
        imageAlt: 'Schematic cross-section diagram of the human eye',
        hotspots: [
          { id: 'cornea', label: 'Cornea', xPct: 44, yPct: 17, info: 'The transparent front layer that does most of the eye\'s light-bending (refraction).', deepDive: 'The cornea actually does more of the eye\'s total focusing work than the lens does -- roughly two-thirds of the eye\'s refractive power comes from the cornea, with the lens providing the fine, adjustable remainder.' },
          { id: 'pupil', label: 'Pupil', xPct: 51, yPct: 20, info: 'The dark opening that lets light into the eye -- its size is controlled by the iris.', deepDive: 'The pupil isn\'t a structure itself -- it\'s simply the hole in the middle of the iris. In bright light the iris makes it smaller to let in less light; in dim light it opens wider, all without you thinking about it.' },
          { id: 'iris', label: 'Iris', xPct: 68, yPct: 26, info: 'The coloured, ring-shaped muscle that controls how much light enters through the pupil.', deepDive: 'The iris is a muscle, not just coloured tissue -- its circular fibers contract to shrink the pupil in bright light, and its radial fibers contract to widen it in dim light, a genuine reflex controlled automatically by the nervous system.' },
          { id: 'lens', label: 'Lens (Crystalline Lens)', xPct: 51, yPct: 27, info: 'A flexible, transparent structure that fine-tunes focus by changing shape.', deepDive: 'Unlike a camera lens, which moves back and forth to focus, the eye\'s lens focuses by changing its own SHAPE -- becoming rounder to focus on near objects and flatter for distant ones, a process called accommodation.' },
          { id: 'ciliary-body', label: 'Ciliary Body', xPct: 71, yPct: 27, info: 'A ring of muscle that changes the lens\'s shape and curvature.', deepDive: 'The ciliary muscles are directly responsible for accommodation: they contract to let the lens spring into a rounder shape for near vision, and relax to let it flatten for distant vision -- this muscle is what tires when you read for too long.' },
          { id: 'sclera', label: 'Sclera', xPct: 21, yPct: 32, info: 'The tough, white outer layer that gives the eyeball its shape and protects it.', deepDive: 'The sclera is made of the same kind of tough connective tissue as the cornea, but it\'s opaque rather than transparent -- together they form one continuous protective outer coat that wraps almost the entire eyeball.' },
          { id: 'choroid', label: 'Choroid', xPct: 81, yPct: 50, info: 'A layer rich in blood vessels that nourishes the retina and absorbs stray light.', deepDive: 'The choroid is darkly pigmented specifically to absorb light that has already passed through the retina, stopping it from bouncing back and blurring the image -- functioning much like the matte black interior of a camera body.' },
          { id: 'retina', label: 'Retina', xPct: 72, yPct: 76, info: 'The light-sensitive layer at the back of the eye where the image actually forms.', deepDive: 'The retina contains two types of light-sensing cells: rods (for dim-light and black-and-white vision) and cones (for colour vision in bright light) -- a healthy retina has roughly 120 million rods but only about 6 million cones.' },
          { id: 'optic-disc', label: 'Optic Disc (Blind Spot)', xPct: 48, yPct: 75, info: 'The point where the optic nerve leaves the eye -- has no light-sensing cells at all.', deepDive: 'Since no rods or cones exist where the optic nerve exits, this exact spot creates a genuine blind spot in your vision -- you don\'t normally notice it because your brain fills in the gap and your other eye covers it.' },
          { id: 'optic-nerve', label: 'Optic Nerve', xPct: 30, yPct: 87, info: 'Carries the electrical signal from the retina to the brain, where it is interpreted as a picture.', deepDive: 'The retina doesn\'t just pass along a raw image -- it does real preprocessing, and the optic nerve then carries this already partly-processed signal deep into the brain, where the visual cortex finishes constructing what you consciously "see".' },
        ],
      },
    ],
    credit: { source: 'Wikimedia Commons', author: 'Erin Silversmith, based on a diagram by Delta G', license: 'CC BY-SA 3.0 / GFDL', url: 'https://commons.wikimedia.org/wiki/File:Schematic_diagram_of_the_human_eye_en.svg' },
  },
  {
    id: 'skeleton',
    name: 'The Skeletal System',
    branch: 'human-biology',
    gradeBand: 'middle',
    board: 'both',
    chapterTags: ['Body Movements', 'Skeletal System', 'Bones and Joints'],
    intro: 'The adult human skeleton has 206 bones -- this front view highlights the major bone groups that give your body its shape, protect vital organs, and let you move.',
    levels: [
      {
        id: 'front',
        label: 'Front View',
        imageSrc: '/anatomy/skeleton-front.svg',
        imageAlt: 'Front view diagram of the human skeleton',
        hotspots: [
          { id: 'skull', label: 'Skull', xPct: 50, yPct: 8, info: 'A fused case of bones that protects the brain and shapes the face.', deepDive: 'A newborn baby\'s skull is actually made of separate bone plates with soft, flexible gaps between them (fontanelles) -- this lets the head pass through birth and the brain grow rapidly, before the plates fully fuse together over the following years.' },
          { id: 'clavicle', label: 'Clavicle (Collarbone)', xPct: 32, yPct: 17, info: 'A long bone connecting the arm to the main skeleton at the shoulder.', deepDive: 'The clavicle is the most commonly fractured bone in the human body -- it sits just under the skin with little muscle padding, and a fall onto an outstretched arm transmits force straight through it.' },
          { id: 'ribcage', label: 'Ribcage (Thoracic Cage)', xPct: 50, yPct: 23, info: '12 pairs of curved bones that form a protective cage around the heart and lungs.', deepDive: 'The ribcage isn\'t rigid -- it\'s built to flex slightly with every breath, expanding as the diaphragm contracts to pull air in, and springing back as you exhale, all while still shielding the heart and lungs from impact.' },
          { id: 'spine', label: 'Vertebral Column (Spine)', xPct: 50, yPct: 30, info: 'A stack of 33 small bones (vertebrae) that supports the body and protects the spinal cord.', deepDive: 'The spine isn\'t a single bone but a flexible column of 33 individual vertebrae cushioned by disks of cartilage between each one -- this segmented design is exactly what lets you bend and twist while still fully protecting the delicate spinal cord running through its center.' },
          { id: 'humerus', label: 'Humerus (Upper Arm Bone)', xPct: 20, yPct: 27, info: 'The single long bone running from the shoulder to the elbow.', deepDive: 'The humerus meets the shoulder blade in a ball-and-socket joint -- the most mobile joint type in the human body, which is exactly why your arm can rotate in almost every direction, unlike your knee, which only really bends one way.' },
          { id: 'radius-ulna', label: 'Radius & Ulna (Forearm Bones)', xPct: 15, yPct: 45, info: 'Two parallel bones in the forearm that rotate around each other to twist the wrist.', deepDive: 'Unlike the upper arm\'s single humerus, the forearm has TWO bones side by side specifically so they can cross over one another -- that crossing motion is what lets you rotate your palm from facing up to facing down.' },
          { id: 'pelvis', label: 'Pelvis (Hip Bone)', xPct: 50, yPct: 42, info: 'A ring of fused bones that supports the spine and connects the legs to the body.', deepDive: 'The pelvis carries the entire weight of your upper body every time you stand, and its bowl-like shape also protects the lower digestive and reproductive organs -- it\'s also the one bone whose shape differs most noticeably between male and female skeletons, due to its role in childbirth.' },
          { id: 'femur', label: 'Femur (Thigh Bone)', xPct: 42, yPct: 58, info: 'The longest, strongest bone in the human body, running from hip to knee.', deepDive: 'The femur can withstand roughly 30 times a person\'s own body weight in force without breaking -- pound for pound, it\'s stronger than steel, which is exactly what\'s needed to support the impact of running and jumping.' },
          { id: 'patella', label: 'Patella (Kneecap)', xPct: 42, yPct: 68, info: 'A small, free-floating bone embedded in the tendon at the front of the knee.', deepDive: 'The patella is a sesamoid bone -- one that forms INSIDE a tendon rather than connecting directly to other bones. It acts like a pulley, increasing the leverage of the thigh muscles when you straighten your leg.' },
          { id: 'tibia-fibula', label: 'Tibia & Fibula (Shin Bones)', xPct: 42, yPct: 82, info: 'Two bones running from the knee to the ankle -- the tibia bears most of the body\'s weight.', deepDive: 'The tibia (shin bone) is the second-longest bone in the body and carries almost all of your body weight below the knee, while the thinner fibula alongside it mainly serves as a muscle attachment point and helps stabilize the ankle.' },
        ],
      },
    ],
    credit: { source: 'Wikimedia Commons', author: 'Mikael Häggström, based on a diagram by Mariana Ruiz Villarreal', license: 'Public Domain', url: 'https://commons.wikimedia.org/wiki/File:Human_skeleton_front_-_no_labels.svg' },
  },
  {
    id: 'skin',
    name: 'The Skin',
    branch: 'human-biology',
    gradeBand: 'middle',
    board: 'both',
    chapterTags: ['Life Processes', 'Excretion', 'Skin'],
    intro: 'A block cutaway of human skin, showing its three main layers and the glands, follicles, and vessels packed within them.',
    levels: [
      {
        id: 'cross-section',
        label: 'Cross-Section',
        imageSrc: '/anatomy/skin.jpg',
        imageAlt: 'Cross-section diagram of human skin showing its layers, glands, and follicles',
        hotspots: [
          { id: 'epidermis', label: 'Epidermis', xPct: 42, yPct: 33, info: 'The thin, outermost layer of skin -- a waterproof barrier that is constantly renewing itself.', deepDive: "The epidermis has no blood vessels of its own -- it survives on nutrients diffusing up from the dermis below. Its outermost cells are already dead by the time you see them, and the entire layer replaces itself roughly every 4 weeks." },
          { id: 'dermis', label: 'Dermis', xPct: 32, yPct: 51, info: 'The thicker layer beneath the epidermis, containing blood vessels, nerves, follicles, and glands.', deepDive: 'Almost everything that makes skin actually function lives in the dermis -- blood vessels for temperature control, nerve endings for touch and pain, hair follicles, and sweat and oil glands are all embedded in this one layer.' },
          { id: 'fatty-tissue', label: 'Fatty Tissue (Hypodermis)', xPct: 32, yPct: 69, info: 'The deepest layer, made of fat that cushions the body and stores energy.', deepDive: 'This layer acts as both insulation (slowing heat loss from the body) and a shock absorber -- its thickness varies a lot from person to person and body region, which is exactly why some areas of skin feel much softer than others.' },
          { id: 'melanocytes', label: 'Melanocytes', xPct: 78, yPct: 38, info: 'Cells in the epidermis that produce melanin, the pigment responsible for skin colour.', deepDive: 'Every human has roughly the same NUMBER of melanocytes regardless of skin colour -- differences in skin tone come from how much melanin those cells actually produce and how it\'s distributed, not from having more or fewer pigment cells.' },
          { id: 'hair-follicle', label: 'Hair Follicle', xPct: 47, yPct: 64, info: 'A tube-shaped pocket in the dermis from which a hair grows.', deepDive: 'Each follicle has its own tiny attached muscle (arrector pili) that can pull the hair upright -- it\'s the same reflex responsible for goosebumps, originally useful for trapping warm air near the skin in animals with thicker fur.' },
          { id: 'oil-gland', label: 'Oil Gland (Sebaceous Gland)', xPct: 55, yPct: 58, info: 'Produces an oily substance (sebum) that keeps skin and hair waterproof and lubricated.', deepDive: 'Sebaceous glands are usually attached directly to a hair follicle, releasing oil along the hair shaft to the skin surface -- overactive sebaceous glands, especially during adolescence, are the main cause of acne.' },
          { id: 'sweat-gland', label: 'Sweat Gland', xPct: 82, yPct: 62, info: 'A coiled gland that produces sweat to cool the body down.', deepDive: 'The human body has roughly 2-4 million sweat glands, and evaporating sweat is one of the body\'s most effective cooling mechanisms -- it\'s also a genuine excretory organ, removing small amounts of urea and salts along with the water.' },
          { id: 'blood-vessels', label: 'Blood Vessels', xPct: 38, yPct: 67, info: 'Networks of vessels in the dermis that regulate body temperature and nourish the skin.', deepDive: 'These vessels widen (dilate) near the skin surface to release excess body heat when you\'re warm, and narrow (constrict) to conserve heat when you\'re cold -- visible as flushed or pale skin depending on how much blood is flowing near the surface.' },
        ],
      },
    ],
    credit: { source: 'Wikimedia Commons', author: 'Don Bliss, National Cancer Institute (NCI Visuals Online)', license: 'Public Domain (US Gov work)', url: 'https://commons.wikimedia.org/wiki/File:Anatomy_The_Skin_-_NCI_Visuals_Online.jpg' },
  },
];
