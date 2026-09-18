// Pure logic for Biology Lab -- no physics-style equations here (biology
// doesn't have one), but every function is still the real, standard,
// hand-verified textbook result for that topic: real Mendelian genetics
// combinatorics, the real direction water moves during osmosis, a real
// (if simplified) model of what focusing a microscope actually does.
// Framework-free (no React/DOM), safe to unit-test in isolation -- same
// discipline as physicsEngine.ts.

// ---------------------------------------------------------------------------
// Microscope focus
// ---------------------------------------------------------------------------
// A real microscope only shows a sharp image at one precise focus distance;
// this models that as a Gaussian falloff around a hidden "ideal" focus
// value the student has to discover by turning the knob -- same as a real
// microscope, where you don't know the right position in advance either.
export function microscopeClarity(focus: number, idealFocus = 50, sigma = 12): number {
  const diff = focus - idealFocus;
  return Math.exp(-(diff * diff) / (2 * sigma * sigma));
}

// ---------------------------------------------------------------------------
// Osmosis
// ---------------------------------------------------------------------------
export interface OsmosisParams {
  cellConcentration: number;
  solutionConcentration: number;
}

// A cell's own internal solute concentration, used as the fixed baseline
// every osmosis experiment's adjustable solution is compared against.
export const CELL_BASELINE_CONCENTRATION = 300;

export type OsmosisDirection = 'swells' | 'shrinks' | 'no-change';

// Water moves from LOWER solute concentration to HIGHER solute
// concentration -- if the surrounding solution is more concentrated than
// the cell (hypertonic), water leaves the cell and it shrinks; if less
// concentrated (hypotonic), water enters and it swells.
export function osmosisDirection(p: OsmosisParams): OsmosisDirection {
  if (p.solutionConcentration > p.cellConcentration) return 'shrinks';
  if (p.solutionConcentration < p.cellConcentration) return 'swells';
  return 'no-change';
}

// Target visual size scale factor (1.0 = original size) for animating the
// specimen toward its new equilibrium size, capped to a believable range.
export function osmosisTargetSizeFactor(p: OsmosisParams): number {
  const diff = p.solutionConcentration - p.cellConcentration;
  const maxDiff = 700;
  const clamped = Math.max(-maxDiff, Math.min(maxDiff, diff));
  return 1 - (clamped / maxDiff) * 0.3;
}

// ---------------------------------------------------------------------------
// Punnett square (monohybrid cross)
// ---------------------------------------------------------------------------
export type Allele = 'T' | 't';

// 0 = homozygous recessive (tt), 1 = heterozygous (Tt), 2 = homozygous
// dominant (TT) -- matches the paramConfig choices in the Punnett
// experiment's curated data.
export interface PunnettParams {
  parent1Genotype: number;
  parent2Genotype: number;
}

export function gametesFor(genotype: number): [Allele, Allele] {
  if (genotype <= 0) return ['t', 't'];
  if (genotype >= 2) return ['T', 'T'];
  return ['T', 't'];
}

export interface PunnettCombo {
  genotype: 'TT' | 'Tt' | 'tt';
  dominant: boolean;
}

export interface PunnettResult {
  // 4 combinations, row-major: parent1's two possible gametes across
  // parent2's two possible gametes -- exactly what a real 2x2 Punnett
  // square grid lays out.
  combos: PunnettCombo[];
  genotypeCounts: Record<string, number>;
  tallCount: number;
  shortCount: number;
}

// Pure combinatorics, not a guess: each parent contributes exactly one
// allele per gene, so laying out every combination of "which allele from
// each parent" gives all 4 equally-likely outcomes.
export function punnettSquare(p: PunnettParams): PunnettResult {
  const g1 = gametesFor(p.parent1Genotype);
  const g2 = gametesFor(p.parent2Genotype);
  const combos: PunnettCombo[] = g1.flatMap((a) =>
    g2.map((b) => {
      const dominant = a === 'T' || b === 'T';
      const genotype: PunnettCombo['genotype'] = a === b ? (a === 'T' ? 'TT' : 'tt') : 'Tt';
      return { genotype, dominant };
    })
  );
  const genotypeCounts: Record<string, number> = {};
  combos.forEach((c) => { genotypeCounts[c.genotype] = (genotypeCounts[c.genotype] || 0) + 1; });
  const tallCount = combos.filter((c) => c.dominant).length;
  return { combos, genotypeCounts, tallCount, shortCount: 4 - tallCount };
}
