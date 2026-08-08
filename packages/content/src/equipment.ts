import { ChemApparatus } from './types';

// The "Studio" -- a standalone illustrated glossary, and also the exact set
// of drag-and-drop assets every curated experiment draws from.
export const CHEM_EQUIPMENT: ChemApparatus[] = [
  { id: 'beaker', name: 'Beaker', description: 'A simple cylindrical container for mixing, heating, and holding liquids -- not used for precise volume measurement.' },
  { id: 'conical-flask', name: 'Conical (Erlenmeyer) Flask', description: 'A flask with a narrow neck and wide base, ideal for swirling liquids during titrations without spilling.' },
  { id: 'round-bottom-flask', name: 'Round-Bottom Flask', description: 'A flask designed for even heating, often used with a stand over a flame for reactions or distillation.' },
  { id: 'test-tube', name: 'Test Tube', description: 'A small glass tube used to hold, mix, or heat small quantities of chemicals.' },
  { id: 'test-tube-rack', name: 'Test Tube Rack', description: 'Holds multiple test tubes upright and steady on the bench.' },
  { id: 'test-tube-holder', name: 'Test Tube Holder', description: 'A clamp used to hold a hot test tube safely while heating it over a flame.' },
  { id: 'bunsen-burner', name: 'Bunsen Burner', description: 'A gas burner used to heat substances -- always used with the wick/flame adjusted and never left unattended.' },
  { id: 'tripod-stand', name: 'Tripod Stand', description: 'A three-legged metal stand that supports a beaker or flask above a Bunsen burner.' },
  { id: 'wire-gauze', name: 'Wire Gauze', description: 'A wire mesh placed on a tripod stand to spread heat evenly under a glass vessel.' },
  { id: 'funnel', name: 'Funnel', description: 'Guides liquid into a narrow-mouthed container, often used with filter paper for filtration.' },
  { id: 'filter-paper', name: 'Filter Paper', description: 'A porous paper that separates solid particles from a liquid during filtration.' },
  { id: 'dropper', name: 'Dropper (Pipette)', description: 'Adds liquid drop by drop for precise, small quantities.' },
  { id: 'measuring-cylinder', name: 'Measuring Cylinder', description: 'A tall, graduated container used to measure a specific volume of liquid accurately.' },
  { id: 'burette', name: 'Burette', description: 'A long graduated tube with a tap at the bottom, used to add a precise, measured volume of liquid drop by drop -- the key tool in titration.' },
  { id: 'pipette', name: 'Volumetric Pipette', description: 'Delivers one exact, fixed volume of liquid -- used to measure the solution being tested in a titration.' },
  { id: 'thermometer', name: 'Thermometer', description: 'Measures the temperature of a reaction mixture.' },
  { id: 'ph-strip', name: 'pH / Litmus Paper', description: 'Changes color to show whether a solution is acidic, neutral, or basic (alkaline).' },
  { id: 'watch-glass', name: 'Watch Glass', description: 'A small curved glass dish used to hold a solid sample or evaporate a small amount of liquid.' },
  { id: 'china-dish', name: 'China Dish (Evaporating Dish)', description: 'A heat-safe dish used to evaporate a liquid and leave a solid residue behind.' },
  { id: 'delivery-tube', name: 'Delivery Tube', description: 'A bent tube that carries gas produced in one container safely into another for collection or testing.' },
  { id: 'retort-stand', name: 'Retort Stand with Clamp', description: 'Holds glassware (like a burette or flask) firmly in place above the bench.' },
  { id: 'safety-goggles', name: 'Safety Goggles', description: 'Protects the eyes from splashes -- always worn during any real hands-on chemistry work.' },
  { id: 'gloves', name: 'Lab Gloves', description: 'Protects hands from chemicals that could irritate or stain the skin.' },
  { id: 'spatula', name: 'Spatula', description: 'A small scoop used to transfer solid chemicals without touching them by hand.' },
  { id: 'glass-rod', name: 'Glass Stirring Rod', description: 'Stirs or mixes a solution without reacting with the chemicals inside it.' },
];
