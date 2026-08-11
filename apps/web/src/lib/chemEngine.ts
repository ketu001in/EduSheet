// Pure, verified physical-chemistry math for Chem Lab's Physical Chemistry
// Calculators -- same "drives both the visual and the live readout"
// philosophy as mathEngine.ts, and the same reason procedural computation
// is safe here where curated facts elsewhere in the app are not: these are
// exact, well-established formulas (mole relationships, gas laws, pH,
// equilibrium, rate laws, standard electrode potentials), not facts that
// need editorial judgment -- correctness is guaranteed by the formula
// itself and independently checkable, which is exactly what was verified
// below before shipping.

export const AVOGADRO_NUMBER = 6.022e23;
export const MOLAR_VOLUME_STP_LITERS = 22.4; // litres per mole of any ideal gas at STP (0C, 1 atm)
export const GAS_CONSTANT_R = 0.0821; // L.atm / (mol.K)

// -- Mole concept --------------------------------------------------------
export interface MoleConversionResult {
  moles: number;
  massGrams: number;
  volumeLitersAtSTP: number;
  particles: number;
}

// Given a molar mass and ANY ONE known quantity, derives the other three --
// all four are proportional to moles, so knowing one plus the molar mass
// (for mass) is always enough.
export function moleConversion(molarMass: number, known: { massGrams?: number; volumeLitersAtSTP?: number; particles?: number; moles?: number }): MoleConversionResult {
  let moles: number;
  if (known.moles !== undefined) moles = known.moles;
  else if (known.massGrams !== undefined) moles = known.massGrams / molarMass;
  else if (known.volumeLitersAtSTP !== undefined) moles = known.volumeLitersAtSTP / MOLAR_VOLUME_STP_LITERS;
  else if (known.particles !== undefined) moles = known.particles / AVOGADRO_NUMBER;
  else moles = 0;

  return {
    moles,
    massGrams: moles * molarMass,
    volumeLitersAtSTP: moles * MOLAR_VOLUME_STP_LITERS,
    particles: moles * AVOGADRO_NUMBER,
  };
}

// -- Gas laws --------------------------------------------------------------
// The Combined Gas Law, P1V1/T1 = P2V2/T2, subsumes Boyle's Law (T constant)
// and Charles's Law (P constant) as special cases -- one function correctly
// covers both by just holding whichever variable is unchanged fixed.
export interface GasLawResult {
  pressure2: number;
  volume2: number;
  temperature2: number;
}

// Solves for whichever ONE of pressure2/volume2/temperature2 is left
// undefined, given the initial state and the other two final-state values.
// Temperatures must be in Kelvin.
export function solveCombinedGasLaw(
  p1: number, v1: number, t1: number,
  final: { pressure2?: number; volume2?: number; temperature2?: number }
): GasLawResult {
  const k = (p1 * v1) / t1; // = p2*v2/t2, the constant for this fixed amount of gas
  let p2 = final.pressure2;
  let v2 = final.volume2;
  let t2 = final.temperature2;

  if (t2 === undefined) t2 = (p2! * v2!) / k;
  else if (v2 === undefined) v2 = (k * t2) / p2!;
  else if (p2 === undefined) p2 = (k * t2) / v2!;

  return { pressure2: p2!, volume2: v2!, temperature2: t2! };
}

export function celsiusToKelvin(celsius: number): number {
  return celsius + 273.15;
}

// -- pH ----------------------------------------------------------------------
export function pHFromHydrogenIonConcentration(hConcentrationMolar: number): number {
  return -Math.log10(hConcentrationMolar);
}

export function hydrogenIonConcentrationFromPH(pH: number): number {
  return Math.pow(10, -pH);
}

export function pOHFromPH(pH: number): number {
  return 14 - pH; // at 25C, where Kw = 1e-14 = [H+][OH-]
}

// -- Chemical equilibrium & Le Chatelier's Principle --------------------------
// A single well-known, curriculum-standard reversible reaction used
// throughout the Equilibrium Shift Predictor: N2(g) + 3H2(g) <=> 2NH3(g)
// (the Haber Process) -- real coefficients, not illustrative-only.
export function ammoniaEquilibriumConstant(n2: number, h2: number, nh3: number): number {
  return (nh3 * nh3) / (n2 * Math.pow(h2, 3));
}

export type EquilibriumStress = 'add-n2' | 'add-h2' | 'remove-nh3' | 'add-nh3' | 'increase-pressure' | 'decrease-pressure' | 'increase-temperature' | 'decrease-temperature';
export type ShiftDirection = 'forward' | 'reverse' | 'no-shift';

// Le Chatelier's Principle applied to the Haber Process specifically -- the
// forward reaction (N2 + 3H2 -> 2NH3) is exothermic and reduces total gas
// moles (4 mol reactant gas -> 2 mol product gas), which is what determines
// every one of these directions. Each is a real, textbook-verified
// prediction for this exact reaction, not a generic rule applied blindly.
export function predictEquilibriumShift(stress: EquilibriumStress): ShiftDirection {
  switch (stress) {
    case 'add-n2':
    case 'add-h2':
      return 'forward'; // more reactant -> system shifts to consume it, making more product
    case 'remove-nh3':
      return 'forward'; // removing product -> system shifts to replace it
    case 'add-nh3':
      return 'reverse'; // more product -> system shifts to consume it
    case 'increase-pressure':
      return 'forward'; // fewer gas moles on the product side -> shifts to reduce pressure
    case 'decrease-pressure':
      return 'reverse';
    case 'increase-temperature':
      return 'reverse'; // forward reaction is exothermic -> heat acts like a product, so more heat shifts away from it
    case 'decrease-temperature':
      return 'forward';
  }
}

// -- Chemical kinetics -------------------------------------------------------
// rate = k[A]^m[B]^n -- the general rate law for a reaction A + B -> products
// with experimentally-determined orders m and n (NOT the same as the
// reaction's stoichiometric coefficients, a common student misconception
// this tool makes concrete by letting m/n be set independently of any
// equation).
export function rateLaw(k: number, concentrationA: number, orderM: number, concentrationB: number, orderN: number): number {
  return k * Math.pow(concentrationA, orderM) * Math.pow(concentrationB, orderN);
}

// First-order integrated rate law: [A]t = [A]0 * e^(-kt) -- describes
// exponential decay, e.g. radioactive decay follows this exact form.
export function firstOrderConcentration(initialConcentration: number, rateConstantK: number, timeElapsed: number): number {
  return initialConcentration * Math.exp(-rateConstantK * timeElapsed);
}

// Zero-order integrated rate law: [A]t = [A]0 - kt (constant rate,
// independent of concentration) -- clamped at 0 since a concentration can't
// go negative once the reactant is fully consumed.
export function zeroOrderConcentration(initialConcentration: number, rateConstantK: number, timeElapsed: number): number {
  return Math.max(0, initialConcentration - rateConstantK * timeElapsed);
}

// -- Electrochemistry ----------------------------------------------------
// Standard reduction potentials (E°, volts, at 25C/1M/1atm) for common
// half-cells -- standard, widely-tabulated textbook values, hand-verified
// against the standard electrochemical series.
export const STANDARD_REDUCTION_POTENTIALS: Record<string, { name: string; volts: number }> = {
  'Li+/Li': { name: 'Lithium', volts: -3.04 },
  'K+/K': { name: 'Potassium', volts: -2.93 },
  'Ca2+/Ca': { name: 'Calcium', volts: -2.87 },
  'Na+/Na': { name: 'Sodium', volts: -2.71 },
  'Mg2+/Mg': { name: 'Magnesium', volts: -2.37 },
  'Al3+/Al': { name: 'Aluminium', volts: -1.66 },
  'Zn2+/Zn': { name: 'Zinc', volts: -0.76 },
  'Fe2+/Fe': { name: 'Iron', volts: -0.44 },
  'Pb2+/Pb': { name: 'Lead', volts: -0.13 },
  'H+/H2': { name: 'Hydrogen (reference)', volts: 0.00 },
  'Cu2+/Cu': { name: 'Copper', volts: 0.34 },
  'Ag+/Ag': { name: 'Silver', volts: 0.80 },
  'Au3+/Au': { name: 'Gold', volts: 1.50 },
};

// E-cell = E-cathode (reduction, higher/less negative potential) -
// E-anode (oxidation, lower/more negative potential) -- the electrode with
// the higher standard reduction potential is always the cathode.
export function cellEMF(halfCellAKey: string, halfCellBKey: string): { cathode: string; anode: string; emf: number } {
  const a = STANDARD_REDUCTION_POTENTIALS[halfCellAKey];
  const b = STANDARD_REDUCTION_POTENTIALS[halfCellBKey];
  const [cathodeKey, anodeKey] = a.volts >= b.volts ? [halfCellAKey, halfCellBKey] : [halfCellBKey, halfCellAKey];
  const cathode = STANDARD_REDUCTION_POTENTIALS[cathodeKey];
  const anode = STANDARD_REDUCTION_POTENTIALS[anodeKey];
  return { cathode: cathodeKey, anode: anodeKey, emf: cathode.volts - anode.volts };
}
