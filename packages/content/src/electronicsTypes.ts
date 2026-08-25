// Shared types for Electronics Lab -- same discipline as every other lab's
// types.ts: every project, component spec, and circuit here is hand-
// authored and verified against real electronics fundamentals (real
// Ohm's Law, real component thresholds, real 555-timer datasheet
// formulas -- see apps/web/src/lib/circuitEngine.ts), never generated at
// request time. IMPORTANT HONESTY NOTE, stated up front the same way
// Vedic Maths states its own: this lab simulates real DC circuit
// behavior (connectivity, Ohm's Law, component thresholds, RC timing)
// but does NOT simulate real analog/RF/transient behavior. Any project
// whose real-world version involves receiving an actual broadcast
// signal (e.g. a radio) plays a pre-loaded, clearly-labeled SIMULATED
// output once the circuit is electrically valid -- it never claims to
// receive a real signal, because a browser genuinely cannot.

export type ElectronicsGradeBandId = 'middle' | 'senior' | 'plusTwo';

export interface ElectronicsGradeBand {
  id: ElectronicsGradeBandId;
  label: string;
  classNumbers: number[];
}

// Electronics/circuits as a hands-on build topic realistically starts
// around Class 6-8 (simple circuits, conductors/insulators) and the
// 555-timer-and-up projects suit Class 9 and above -- narrower band set
// than the other labs since "wire a real breadboard circuit" isn't a
// pre-primary or early-primary activity.
export const ELECTRONICS_GRADE_BANDS: ElectronicsGradeBand[] = [
  { id: 'middle', label: 'Class 6-8', classNumbers: [6, 7, 8] },
  { id: 'senior', label: 'Class 9-10', classNumbers: [9, 10] },
  { id: 'plusTwo', label: 'Class 11-12', classNumbers: [11, 12] },
];

export function electronicsGradeBandForClass(gradeNumber: number): ElectronicsGradeBand {
  return ELECTRONICS_GRADE_BANDS.find((b) => b.classNumbers.includes(gradeNumber)) || ELECTRONICS_GRADE_BANDS[0];
}

// -- Components ---------------------------------------------------------

export type ComponentCategory = 'power' | 'passive' | 'semiconductor' | 'ic' | 'electromechanical' | 'input' | 'wiring' | 'tools';

// The closed vocabulary of component *kinds* the circuit engine knows how
// to model electrically -- a real, small, honestly-scoped set (DC
// steady-state behavior only, see circuitEngine.ts), not "any component
// imaginable". A new project can only use kinds already in this list.
export type ComponentKind =
  | 'battery-9v' | 'battery-6v'
  | 'resistor' | 'capacitor'
  | 'led' | 'diode'
  | 'timer-555'
  | 'switch-spst' | 'switch-spdt' | 'push-button'
  | 'buzzer' | 'dc-motor' | 'motor-servo' | 'motor-stepper' | 'relay'
  | 'breadboard' | 'perfboard' | 'pcb-blank'
  | 'soldering-iron' | 'solder-wire';

// A pin/lead on a component, named the way a real datasheet names it
// (e.g. the 555's 8 pins by their real names) -- the circuit engine's
// topology recognizers match against these exact names.
export interface ComponentPin {
  id: string; // e.g. "anode", "cathode", "pin1-gnd", "pin8-vcc"
  label: string; // human-readable, shown on hover/click
}

export interface ComponentSpec {
  id: string;
  kind: ComponentKind;
  name: string;
  category: ComponentCategory;
  pins: ComponentPin[];
  description: string; // shown in the component info popup
  deepDive: string; // longer real-facts paragraph, same "Deep Dive" pattern as every other lab
  // Real electrical properties used by circuitEngine.ts -- units in SI
  // base units (ohms, farads, volts, amps) unless noted. Optional per
  // kind (a switch has no resistance value, a battery has no
  // capacitance, etc).
  electrical?: {
    voltage?: number; // for sources, in volts
    resistanceOhms?: number; // fixed value for a specific resistor part; adjustable ones set this via the project's placement instead
    capacitanceFarads?: number;
    forwardVoltage?: number; // LEDs/diodes, in volts
    maxCurrentAmps?: number; // LEDs -- the rated safe maximum
  };
  modelHint?: 'box' | 'cylinder' | 'led-dome' | 'ic-dip8' | 'switch-toggle' | 'push-button' | 'motor' | 'servo' | 'stepper' | 'buzzer' | 'relay' | 'breadboard' | 'perfboard' | 'pcb-blank' | 'soldering-iron' | 'solder-spool';
  colorHex?: string; // real, typical color for this part (e.g. a red LED's real dome color)
}

// -- Breadboard / placement ----------------------------------------------

// A position on a standard half-size breadboard: either a strip hole
// (row 1-30, column a-j, with a real center gutter between e and f
// exactly like a physical board) or a power-rail hole. See
// circuitEngine.ts's nodeKeyForPosition() for the real connectivity
// rules this maps to.
export type BreadboardPosition =
  | { row: number; col: 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' }
  | { rail: 'top-pos' | 'top-neg' | 'bottom-pos' | 'bottom-neg' };

export interface ComponentPlacement {
  componentId: string; // references a ComponentSpec.id
  instanceId: string; // unique per placement, in case a project uses two of the same component
  // Where each of the component's pins physically sits on the board.
  pinPositions: Record<string, BreadboardPosition>;
  // Adjustable value for this specific instance (e.g. this project's R1
  // is 1k ohm even though "resistor" as a generic part has no fixed
  // value) -- overrides ComponentSpec.electrical for this placement only.
  valueOverride?: { resistanceOhms?: number; capacitanceFarads?: number };
}

export interface WireConnection {
  id: string;
  from: BreadboardPosition;
  to: BreadboardPosition;
  colorHex: string; // real jumper-wire colors, purely visual, no electrical meaning
}

// The reference solution a project is built against -- the circuit
// engine checks the STUDENT's own wiring for real electrical validity
// (not "did you copy this exact layout"), but this is what's shown in
// the step-by-step circuit diagram and what the project's own preview
// renders.
export interface ReferenceCircuit {
  placements: ComponentPlacement[];
  wires: WireConnection[];
}

// -- Projects -------------------------------------------------------------

export type ElectronicsBranch = 'basic-circuits' | 'timers-oscillators' | 'digital-logic' | 'sensors-signals' | 'motors-actuators';

export interface ElectronicsBuildStep {
  number: number;
  instruction: string;
  // Which placements/wires (by id) this step introduces -- lets the
  // guided build reveal the reference circuit incrementally, matching
  // the "one real, physical wiring action per step" style already used
  // for tech project steps elsewhere in this app.
  addsPlacementIds?: string[];
  addsWireIds?: string[];
  hint?: string;
}

export interface ElectronicsProject {
  id: string;
  title: string;
  branch: ElectronicsBranch;
  gradeBand: ElectronicsGradeBandId;
  board: 'CBSE' | 'ICSE' | 'both' | 'general'; // 'general' = not tied to a specific board chapter, still real electronics
  chapterTags: string[]; // real curriculum chapter names where applicable; empty for 'general' projects
  componentIds: string[]; // which ComponentSpec ids this project's cupboard drawer needs to supply
  referenceCircuit: ReferenceCircuit;
  buildSteps: ElectronicsBuildStep[];
  purpose: string;
  workingModelDescription: string; // what the finished, running circuit actually does
  // The "Force" section the user asked for -- what physical/electrical
  // force or principle is actually at work (e.g. "the RC charge/discharge
  // cycle" or "electromagnetic force in the relay coil").
  forceSection: string;
  realWorldUse: string[];
  // Explicit, honest note for any project whose real-world counterpart
  // does something a browser can't -- e.g. the radio. Omitted for
  // projects with no such gap (most of them).
  simulationHonestyNote?: string;
  extensions: string[];
  safetyNotes: string[];
}
