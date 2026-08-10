// Vedic Mathematics -- Phase 3 of Math Lab.
//
// AN IMPORTANT HISTORICAL NOTE, stated up front because this app never
// overclaims a source: "Vedic Mathematics" as a named system was compiled
// and published in 1965 by Swami Bharati Krishna Tirtha (1884-1960), who
// described the 16 sutras (word-formulae) here as reconstructed from his
// own study of the Vedas between 1911 and 1918. Independent historians and
// Sanskrit scholars have not been able to locate these specific sutras in
// any known Vedic text -- so while the arithmetic techniques themselves are
// completely real, verified, and often genuinely fast, calling them
// "ancient" or "from the Vedas" in a strict historical sense is disputed.
// This app presents them honestly: as a real, useful mental-math system
// from 20th-century India, named after and inspired by the Vedic
// tradition, not as independently-verified ancient artifacts.
export const VEDIC_MATH_HISTORICITY_NOTE =
  'A note on the name: these 16 sutras were compiled and published in 1965 by Swami Bharati Krishna Tirtha, who described them as reconstructed from the Vedas during his own study between 1911 and 1918. Independent scholars have not been able to locate these specific sutras in any known Vedic text -- so while the arithmetic techniques below are completely real and verified, calling them literally "ancient" is disputed. What follows is a genuine, fast mental-math system from 20th-century India, honestly presented as that rather than as an independently-verified ancient artifact.';

export interface VedicSutra {
  id: string;
  sanskrit: string;
  transliteration: string;
  translation: string;
  description: string;
  usedFor: string;
  gradeBand: 'middle' | 'senior';
}

export const VEDIC_SUTRAS: VedicSutra[] = [
  {
    id: 'ekadhikena-purvena',
    sanskrit: 'एकाधिकेन पूर्वेण',
    transliteration: 'Ekadhikena Purvena',
    translation: 'By one more than the previous one',
    description: 'Squares any number ending in 5 in two quick multiplications instead of a full long multiplication.',
    usedFor: 'Squaring numbers ending in 5 (like 25, 45, 85, or even 105)',
    gradeBand: 'middle',
  },
  {
    id: 'urdhva-tiryagbhyam',
    sanskrit: 'ऊर्ध्वतिर्यग्भ्याम्',
    transliteration: 'Urdhva-Tiryagbhyam',
    translation: 'Vertically and crosswise',
    description: 'A general two-digit multiplication method -- multiply straight down each side, then crosswise, then combine with carries. Works for any two-digit numbers, not just special cases.',
    usedFor: 'Multiplying any two two-digit numbers',
    gradeBand: 'middle',
  },
  {
    id: 'nikhilam',
    sanskrit: 'निखिलं नवतश्चरमं दशतः',
    transliteration: 'Nikhilam Navatashcaramam Dashatah',
    translation: 'All from 9 and the last from 10',
    description: 'Multiplies two numbers that are both close to a round base (like 100) using how far short of that base each one is, instead of multiplying the full numbers directly.',
    usedFor: 'Multiplying two numbers both close to a power of 10 (like 96 x 97, or 88 x 92)',
    gradeBand: 'senior',
  },
];
