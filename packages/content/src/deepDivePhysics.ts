import { DeepDiveContent } from './deepDive';

// Physics Lab's first wave of Deep Dives -- wired through the shared
// EquipmentModal in labshared/LabHotspot.tsx (see its `deepDivePrefix`
// prop), so every hotspot-driven equipment popup across Physics Lab's
// experiments gets an "Explore Further" option automatically wherever a
// matching entry exists here. Text-depth only for now (no new photos
// sourced this pass) -- see deepDiveChem.ts for the photo-plus-rotate
// treatment already live in Chem Lab's Equipment Studio.
export const PHYSICS_DEEP_DIVES: DeepDiveContent[] = [
  {
    id: 'physics-equip-pendulum-bob',
    lab: 'physics',
    title: 'Pendulum Bob',
    tagline: 'Its mass barely matters -- length and gravity are what actually control the swing.',
    overview: 'The pendulum bob is the weight that swings on the end of the string, and its motion is one of the oldest, most precisely studied systems in physics.',
    deepFacts: [
      'A pendulum\'s swing period depends on its LENGTH and on gravity, but not on the mass of the bob -- a heavier or lighter bob on the same length string swings at exactly the same rate (ignoring air resistance), a genuinely counterintuitive result.',
      'Galileo is said to have first noticed this timing regularity as a young man, watching a swinging lamp in Pisa Cathedral around 1583 and timing it against his own pulse.',
      'Pendulum clocks, built on this principle, were the world\'s most accurate timekeeping technology for nearly 300 years, from Christiaan Huygens\' first pendulum clock in 1656 until quartz clocks took over in the 20th century.',
      'The simple T = 2π√(L/g) formula only holds accurately for small swing angles, roughly under 15-20 degrees -- at larger angles, the real period is slightly longer than the formula predicts.',
    ],
    realWorldApplications: [
      'Pendulum clocks',
      'Foucault pendulums, which demonstrate that the Earth itself is rotating',
      'Some early seismometers used pendulums to detect ground motion',
      'Playground swings follow the exact same underlying physics',
    ],
    commonMisconceptions: [
      '"A heavier bob swings faster or slower than a lighter one" -- for an ideal pendulum this is false; mass doesn\'t affect the period at all, only length and gravity do.',
    ],
    relatedIds: ['physics-equip-spring-coil'],
    visualType: 'none',
  },
  {
    id: 'physics-equip-spring-coil',
    lab: 'physics',
    title: 'Spring',
    tagline: 'Stretch it twice as far, and it pulls back twice as hard -- until it doesn\'t.',
    overview: 'The spring demonstrates Hooke\'s Law and simple harmonic motion, two of the most widely applicable ideas in all of physics.',
    deepFacts: [
      'Springs obey Hooke\'s Law: the force needed to stretch or compress a spring is directly proportional to how far it\'s displaced -- doubling the stretch doubles the force needed, at least until the spring is pushed too far and permanently deforms.',
      'English scientist Robert Hooke discovered this in 1660, and famously first published it in 1676 as a scrambled Latin anagram to secure credit for the discovery while keeping the actual details secret -- he only revealed the real law two years later.',
      'A mass bouncing on a spring is one of the simplest real systems that shows genuine Simple Harmonic Motion -- the same mathematical pattern that also describes swinging pendulums, vibrating guitar strings, and alternating electrical current.',
      'Every real spring has an "elastic limit" -- stretch it beyond that point and it won\'t spring back to its original shape, a real, permanent deformation.',
    ],
    realWorldApplications: [
      'Vehicle suspension systems',
      'Mattresses',
      'Spring-based weighing scales, which measure weight directly from how far a spring stretches',
      'Mechanical watches and retractable pens',
    ],
    commonMisconceptions: [
      '"A spring can be stretched any amount and still spring back perfectly" -- every real spring has an elastic limit beyond which it deforms permanently.',
    ],
    relatedIds: ['physics-equip-pendulum-bob'],
    visualType: 'none',
  },
  {
    id: 'physics-equip-battery',
    lab: 'physics',
    title: 'Battery',
    tagline: 'It doesn\'t store electricity directly -- it stores a chemical reaction waiting to happen.',
    overview: 'A battery provides the electrical energy for a circuit by converting stored chemical energy into an electric current on demand.',
    deepFacts: [
      'A battery doesn\'t actually store electricity directly -- it stores chemical energy, and a chemical reaction inside it pushes electrons through an external circuit, converting chemical energy into electrical energy as needed.',
      'The word "battery" originally meant a connected group of multiple electrical cells -- Benjamin Franklin first used the term this way in the 1740s for a linked set of charged glass plates, well before the modern chemical battery existed.',
      'Italian scientist Alessandro Volta built the first true chemical battery, the "voltaic pile," in 1800, using alternating discs of zinc and copper separated by brine-soaked cloth -- the same two metals still used in many classic battery demonstrations today.',
      'Rechargeable batteries, like the lithium-ion battery in a phone, can have their internal chemical reaction run in reverse by pushing current back in during charging, re-forming the original chemicals -- non-rechargeable batteries use a reaction that can\'t practically be reversed.',
    ],
    realWorldApplications: [
      'Portable electronic devices of every kind',
      'Electric vehicles',
      'Backup power systems',
      'Remote controls and hearing aids',
    ],
    commonMisconceptions: [
      '"A battery stores electricity like a tank stores water" -- it stores chemical potential energy, which is converted to electrical energy through a reaction, not electricity sitting there ready-made.',
    ],
    relatedIds: [],
    visualType: 'none',
  },
];
