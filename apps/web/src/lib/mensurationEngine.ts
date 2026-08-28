// Pure mensuration math for Geometry Explorer's 3D Solids construction --
// framework-free, hand-verified against the standard CBSE/ICSE Class 9-10
// mensuration formulas, same "pure function drives both the 3D scene and
// the live readout" philosophy as mathEngine.ts. No solid is ever rendered
// with a made-up proportion -- every dimension on screen traces back to one
// of these functions.

export type SolidType = 'cube' | 'cuboid' | 'cylinder' | 'cone' | 'sphere';

export interface SolidResult {
  volume: number;
  surfaceArea: number;
  volumeFormula: string;
  surfaceAreaFormula: string;
}

// Cube: side a. V = a^3. Total Surface Area = 6a^2 (six equal square faces).
export function cubeMensuration(a: number): SolidResult {
  return {
    volume: a ** 3,
    surfaceArea: 6 * a * a,
    volumeFormula: `${a}³ = ${(a ** 3).toFixed(2)}`,
    surfaceAreaFormula: `6 × ${a}² = ${(6 * a * a).toFixed(2)}`,
  };
}

// Cuboid: length l, width w, height h. V = lwh.
// TSA = 2(lw + wh + hl) (three pairs of matching rectangular faces).
export function cuboidMensuration(l: number, w: number, h: number): SolidResult {
  const volume = l * w * h;
  const surfaceArea = 2 * (l * w + w * h + h * l);
  return {
    volume,
    surfaceArea,
    volumeFormula: `${l} × ${w} × ${h} = ${volume.toFixed(2)}`,
    surfaceAreaFormula: `2(${l}×${w} + ${w}×${h} + ${h}×${l}) = ${surfaceArea.toFixed(2)}`,
  };
}

// Cylinder: radius r, height h. V = pi r^2 h.
// TSA = 2 pi r h + 2 pi r^2 = 2 pi r (r + h) (curved surface + two circular ends).
export function cylinderMensuration(r: number, h: number): SolidResult {
  const volume = Math.PI * r * r * h;
  const surfaceArea = 2 * Math.PI * r * (r + h);
  return {
    volume,
    surfaceArea,
    volumeFormula: `π × ${r}² × ${h} = ${volume.toFixed(2)}`,
    surfaceAreaFormula: `2π × ${r} × (${r} + ${h}) = ${surfaceArea.toFixed(2)}`,
  };
}

// Cone: radius r, height h, slant l = sqrt(r^2 + h^2) (Pythagoras -- the
// slant height is literally the hypotenuse of the radius/height right
// triangle formed by slicing the cone through its axis).
// V = (1/3) pi r^2 h. TSA = pi r l + pi r^2 (curved surface + circular base).
export function coneMensuration(r: number, h: number): SolidResult & { slant: number } {
  const slant = Math.hypot(r, h);
  const volume = (1 / 3) * Math.PI * r * r * h;
  const surfaceArea = Math.PI * r * slant + Math.PI * r * r;
  return {
    volume,
    surfaceArea,
    slant,
    volumeFormula: `(1/3)π × ${r}² × ${h} = ${volume.toFixed(2)}`,
    surfaceAreaFormula: `π × ${r} × ${slant.toFixed(2)} + π × ${r}² = ${surfaceArea.toFixed(2)}`,
  };
}

// Sphere: radius r. V = (4/3) pi r^3. Surface Area = 4 pi r^2.
export function sphereMensuration(r: number): SolidResult {
  const volume = (4 / 3) * Math.PI * r ** 3;
  const surfaceArea = 4 * Math.PI * r * r;
  return {
    volume,
    surfaceArea,
    volumeFormula: `(4/3)π × ${r}³ = ${volume.toFixed(2)}`,
    surfaceAreaFormula: `4π × ${r}² = ${surfaceArea.toFixed(2)}`,
  };
}
