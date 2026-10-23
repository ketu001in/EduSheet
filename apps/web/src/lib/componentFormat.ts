// Shared, locale-PINNED number formatting for Electronics Lab component
// specs. Two real bugs this fixes, both caught live while verifying the
// drawer UI:
//  1. `.toLocaleString()` with no locale argument uses the RUNTIME's
//     default locale -- which can genuinely differ between the Node.js
//     server (during SSR) and the browser (during hydration), producing
//     a different formatted string in each and triggering a real React
//     hydration-mismatch error. Pinning 'en-US' explicitly on both sides
//     removes the ambiguity entirely.
//  2. Always converting capacitance to microfarads made small ceramic
//     values round to display as "0 µF" (100 picofarad = 0.0001
//     microfarad, which most locale formatters round away) -- fixed by
//     picking picofarad/nanofarad/microfarad based on the real
//     magnitude, the same way a real datasheet would.
export function formatOhms(ohms: number): string {
  return `${ohms.toLocaleString('en-US')} Ω`;
}

export function formatFarads(farads: number): string {
  if (farads < 1e-9) return `${(farads * 1e12).toLocaleString('en-US')} pF`;
  if (farads < 1e-6) return `${(farads * 1e9).toLocaleString('en-US')} nF`;
  return `${(farads * 1e6).toLocaleString('en-US')} µF`;
}
