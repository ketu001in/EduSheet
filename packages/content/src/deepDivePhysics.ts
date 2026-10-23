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
  {
    id: 'physics-equip-stopwatch',
    lab: 'physics',
    title: 'Stopwatch',
    tagline: 'The biggest source of timing error usually isn\'t the watch -- it\'s the thumb pressing the button.',
    overview: 'The stopwatch times how long an event takes -- simple in concept, but a genuine source of measurement error in almost every hand-timed physics experiment.',
    deepFacts: [
      'Human reaction time when manually starting or stopping a stopwatch is typically 0.1-0.3 seconds, which is often the single biggest source of error in a hand-timed experiment -- far bigger than any imprecision in the stopwatch itself.',
      'Because of this reaction-time error, a common and effective technique is to time MULTIPLE repetitions of an event (like 10 full pendulum swings) and divide by the count, which averages the timing error down to a much smaller fraction per single event.',
      'Mechanical stopwatches, using a wound spring and an escapement mechanism, were the standard for over a century before quartz crystal oscillators made electronic stopwatches both cheaper and more accurate.',
      'Officially timed sporting events now use fully automatic electronic timing, triggered directly by the starting gun and a finish-line sensor, specifically to remove human reaction-time error entirely from competitive results.',
    ],
    realWorldApplications: [
      'Timing experiments in physics and chemistry labs',
      'Sports timing',
      'Cooking',
      'Any scientific research requiring precise duration measurement',
    ],
    commonMisconceptions: [
      '"A stopwatch reading is exactly accurate down to its smallest displayed digit" -- the READOUT can be precise, but human reaction time starting and stopping it introduces a real error usually much larger than the device\'s own precision.',
    ],
    relatedIds: ['physics-equip-pendulum-bob'],
    visualType: 'none',
  },
  {
    id: 'physics-equip-meter-scale',
    lab: 'physics',
    title: 'Metre Scale',
    tagline: 'Once defined by the Earth itself -- now defined by the speed of light.',
    overview: 'The metre scale is the standard tool for measuring length and distance in a physics lab, built on one of the most carefully redefined units in all of science.',
    deepFacts: [
      'The metre was originally defined in 1793 as one ten-millionth of the distance from the Earth\'s North Pole to the Equator, measured along a meridian through Paris -- an ambitious, genuinely global reference before satellites existed to check the calculation easily.',
      'Today the metre is defined with far more precision using a physical constant: the distance light travels in a vacuum in exactly 1/299,792,458th of a second -- tying the unit of length directly to the universal, unchanging speed of light.',
      'Reading a metre scale accurately requires avoiding "parallax error" -- viewing the scale from an angle rather than directly straight-on, which can make a reading appear shifted from its true position.',
      'Before internationally standardized measurement, different regions used wildly inconsistent local units for length, causing real problems for trade and construction -- the metric system was deliberately designed to be a single, universal, logically consistent standard.',
    ],
    realWorldApplications: [
      'Measuring length and distance in physics and everyday life',
      'Construction and engineering',
      'Manufacturing, ensuring parts made in different factories still fit together',
      'Scientific research worldwide',
    ],
    commonMisconceptions: [
      '"Any straight ruler is basically as accurate as any other" -- a metre scale\'s actual accuracy depends on manufacturing precision and how carefully it\'s read; cheap, worn, or poorly-read scales introduce real measurement error.',
    ],
    relatedIds: [],
    visualType: 'none',
  },
  {
    id: 'physics-equip-plane-mirror',
    lab: 'physics',
    title: 'Plane Mirror',
    tagline: 'The image looks like it\'s behind the glass -- and only left-right gets swapped, never up-down.',
    overview: 'A plane mirror reflects light to form a virtual image that appears the same distance behind the mirror as the object is in front of it.',
    deepFacts: [
      'A plane mirror\'s image appears to be the same distance BEHIND the mirror as the object is in front of it, even though nothing is physically there -- this is called a "virtual image," one that can\'t be projected onto a screen, since light rays only appear to come from that point.',
      'A plane mirror image is "laterally inverted" -- left and right appear swapped, which is why text held up to a mirror looks backwards -- but top and bottom are NOT swapped, a detail that trips up a lot of people trying to explain exactly what a mirror does.',
      'Real mirrors are actually a thin layer of reflective metal, traditionally silver, now often aluminium, coated on the BACK of a sheet of glass -- the glass itself doesn\'t do the reflecting, it just protects and supports the thin metal layer.',
      'The Law of Reflection -- the angle of incidence equals the angle of reflection -- holds exactly at every single point on a plane mirror\'s surface, which is exactly why a flat mirror produces a clean, undistorted image while a curved surface does not.',
    ],
    realWorldApplications: [
      'Household mirrors',
      'Periscopes, where submarines use angled plane mirrors to see above the water',
      'Rear-view and side mirrors on vehicles',
      'Laser and optical instrument alignment',
    ],
    commonMisconceptions: [
      '"A mirror image is completely reversed, top-to-bottom and left-to-right both" -- only left-right appears swapped (lateral inversion); up stays up and down stays down.',
    ],
    relatedIds: [],
    visualType: 'none',
  },
  {
    id: 'physics-equip-bar-magnet',
    lab: 'physics',
    title: 'Bar Magnet',
    tagline: 'Cut it in half, and you don\'t isolate a pole -- you just get two smaller complete magnets.',
    overview: 'A bar magnet produces a magnetic field with a north and south pole, used to explore magnetism\'s basic rules through direct, hands-on observation.',
    deepFacts: [
      'Every magnet, no matter how many times you cut it, always has both a north and a south pole -- cutting a bar magnet in half doesn\'t isolate a single pole, it just creates two new, smaller complete magnets, each with its own north and south pole.',
      'The invisible magnetic field around a bar magnet can be made visible by sprinkling iron filings around it -- they align themselves along the actual field lines, showing the field\'s real shape rather than just its effect on a single compass needle.',
      'Earth itself behaves like a giant, if imperfect and constantly shifting, bar magnet -- exactly why a compass needle, a small magnet free to rotate, reliably points roughly toward geographic north.',
      'Heating a magnet strongly enough, or repeatedly striking it, can disrupt the aligned microscopic magnetic domains inside it and cause it to lose its magnetism -- magnetism is a real physical alignment at the atomic scale, not a fixed, indestructible property.',
    ],
    realWorldApplications: [
      'Compasses for navigation',
      'Electric motors and generators, which rely on magnetic fields to convert between electrical and mechanical energy',
      'Magnetic data storage',
      'MRI machines in medicine, using much larger, far more powerful magnets on the same basic principles',
    ],
    commonMisconceptions: [
      '"Cutting a bar magnet in half isolates a single north or south pole" -- it\'s genuinely impossible with a normal magnet; cutting it always produces two new complete magnets, each with both a north and south pole.',
    ],
    relatedIds: [],
    visualType: 'none',
  },
];
