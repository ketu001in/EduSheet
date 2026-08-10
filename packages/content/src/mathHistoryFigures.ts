// Ancient Mathematics Explorer -- Phase 3 of Math Lab. Same real-image
// discipline as Biology Lab's Anatomy Explorer: every image is a real,
// license-verified photograph or illustration (see CREDITS.md next to the
// image files), and every fact below is hand-verified, never generated.
//
// An important honesty note, same spirit as the Vedic Mathematics section:
// Aryabhata, Brahmagupta, and Bhaskara II all lived many centuries before
// photography existed, and no contemporary portrait of any of them
// survives. Their images here are a modern statue, a modern relief
// sculpture, and a modern illustrated portrait -- artistic tributes, not
// likenesses -- and each figure's `imageNote` says so explicitly. Only
// Ramanujan (1887-1920) lived in the photographic era, so his image is a
// genuine historical photograph.
export interface MathAchievement {
  id: string;
  title: string;
  summary: string;
  deepDive: string;
}

export interface MathHistoryFigure {
  id: string;
  name: string;
  years: string;
  imageSrc: string;
  imageAlt: string;
  imageNote: string; // honesty note about whether this is a real likeness
  intro: string;
  achievements: MathAchievement[];
  credit: { source: string; author: string; license: string; url: string };
}

export const MATH_HISTORY_FIGURES: MathHistoryFigure[] = [
  {
    id: 'aryabhata',
    name: 'Aryabhata',
    years: '476 - 550 CE',
    imageSrc: '/mathhistory/aryabhata.jpg',
    imageAlt: 'A modern statue of Aryabhata at IUCAA, Pune, India',
    imageNote: 'No contemporary portrait of Aryabhata survives -- this is a modern statue built as a tribute, not a historical likeness.',
    intro: 'Aryabhata wrote India\'s oldest surviving major work of mathematics and astronomy, the Aryabhatiya, at just 23 years old -- and it still shapes how the world calculates today.',
    achievements: [
      {
        id: 'place-value',
        title: 'Place-Value Number System',
        summary: 'Used a positional decimal system where a digit\'s value depends on its place -- the same system the whole world uses today.',
        deepDive: 'Aryabhata described numbers using a place-value system with each position representing a power of 10, the direct ancestor of the number system you use for every calculation today. This positional idea, combined later with a symbol for zero, is what makes arithmetic with large numbers practical at all -- try doing long division in Roman numerals to see why.',
      },
      {
        id: 'pi-approximation',
        title: 'An Extremely Accurate Value for Pi',
        summary: 'Calculated pi as 62,832/20,000 = 3.1416 -- correct to four decimal places, remarkable for the 5th century.',
        deepDive: 'In the Aryabhatiya, Aryabhata gave a value for pi accurate to four decimal places and explicitly noted it was an approximation ("asanna"), not an exact value -- a strikingly modern, honest way to present a number we now know is irrational.',
      },
      {
        id: 'sine-table',
        title: 'The First Trigonometric Sine Table',
        summary: 'Built the earliest known table of sine values, calling it "ardha-jya" (half-chord) -- the direct ancestor of the word "sine".',
        deepDive: 'Aryabhata computed 24 sine values at regular angle intervals, the earliest known sine table in history. His term "jya" for half-chord was later mistranslated through Arabic and Latin into "sinus" -- which is exactly where the modern word "sine" comes from.',
      },
    ],
    credit: { source: 'Wikimedia Commons', author: 'Mukerjee', license: 'Public Domain', url: 'https://commons.wikimedia.org/wiki/File:2064_aryabhata-crp.jpg' },
  },
  {
    id: 'brahmagupta',
    name: 'Brahmagupta',
    years: '598 - 668 CE',
    imageSrc: '/mathhistory/brahmagupta.jpg',
    imageAlt: 'A modern relief sculpture of Brahmagupta with zero and negative-number symbols, Shaheedi Park, Delhi',
    imageNote: 'No contemporary portrait of Brahmagupta survives -- this is a modern relief sculpture built as a tribute, not a historical likeness.',
    intro: 'Brahmagupta was the first mathematician known to treat zero as a number in its own right, with its own rules -- not just a placeholder or "nothing".',
    achievements: [
      {
        id: 'zero-rules',
        title: 'Rules for Zero',
        summary: 'Wrote down explicit rules for adding, subtracting, and multiplying with zero, including that a number multiplied by zero is zero.',
        deepDive: 'In his book Brahmasphutasiddhanta (628 CE), Brahmagupta laid out rules including "a number multiplied by zero is zero" and "zero divided by zero is zero" (this second one, we now know, is actually undefined -- a rare miss in an otherwise groundbreaking framework). Treating zero as a full number with defined behavior, not just an empty placeholder, was a genuine conceptual leap.',
      },
      {
        id: 'negative-numbers',
        title: 'Rules for Negative Numbers',
        summary: 'Described negative numbers as "debts" and positive numbers as "fortunes", with correct rules for adding and multiplying them.',
        deepDive: 'Brahmagupta explained negative numbers using the language of debt and fortune in accounting -- a debt plus a fortune of the same size cancels to zero, a debt times a debt is a fortune -- rules that exactly match how we still teach signed-number arithmetic today, over 1,300 years later.',
      },
      {
        id: 'cyclic-quadrilateral',
        title: "Brahmagupta's Formula",
        summary: 'Discovered a formula for the area of a cyclic quadrilateral (a four-sided shape inscribed in a circle) using only its side lengths.',
        deepDive: 'Brahmagupta\'s formula finds the area of any four-sided shape inscribed in a circle directly from its four side lengths, without needing to know any of its angles -- a genuinely elegant result that generalizes the ancient Greek Heron\'s formula for triangle area.',
      },
    ],
    credit: { source: 'Wikimedia Commons', author: 'Pur 0 0', license: 'CC0 1.0', url: 'https://commons.wikimedia.org/wiki/File:Bas-relief_of_Brahmagupta.jpg' },
  },
  {
    id: 'bhaskara-ii',
    name: 'Bhaskara II',
    years: '1114 - 1185 CE',
    imageSrc: '/mathhistory/bhaskara.jpg',
    imageAlt: 'A modern illustrated portrait of Bhaskara II',
    imageNote: 'No contemporary portrait of Bhaskara II survives -- this is a modern illustration built as a tribute, not a historical likeness.',
    intro: 'Bhaskara II (also called Bhaskaracharya, "Bhaskara the Teacher") wrote the Siddhanta Shiromani, a four-part masterwork covering arithmetic, algebra, astronomy, and spherical geometry.',
    achievements: [
      {
        id: 'lilavati',
        title: 'Lilavati -- Arithmetic Made Playful',
        summary: 'Wrote an arithmetic textbook, Lilavati, that taught real mathematics through poetic, story-like word problems.',
        deepDive: 'Lilavati -- part of the Siddhanta Shiromani -- covers definitions, interest calculations, progressions, geometry, and combinatorics, but does it through charming, story-like verse problems rather than dry rules, a teaching style still admired today for making difficult ideas approachable.',
      },
      {
        id: 'instantaneous-motion',
        title: 'An Early Idea Resembling Calculus',
        summary: 'Described "instantaneous motion" -- looking at a planet\'s position over an infinitely small interval of time -- centuries before Newton and Leibniz.',
        deepDive: 'In his astronomical work, Bhaskara II developed the idea of "tatkalika-gati" (instantaneous motion): to know a planet\'s speed at one exact moment, you consider an infinitely small slice of time around it. That is conceptually very close to what a derivative measures in calculus -- developed roughly 500 years before Newton and Leibniz independently formalized calculus in the 17th century.',
      },
      {
        id: 'second-pythagoras-proof',
        title: 'A Second Proof of the Pythagoras Theorem',
        summary: 'Gave his own original geometric proof of the Pythagoras Theorem, different from the classical Greek proof.',
        deepDive: 'Bhaskara II\'s proof rearranges the same right triangle into a square in a different way than the classical proof does, arriving at a^2 + b^2 = c^2 through a distinct geometric argument -- a reminder that a true theorem can often be proven correctly in more than one legitimate way.',
      },
    ],
    credit: { source: 'Wikimedia Commons', author: 'Marcelo Uva', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Bhaskara_Akaria.jpg' },
  },
  {
    id: 'ramanujan',
    name: 'Srinivasa Ramanujan',
    years: '1887 - 1920 CE',
    imageSrc: '/mathhistory/ramanujan.jpg',
    imageAlt: 'A historical photograph of Srinivasa Ramanujan',
    imageNote: 'Ramanujan lived in the photographic era -- this is a genuine historical photograph, not a modern artistic tribute.',
    intro: 'With almost no formal training, Ramanujan independently compiled thousands of original mathematical results -- and mathematicians are still finding uses for them over a century later.',
    achievements: [
      {
        id: 'infinite-series',
        title: 'Astonishing Infinite Series',
        summary: 'Discovered highly efficient infinite series for calculating pi, some of which are still used in modern computer algorithms today.',
        deepDive: 'Ramanujan found infinite series that converge on the value of pi far faster than earlier methods -- some of his series-based techniques are still the basis of algorithms used to compute pi to trillions of digits on modern computers.',
      },
      {
        id: 'partition-function',
        title: 'The Partition Function',
        summary: 'Made major breakthroughs (with G. H. Hardy) in understanding "partitions" -- the number of ways a whole number can be broken into sums.',
        deepDive: 'A "partition" of a number counts every way it can be written as a sum of positive integers (for example, 4 = 4, or 3+1, or 2+2, or 2+1+1, or 1+1+1+1 -- five partitions). Ramanujan and Hardy developed a formula to closely estimate how fast the number of partitions grows for large numbers, a foundational result in number theory.',
      },
      {
        id: 'taxicab-number',
        title: 'The Taxicab Number 1729',
        summary: 'Instantly recognized 1729 as the smallest number expressible as a sum of two cubes in two different ways -- while lying ill in a hospital bed.',
        deepDive: 'The mathematician G. H. Hardy visited Ramanujan in hospital and mentioned his taxi\'s number, 1729, calling it "rather a dull number." Ramanujan immediately replied it was actually a fascinating number -- the smallest one expressible as the sum of two cubes in two different ways: 1729 = 1^3 + 12^3 = 9^3 + 10^3. Numbers with this property are now called "taxicab numbers" in his honour.',
      },
    ],
    credit: { source: 'Wikimedia Commons', author: 'Unknown, via French Wikipedia', license: 'Public Domain (PD-1923)', url: 'https://commons.wikimedia.org/wiki/File:Srinivasa_Ramanujan.jpg' },
  },
];
