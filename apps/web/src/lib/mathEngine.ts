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
