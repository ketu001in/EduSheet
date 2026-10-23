import { ChemApparatus, Model3DConfig } from './types';

// First batch of real, license-verified 3D models -- same sourcing
// discipline as Robotics Lab (see public/models/robotics/MANIFEST.md):
// each model's own Sketchfab license page was checked directly, not
// assumed. See public/models/chem/MANIFEST.md for the download list.
const CC_ATTR = (author: string, url: string): Model3DConfig['credit'] => ({ author: `${author} (Sketchfab)`, license: 'CC Attribution', url });

// The "Studio" -- a standalone illustrated glossary, and also the exact set
// of drag-and-drop assets every curated experiment draws from.
export const CHEM_EQUIPMENT: ChemApparatus[] = [
  { id: 'beaker', name: 'Beaker', description: 'A simple cylindrical container for mixing, heating, and holding liquids -- not used for precise volume measurement.', model3d: { src: '/models/chem/beaker/scene.gltf', credit: CC_ATTR('cesar.seidel', 'https://sketchfab.com/3d-models/beakers-b63ae471653f41e4b327cdcc796fc20c') } },
  { id: 'conical-flask', name: 'Conical (Erlenmeyer) Flask', description: 'A flask with a narrow neck and wide base, ideal for swirling liquids during titrations without spilling.', model3d: { src: '/models/chem/conical-flask/scene.gltf', credit: CC_ATTR('Naked Singularity Studio', 'https://sketchfab.com/3d-models/free-conical-flask-laboratory-low-poly-f2991abcaaa44616ad5f72d29a3d47b3') } },
  { id: 'round-bottom-flask', name: 'Round-Bottom Flask', description: 'A flask designed for even heating, often used with a stand over a flame for reactions or distillation.', model3d: { src: '/models/chem/round-bottom-flask/scene.gltf', credit: CC_ATTR('cesar.seidel', 'https://sketchfab.com/3d-models/round-bottom-flasks-7433a11498464de78f7751578bbbe211') } },
  { id: 'test-tube', name: 'Test Tube', description: 'A small glass tube used to hold, mix, or heat small quantities of chemicals.', model3d: { src: '/models/chem/test-tube/scene.gltf', credit: CC_ATTR('Smoothie 3D', 'https://sketchfab.com/3d-models/chemistry-4-test-tube-f933e29ea9114b0cbcd8bec005833f5a') } },
  { id: 'test-tube-rack', name: 'Test Tube Rack', description: 'Holds multiple test tubes upright and steady on the bench.', model3d: { src: '/models/chem/test-tube-rack/scene.gltf', credit: CC_ATTR('Harry Bond', 'https://sketchfab.com/3d-models/test-tube-rack-f09bcbfe529e4314a1acbf7b7d1e867f') } },
  { id: 'test-tube-holder', name: 'Test Tube Holder', description: 'A clamp used to hold a hot test tube safely while heating it over a flame.', model3d: { src: '/models/chem/test-tube-holder/scene.gltf', credit: CC_ATTR('Jordan Gerhardt', 'https://sketchfab.com/3d-models/test-tube-holder-8841d9db0fda442388b22a8cd5baf25b') } },
  { id: 'bunsen-burner', name: 'Bunsen Burner', description: 'A gas burner used to heat substances -- always used with the wick/flame adjusted and never left unattended.', model3d: { src: '/models/chem/bunsen-burner/scene.gltf', credit: CC_ATTR('Dreamsoft Innovations Pvt Ltd', 'https://sketchfab.com/3d-models/bunsen-burner-5185e41b2beb48fa8f15ca3707f43e10') } },
  { id: 'tripod-stand', name: 'Tripod Stand', description: 'A three-legged metal stand that supports a beaker or flask above a Bunsen burner.', model3d: { src: '/models/chem/tripod-stand/scene.gltf', credit: CC_ATTR('VeeRuby Technologies Pvt Ltd', 'https://sketchfab.com/3d-models/tripod-stand-676ab614343941d7b51a77962a97f5af') } },
  { id: 'wire-gauze', name: 'Wire Gauze', description: 'A wire mesh placed on a tripod stand to spread heat evenly under a glass vessel.' },
  { id: 'funnel', name: 'Funnel', description: 'Guides liquid into a narrow-mouthed container, often used with filter paper for filtration.', model3d: { src: '/models/chem/funnel/scene.gltf', credit: { author: 'plaggy (Sketchfab)', license: 'CC0 (Public Domain)', url: 'https://sketchfab.com/3d-models/cc0-funnel-3-9c71ecea8e0941af9f0e7b59895f7fd4' } } },
  { id: 'filter-paper', name: 'Filter Paper', description: 'A porous paper that separates solid particles from a liquid during filtration.' },
  { id: 'dropper', name: 'Dropper (Pipette)', description: 'Adds liquid drop by drop for precise, small quantities.' },
  { id: 'measuring-cylinder', name: 'Measuring Cylinder', description: 'A tall, graduated container used to measure a specific volume of liquid accurately.', model3d: { src: '/models/chem/measuring-cylinder/scene.gltf', credit: CC_ATTR('cesar.seidel', 'https://sketchfab.com/3d-models/graduated-cylinders-e0a1a66e2d104e4fb5b410ea84cd6b6f') } },
  { id: 'burette', name: 'Burette', description: 'A long graduated tube with a tap at the bottom, used to add a precise, measured volume of liquid drop by drop -- the key tool in titration.', model3d: { src: '/models/chem/burette/scene.gltf', credit: CC_ATTR('3dLabWare', 'https://sketchfab.com/3d-models/burette-4bb5f945638a46ba9ea5684d0f38ebad') } },
  { id: 'pipette', name: 'Volumetric Pipette', description: 'Delivers one exact, fixed volume of liquid -- used to measure the solution being tested in a titration.', model3d: { src: '/models/chem/pipette/scene.gltf', credit: CC_ATTR('3dLabWare', 'https://sketchfab.com/3d-models/pipette-laboratory-essential-tool-4ed0651f9de14cdf96891449acb7cc38') } },
  { id: 'thermometer', name: 'Thermometer', description: 'Measures the temperature of a reaction mixture.' },
  { id: 'ph-strip', name: 'pH / Litmus Paper', description: 'Changes color to show whether a solution is acidic, neutral, or basic (alkaline).' },
  { id: 'watch-glass', name: 'Watch Glass', description: 'A small curved glass dish used to hold a solid sample or evaporate a small amount of liquid.' },
  { id: 'china-dish', name: 'China Dish (Evaporating Dish)', description: 'A heat-safe dish used to evaporate a liquid and leave a solid residue behind.' },
  { id: 'delivery-tube', name: 'Delivery Tube', description: 'A bent tube that carries gas produced in one container safely into another for collection or testing.' },
  { id: 'retort-stand', name: 'Retort Stand with Clamp', description: 'Holds glassware (like a burette or flask) firmly in place above the bench.', model3d: { src: '/models/chem/retort-stand/scene.gltf', credit: CC_ATTR('3dLabWare', 'https://sketchfab.com/3d-models/universal-support-8f78057785f447e5a44758464a8186c0') } },
  { id: 'safety-goggles', name: 'Safety Goggles', description: 'Protects the eyes from splashes -- always worn during any real hands-on chemistry work.', model3d: { src: '/models/chem/safety-goggles/scene.gltf', credit: CC_ATTR('Microsoft', 'https://sketchfab.com/3d-models/safety-goggles-355f1e119c33452ea9e2e8d306360435') } },
  { id: 'gloves', name: 'Lab Gloves', description: 'Protects hands from chemicals that could irritate or stain the skin.', model3d: { src: '/models/chem/gloves/scene.gltf', credit: CC_ATTR('eerotiainen', 'https://sketchfab.com/3d-models/lab-equipment-gloves-3519914b790d47d7a80abbf4ee7919bf') } },
  { id: 'spatula', name: 'Spatula', description: 'A small scoop used to transfer solid chemicals without touching them by hand.' },
  { id: 'glass-rod', name: 'Glass Stirring Rod', description: 'Stirs or mixes a solution without reacting with the chemicals inside it.' },
  { id: 'gas-jar', name: 'Gas Jar', description: 'A wide glass jar used to collect and hold a gas once it has been prepared, often sealed with a glass plate.' },
  { id: 'water-trough', name: 'Water Trough (Pneumatic Trough)', description: 'A water-filled basin used to collect a gas by downward displacement of water -- the gas bubbles up into an upturned, water-filled jar and pushes the water out.' },
  { id: 'boiling-tube', name: 'Boiling Tube', description: 'A test tube-like vessel, slightly larger, designed to be heated directly over a flame without cracking.', model3d: { src: '/models/chem/boiling-tube/scene.gltf', credit: CC_ATTR('3dLabWare', 'https://sketchfab.com/3d-models/large-tube-and-rack-7743f61c59584492a3811dda9ef1f6da') } },
];
