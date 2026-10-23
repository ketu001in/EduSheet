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
  // Only set when this level's image comes from a different source than
  // the model's main `credit` (e.g. the Nose's zoomed smell-receptor view).
  credit?: AnatomyCredit;
}

// The "whole system" story that sits below the per-part hotspots -- the
// hotspots explain WHAT each part is; this explains how they work together,
// what goes wrong, and how to look after it.
export interface AnatomyGuide {
  // Ordered steps, e.g. the path sound takes from pinna to brain.
  howItWorks: string[];
  didYouKnow: string[];
  conditions: { name: string; info: string }[];
  keepHealthy: string[];
  // One line on what board exams most often ask about this system.
  examTip: string;
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
  // Brain (Surface / Cross-Section / Deep Structures) and Nose (Inside the
  // Nose / Smell Receptors) have more than one level -- the rest are a
  // single view.
  levels: AnatomyLevel[];
  credit: AnatomyCredit;
  guide?: AnatomyGuide;
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
    guide: {
      howItWorks: [
        'Oxygen-poor blood from the body returns through the superior and inferior vena cava into the right atrium.',
        'The right atrium contracts, pushing blood through the tricuspid valve into the right ventricle.',
        'The right ventricle pumps it through the pulmonary artery to the lungs, where it picks up oxygen and gives off carbon dioxide.',
        'Oxygen-rich blood returns from the lungs through the pulmonary veins into the left atrium.',
        'The left atrium pushes it through the bicuspid (mitral) valve into the left ventricle.',
        'The thick-walled left ventricle contracts powerfully, sending blood through the aortic valve into the aorta and out to the whole body.',
        'The "lub-dub" of a heartbeat is the sound of these valves snapping shut -- "lub" as the tricuspid and mitral valves close, "dub" as the aortic and pulmonary valves close.',
      ],
      didYouKnow: [
        'Your heart beats about 100,000 times a day and over 2.5 billion times in an average lifetime.',
        'The heart has its own built-in pacemaker, the SA node, so it keeps beating even without signals from the brain.',
        'Blood passes through the heart twice on every full trip round the body -- this is called double circulation.',
        'An adult heart is roughly the size of your two fists clasped together and weighs about 250-350 g.',
      ],
      conditions: [
        { name: 'Coronary artery disease', info: 'Fatty deposits narrow the arteries supplying the heart muscle itself, which can lead to chest pain or a heart attack.' },
        { name: 'Heart attack (myocardial infarction)', info: 'Part of the heart muscle is starved of oxygen when its blood supply is blocked.' },
        { name: 'High blood pressure (hypertension)', info: 'The heart must pump against higher resistance, which strains it over time.' },
        { name: 'Valve disease', info: 'A valve that is too narrow or leaky forces the heart to work harder.' },
        { name: 'Arrhythmia', info: 'The heart beats too fast, too slow, or irregularly because of a problem with its electrical signals.' },
      ],
      keepHealthy: [
        'Get at least 60 minutes of active play or exercise every day.',
        'Eat plenty of fruit, vegetables, and whole grains, and limit fried and very salty foods.',
        'Never start smoking -- it damages blood vessels and is a leading cause of heart disease.',
        'Sleep well and find healthy ways to manage stress.',
      ],
      examTip: 'Be ready to trace double circulation, explain why the left ventricle wall is thicker, and name which side carries oxygenated vs deoxygenated blood. Remember: arteries carry blood away from the heart; the pulmonary artery is the one artery carrying deoxygenated blood.',
    },
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
    guide: {
      howItWorks: [
        'Ingestion: food is taken into the mouth, chewed by teeth, and mixed with saliva, whose amylase begins breaking starch into sugar.',
        'Swallowing: the tongue pushes the food ball (bolus) into the oesophagus, and peristalsis carries it down to the stomach.',
        'In the stomach, hydrochloric acid kills germs and activates pepsin, which starts digesting proteins; the food becomes a thick liquid called chyme.',
        'In the small intestine, bile from the liver emulsifies fats, and pancreatic and intestinal enzymes finish digesting carbohydrates, proteins, and fats.',
        'Absorption: digested nutrients pass through the villi of the small intestine into the blood and lymph.',
        'The large intestine absorbs most of the remaining water, and undigested waste is stored in the rectum and removed through the anus (egestion).',
      ],
      didYouKnow: [
        'The whole digestive tract (alimentary canal) is about 8-9 metres long in an adult.',
        'Your stomach lining replaces itself every few days so the acid doesn\'t digest it.',
        'A meal usually takes 24-72 hours to pass all the way through the digestive system.',
        'The large intestine is home to trillions of bacteria, which help digest fibre and make some vitamins.',
      ],
      conditions: [
        { name: 'Acidity and acid reflux', info: 'Stomach acid rises into the oesophagus, causing a burning feeling ("heartburn").' },
        { name: 'Constipation', info: 'Waste moves too slowly and becomes hard, often from too little fibre or water.' },
        { name: 'Diarrhoea', info: 'Waste moves too quickly for water to be absorbed -- often caused by infection; the main danger is dehydration.' },
        { name: 'Peptic ulcer', info: 'A sore in the stomach or duodenum lining, commonly linked to the bacterium H. pylori.' },
        { name: 'Jaundice', info: 'Yellowing of the skin and eyes when the liver cannot process bilirubin properly, for example in hepatitis.' },
      ],
      keepHealthy: [
        'Eat fibre-rich foods like fruit, vegetables, dal, and whole grains to keep food moving smoothly.',
        'Drink plenty of clean water and wash hands before eating to prevent infections.',
        'Chew food thoroughly and eat at regular times.',
        'Limit junk food and sugary drinks, which are hard on the stomach and teeth.',
      ],
      examTip: 'Learn which enzyme digests which food and where: salivary amylase (starch, mouth), pepsin (proteins, stomach), lipase (fats, small intestine), and the role of bile (emulsification, not digestion). Villi and their large surface area are a favourite diagram question.',
    },
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
    guide: {
      howItWorks: [
        'Air enters through the nose, where hairs and mucus filter it and it is warmed and moistened.',
        'It passes through the pharynx and larynx (voice box) into the trachea, held open by C-shaped cartilage rings.',
        'The trachea splits into two bronchi, which branch again and again into tiny bronchioles inside each lung.',
        'The bronchioles end in clusters of alveoli -- thin-walled air sacs surrounded by blood capillaries.',
        'Oxygen diffuses from the alveoli into the blood, and carbon dioxide diffuses from the blood into the alveoli.',
        'Breathing in: the diaphragm contracts and flattens and the ribs move up and out, so the chest volume increases and air rushes in. Breathing out reverses this.',
      ],
      didYouKnow: [
        'You breathe about 12-20 times a minute at rest -- more than 20,000 breaths a day.',
        'Your left lung is slightly smaller than your right, which leaves room for the heart.',
        'The air you breathe out still contains about 16% oxygen, which is why rescue breathing works.',
        'Hiccups are sudden involuntary contractions of the diaphragm.',
      ],
      conditions: [
        { name: 'Asthma', info: 'The airways swell and tighten in response to triggers like dust or pollen, making breathing difficult.' },
        { name: 'Pneumonia', info: 'An infection fills the alveoli with fluid, reducing gas exchange.' },
        { name: 'Tuberculosis (TB)', info: 'A bacterial infection that mainly affects the lungs; it is curable with a full course of medicine.' },
        { name: 'Bronchitis', info: 'Inflammation of the bronchi, causing a persistent cough with mucus.' },
        { name: 'Lung damage from smoking', info: 'Smoke destroys cilia and alveoli and is the main cause of lung cancer.' },
      ],
      keepHealthy: [
        'Never smoke, and avoid second-hand smoke.',
        'Exercise regularly to strengthen your breathing muscles.',
        'Cover coughs and sneezes, and wear a mask on high-pollution days.',
        'Breathe through your nose when you can -- it filters and conditions the air.',
      ],
      examTip: 'Know the pathway nose → pharynx → larynx → trachea → bronchi → bronchioles → alveoli, and why alveoli are suited to gas exchange (thin walls, large surface area, rich blood supply). Also distinguish breathing (a physical process) from respiration (a chemical process that releases energy in cells).',
    },
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
    guide: {
      howItWorks: [
        'A receptor (in the skin, eye, ear, etc.) detects a stimulus such as heat, light, or touch.',
        'The dendrites of a sensory neuron receive the signal and pass it to the cell body.',
        'An electrical impulse travels along the axon, jumping quickly between the gaps in the myelin sheath.',
        'At the axon terminal, chemicals called neurotransmitters cross the synapse and start a new impulse in the next neuron.',
        'The brain or spinal cord processes the information and sends a response through motor neurons.',
        'The effector -- a muscle or gland -- carries out the response, such as pulling your hand away.',
      ],
      didYouKnow: [
        'Your brain contains around 86 billion neurons.',
        'Nerve impulses can travel at over 100 metres per second along myelinated axons.',
        'In a reflex action, such as jerking your hand from a hot object, the spinal cord triggers the response before the brain is even aware of the pain.',
        'Neurons communicate both electrically (along the axon) and chemically (across the synapse).',
      ],
      conditions: [
        { name: 'Paralysis', info: 'Damage to the spinal cord or nerves stops signals from reaching muscles.' },
        { name: 'Epilepsy', info: 'Bursts of abnormal electrical activity in the brain cause seizures.' },
        { name: 'Multiple sclerosis', info: 'The immune system damages myelin sheaths, slowing or blocking nerve signals.' },
        { name: 'Peripheral neuropathy', info: 'Damaged nerves in the hands and feet, often linked to diabetes, cause numbness or tingling.' },
      ],
      keepHealthy: [
        'Wear a helmet when cycling and a seatbelt in vehicles to protect your brain and spinal cord.',
        'Get 8-10 hours of sleep -- it\'s when the brain strengthens memories.',
        'Eat a balanced diet that includes B vitamins, which nerves need to function.',
        'Stay physically and mentally active by learning new skills and solving puzzles.',
      ],
      examTip: 'Draw and label a neuron (dendrite, cell body, axon, myelin sheath, axon terminal), and be able to explain a reflex arc in order: receptor → sensory neuron → spinal cord (relay neuron) → motor neuron → effector.',
    },
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
    guide: {
      howItWorks: [
        'The cell wall, made of cellulose, gives the cell a fixed shape and stops it from bursting when it takes in water.',
        'The cell membrane controls which substances enter and leave the cell -- it is selectively permeable.',
        'The nucleus holds the DNA and directs everything the cell does, including when it divides.',
        'Chloroplasts capture sunlight and use it to make glucose from carbon dioxide and water (photosynthesis).',
        'Mitochondria break down glucose to release energy (respiration) for the cell to use.',
        'The large central vacuole stores water and dissolved substances and pushes outward to keep the cell firm (turgid).',
      ],
      didYouKnow: [
        'Plant cells have both chloroplasts AND mitochondria -- they make food by photosynthesis and then use it in respiration.',
        'A wilting plant is one whose vacuoles have lost water, so its cells are no longer firm.',
        'Chloroplasts and mitochondria contain their own small loops of DNA, a clue that they were once free-living bacteria.',
        'Robert Hooke first named "cells" in 1665 after looking at thin slices of cork under a microscope.',
      ],
      conditions: [
        { name: 'Plasmolysis', info: 'In a very salty solution, water leaves the vacuole and the membrane pulls away from the cell wall.' },
        { name: 'Chlorosis', info: 'Leaves turn yellow when chloroplasts can\'t make enough chlorophyll, often due to a lack of nitrogen, iron, or magnesium.' },
        { name: 'Wilting', info: 'Cells lose turgor when the plant loses more water than it can absorb.' },
      ],
      keepHealthy: [
        'Plants need sunlight for their chloroplasts to photosynthesise.',
        'Regular watering keeps vacuoles full and cells turgid.',
        'Soil minerals like nitrogen and magnesium are needed to make chlorophyll.',
        'Over-salty soil or too much fertiliser can draw water out of root cells.',
      ],
      examTip: 'Classic question: list three differences between plant and animal cells -- plant cells have a cell wall, chloroplasts, and a large central vacuole; animal cells lack a cell wall and chloroplasts, have only small vacuoles, and have centrioles.',
    },
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
    guide: {
      howItWorks: [
        'Signals from your senses arrive through cranial nerves and the spinal cord.',
        'The thalamus acts as a relay station, sending each type of sensory information to the right part of the cortex.',
        'The four lobes of the cerebrum process it: occipital (vision), temporal (hearing and memory), parietal (touch and space), and frontal (thinking, planning, and movement).',
        'The corpus callosum links the left and right hemispheres so they can share information.',
        'The cerebellum fine-tunes movement and balance so actions are smooth and coordinated.',
        'The brainstem (midbrain, pons, medulla) controls automatic life-support functions such as breathing, heart rate, and swallowing.',
      ],
      didYouKnow: [
        'The brain is about 2% of your body weight but uses around 20% of your energy.',
        'The left hemisphere controls the right side of the body, and the right hemisphere controls the left.',
        'The brain itself has no pain receptors -- which is why some brain surgery can be done while the patient is awake.',
        'The brain is protected by the skull, three membranes (meninges), and a cushion of cerebrospinal fluid.',
      ],
      conditions: [
        { name: 'Concussion', info: 'A blow to the head jolts the brain, causing temporary confusion, headache, or memory problems.' },
        { name: 'Stroke', info: 'A blood clot or burst vessel cuts off blood supply to part of the brain.' },
        { name: 'Parkinson\'s disease', info: 'Dopamine-producing cells in the substantia nigra die, causing tremors and stiff movement.' },
        { name: 'Migraine', info: 'Severe, recurring headaches, often with sensitivity to light and sound.' },
      ],
      keepHealthy: [
        'Always wear a helmet for cycling, skating, and contact sports.',
        'Sleep well -- the brain clears waste and stores memories during sleep.',
        'Exercise regularly; it increases blood flow and oxygen to the brain.',
        'Keep learning: reading, music, and puzzles build new connections between neurons.',
      ],
      examTip: 'Match each part to its function: cerebrum (thinking, voluntary actions), cerebellum (balance and posture), medulla (involuntary actions like heartbeat and breathing). The forebrain / midbrain / hindbrain classification is frequently asked.',
    },
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
    guide: {
      howItWorks: [
        'Light enters through the cornea, which bends it and does most of the focusing.',
        'The iris adjusts the size of the pupil to control how much light gets in.',
        'The lens fine-tunes the focus, changing shape (accommodation) for near and distant objects.',
        'Light passes through the clear, jelly-like vitreous humour to the retina.',
        'Rods and cones in the retina convert the light into electrical signals; the image formed is real and upside down.',
        'The optic nerve carries the signals to the brain, which interprets the image the right way up.',
      ],
      didYouKnow: [
        'The image on your retina is upside down -- your brain makes sense of it.',
        'You blink about 15-20 times a minute, which spreads tears to keep the cornea clean and moist.',
        'Your eye can distinguish around a million different colours using just three types of cone.',
        'The cornea has no blood vessels; it gets most of its oxygen directly from the air.',
      ],
      conditions: [
        { name: 'Myopia (short-sightedness)', info: 'Distant objects look blurry because the image forms in front of the retina; corrected with a concave lens.' },
        { name: 'Hypermetropia (long-sightedness)', info: 'Near objects look blurry because the image forms behind the retina; corrected with a convex lens.' },
        { name: 'Cataract', info: 'The lens becomes cloudy, usually with age; treated by surgically replacing the lens.' },
        { name: 'Colour blindness', info: 'One type of cone is missing or faulty, making some colours hard to tell apart.' },
        { name: 'Presbyopia', info: 'The lens stiffens with age, making it harder to focus on near objects.' },
      ],
      keepHealthy: [
        'Follow the 20-20-20 rule for screens: every 20 minutes, look at something 20 feet away for 20 seconds.',
        'Read in good light and keep books and screens at a comfortable distance.',
        'Eat foods rich in vitamin A, such as carrots, spinach, and mangoes -- a lack of it causes night blindness.',
        'Never look directly at the Sun, and get your eyes tested regularly.',
      ],
      examTip: 'Be able to draw ray diagrams for myopia and hypermetropia and their corrections. Know the power of accommodation, the near point (25 cm) and far point (infinity) of a normal eye, and the role of the ciliary muscles.',
    },
  },
  {
    id: 'ear',
    name: 'The Ear',
    branch: 'human-biology',
    gradeBand: 'senior',
    board: 'both',
    chapterTags: ['Sound', 'Control and Coordination', 'Human Ear', 'Neural Control and Coordination'],
    intro: 'A cutaway of the human ear showing all three of its regions -- the outer ear that collects sound, the air-filled middle ear that amplifies it, and the fluid-filled inner ear that turns it into nerve signals (and keeps you balanced).',
    levels: [
      {
        id: 'cross-section',
        label: 'Cross-Section',
        imageSrc: '/anatomy/ear.svg',
        imageAlt: 'Cross-section diagram of the human ear showing the outer, middle, and inner ear',
        hotspots: [
          { id: 'pinna', label: 'Pinna (Auricle)', xPct: 9, yPct: 30, info: 'The visible, curved flap of skin and cartilage that collects sound waves and funnels them into the ear canal.', deepDive: 'The pinna is made of flexible elastic cartilage, not bone -- which is why you can fold your ear without breaking it. Its ridges and hollows slightly change sounds depending on whether they come from above, below, in front, or behind, and your brain uses those tiny changes to work out where a sound is coming from.' },
          { id: 'earlobe', label: 'Earlobe (Lobule)', xPct: 11, yPct: 88, info: 'The soft, fleshy lower part of the pinna -- the only part of the outer ear with no cartilage inside.', deepDive: 'The earlobe is just skin, fat, and blood vessels, which is why it\'s the usual place for piercings. It has no known role in hearing. Whether earlobes are "free" or "attached" is often used in school as a simple example of an inherited trait, though in reality it\'s controlled by many genes, not just one.' },
          { id: 'ear-canal', label: 'Ear Canal (External Auditory Canal)', xPct: 37, yPct: 56, info: 'A tube about 2.5 cm long that carries sound from the pinna to the eardrum.', deepDive: 'The outer part of the canal is lined with fine hairs and glands that make earwax (cerumen). Earwax traps dust and insects, keeps the skin from drying out, and is mildly antibacterial. The canal cleans itself -- skin slowly migrates outward, carrying wax with it -- which is why pushing cotton buds inside usually does more harm than good.' },
          { id: 'eardrum', label: 'Eardrum (Tympanic Membrane)', xPct: 58, yPct: 60, info: 'A thin, tightly stretched membrane that vibrates when sound waves hit it -- the boundary between the outer and middle ear.', deepDive: 'The eardrum is only about 0.1 mm thick, yet it can respond to vibrations smaller than the width of an atom. It vibrates at exactly the same frequency as the incoming sound: a high-pitched sound makes it vibrate faster, a louder sound makes it move further. A small tear usually heals on its own within a few weeks.' },
          { id: 'malleus', label: 'Malleus (Hammer)', xPct: 53.5, yPct: 48.5, info: 'The first of the three tiny middle-ear bones -- its handle is attached directly to the eardrum.', deepDive: 'Because the malleus is fixed to the inner surface of the eardrum, every vibration of the eardrum rocks the malleus too. Together, the three ossicles (malleus, incus, stapes) act as a lever system that passes the vibration inward while making it stronger.' },
          { id: 'incus', label: 'Incus (Anvil)', xPct: 58, yPct: 45, info: 'The middle ossicle, linking the malleus to the stapes and passing vibrations between them.', deepDive: 'The incus is connected to its neighbours by tiny synovial joints -- real movable joints, just like your knee, only a few millimetres across. This lets the chain of bones move smoothly as one unit when sound arrives.' },
          { id: 'stapes', label: 'Stapes (Stirrup)', xPct: 65, yPct: 52, info: 'The smallest bone in the human body -- its flat footplate pushes on the oval window of the inner ear.', deepDive: 'The stapes is about 3 mm long, roughly the size of a grain of rice. Its footplate is much smaller than the eardrum, so the same force is concentrated onto a much smaller area -- together with the ossicles\' lever action, this boosts the pressure about 20 times. That boost is needed because sound has to pass from air into the fluid of the inner ear, and fluid is much harder to move than air.' },
          { id: 'middle-ear', label: 'Middle Ear Cavity', xPct: 62.5, yPct: 65, info: 'An air-filled chamber behind the eardrum that houses the three ossicles.', deepDive: 'The middle ear must stay at the same air pressure as the outside world for the eardrum to vibrate freely. When it fills with fluid during a cold or infection (otitis media, very common in young children), the eardrum can\'t move properly -- which is why hearing goes muffled and the ear feels blocked.' },
          { id: 'eustachian-tube', label: 'Eustachian Tube', xPct: 75, yPct: 73, info: 'A narrow tube connecting the middle ear to the back of the throat, keeping air pressure equal on both sides of the eardrum.', deepDive: 'The tube is normally closed and opens briefly each time you swallow or yawn. That\'s exactly why your ears "pop" in an aeroplane or a fast lift -- swallowing lets air rush in or out of the middle ear to match the new outside pressure. In young children the tube is shorter and more horizontal, so throat germs reach the middle ear more easily.' },
          { id: 'semicircular-canals', label: 'Semicircular Canals', xPct: 69, yPct: 33, info: 'Three fluid-filled loops, set at right angles to each other, that detect rotation of the head -- the organ of balance.', deepDive: 'Each canal lies in a different plane (roughly nodding, shaking "no", and tilting to the side). When your head turns, the fluid inside (endolymph) lags behind and bends tiny hair cells, telling the brain which way you\'re rotating. After you spin and stop suddenly, the fluid keeps swirling for a moment -- that\'s the dizzy feeling.' },
          { id: 'cochlea', label: 'Cochlea', xPct: 76.5, yPct: 57, info: 'A snail-shaped, fluid-filled tube where vibrations are converted into electrical nerve signals.', deepDive: 'Inside the cochlea runs the organ of Corti, lined with about 15,000 hair cells. Different positions along the coil respond to different pitches -- high frequencies near the base, low frequencies near the tip. Hair cells don\'t grow back once damaged, which is why loud-noise hearing loss is permanent.' },
          { id: 'auditory-nerve', label: 'Auditory (Vestibulocochlear) Nerve', xPct: 88, yPct: 48, info: 'Carries signals for both hearing (from the cochlea) and balance (from the semicircular canals) to the brain.', deepDive: 'This is the eighth cranial nerve. Its signals travel to the temporal lobe of the brain, where they are finally interpreted as speech, music, or noise. You don\'t "hear" with your ears alone -- the ear converts sound into signals, but the brain is what makes sense of them.' },
        ],
      },
    ],
    credit: { source: 'Wikimedia Commons', author: 'Chittka L, Brockmann A; derivative by M. Komorniczak', license: 'CC BY 2.5', url: 'https://commons.wikimedia.org/wiki/File:Anatomy_of_the_Human_Ear_blank.svg' },
    guide: {
      howItWorks: [
        'Sound waves are collected by the pinna and funnelled down the ear canal.',
        'The waves hit the eardrum, making it vibrate at the same frequency as the sound.',
        'The malleus, incus, and stapes pass these vibrations across the middle ear, amplifying them about 20 times.',
        'The stapes pushes on the oval window, setting the fluid inside the cochlea moving.',
        'The moving fluid bends hair cells in the cochlea, which turn the movement into electrical impulses.',
        'The auditory nerve carries these impulses to the brain, which interprets them as sound.',
      ],
      didYouKnow: [
        'The three ossicles are the smallest bones in your body, and they are already full adult size at birth.',
        'Humans can hear frequencies from roughly 20 Hz to 20,000 Hz; the upper limit drops steadily with age.',
        'Your ears never stop working -- even while you sleep, they keep hearing; your brain simply ignores most sounds.',
        'The semicircular canals have nothing to do with hearing at all -- they are part of your balance system, packed into the same space.',
      ],
      conditions: [
        { name: 'Ear infection (otitis media)', info: 'Fluid and germs build up in the middle ear, causing pain and muffled hearing. Very common in children after colds.' },
        { name: 'Noise-induced hearing loss', info: 'Loud sounds (over about 85 dB for long periods) permanently damage cochlear hair cells.' },
        { name: 'Tinnitus', info: 'A ringing, buzzing, or hissing sound with no outside source, often after noise exposure.' },
        { name: 'Earwax blockage', info: 'Wax pushed deep (often by cotton buds) can plug the canal and dull hearing.' },
        { name: 'Vertigo', info: 'A spinning sensation caused by problems in the inner-ear balance organs.' },
      ],
      keepHealthy: [
        'Keep headphone volume below about 60% and take regular breaks (the "60/60 rule": 60% volume, 60 minutes at a time).',
        'Don\'t push cotton buds or other objects into the ear canal -- wipe only the outer ear.',
        'Use ear protection around very loud noise such as firecrackers, concerts, or machinery.',
        'Dry your ears gently after swimming, and see a doctor for ear pain, discharge, or sudden hearing loss.',
      ],
      examTip: 'Learn the path of sound in order: pinna → ear canal → eardrum → malleus → incus → stapes → oval window → cochlea → auditory nerve → brain. Also remember the Eustachian tube equalises pressure and the semicircular canals control balance, not hearing.',
    },
  },
  {
    id: 'nose',
    name: 'The Nose',
    branch: 'human-biology',
    gradeBand: 'senior',
    board: 'both',
    chapterTags: ['Control and Coordination', 'Sense Organs', 'Breathing and Exchange of Gases', 'Neural Control and Coordination'],
    intro: 'The nose does two jobs at once: it cleans, warms, and moistens every breath you take, and it holds the smell receptors that detect thousands of different odours. Explore the full cross-section first, then zoom in to see how a smell becomes a nerve signal.',
    levels: [
      {
        id: 'cross-section',
        label: 'Inside the Nose',
        imageSrc: '/anatomy/nose-cross-section.jpg',
        imageAlt: 'Side cross-section of the human head showing the nasal cavity and olfactory nerves',
        hotspots: [
          { id: 'nostril', label: 'Nostril (Naris)', xPct: 12, yPct: 52.5, info: 'One of the two openings through which air enters the nose.', deepDive: 'Just inside each nostril is the vestibule, lined with coarse hairs that catch large particles like dust and insects. Interestingly, you usually breathe more through one nostril than the other, and the "dominant" side switches every few hours -- the nasal cycle.' },
          { id: 'external-nose', label: 'External Nose', xPct: 9, yPct: 43, info: 'The outer nose, shaped by bone at the top (the bridge) and flexible cartilage lower down.', deepDive: 'Only the upper third of the nose is bone -- the rest is cartilage, which is why the tip is soft and bendable. The nasal septum, a wall of cartilage and bone, runs down the middle and divides the inside into left and right halves.' },
          { id: 'nasal-cavity', label: 'Nasal Cavity', xPct: 36, yPct: 45, info: 'The air space behind the nose, lined with moist mucous membrane, that cleans, warms, and humidifies incoming air.', deepDive: 'The mucous membrane makes about a litre of mucus a day. Tiny hair-like cilia beat continually to sweep this mucus, along with the dust and germs it has trapped, back towards the throat to be swallowed. By the time air reaches your lungs, it is close to body temperature and almost fully saturated with moisture.' },
          { id: 'olfactory-nerves', label: 'Olfactory Nerves', xPct: 45.5, yPct: 35, info: 'Fine nerve fibres spreading through the roof of the nasal cavity, carrying smell signals upward.', deepDive: 'These fibres start in the olfactory epithelium -- a patch only about the size of a postage stamp on each side of the nose. The olfactory nerve is the first cranial nerve, and it\'s unusual: it\'s one of the few places where nerve cells are regularly replaced throughout your life, roughly every one to two months.' },
          { id: 'olfactory-bulb', label: 'Olfactory Bulb', xPct: 41, yPct: 22, info: 'A small extension of the brain sitting just above the nose, where smell signals are first sorted.', deepDive: 'The olfactory bulb is part of the forebrain itself. Smell is the only sense whose signals reach the brain\'s emotion and memory centres (the limbic system) directly -- which is why a particular smell can instantly bring back a vivid memory.' },
          { id: 'cribriform-plate', label: 'Cribriform Plate', xPct: 54, yPct: 26, info: 'A thin, sieve-like shelf of bone separating the nasal cavity from the brain.', deepDive: '"Cribriform" means "sieve-shaped" -- the plate is full of tiny holes that the olfactory nerve fibres pass through on their way to the bulb. Because the bone is so thin, a hard blow to the face can fracture it, and this can damage the sense of smell.' },
          { id: 'olfactory-tract', label: 'Olfactory Tract', xPct: 66, yPct: 25.5, info: 'A bundle of nerve fibres carrying sorted smell information from the bulb deeper into the brain.', deepDive: 'The tract delivers signals to the olfactory cortex in the temporal lobe. Unlike every other sense, smell information doesn\'t have to pass through the thalamus (the brain\'s relay station) first -- it takes a much more direct route.' },
          { id: 'sphenoid-sinus', label: 'Sinus (Sphenoid Sinus)', xPct: 68, yPct: 34, info: 'One of several air-filled spaces in the skull bones around the nose, connected to the nasal cavity.', deepDive: 'The sinuses make the skull lighter, help add resonance to your voice, and produce mucus that drains into the nose. When their small drainage openings get blocked during a cold or allergy, mucus builds up and causes the pressure and headache of sinusitis.' },
          { id: 'hard-palate', label: 'Hard Palate', xPct: 41, yPct: 56, info: 'The bony roof of the mouth, which is also the floor of the nasal cavity.', deepDive: 'Because the palate separates the nose from the mouth, you can breathe and chew at the same time. It also explains why flavour depends so much on smell: when you chew, odour molecules travel up from the back of the mouth into the nasal cavity. Pinch your nose while eating and most of the "taste" disappears.' },
        ],
      },
      {
        id: 'smell-receptors',
        label: 'Smell Receptors (Zoomed)',
        imageSrc: '/anatomy/nose-smell-receptors.jpg',
        imageAlt: 'Diagram of the olfactory system with a magnified view of smell receptor neurons and the olfactory bulb',
        credit: { source: 'Wikimedia Commons', author: 'Andrewmeyerson', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Olfactory_System_Large_Unlabeled.jpg' },
        hotspots: [
          { id: 'nostril-zoom', label: 'Nostril', xPct: 4, yPct: 51.5, info: 'Air carrying odour molecules enters here.', deepDive: 'Sniffing matters: a normal breath sends only a small fraction of the air up to the smell receptors at the top of the nose. A deliberate sniff creates a faster swirl of air that pushes more odour molecules up to them -- which is why we instinctively sniff when trying to identify a smell.' },
          { id: 'nasal-conchae', label: 'Nasal Conchae (Turbinates)', xPct: 33, yPct: 44, info: 'Curved, scroll-shaped shelves of bone on the side walls of the nasal cavity that swirl the incoming air.', deepDive: 'There are three on each side -- superior, middle, and inferior. They greatly increase the surface area of the nose\'s lining and make the air tumble, so more of it touches the warm, moist mucus. This is how the nose filters and conditions air so effectively in such a short distance.' },
          { id: 'olfactory-bulb-zoom', label: 'Olfactory Bulb', xPct: 31, yPct: 25, info: 'Sits just above the roof of the nasal cavity -- the magnified panel on the right shows what\'s happening inside it.', deepDive: 'Each olfactory bulb receives input from millions of receptor neurons but sends out far fewer fibres, so it combines and sharpens the signal before passing it on -- a bit like a mixing desk turning many microphones into one clear track.' },
          { id: 'receptor-neurons', label: 'Olfactory Receptor Neurons', xPct: 57, yPct: 74, info: 'Specialised nerve cells that detect odour molecules. Each one carries just one type of smell receptor.', deepDive: 'Humans have around 400 different types of smell receptor, and about 10-20 million receptor neurons in total. Each odour activates a particular combination of receptor types -- like a chord on a piano -- and the brain recognises the pattern. The colours in this diagram show three receptor types sending their signals to separate destinations.' },
          { id: 'cilia', label: 'Cilia in Mucus', xPct: 64, yPct: 82, info: 'Hair-like tips of the receptor neurons that poke into the mucus layer, where odour molecules dissolve and bind.', deepDive: 'An odour molecule must first dissolve in the thin layer of mucus before it can reach a receptor -- which is why a dry nose smells poorly. When the molecule fits its receptor (like a key in a lock), the neuron fires an electrical signal.' },
          { id: 'olfactory-epithelium', label: 'Olfactory Epithelium', xPct: 85, yPct: 71, info: 'The thin layer of tissue at the roof of the nose that holds the receptor neurons and their support cells.', deepDive: 'The epithelium also contains basal stem cells that continually produce new receptor neurons, replacing worn-out ones. This regeneration is why smell often recovers after a bad cold or infection, though it can take weeks to months.' },
          { id: 'cribriform-plate-zoom', label: 'Cribriform Plate', xPct: 83, yPct: 59, info: 'The perforated bone that the receptor neurons\' axons pass through on their way to the bulb.', deepDive: 'In the magnified panel you can see each axon threading upward through the bone. This is the only place where nerve cells exposed to the outside world connect so directly to the brain.' },
          { id: 'glomeruli', label: 'Glomeruli', xPct: 73, yPct: 50, info: 'Small round clusters in the olfactory bulb where axons from the same receptor type all meet.', deepDive: 'Every receptor neuron of the same type, scattered across the epithelium, sends its axon to the same one or two glomeruli. This neatly sorts the incoming information so that each glomerulus represents one kind of receptor -- the circles in the diagram show this colour-matched sorting.' },
          { id: 'mitral-cells', label: 'Mitral Cells', xPct: 62.5, yPct: 42.5, info: 'Neurons in the olfactory bulb that pick up the signal from the glomeruli and send it on towards the brain.', deepDive: 'Mitral cells are named for their shape, which reminded early anatomists of a bishop\'s mitre (hat). Their long axons together form the olfactory tract.' },
          { id: 'olfactory-tract-zoom', label: 'Olfactory Tract', xPct: 92, yPct: 40, info: 'Carries processed smell signals from the bulb onward to the brain\'s smell and memory centres.', deepDive: 'From here, signals spread to the olfactory cortex, the amygdala (emotion), and close to the hippocampus (memory) -- the anatomy behind why smells feel so emotional and memorable.' },
        ],
      },
    ],
    credit: { source: 'Wikimedia Commons', author: 'Patrick J. Lynch, medical illustrator', license: 'CC BY 2.5', url: 'https://commons.wikimedia.org/wiki/File:Head_olfactory_nerve.jpg' },
    guide: {
      howItWorks: [
        'Air enters through the nostrils, where hairs trap larger dust particles.',
        'The turbinates swirl the air across the moist, warm mucous lining, which filters, warms, and humidifies it.',
        'A small amount of air reaches the olfactory epithelium in the roof of the nasal cavity.',
        'Odour molecules dissolve in the mucus and bind to receptors on the cilia of olfactory receptor neurons.',
        'The neurons fire impulses that pass through the cribriform plate to the olfactory bulb, where they are sorted in the glomeruli.',
        'The olfactory tract carries the signals to the brain, which identifies the smell and links it to emotions and memories.',
      ],
      didYouKnow: [
        'Humans can distinguish thousands of different smells -- some research suggests far more.',
        'Most of what we call "taste" is actually smell: the tongue detects only sweet, sour, salty, bitter, and umami.',
        'Your nose produces around a litre of mucus every day, most of which you swallow without noticing.',
        'Dogs have up to 300 million smell receptor neurons, compared with roughly 10-20 million in humans.',
      ],
      conditions: [
        { name: 'Common cold (rhinitis)', info: 'Swollen, mucus-filled linings block air from reaching the smell receptors, so food tastes bland.' },
        { name: 'Allergic rhinitis (hay fever)', info: 'The lining overreacts to pollen or dust, causing sneezing, itching, and a runny nose.' },
        { name: 'Sinusitis', info: 'Blocked, inflamed sinuses fill with mucus, causing facial pressure and headache.' },
        { name: 'Anosmia', info: 'Loss of the sense of smell, which can follow infections (including COVID-19), head injury, or nasal polyps.' },
        { name: 'Deviated septum', info: 'A septum that is off-centre can make one side of the nose feel blocked.' },
      ],
      keepHealthy: [
        'Breathe through your nose when resting -- it filters and conditions air much better than mouth breathing.',
        'Blow your nose gently, one nostril at a time, rather than forcefully.',
        'Don\'t pick your nose or push objects inside; the lining is delicate and bleeds easily.',
        'Avoid smoke and strong chemical fumes, which damage the cilia and smell receptors.',
      ],
      examTip: 'Remember the nose is both a respiratory organ (filtering, warming, moistening air) and a sense organ (olfactory receptors are chemoreceptors). Smell signals travel via the olfactory nerve to the olfactory lobe of the forebrain.',
    },
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
    guide: {
      howItWorks: [
        'Support: the skeleton forms a rigid frame that gives the body its shape and holds it upright.',
        'Protection: the skull protects the brain, the ribcage protects the heart and lungs, and the vertebrae protect the spinal cord.',
        'Movement: muscles attach to bones through tendons and pull on them, and bones meet at joints that let them move.',
        'Joints come in several types -- hinge (elbow, knee), ball-and-socket (shoulder, hip), pivot (neck), and fixed (skull).',
        'Ligaments hold bones together at joints, and cartilage cushions their ends to reduce friction.',
        'Red bone marrow inside many bones makes red blood cells, white blood cells, and platelets, and bones also store calcium.',
      ],
      didYouKnow: [
        'Babies are born with about 270-300 bones, many of which fuse to form the adult\'s 206.',
        'The femur (thigh bone) is the longest and strongest bone in the body.',
        'Over half of your bones are in your hands and feet.',
        'Bone is living tissue -- it constantly remodels itself and renews roughly every 10 years.',
      ],
      conditions: [
        { name: 'Fracture', info: 'A broken bone, which heals as new bone tissue forms across the break.' },
        { name: 'Osteoporosis', info: 'Bones become weak and brittle as they lose calcium, common in older age.' },
        { name: 'Arthritis', info: 'Inflamed joints become painful and stiff.' },
        { name: 'Rickets', info: 'Soft, bent bones in children caused by a lack of vitamin D or calcium.' },
        { name: 'Scoliosis', info: 'A sideways curve of the spine.' },
      ],
      keepHealthy: [
        'Eat calcium-rich foods like milk, curd, paneer, ragi, and green leafy vegetables.',
        'Get some sunlight every day so your skin can make vitamin D.',
        'Do weight-bearing exercise such as running, skipping, and climbing to strengthen bones.',
        'Sit with good posture and carry school bags on both shoulders.',
      ],
      examTip: 'Know the functions of the skeleton (support, protection, movement, blood cell production, mineral storage) and the types of joints with one example each. Be clear on the difference between tendons (muscle to bone) and ligaments (bone to bone).',
    },
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
    guide: {
      howItWorks: [
        'Protection: the epidermis forms a waterproof barrier that keeps germs out and water in.',
        'Sensation: nerve endings in the dermis detect touch, pressure, pain, heat, and cold.',
        'Temperature control: when you are hot, blood vessels widen and sweat glands release sweat, which cools you as it evaporates; when you are cold, vessels narrow to save heat.',
        'Excretion: sweat removes small amounts of water, salts, and urea from the body.',
        'Vitamin D: sunlight on the skin triggers it to make vitamin D, which is needed for strong bones.',
        'UV protection: melanocytes produce melanin, which absorbs harmful ultraviolet rays.',
      ],
      didYouKnow: [
        'The skin is the largest organ of the body, covering about 2 square metres in an adult.',
        'You shed tens of thousands of dead skin cells every minute.',
        'Fingerprints form before birth and stay the same for life -- even identical twins have different ones.',
        'Skin is thinnest on the eyelids and thickest on the soles of the feet.',
      ],
      conditions: [
        { name: 'Sunburn', info: 'UV rays damage skin cells, causing redness and pain; repeated burns raise skin cancer risk.' },
        { name: 'Acne', info: 'Oil glands become blocked and inflamed, very common during the teenage years.' },
        { name: 'Eczema', info: 'Dry, itchy, inflamed patches of skin, often linked to allergies.' },
        { name: 'Fungal infections (ringworm)', info: 'A fungus causes itchy, ring-shaped rashes, spreading through contact or shared towels.' },
        { name: 'Burns', info: 'Heat or chemicals damage skin layers; deeper burns reach the dermis and need medical care.' },
      ],
      keepHealthy: [
        'Bathe regularly and dry your skin well, especially between the toes.',
        'Use sunscreen and protective clothing in strong sunlight.',
        'Drink enough water and eat fruit and vegetables for healthy skin.',
        'Don\'t share towels or combs, to avoid spreading skin infections.',
      ],
      examTip: 'List the functions of skin (protection, sensation, temperature regulation, excretion, vitamin D synthesis) and explain how sweating and changes in blood flow help regulate body temperature.',
    },
  },
];
