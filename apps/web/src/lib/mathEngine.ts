// Pure geometry math for Math Lab's Geometry Explorer -- framework-free, so
// it's independently testable and reused by every construction (triangle
// angle-sum, circle theorems, etc.) rather than each component rolling its
// own trig. Same "pure function drives both the animation and the live
// readout" philosophy as physicsEngine.ts and biologyEngine.ts.

export interface Point {
  x: number;
  y: number;
}

export function distance(p1: Point, p2: Point): number {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

// Interior angle in degrees at `vertex`, formed by the rays to `prev` and
// `next`. Returns 0 for a degenerate (zero-length) side rather than NaN, so
// a construction never crashes if two points briefly coincide mid-drag.
export function angleAtVertex(prev: Point, vertex: Point, next: Point): number {
  const v1 = { x: prev.x - vertex.x, y: prev.y - vertex.y };
  const v2 = { x: next.x - vertex.x, y: next.y - vertex.y };
  const mag1 = Math.hypot(v1.x, v1.y);
  const mag2 = Math.hypot(v2.x, v2.y);
  if (mag1 === 0 || mag2 === 0) return 0;
  const cosAngle = Math.min(1, Math.max(-1, (v1.x * v2.x + v1.y * v2.y) / (mag1 * mag2)));
  return (Math.acos(cosAngle) * 180) / Math.PI;
}

export function triangleAngles(a: Point, b: Point, c: Point): { A: number; B: number; C: number } {
  return {
    A: angleAtVertex(c, a, b),
    B: angleAtVertex(a, b, c),
    C: angleAtVertex(b, c, a),
  };
}

// A point on a circle of given radius/center at `angleDeg` (standard SVG
// convention: 0 degrees points right (+x), increasing clockwise since SVG's
// y-axis points down).
export function pointOnCircle(center: Point, radius: number, angleDeg: number): Point {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: center.x + radius * Math.cos(rad), y: center.y + radius * Math.sin(rad) };
}

// The angle (0-360, standard SVG convention) of point `p` as seen from
// `center`.
export function angleOf(center: Point, p: Point): number {
  const deg = (Math.atan2(p.y - center.y, p.x - center.x) * 180) / Math.PI;
  return (deg + 360) % 360;
}

// Keeps a candidate angle out of a forbidden (start, end) range (start <
// end, non-wrapping) by snapping it just outside whichever boundary it's
// closer to -- used so a draggable point on a circle can never land exactly
// on (or between) two fixed reference points, which would otherwise create
// a degenerate, zero-area triangle.
// -- Numeric helpers for Math Lab's Guided Experiments (divide/euclidean/
// progression/quadratic/probability/graph simTypes) -- pure functions, same
// "drives both the visual and the live readout" philosophy as the geometry
// helpers above.

export interface EuclideanStep {
  dividend: number;
  divisor: number;
  quotient: number;
  remainder: number;
}

// The real Euclidean Algorithm: repeatedly replace (dividend, divisor) with
// (divisor, dividend mod divisor) until the remainder is 0. The last
// non-zero divisor is the HCF.
export function euclideanSteps(a: number, b: number): { steps: EuclideanStep[]; hcf: number } {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  const steps: EuclideanStep[] = [];
  let guard = 0;
  while (y !== 0 && guard < 100) {
    guard++;
    const quotient = Math.floor(x / y);
    const remainder = x % y;
    steps.push({ dividend: x, divisor: y, quotient, remainder });
    x = y;
    y = remainder;
  }
  return { steps, hcf: x || 1 };
}

export function lcmFromHcf(a: number, b: number, hcf: number): number {
  if (hcf === 0) return 0;
  return Math.abs(Math.round(a) * Math.round(b)) / hcf;
}

export interface QuadraticResult {
  discriminant: number;
  roots: number[]; // 0, 1, or 2 real roots
}

export function solveQuadratic(a: number, b: number, c: number): QuadraticResult {
  if (a === 0) return { discriminant: NaN, roots: [] };
  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) return { discriminant, roots: [] };
  if (discriminant === 0) return { discriminant, roots: [-b / (2 * a)] };
  const sqrtD = Math.sqrt(discriminant);
  return { discriminant, roots: [(-b - sqrtD) / (2 * a), (-b + sqrtD) / (2 * a)] };
}

// Ways to roll each possible sum with two standard six-sided dice, out of
// 36 equally likely (die1, die2) combinations -- hand-verified, not
// computed at runtime, so it's trivially checkable against a real dice
// table.
export const DICE_SUM_WAYS: Record<number, number> = {
  2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 5, 9: 4, 10: 3, 11: 2, 12: 1,
};

// -- Helpers for Geometry Explorer's new constructions (Basic
// Proportionality Theorem, Parallelogram diagonals, Coordinate Geometry) --

export function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

// The point dividing segment A->B in the ratio t : (1-t), i.e. the Section
// Formula's internal-division point for m:n = t:(1-t). t=0 gives A, t=1
// gives B, t=0.5 gives the midpoint -- the standard parametric form of the
// section formula used throughout CBSE/ICSE coordinate geometry.
export function sectionPoint(a: Point, b: Point, t: number): Point {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

// Projects point `p` onto the segment A->B and returns the parameter t in
// [0,1] of the closest point on that segment -- used to let a student "drag
// a point along a side" (e.g. the Basic Proportionality Theorem's point D
// on side AB) while keeping it constrained to the segment, the same
// dynamic-geometry-software convention GeoGebra uses for a point-on-object.
export function projectOntoSegment(p: Point, a: Point, b: Point): number {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const lenSq = abx * abx + aby * aby;
  if (lenSq === 0) return 0;
  const t = ((p.x - a.x) * abx + (p.y - a.y) * aby) / lenSq;
  return Math.min(1, Math.max(0, t));
}

// Real trial-division prime factorization -- used by Theorem Corner's
// Fundamental Theorem of Arithmetic visual (a live-computed factor tree,
// not a pre-baked example image). Returns the prime factors in
// non-decreasing order, e.g. primeFactorize(60) -> [2, 2, 3, 5].
export function primeFactorize(n: number): number[] {
  let x = Math.max(2, Math.round(Math.abs(n)));
  const factors: number[] = [];
  let divisor = 2;
  while (divisor * divisor <= x) {
    while (x % divisor === 0) {
      factors.push(divisor);
      x /= divisor;
    }
    divisor++;
  }
  if (x > 1) factors.push(x);
  return factors;
}

export function keepAngleOutsideRange(angleDeg: number, start: number, end: number, buffer = 4): number {
  // Strict < / > (not <=/>=) so landing EXACTLY on `start` or `end` still
  // counts as forbidden and gets pushed out too -- otherwise a point could
  // coincide exactly with a fixed reference point, collapsing a triangle
  // to zero area (angleAtVertex has its own zero-length guard, but it's
  // better not to rely on that as the only safety net here).
  if (angleDeg < start || angleDeg > end) return angleDeg;
  const midpoint = (start + end) / 2;
  return angleDeg < midpoint ? start - buffer : end + buffer;
}
