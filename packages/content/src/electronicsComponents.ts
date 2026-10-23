import { ComponentSpec } from './electronicsTypes';

// The Electronics Lab's full component library -- organized into drawers
// by category (Power, Resistors, Capacitors, Semiconductors, ICs, Input,
// Electromechanical, Wiring), each drawer holding every standard real
// value a real component drawer would: the resistor set below is the
// same E12-derived decade spread found in real beginner resistor kits,
// the capacitor set spans both real families (non-polarized ceramic for
// small values, polarized electrolytic for larger ones), and the LED set
// covers every common real color with its own real, distinct forward
// voltage -- not one generic placeholder part per category.
//
// Two 2-lead parts, one value each: TWO leads, ONE electrical value --
// nothing here is a made-up spec. Resistor color bands are computed live
// from the real resistance value (see circuitEngine.ts's
// resistorColorBands(), verified in a throwaway Node script), not
// hand-typed per item, so they can never drift out of sync with the
// stated value.

const RESISTOR_LEADS = [{ id: 'a', label: 'Lead A' }, { id: 'b', label: 'Lead B' }];

function resistor(ohms: number, label: string): ComponentSpec {
  return {
    id: `resistor-${ohms}`,
    kind: 'resistor',
    name: `${label} Resistor`,
    category: 'passive',
    pins: RESISTOR_LEADS,
    description: `Limits current flow to a fixed ${label}.`,
    deepDive: `A resistor's color bands encode its exact resistance in a real, readable code shared by every resistor ever made -- this one's bands (computed from its real ${label} value) are shown on the 3D model itself.`,
    electrical: { resistanceOhms: ohms },
    modelHint: 'cylinder',
    colorHex: '#D2B48C',
  };
}

function ceramicCapacitor(farads: number, idSuffix: string, label: string): ComponentSpec {
  return {
    id: `cap-ceramic-${idSuffix}`,
    kind: 'capacitor',
    name: `${label} Ceramic Capacitor`,
    category: 'passive',
    pins: [{ id: 'a', label: 'Lead A' }, { id: 'b', label: 'Lead B' }],
    description: `A small, non-polarized capacitor -- ${label}. Either lead can go either way, unlike an electrolytic capacitor.`,
    deepDive: 'Ceramic capacitors have no positive/negative lead -- their internal construction (a ceramic dielectric between two plates) works identically in either direction, which is exactly why they\'re used for small-value, non-polarized roles like high-frequency filtering.',
    electrical: { capacitanceFarads: farads },
    modelHint: 'cylinder',
    colorHex: '#f59e0b',
  };
}

function electrolyticCapacitor(farads: number, idSuffix: string, label: string): ComponentSpec {
  return {
    id: `cap-electro-${idSuffix}`,
    kind: 'capacitor',
    name: `${label} Electrolytic Capacitor`,
    category: 'passive',
    pins: [{ id: 'a', label: 'Positive lead' }, { id: 'b', label: 'Negative lead' }],
    description: `Stores charge and releases it over time -- ${label}, polarized (leads are NOT interchangeable).`,
    deepDive: "An electrolytic capacitor is polarized -- wiring one backwards can genuinely damage it. Real ones are marked with a stripe (usually along the negative lead) for exactly this reason. Larger values like this one are what makes timing circuits (like a 555 astable) run at a real, slow, humanly-visible rate.",
    electrical: { capacitanceFarads: farads },
    modelHint: 'cylinder',
    colorHex: '#2563eb',
  };
}

function led(colorName: string, hex: string, forwardVoltage: number): ComponentSpec {
  return {
    id: `led-${colorName.toLowerCase()}`,
    kind: 'led',
    name: `${colorName} LED`,
    category: 'semiconductor',
    pins: [{ id: 'anode', label: 'Anode (+, longer lead)' }, { id: 'cathode', label: 'Cathode (-, shorter lead, flat edge)' }],
    description: `Lights up ${colorName.toLowerCase()} only when current flows the right way, and only above its real forward voltage (~${forwardVoltage}V).`,
    deepDive: `Every LED color is really a different semiconductor material with its own real forward voltage -- ${colorName} needs roughly ${forwardVoltage}V before it conducts at all, which is why the SAME current-limiting resistor value doesn't give the same brightness across different LED colors on the same supply.`,
    electrical: { forwardVoltage, maxCurrentAmps: 0.02 },
    modelHint: 'led-dome',
    colorHex: hex,
  };
}

export const ELECTRONICS_COMPONENTS: ComponentSpec[] = [
  // -- Power --------------------------------------------------------------
  {
    id: 'battery-9v',
    kind: 'battery-9v',
    name: '9V Battery (PP3)',
    category: 'power',
    pins: [{ id: 'pos', label: 'Positive (+)' }, { id: 'neg', label: 'Negative (-)' }],
    description: 'A standard 9-volt PP3 battery -- the power source for the circuit.',
    deepDive: "A 9V PP3 battery is actually six 1.5V cells stacked internally, connected in series -- 6 x 1.5V = 9V, the same series-voltage-adds-up rule taught in the Electric Circuits chapter, just already assembled inside one case.",
    electrical: { voltage: 9 },
    modelHint: 'box',
    colorHex: '#1a1a1a',
  },
  {
    id: 'battery-6v',
    kind: 'battery-6v',
    name: '6V Battery Pack (4×AA)',
    category: 'power',
    pins: [{ id: 'pos', label: 'Positive (+)' }, { id: 'neg', label: 'Negative (-)' }],
    description: 'Four AA cells in series inside one holder -- 4 x 1.5V = 6V, a common real supply for small hobby motors.',
    deepDive: "Matching a motor's rated voltage matters: too little and it won't spin with useful torque, too much and it can overheat or wear out early -- a 6V pack is the standard real choice for a motor rated at 6V, for exactly this reason.",
    electrical: { voltage: 6 },
    modelHint: 'box',
    colorHex: '#374151',
  },

  // -- Resistors: the real E12-derived decade spread found in a standard
  // beginner resistor kit --------------------------------------------------
  resistor(100, '100 Ω'),
  resistor(220, '220 Ω'),
  resistor(330, '330 Ω'),
  resistor(470, '470 Ω'),
  resistor(560, '560 Ω'),
  resistor(1000, '1 kΩ'),
  resistor(2200, '2.2 kΩ'),
  resistor(4700, '4.7 kΩ'),
  resistor(10000, '10 kΩ'),
  resistor(22000, '22 kΩ'),
  resistor(47000, '47 kΩ'),
  resistor(100000, '100 kΩ'),
  resistor(220000, '220 kΩ'),
  resistor(1000000, '1 MΩ'),

  // -- Capacitors: real ceramic (non-polarized, small) + electrolytic
  // (polarized, large) families -----------------------------------------
  ceramicCapacitor(100e-12, '100pf', '100 pF'),
  ceramicCapacitor(1e-9, '1nf', '1 nF'),
  ceramicCapacitor(10e-9, '10nf', '10 nF'),
  ceramicCapacitor(100e-9, '100nf', '100 nF'),
  electrolyticCapacitor(1e-6, '1uf', '1 µF'),
  electrolyticCapacitor(10e-6, '10uf', '10 µF'),
  electrolyticCapacitor(22e-6, '22uf', '22 µF'),
  electrolyticCapacitor(47e-6, '47uf', '47 µF'),
  electrolyticCapacitor(100e-6, '100uf', '100 µF'),
  electrolyticCapacitor(220e-6, '220uf', '220 µF'),
  electrolyticCapacitor(470e-6, '470uf', '470 µF'),
  electrolyticCapacitor(1000e-6, '1000uf', '1000 µF'),

  // -- LEDs: every common real color, each a real, distinct forward
  // voltage (typical published values for standard 5mm LEDs) -------------
  led('Red', '#dc2626', 2.0),
  led('Yellow', '#eab308', 2.1),
  led('Green', '#16a34a', 2.2),
  led('Blue', '#2563eb', 3.2),
  led('White', '#f8fafc', 3.2),
  led('Infrared', '#7f1d1d', 1.4),

  // -- IC -------------------------------------------------------------------
  {
    id: 'timer-555',
    kind: 'timer-555',
    name: '555 Timer IC',
    category: 'ic',
    pins: [
      { id: 'pin1-gnd', label: 'Pin 1 -- GND' },
      { id: 'pin2-trig', label: 'Pin 2 -- Trigger' },
      { id: 'pin3-out', label: 'Pin 3 -- Output' },
      { id: 'pin4-reset', label: 'Pin 4 -- Reset' },
      { id: 'pin5-ctrl', label: 'Pin 5 -- Control Voltage' },
      { id: 'pin6-thres', label: 'Pin 6 -- Threshold' },
      { id: 'pin7-disch', label: 'Pin 7 -- Discharge' },
      { id: 'pin8-vcc', label: 'Pin 8 -- VCC (+)' },
    ],
    description: 'One of the most-produced ICs in history -- generates precise timing signals from just a resistor-capacitor network.',
    deepDive: 'Wired as an "astable multivibrator" (RESET tied high, THRESHOLD and TRIGGER tied together, a resistor from VCC to DISCHARGE and a second resistor from DISCHARGE to the THRESHOLD/TRIGGER node, a capacitor from that same node to GND), the 555 repeatedly charges and discharges the capacitor through the two resistors, flipping its output HIGH and LOW at a real, calculable rate. First released in 1971, it is still manufactured and used today, over 50 years later.',
    modelHint: 'ic-dip8',
    colorHex: '#1e293b',
  },

  // -- Input (switches) -----------------------------------------------------
  {
    id: 'switch-spst',
    kind: 'switch-spst',
    name: 'SPST Toggle Switch',
    category: 'input',
    pins: [{ id: 'a', label: 'Terminal A' }, { id: 'b', label: 'Terminal B' }],
    description: 'A single-pole single-throw switch -- either fully connects its two terminals, or fully breaks the connection.',
    deepDive: '"SPST" describes exactly what it does: Single Pole (one circuit path), Single Throw (one on/off position) -- the simplest possible switch.',
    modelHint: 'switch-toggle',
    colorHex: '#dc2626',
  },
  {
    id: 'switch-spdt',
    kind: 'switch-spdt',
    name: 'SPDT Toggle Switch',
    category: 'input',
    pins: [{ id: 'common', label: 'Common' }, { id: 'throw1', label: 'Throw 1' }, { id: 'throw2', label: 'Throw 2' }],
    description: 'A single-pole double-throw switch -- routes its common terminal to ONE of two other terminals, never both at once.',
    deepDive: '"SPDT" means the common terminal can be thrown to either of two positions -- used anywhere you need to switch a circuit between two different paths, like choosing between two power sources or two signal routes.',
    modelHint: 'switch-toggle',
    colorHex: '#2563eb',
  },
  {
    id: 'push-button',
    kind: 'push-button',
    name: 'Push Button (Momentary)',
    category: 'input',
    pins: [{ id: 'a', label: 'Terminal A' }, { id: 'b', label: 'Terminal B' }],
    description: 'A momentary switch -- connects its two terminals only while physically held down, and springs back open the instant you release it.',
    deepDive: 'Unlike a toggle switch (which stays in whatever position you leave it), a push button is momentary -- it only closes the circuit for as long as pressure is applied, which is exactly why it\'s the standard choice for doorbells, keyboard keys, and reset buttons.',
    modelHint: 'push-button',
    colorHex: '#dc2626',
  },

  // -- Electromechanical (motors) --------------------------------------------
  {
    id: 'motor-dc',
    kind: 'dc-motor',
    name: 'DC Motor',
    category: 'electromechanical',
    pins: [{ id: 'pos', label: 'Positive (+)' }, { id: 'neg', label: 'Negative (-)' }],
    description: 'A small hobby DC motor -- spins continuously while powered, direction determined by which way current flows through it.',
    deepDive: "Reverse a DC motor's two leads and it spins the opposite direction -- the same current, just flowing the other way through its internal coil, which is exactly how motor-driver circuits control direction without any extra switches.",
    electrical: { voltage: 6 },
    modelHint: 'motor',
    colorHex: '#475569',
  },
  {
    id: 'buzzer-piezo',
    kind: 'buzzer',
    name: 'Piezo Buzzer',
    category: 'electromechanical',
    pins: [{ id: 'pos', label: 'Positive (+)' }, { id: 'neg', label: 'Negative (-)' }],
    description: 'A small piezoelectric buzzer -- converts electrical current directly into an audible tone the instant current flows through it.',
    deepDive: 'A piezo buzzer works by applying voltage across a piezoelectric ceramic disc, which physically flexes and vibrates a diaphragm to produce sound -- no moving coil or magnet needed, unlike a real speaker, which is exactly why piezo buzzers are so compact, cheap, and durable.',
    electrical: { voltage: 5 },
    modelHint: 'buzzer',
    colorHex: '#0f766e',
  },
  {
    id: 'motor-servo',
    kind: 'motor-servo',
    name: 'Servo Motor (SG90-style)',
    category: 'electromechanical',
    pins: [{ id: 'vcc', label: 'Power (+)' }, { id: 'gnd', label: 'Ground (-)' }, { id: 'signal', label: 'Signal (PWM)' }],
    description: 'A motor that turns to an exact commanded angle (not continuously) -- moves in response to a real PWM signal on its third wire.',
    deepDive: "A servo doesn't just spin -- it reads the WIDTH of repeating electrical pulses on its signal wire (typically 1-2 milliseconds) and turns to the exact angle that pulse width represents, then holds that position. This is why it needs 3 wires (power, ground, AND signal) instead of a plain motor's 2.",
    electrical: { voltage: 5 },
    modelHint: 'servo',
    colorHex: '#1d4ed8',
  },
  {
    id: 'motor-stepper',
    kind: 'motor-stepper',
    name: 'Stepper Motor (28BYJ-48-style)',
    category: 'electromechanical',
    pins: [
      { id: 'coil-a', label: 'Coil A' }, { id: 'coil-b', label: 'Coil B' },
      { id: 'coil-c', label: 'Coil C' }, { id: 'coil-d', label: 'Coil D' },
      { id: 'common', label: 'Common' },
    ],
    description: 'A motor that turns in exact, precise steps rather than spinning freely -- each electrical pulse to its coils advances it by one fixed, known angle.',
    deepDive: "A real 28BYJ-48-style stepper has 4 internal coils plus a shared common wire (5 wires total). Energizing the coils in the right sequence pulls its internal gear one precise step at a time -- since each step is a known, fixed angle, a stepper can reach an exact position by counting pulses, with no separate sensor needed to know where it is.",
    modelHint: 'stepper',
    colorHex: '#334155',
  },

  // -- Wiring -----------------------------------------------------------------
  {
    id: 'breadboard-half',
    kind: 'breadboard',
    name: 'Half-Size Breadboard',
    category: 'wiring',
    pins: [],
    description: 'A solderless prototyping board -- 30 rows of 5-hole strips (split by a center gutter) plus two power rails, wired internally exactly like a real breadboard.',
    deepDive: "Inside a real breadboard, metal spring clips run beneath each 5-hole strip, physically connecting every hole in that strip -- which is exactly why plugging a component's two leads into the SAME strip electrically joins them, and why the center gutter (deliberately wide enough for a DIP IC to straddle) keeps the two sides of a row from ever touching.",
    modelHint: 'breadboard',
    colorHex: '#e5e7eb',
  },
  {
    id: 'perfboard-blank',
    kind: 'perfboard',
    name: 'Blank Perfboard',
    category: 'wiring',
    pins: [],
    description: 'A grid of pre-drilled holes, each with its own small copper pad -- solder wire and component leads directly into it to build a real, permanent circuit.',
    deepDive: "Unlike a breadboard's temporary push-fit connections, a perfboard circuit is soldered -- once you're happy with a design proven out on a breadboard, transferring it to a soldered perfboard is the standard next step to make it permanent and reliable enough to actually use, rather than something that falls apart if the board gets bumped.",
    modelHint: 'perfboard',
    colorHex: '#166534',
  },
  {
    id: 'pcb-blank',
    kind: 'pcb-blank',
    name: 'Blank Copper-Clad PCB',
    category: 'wiring',
    pins: [],
    description: 'A blank board coated in a thin layer of copper -- the real starting material a printed circuit board is made from, before any circuit exists on it.',
    deepDive: 'A real PCB starts exactly like this -- a plain sheet of copper-clad board. The actual circuit only exists after copper is selectively removed (etched away with a chemical like ferric chloride) or hand-cut, leaving behind just the traces a real circuit needs, then components are soldered onto what remains.',
    modelHint: 'pcb-blank',
    colorHex: '#b45309',
  },
  {
    id: 'soldering-iron',
    kind: 'soldering-iron',
    name: 'Soldering Iron',
    category: 'tools',
    pins: [],
    description: 'A hand tool that heats up to melt solder, permanently joining a component lead to a copper pad -- the real tool behind every soldered (as opposed to breadboarded) circuit.',
    deepDive: 'A real soldering iron tip runs at roughly 300-370°C -- hot enough to melt solder almost instantly, but this is a genuinely hot tool: real soldering always calls for a stand to rest it on between joints, and never touching the tip.',
    modelHint: 'soldering-iron',
    colorHex: '#dc2626',
  },
  {
    id: 'solder-wire',
    kind: 'solder-wire',
    name: 'Solder Wire (Spool)',
    category: 'tools',
    pins: [],
    description: 'A thin wire of solder -- a metal alloy that melts at a low, safe-for-electronics temperature and re-hardens instantly, permanently bonding a component lead to a copper pad.',
    deepDive: "Most electronics solder is rosin-core -- the wire has a thin channel of rosin flux running through its center that's released as it melts, cleaning the joint surface as you solder so the metal actually bonds properly instead of beading up.",
    modelHint: 'solder-spool',
    colorHex: '#a8a29e',
  },
  {
    id: 'oscilloscope',
    kind: 'oscilloscope',
    name: 'Oscilloscope (CRO)',
    category: 'tools',
    pins: [{ id: 'probe', label: 'Probe (CH1)' }, { id: 'ground', label: 'Ground' }],
    description: 'A real test instrument -- probe any two points in your circuit and it draws the actual voltage-versus-time trace there, exactly like a real bench oscilloscope (or the CRO used in the Virtual Labs "Generation of Clock" experiment).',
    deepDive: "A real Cathode Ray Oscilloscope (CRO) works by steering an electron beam across a phosphor screen, deflected vertically by the probed voltage and swept horizontally by time -- which is exactly why its two core controls are VOLTS/DIV (how many volts each vertical grid square represents) and TIME/DIV (how many seconds each horizontal grid square represents). Probe a steady DC circuit and you'll see a flat line at its real voltage; probe a 555 astable's output and you'll see the real square wave at its real computed frequency; probe the 555's own timing capacitor and you'll see the real RC charge/discharge curve underneath that square wave.",
    modelHint: 'oscilloscope',
    colorHex: '#1e293b',
  },
];

export const ELECTRONICS_CATEGORY_LABELS: Record<string, string> = {
  power: 'Power Sources',
  passive: 'Resistors & Capacitors',
  semiconductor: 'LEDs & Diodes',
  ic: 'Integrated Circuits',
  input: 'Switches & Buttons',
  electromechanical: 'Motors & Buzzers',
  wiring: 'Boards & Wiring',
  tools: 'Soldering Tools',
};

// Shared drawer accent color per category -- lives here (not in a page
// component) since it's now used in two places: the Cupboard tab's own
// drawer browsing AND the same drawer scene re-embedded inside a
// project's Breadboard Workbench as its real component picker.
export const ELECTRONICS_CATEGORY_ACCENT: Record<string, string> = {
  power: '#1a1a1a',
  passive: '#d97706',
  semiconductor: '#dc2626',
  ic: '#1e293b',
  input: '#2563eb',
  electromechanical: '#475569',
  wiring: '#94a3b8',
  tools: '#0d9488',
};
