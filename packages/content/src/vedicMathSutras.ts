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
  {
    id: 'antyayordashake',
    sanskrit: "अन्त्ययोर्दशकेऽपि",
    transliteration: "Antyayordashake'pi",
    translation: 'Also when the last digits total ten',
    description: 'Multiplies two 2-digit numbers that share the same tens digit, when their units digits add up to exactly 10 -- in two quick multiplications instead of a full long multiplication.',
    usedFor: 'Multiplying two 2-digit numbers with the same tens digit and units digits summing to 10 (like 23 x 27, or 41 x 49)',
    gradeBand: 'middle',
  },
  {
    id: 'yavadunam',
    sanskrit: 'यावदूनं तावदूनीकृत्य वर्गं च योजयेत्',
    transliteration: 'Yavadunam Tavadunikritya Vargam Cha Yojayet',
    translation: 'Whatever the deficiency, lessen further by that amount, and also set up the square of the deficiency',
    description: 'Squares any number close to a round base (like 100), by adjusting for how far it is above or below that base -- instead of multiplying the whole number by itself directly.',
    usedFor: 'Squaring any number close to a power of 10 (like 98 squared, or 104 squared)',
    gradeBand: 'senior',
  },
  {
    id: 'ekanyunena-purvena',
    sanskrit: 'एकन्यूनेन पूर्वेण',
    transliteration: 'Ekanyunena Purvena',
    translation: 'By one less than the previous one',
    description: 'Multiplies any number by a string of 9s (9, 99, 999...) in two quick steps, using one less than the number and its complement, instead of a full long multiplication.',
    usedFor: 'Multiplying any number by 9, 99, or 999 (like 43 x 99, or 7 x 999)',
    gradeBand: 'middle',
  },
];
