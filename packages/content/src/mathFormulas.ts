import { MathFormula } from './mathTypes';

// Formula Reference -- Phase 1 of Math Lab. Every example below is worked
// out by hand and double-checked (not "generated") -- same discipline as
// Physics Lab's live formula substitution panel: the math is never hidden
// behind a black box, every number plugs in and checks out.
export const MATH_FORMULAS: MathFormula[] = [
  {
    id: 'hcf-lcm-relation',
    name: 'HCF x LCM Relation',
    branch: 'number-systems',
    gradeBand: 'junior',
    formula: 'HCF(a, b) x LCM(a, b) = a x b',
    variables: [
      { symbol: 'HCF(a, b)', meaning: 'Highest Common Factor of a and b' },
      { symbol: 'LCM(a, b)', meaning: 'Lowest Common Multiple of a and b' },
    ],
    example: { values: { a: 12, b: 18 }, result: 'HCF = 6, LCM = 36, and 6 x 36 = 216 = 12 x 18' },
    note: 'Only true for exactly TWO numbers -- it does not extend directly to three or more numbers the same way.',
  },
  {
    id: 'quadratic-formula',
    name: 'Quadratic Formula',
    branch: 'algebra',
    gradeBand: 'senior',
    formula: 'x = (-b +/- sqrt(b^2 - 4ac)) / 2a',
    variables: [
      { symbol: 'a, b, c', meaning: 'coefficients of the quadratic equation ax^2 + bx + c = 0 (a != 0)' },
      { symbol: 'b^2 - 4ac', meaning: 'the discriminant -- tells you how many real roots exist' },
    ],
    example: { values: { a: 1, b: -3, c: 2 }, result: 'For x^2 - 3x + 2 = 0: x = 2 or x = 1' },
    note: 'If the discriminant is negative, there are no real roots -- the two solutions are a pair of complex numbers instead.',
  },
  {
    id: 'algebraic-identities',
    name: 'Standard Algebraic Identities',
    branch: 'algebra',
    gradeBand: 'middle',
    formula: '(a+b)^2 = a^2 + 2ab + b^2   |   (a-b)^2 = a^2 - 2ab + b^2   |   a^2 - b^2 = (a+b)(a-b)',
    variables: [
      { symbol: 'a, b', meaning: 'any two numbers or algebraic terms' },
    ],
    example: { values: { a: 5, b: 3 }, result: '(5+3)^2 = 64, (5-3)^2 = 4, and 5^2 - 3^2 = 16 = (8)(2)' },
    note: 'These three are the most-used identities in all of school algebra -- factorising, expanding, and simplifying expressions all lean on them constantly.',
  },
  {
    id: 'triangle-area',
    name: 'Area of a Triangle',
    branch: 'mensuration',
    gradeBand: 'junior',
    formula: 'Area = 1/2 x base x height',
    variables: [
      { symbol: 'base', meaning: 'length of the triangle\'s base' },
      { symbol: 'height', meaning: 'perpendicular height from the base to the opposite vertex' },
    ],
    example: { values: { base: 10, height: 6 }, result: 'Area = 1/2 x 10 x 6 = 30 square units' },
    note: 'The height must be measured perpendicular (at a right angle) to the base -- a slanted side length is not the same thing.',
  },
  {
    id: 'circle-area-circumference',
    name: 'Area and Circumference of a Circle',
    branch: 'mensuration',
    gradeBand: 'senior',
    formula: 'Area = pi x r^2      Circumference = 2 x pi x r',
    variables: [
      { symbol: 'r', meaning: 'radius of the circle' },
      { symbol: 'pi', meaning: 'approximately 22/7 or 3.14159' },
    ],
    example: { values: { r: 7 }, result: 'Using pi = 22/7: Area = 154 square units, Circumference = 44 units' },
    note: 'Radius 7 is chosen deliberately in most textbook examples because it cancels neatly against the 22/7 approximation of pi.',
  },
  {
    id: 'cylinder-surface-volume',
    name: 'Surface Area and Volume of a Cylinder',
    branch: 'mensuration',
    gradeBand: 'senior',
    formula: 'Curved Surface Area = 2 x pi x r x h      Volume = pi x r^2 x h',
    variables: [
      { symbol: 'r', meaning: 'radius of the circular base' },
      { symbol: 'h', meaning: 'height of the cylinder' },
    ],
    example: { values: { r: 7, h: 10 }, result: 'Using pi = 22/7: Curved Surface Area = 440 sq units, Volume = 1540 cubic units' },
    note: 'Total surface area (if the cylinder is closed at both ends) needs the two circular ends added: 2 x pi x r x (h + r).',
  },
  {
    id: 'sphere-volume',
    name: 'Volume of a Sphere',
    branch: 'mensuration',
    gradeBand: 'senior',
    formula: 'Volume = 4/3 x pi x r^3',
    variables: [
      { symbol: 'r', meaning: 'radius of the sphere' },
    ],
    example: { values: { r: 3 }, result: 'Using pi = 3.14: Volume = 4/3 x 3.14 x 27 = approximately 113.1 cubic units' },
    note: 'Notice the radius is cubed, not squared -- volume grows MUCH faster than surface area as a sphere gets bigger.',
  },
  {
    id: 'distance-formula',
    name: 'Distance Formula',
    branch: 'geometry',
    gradeBand: 'senior',
    formula: 'd = sqrt((x2-x1)^2 + (y2-y1)^2)',
    variables: [
      { symbol: '(x1, y1)', meaning: 'coordinates of the first point' },
      { symbol: '(x2, y2)', meaning: 'coordinates of the second point' },
    ],
    example: { values: { x1: 1, y1: 2, x2: 4, y2: 6 }, result: 'd = sqrt(3^2 + 4^2) = sqrt(25) = 5 units' },
    note: 'This is really just the Pythagoras Theorem in disguise -- the horizontal and vertical gaps between the two points ARE the two legs of a right triangle.',
  },
  {
    id: 'trig-ratios',
    name: 'Basic Trigonometric Ratios',
    branch: 'trigonometry',
    gradeBand: 'senior',
    formula: 'sin(theta) = opposite/hypotenuse    cos(theta) = adjacent/hypotenuse    tan(theta) = opposite/adjacent',
    variables: [
      { symbol: 'theta', meaning: 'one of the acute angles in a right triangle' },
      { symbol: 'opposite, adjacent, hypotenuse', meaning: 'the three sides of the right triangle, relative to theta' },
    ],
    example: { values: { opposite: 3, adjacent: 4, hypotenuse: 5 }, result: 'For a 3-4-5 triangle: sin(theta) = 0.6, cos(theta) = 0.8, tan(theta) = 0.75' },
    note: 'A quick memory aid taught in most classrooms: SOH-CAH-TOA (Sine=Opp/Hyp, Cosine=Adj/Hyp, Tangent=Opp/Adj).',
  },
  {
    id: 'pythagorean-identity',
    name: 'Pythagorean Trigonometric Identity',
    branch: 'trigonometry',
    gradeBand: 'senior',
    formula: 'sin^2(theta) + cos^2(theta) = 1',
    variables: [
      { symbol: 'theta', meaning: 'any angle' },
    ],
    example: { values: {}, result: 'For sin(theta) = 0.6 and cos(theta) = 0.8: 0.36 + 0.64 = 1' },
    note: 'This is Pythagoras Theorem rewritten for the unit circle -- sine and cosine ARE the two legs of a right triangle with hypotenuse 1.',
  },
  {
    id: 'mean-formula',
    name: 'Mean (Average)',
    branch: 'statistics-probability',
    gradeBand: 'middle',
    formula: 'Mean = (sum of all values) / (number of values)',
    variables: [
      { symbol: 'n', meaning: 'how many values are in the data set' },
    ],
    example: { values: { data: 4, count: 5 }, result: 'For {4, 8, 6, 10, 2}: Mean = 30 / 5 = 6' },
    note: 'The mean can be pulled far from "typical" by just one extreme outlier -- that\'s exactly why median is often reported alongside it.',
  },
  {
    id: 'probability-formula',
    name: 'Probability of an Event',
    branch: 'statistics-probability',
    gradeBand: 'senior',
    formula: 'P(event) = (favourable outcomes) / (total possible outcomes)',
    variables: [
      { symbol: 'P(event)', meaning: 'probability of the event happening, always between 0 and 1' },
    ],
    example: { values: {}, result: 'Rolling an even number on a fair die: 3 favourable outcomes (2, 4, 6) out of 6 total = 1/2' },
    note: 'This formula only works when every outcome is equally likely -- a loaded die or a biased coin needs a different approach entirely.',
  },
  {
    id: 'derivative-power-rule',
    name: 'Derivative Power Rule',
    branch: 'calculus',
    gradeBand: 'plusTwo',
    formula: 'd/dx (x^n) = n . x^(n-1)',
    variables: [
      { symbol: 'n', meaning: 'any real-number exponent' },
    ],
    example: { values: { n: 3 }, result: 'd/dx (x^3) = 3x^2' },
    note: 'This single rule, combined with the sum and product rules, is enough to differentiate almost every polynomial you\'ll meet in school.',
  },
  {
    id: 'integral-power-rule',
    name: 'Integral Power Rule',
    branch: 'calculus',
    gradeBand: 'plusTwo',
    formula: 'Integral of x^n dx = x^(n+1) / (n+1) + C',
    variables: [
      { symbol: 'n', meaning: 'any real-number exponent, n != -1' },
      { symbol: 'C', meaning: 'the constant of integration -- infinitely many functions share the same derivative' },
    ],
    example: { values: { n: 2 }, result: 'Integral of x^2 dx = x^3 / 3 + C' },
    note: 'This is the exact reverse of the derivative power rule above -- integration and differentiation undo each other.',
  },
];
