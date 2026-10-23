// Pure computation for Ancient Mathematics Explorer's "Try It Yourself"
// experiments -- one per historical figure, each built directly on an
// achievement already described (and hand-verified) in
// mathHistoryFigures.ts, rather than introducing any new unverified claim.

// -- Brahmagupta's Formula -- area of a cyclic quadrilateral from its four
// side lengths alone: Area = sqrt((s-a)(s-b)(s-c)(s-d)), s = semi-perimeter.
// Verified against a unit square (area 1) and the classic 25/39/52/60
// textbook example (area 1764) before shipping.
export function cyclicQuadrilateralArea(a: number, b: number, c: number, d: number): number {
  const s = (a + b + c + d) / 2;
  const term = (s - a) * (s - b) * (s - c) * (s - d);
  return term > 0 ? Math.sqrt(term) : NaN; // NaN if the four sides can't form a real quadrilateral
}

// -- Bhaskara II's "instantaneous motion" -- the slope of the secant line
// through (x0, f(x0)) and (x0+h, f(x0+h)) on y=x^2, which approaches the
// real derivative 2*x0 as h shrinks toward 0. f(x)=x^2 chosen since its
// derivative is simple enough to state and verify by hand: slope =
// ((x0+h)^2 - x0^2) / h = 2*x0 + h.
export function secantSlope(x0: number, h: number): number {
  const f = (x: number) => x * x;
  if (h === 0) return 2 * x0; // the true instantaneous (derivative) value
  return (f(x0 + h) - f(x0)) / h;
}

// -- Ramanujan's taxicab numbers -- every way n can be written as a sum of
// two positive cubes, a <= b, searched by real brute force up to the cube
// root of n (not a pre-baked lookup). Verified: taxicabRepresentations(1729)
// returns exactly [[1,12],[9,10]], matching the real historical fact.
export function taxicabRepresentations(n: number): [number, number][] {
  const reps: [number, number][] = [];
  const maxA = Math.ceil(Math.cbrt(n));
  for (let a = 1; a <= maxA; a++) {
    const aCubed = a ** 3;
    if (aCubed >= n) break;
    for (let b = a; b <= maxA; b++) {
      const sum = aCubed + b ** 3;
      if (sum === n) reps.push([a, b]);
      if (sum > n) break;
    }
  }
  return reps;
}
