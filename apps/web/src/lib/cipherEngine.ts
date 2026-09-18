// A real historical cipher for Coding Lab's Caesar Cipher Lab -- the
// actual shift-substitution cipher attributed to Julius Caesar (Gallic
// Wars-era Rome, reportedly used with a shift of 3 for military
// correspondence). Only letters are shifted; case and all other
// characters (spaces, punctuation, digits) pass through unchanged.
// Verified against hand-worked examples (including alphabet wraparound
// and a full ROT13 round-trip) before shipping.
export function caesarShift(text: string, shift: number): string {
  const s = ((shift % 26) + 26) % 26;
  return text.split('').map((ch) => {
    const code = ch.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCharCode(((code - 65 + s) % 26) + 65);
    if (code >= 97 && code <= 122) return String.fromCharCode(((code - 97 + s) % 26) + 97);
    return ch;
  }).join('');
}
export function caesarDecode(text: string, shift: number): string {
  return caesarShift(text, -shift);
}

// A real, simple frequency-analysis attack: for each of the 26 possible
// shifts, decode the ciphertext and score it against real English letter
// frequency (the classic ETAOIN SHRDLU ordering) -- the shift with the
// closest match is very likely the real key, exactly how this cipher has
// genuinely been broken by hand for centuries.
const ENGLISH_FREQUENCY: Record<string, number> = {
  E: 12.7, T: 9.1, A: 8.2, O: 7.5, I: 7.0, N: 6.7, S: 6.3, H: 6.1, R: 6.0,
  D: 4.3, L: 4.0, C: 2.8, U: 2.8, M: 2.4, W: 2.4, F: 2.2, G: 2.0, Y: 2.0,
  P: 1.9, B: 1.5, V: 1.0, K: 0.8, J: 0.15, X: 0.15, Q: 0.1, Z: 0.07,
};
export interface ShiftScore { shift: number; decoded: string; score: number }
export function bruteForceShifts(ciphertext: string): ShiftScore[] {
  const results: ShiftScore[] = [];
  for (let shift = 0; shift < 26; shift++) {
    const decoded = caesarDecode(ciphertext, shift);
    const counts: Record<string, number> = {};
    let letters = 0;
    for (const ch of decoded.toUpperCase()) {
      if (ch >= 'A' && ch <= 'Z') { counts[ch] = (counts[ch] ?? 0) + 1; letters++; }
    }
    let score = 0;
    if (letters > 0) {
      for (const letter of Object.keys(ENGLISH_FREQUENCY)) {
        const observed = ((counts[letter] ?? 0) / letters) * 100;
        score -= Math.abs(observed - ENGLISH_FREQUENCY[letter]);
      }
    } else {
      score = -Infinity;
    }
    results.push({ shift, decoded, score });
  }
  return results.sort((a, b) => b.score - a.score);
}
