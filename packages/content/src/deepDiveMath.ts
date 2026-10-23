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
  {
    id: 'math-theorem-exterior-angle-triangle',
    lab: 'math',
    title: 'Exterior Angle Theorem',
    tagline: "A shortcut hiding inside the Angle Sum Property -- one theorem falls straight out of another.",
    overview: 'The Exterior Angle Theorem says any exterior angle of a triangle equals the sum of the two interior angles that aren\'t next to it, giving a genuine shortcut for solving triangle angle problems.',
    deepFacts: [
      'It follows directly from the Angle Sum Property: since a straight line\'s angles add to 180° and a triangle\'s interior angles also add to 180°, the exterior angle (180° minus the adjacent interior angle) must equal the sum of the other two interior angles.',
      'This gives a genuine shortcut: if you know any two interior angles of a triangle, you can find the exterior angle at the third vertex WITHOUT first calculating that third interior angle at all.',
      'It generalizes to any convex polygon too, in a related form: the sum of all exterior angles of any convex polygon, one per vertex, always adds up to exactly 360 degrees, no matter how many sides the polygon has.',
      'Surveyors and navigators historically used exterior-angle relationships like this to calculate unknown angles and bearings in triangulated land surveys, well before calculators existed.',
    ],
    realWorldApplications: [
      'Navigation and surveying, through triangulation',
      'Structural engineering, calculating roof and truss angles',
      'Computer graphics and robotics, calculating turning angles for a path',
      'Any problem involving parallel lines cut by a transversal',
    ],
    commonMisconceptions: [
      '"The exterior angle theorem is a completely separate rule from the angle sum property" -- it\'s actually a direct, simple consequence of the angle sum property combined with the fact that angles on a straight line add to 180 degrees.',
    ],
    relatedIds: ['math-theorem-angle-sum-triangle'],
    visualType: 'none',
  },
  {
    id: 'math-theorem-angle-in-semicircle',
    lab: 'math',
    title: 'Angle in a Semicircle',
    tagline: 'A 2,600-year-old result: draw a diameter, pick any point on the circle, and you get a perfect right angle.',
    overview: 'The Angle in a Semicircle theorem says the angle subtended by a diameter at any point on the circle\'s circumference is always exactly 90 degrees -- a reliable, tool-free way to construct or verify a right angle.',
    deepFacts: [
      'This is a special case of a broader circle theorem: the angle subtended by any chord at the centre of a circle is always exactly TWICE the angle subtended by that same chord at any point on the remaining circumference. When the chord is a diameter, the centre angle is a straight 180°, so the circumference angle is always exactly half that: 90°.',
      'This theorem is the basis of Thales\' Theorem, one of the oldest named results in geometry, credited to the ancient Greek mathematician Thales of Miletus around 600 BCE.',
      'It gives a genuinely practical, tool-free way to check whether an angle is a true right angle: if a circle can be drawn through all three corners of a triangle and one of its sides turns out to be that circle\'s diameter, the angle opposite that side must be exactly 90 degrees.',
      'Carpenters and machinists have historically used this exact property with a simple semicircular jig to verify a right angle without needing a separate protractor or set square.',
    ],
    realWorldApplications: [
      'Verifying right angles in construction and carpentry without a protractor',
      'Circle geometry proofs in higher mathematics',
      'Computer graphics, determining if a point lies on a specific arc',
      'The design of certain mechanical linkages and gears',
    ],
    commonMisconceptions: [
      '"This only works for a nearly-perfect semicircle drawn very precisely" -- the 90-degree result is an exact mathematical guarantee for ANY point on the circle as long as the chord is a true diameter, not an approximation that depends on drawing accuracy.',
    ],
    relatedIds: ['math-theorem-angle-sum-triangle'],
    visualType: 'none',
  },
  {
    id: 'math-theorem-sum-of-ap',
    lab: 'math',
    title: 'Sum of the First n Terms of an Arithmetic Progression',
    tagline: "The trick a young Gauss is said to have used to sum 1 to 100 almost instantly.",
    overview: 'This formula gives the sum of the first n terms of an arithmetic progression directly, without adding every term one by one.',
    deepFacts: [
      'The formula is often introduced through a famous story about a young Carl Friedrich Gauss, said to have instantly summed the numbers 1 to 100 as a schoolboy by pairing the first and last terms (1+100, 2+99, 3+98...) and noticing every pair adds to the same total -- exactly the trick the general AP sum formula formalizes.',
      'The formula works precisely because an arithmetic progression is symmetric around its middle: the first term plus the last term always equals the second term plus the second-to-last term, and so on, which is exactly why "n/2 times (first plus last)" gives the correct total.',
      'Even-numbered and odd-numbered term counts both work with the same formula without needing a special case -- summing an odd number of terms means one term, the exact middle one, technically pairs with itself, and the formula still holds.',
      'This is a special, simpler case of a broader family of "summation formulas" used throughout higher mathematics -- similar reasoning, adapted differently, gives the sum formula for a Geometric Progression too.',
    ],
    realWorldApplications: [
      'Calculating total savings from fixed, regular deposits',
      'Stacking patterns, like crates or cannonballs arranged in rows that decrease by one each layer',
      'Physics problems involving constant acceleration, computing total distance covered',
      'Seating arrangement and scheduling problems with a regular pattern',
    ],
    commonMisconceptions: [
      '"This formula only works when the common difference is positive (an increasing sequence)" -- it works identically for a negative common difference too; the formula doesn\'t care about the sign of d.',
    ],
    relatedIds: [],
    visualType: 'none',
  },
  {
    id: 'math-formula-quadratic-formula',
    lab: 'math',
    title: 'The Quadratic Formula',
    tagline: "Solves any quadratic equation -- and its own middle term secretly tells you what kind of answer to expect.",
    overview: 'The Quadratic Formula gives the solutions to any equation of the form ax² + bx + c = 0, directly from its coefficients, without needing to factor the expression by hand.',
    deepFacts: [
      'The formula\'s "b² - 4ac" part, called the discriminant, tells you the nature of the roots before you even finish solving: positive means two distinct real roots, zero means exactly one repeated real root, and negative means no real roots at all.',
      'Babylonian mathematicians were solving specific quadratic-type problems using methods equivalent to "completing the square" as far back as roughly 2000 BCE, though not in the symbolic algebraic form used today.',
      'The now-standard symbolic form of the formula was largely developed by mathematicians of the Islamic Golden Age, notably Al-Khwarizmi, whose name gives us the word "algorithm," and later refined by Indian and European mathematicians.',
      'The quadratic formula is literally derived by "completing the square" on the general equation ax² + bx + c = 0 -- it isn\'t a separate, unrelated trick, but a shortcut that packages up that entire step-by-step process into one reusable formula.',
    ],
    realWorldApplications: [
      'Projectile motion in physics, finding when a thrown object hits the ground',
      'Business and economics, finding break-even points where a profit function crosses zero',
      'Engineering, in structural load calculations',
      'Computer graphics, calculating intersections between lines and curves',
    ],
    commonMisconceptions: [
      '"A quadratic equation always has two real solutions" -- it can have two, exactly one (repeated), or zero real solutions, depending entirely on the sign of the discriminant.',
    ],
    relatedIds: [],
    visualType: 'none',
  },
  {
    id: 'math-formula-circle-area-circumference',
    lab: 'math',
    title: 'Circle Area & Circumference',
    tagline: 'Built entirely on one irrational number -- calculated to trillions of digits, needed to only a few.',
    overview: 'These two formulas give a circle\'s area and circumference directly from its radius, both built on the constant pi.',
    deepFacts: [
      'Pi (π) is an irrational number, meaning its decimal digits never terminate or repeat in any pattern -- it has been calculated to trillions of digits by modern computers, though any real-world calculation only ever needs a small handful of decimal places for full practical accuracy.',
      'The area formula (πr²) can be derived visually: cut a circle into many thin pie-slice wedges and rearrange them, alternating point-up and point-down, and they approximate a parallelogram with a base of half the circumference and a height equal to the radius -- multiply those together and πr² falls out naturally.',
      'Ancient civilizations, including the Babylonians and Egyptians, used approximations of pi, like 3 or 3.125, thousands of years before it was proven that pi\'s true value could never be expressed as an exact fraction.',
      'Archimedes, around 250 BCE, calculated remarkably tight upper and lower bounds for pi by inscribing and circumscribing many-sided polygons inside and outside a circle and calculating their perimeters -- an early, rigorous method that anticipated ideas calculus would later formalize.',
    ],
    realWorldApplications: [
      'Engineering and construction, for pipes, wheels, gears, and tanks',
      'Astronomy, calculating orbital paths',
      'Manufacturing any circular or cylindrical part',
      'Everyday measurement of round objects',
    ],
    commonMisconceptions: [
      '"Pi is exactly 22/7" -- 22/7 is a commonly used, convenient APPROXIMATION of pi, accurate to only about 2 decimal places; pi\'s true value is irrational and can never be expressed as an exact fraction.',
    ],
    relatedIds: [],
    visualType: 'none',
  },
];
