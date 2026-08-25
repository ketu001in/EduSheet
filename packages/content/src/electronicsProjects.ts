import { ElectronicsProject } from './electronicsTypes';

// Electronics Lab -- Phase 1's single flagship project. The reference
// circuit below is not illustrative -- it was run through the actual
// connectivity/topology-detection logic in circuitEngine.ts (via a
// throwaway Node port) before being written here, confirming it really
// is a valid 555 astable multivibrator: RESET tied to VCC, THRESHOLD
// jumpered to TRIGGER, R1 bridging VCC<->DISCHARGE, R2 bridging
// DISCHARGE<->THRESHOLD/TRIGGER, and the capacitor bridging that same
// node to GND -- the real, standard topology, not an approximation of it.
export const ELECTRONICS_PROJECTS: ElectronicsProject[] = [
  {
    id: 'led-blinker-555',
    title: 'LED Blinker (555 Timer Astable Multivibrator)',
    branch: 'timers-oscillators',
    gradeBand: 'senior',
    board: 'both',
    chapterTags: ['Electricity', 'Electric Circuits', 'Current Electricity'],
    componentIds: ['battery-9v', 'resistor-1000', 'resistor-100000', 'resistor-470', 'cap-electro-10uf', 'led-red', 'timer-555', 'breadboard-half'],
    referenceCircuit: {
      placements: [
        { componentId: 'timer-555', instanceId: 'ic555', pinPositions: {
          'pin1-gnd': { row: 10, col: 'a' },
          'pin2-trig': { row: 11, col: 'a' },
          'pin3-out': { row: 12, col: 'a' },
          'pin4-reset': { row: 13, col: 'a' },
          'pin5-ctrl': { row: 13, col: 'f' },
          'pin6-thres': { row: 12, col: 'f' },
          'pin7-disch': { row: 11, col: 'f' },
          'pin8-vcc': { row: 10, col: 'f' },
        } },
        { componentId: 'resistor-1000', instanceId: 'r1', pinPositions: {
          a: { rail: 'top-pos' },
          b: { row: 11, col: 'h' },
        } },
        { componentId: 'resistor-100000', instanceId: 'r2', pinPositions: {
          a: { row: 11, col: 'g' },
          b: { row: 12, col: 'h' },
        } },
        { componentId: 'cap-electro-10uf', instanceId: 'cap1', pinPositions: {
          a: { row: 12, col: 'g' },
          b: { row: 15, col: 'a' },
        } },
        { componentId: 'resistor-470', instanceId: 'ledResistor', pinPositions: {
          a: { row: 12, col: 'b' },
          b: { row: 17, col: 'a' },
        } },
        { componentId: 'led-red', instanceId: 'led1', pinPositions: {
          anode: { row: 17, col: 'c' },
          cathode: { row: 18, col: 'a' },
        } },
        { componentId: 'battery-9v', instanceId: 'battery1', pinPositions: {
          pos: { rail: 'top-pos' },
          neg: { rail: 'top-neg' },
        } },
      ],
      wires: [
        { id: 'w-vcc-rail', from: { row: 10, col: 'h' }, to: { rail: 'top-pos' }, colorHex: '#dc2626' },
        { id: 'w-gnd-rail', from: { row: 10, col: 'c' }, to: { rail: 'top-neg' }, colorHex: '#1a1a1a' },
        { id: 'w-reset-high', from: { row: 13, col: 'c' }, to: { rail: 'top-pos' }, colorHex: '#dc2626' },
        { id: 'w-thres-trig', from: { row: 12, col: 'i' }, to: { row: 11, col: 'd' }, colorHex: '#2563eb' },
        { id: 'w-cap-gnd', from: { row: 15, col: 'c' }, to: { rail: 'top-neg' }, colorHex: '#1a1a1a' },
        { id: 'w-led-gnd', from: { row: 18, col: 'c' }, to: { rail: 'top-neg' }, colorHex: '#1a1a1a' },
      ],
    },
    buildSteps: [
      { number: 1, instruction: 'Place the 555 Timer IC straddling the breadboard\'s center gutter, so its two rows of 4 pins sit on opposite sides of the gap -- exactly like a real DIP-8 chip.', addsPlacementIds: ['ic555'], hint: 'Pin 1 (GND) is marked by a small notch or dot on the real chip -- always double check which end is which before wiring anything else.' },
      { number: 2, instruction: 'Wire pin 8 (VCC) to the positive power rail, and pin 1 (GND) to the negative power rail.', addsWireIds: ['w-vcc-rail', 'w-gnd-rail'] },
      { number: 3, instruction: 'Wire pin 4 (RESET) to the positive power rail too -- this keeps the timer permanently enabled instead of held in reset.', addsWireIds: ['w-reset-high'] },
      { number: 4, instruction: 'Place resistor R1 (1 kΩ) between the positive rail and pin 7 (DISCHARGE).', addsPlacementIds: ['r1'] },
      { number: 5, instruction: 'Place resistor R2 (100 kΩ) between pin 7 (DISCHARGE) and pin 6 (THRESHOLD).', addsPlacementIds: ['r2'] },
      { number: 6, instruction: 'Add a short jumper wire directly connecting pin 6 (THRESHOLD) to pin 2 (TRIGGER) -- they must be tied together for astable operation.', addsWireIds: ['w-thres-trig'] },
      { number: 7, instruction: 'Place the 10 µF capacitor between the THRESHOLD/TRIGGER node and the negative rail (GND) -- watch the polarity marking.', addsPlacementIds: ['cap1'], addsWireIds: ['w-cap-gnd'], hint: 'This capacitor is what actually sets the timing -- it charges through R1+R2 and discharges through R2 alone, over and over.' },
      { number: 8, instruction: 'Place the LED current-limiting resistor (470 Ω) from pin 3 (OUTPUT) to a fresh strip, then place the LED with its anode on that same strip and its cathode wired to the negative rail.', addsPlacementIds: ['ledResistor', 'led1'], addsWireIds: ['w-led-gnd'] },
      { number: 9, instruction: 'Connect the 9V battery: positive terminal to the positive rail, negative terminal to the negative rail. The LED should now blink on its own, with no further input needed.', addsPlacementIds: ['battery1'] },
    ],
    purpose: 'Build a real oscillator circuit from a 555 Timer IC that makes an LED blink at a precise, calculable rate -- no microcontroller, no code, just resistors, a capacitor, and the timer chip\'s own internal logic.',
    workingModelDescription: 'Once wired correctly and powered, the capacitor repeatedly charges through R1+R2 and discharges through R2, flipping the 555\'s output HIGH and LOW each time it crosses an internal voltage threshold -- driving the LED on and off at a real, steady rate determined entirely by the R1, R2, and C values chosen.',
    forceSection: 'The real force at work is electrostatic: the capacitor is being repeatedly charged and discharged by current flowing through the resistors, and its voltage rises and falls in a real RC exponential charge/discharge curve. The 555\'s two internal voltage comparators watch that curve and flip the output the instant it crosses 1/3 and 2/3 of the supply voltage -- that comparator-triggered flip is what turns a smooth, continuous charge curve into a clean, sharp on/off square wave at the output.',
    realWorldUse: [
      'The exact same astable 555 circuit is the basis of real hazard-warning flashers, turn-signal blinkers, and indicator lights in vehicles and appliances.',
      'Metronomes, simple tone generators, and PWM motor-speed controllers all build on this same charge/discharge timing principle.',
      'Before microcontrollers became cheap, the 555 timer was the standard, reliable way to generate any precise repeating signal in consumer electronics -- it is still manufactured and used today for exactly that reason.',
    ],
    extensions: [
      'Swap R2 for a larger or smaller value and predict how the blink rate will change before testing it -- the frequency formula tells you exactly what to expect.',
      'Add a second LED wired to blink opposite the first (using the same OUTPUT pin through an inverting arrangement) for a genuine two-way alternating blinker -- the first real step toward a traffic light circuit.',
      'Replace the LED with a small buzzer to hear the oscillation as a tone instead of seeing it as a blink -- same circuit, same timing, a different way to observe the same real frequency.',
    ],
    safetyNotes: [
      'Always check an electrolytic capacitor\'s polarity marking before placing it -- wiring one backwards can genuinely damage it.',
      'Never connect the battery until every other component and wire is in place and double-checked.',
    ],
  },
];
