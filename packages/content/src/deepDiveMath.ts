import { DeepDiveContent } from './deepDive';

// Math Lab's first wave of Deep Dives -- wired into Theorem Corner (see
// TheoremCorner.tsx's "Explore This Theorem Further" button). Ancient
// Mathematics' history figures deliberately are NOT duplicated here --
// AncientMathExplorer.tsx already gives them their own rich, real-image,
// achievement-by-achievement deep-dive treatment, so adding a second,
// separate Deep Dive layer for the same people would just be redundant.
export const MATH_DEEP_DIVES: DeepDiveContent[] = [
  {
    id: 'math-theorem-pythagoras-theorem',
    lab: 'math',
    title: 'Pythagoras Theorem',
    tagline: 'Known and used by multiple ancient civilizations -- centuries before Pythagoras.',
    overview: 'The Pythagoras Theorem relates the three sides of any right-angled triangle, and is one of the oldest, most useful, and most-proved results in all of mathematics.',
    deepFacts: [
      'Despite the name, this relationship was known and used by Babylonian mathematicians over a thousand years before Pythagoras, and independently discovered in ancient India (the Baudhayana Sulba Sutra, roughly 800 BCE) and China. What\'s specifically credited to the Pythagorean school is the first known general PROOF, not the discovery of the pattern itself.',
      'There are now more than 350 documented, genuinely different proofs of this one theorem -- including an original proof published by future US President James A. Garfield in 1876, years before he took office.',
      '"Pythagorean triples" are sets of three whole numbers that satisfy the relationship exactly, like 3-4-5 or 5-12-13. Ancient builders used a knotted rope in a 3-4-5 ratio to reliably construct a perfect right angle, long before anyone had a formal proof of why it worked.',
      'The theorem only holds exactly on a FLAT surface. Draw a triangle on a curved surface, like the surface of the Earth, and it can have three 90-degree angles at once -- the simple relationship breaks down completely once the surface isn\'t flat.',
    ],
    realWorldApplications: [
      'Construction and carpentry, checking that a corner is truly square',
      'Navigation and GPS, calculating straight-line distance from horizontal and vertical components',
      'Computer graphics, calculating the distance between two points on screen',
      'Physics, resolving a vector into its components',
    ],
    commonMisconceptions: [
      '"Pythagoras invented this relationship" -- it was known and used by multiple ancient civilizations well before him; what\'s specifically credited to his school is the first known rigorous, general proof.',
    ],
    relatedIds: [],
    visualType: 'none',
  },
  {
    id: 'math-theorem-angle-sum-triangle',
    lab: 'math',
    title: 'Angle Sum Property of a Triangle',
    tagline: 'True on a flat page -- but draw a triangle on a globe, and the rule breaks completely.',
    overview: 'The Angle Sum Property says every triangle\'s three interior angles add up to exactly 180 degrees -- but only on a flat surface, which turns out to be a genuinely deep fact about geometry itself.',
    deepFacts: [
      'This 180-degree rule is only true on a FLAT surface. Draw a triangle on the surface of a sphere, like the Earth, using great-circle lines, and its three angles can add up to MORE than 180 degrees -- a triangle with three 90-degree corners is easy to construct on a globe.',
      'The standard proof relies directly on properties of parallel lines, which are themselves built on Euclid\'s famous "parallel postulate" -- a foundational assumption of geometry that mathematicians spent over 2,000 years trying, unsuccessfully, to prove from simpler rules.',
      'This property alone is enough to prove a closely related result: any EXTERIOR angle of a triangle equals the sum of the two non-adjacent interior angles.',
      'Because the angle sum is fixed at exactly 180 degrees, a flat triangle can have at most one angle of 90 degrees or more -- it\'s mathematically impossible for a flat triangle to have two right angles or two obtuse angles.',
    ],
    realWorldApplications: [
      'Architecture and structural engineering, calculating roof truss angles',
      'Surveying and land measurement',
      'Navigation',
      'Any 3D computer graphics or game engine, since triangular meshes are the basic building block of rendered 3D shapes',
    ],
    commonMisconceptions: [
      '"Every triangle\'s angles add up to 180 degrees, no matter what surface it\'s drawn on" -- that\'s only true for a triangle on a flat plane; triangles on curved surfaces, like a sphere, don\'t follow this rule.',
    ],
    relatedIds: ['math-theorem-pythagoras-theorem'],
    visualType: 'none',
  },
  {
    id: 'math-theorem-binomial-theorem',
    lab: 'math',
    title: 'Binomial Theorem',
    tagline: "Its coefficients are Pascal's Triangle -- known across three ancient cultures before Pascal.",
    overview: 'The Binomial Theorem gives a direct formula for expanding (a + b) raised to any positive whole power, without multiplying it out term by term.',
    deepFacts: [
      'The coefficients in a binomial expansion ("n choose k") are exactly the numbers found in Pascal\'s Triangle -- known and used across multiple ancient cultures (China, Persia, India) centuries before Blaise Pascal, the mathematician the triangle is named after in the West, wrote about it in 1653.',
      'The theorem isn\'t limited to positive whole-number powers -- Isaac Newton generalized it in the 1660s to work for negative and fractional exponents too, producing an infinite series instead of a finite sum, one of the key early results on the road to calculus.',
      'Setting a = b = 1 in the expansion of (a+b)^n shows that all the coefficients add up to exactly 2^n -- a clean shortcut connecting the binomial theorem directly to counting problems, like counting every possible subset of a set of n items.',
      'Binomial coefficients show up constantly in probability -- the classic formula for "the probability of getting exactly k heads in n coin flips" is built directly from the binomial theorem\'s coefficients.',
    ],
    realWorldApplications: [
      'Probability and statistics, calculating exact probabilities across repeated trials',
      'Computer science, in algorithm analysis and combinatorics',
      'Financial modelling, in binomial option pricing models',
      'Genetics, calculating the probability of specific gene combinations in offspring',
    ],
    commonMisconceptions: [
      '"The binomial theorem only works for positive whole-number exponents" -- the standard CBSE/ICSE version does focus on positive integer n, but Newton generalized the theorem to work for negative and fractional powers too, as an infinite series.',
    ],
    relatedIds: [],
    visualType: 'none',
  },
];
