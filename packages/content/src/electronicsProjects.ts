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
    id: 'simple-led-circuit',
    title: 'Simple LED Circuit',
    branch: 'basic-circuits',
    gradeBand: 'middle',
    board: 'both',
    chapterTags: ['Electricity', 'Electric Circuits'],
    componentIds: ['battery-9v', 'resistor-470', 'led-red', 'oscilloscope', 'breadboard-half'],
    referenceCircuit: {
      placements: [
        { componentId: 'battery-9v', instanceId: 'battery1', pinPositions: { pos: { rail: 'top-pos' }, neg: { rail: 'top-neg' } } },
        { componentId: 'resistor-470', instanceId: 'r1', pinPositions: { a: { row: 1, col: 'a' }, b: { row: 3, col: 'a' } } },
        { componentId: 'led-red', instanceId: 'led1', pinPositions: { anode: { row: 3, col: 'c' }, cathode: { row: 5, col: 'a' } } },
        { componentId: 'oscilloscope', instanceId: 'cro1', pinPositions: { probe: { rail: 'top-pos' }, ground: { rail: 'top-neg' } } },
      ],
      wires: [
        { id: 'w-r1-pos', from: { row: 1, col: 'e' }, to: { rail: 'top-pos' }, colorHex: '#dc2626' },
        { id: 'w-led-neg', from: { row: 5, col: 'e' }, to: { rail: 'top-neg' }, colorHex: '#1a1a1a' },
      ],
    },
    buildSteps: [
      { number: 1, instruction: 'Place the resistor with one lead on a fresh strip and the other lead two rows down, on that same side of the gutter.', addsPlacementIds: ['r1'] },
      { number: 2, instruction: 'Place the LED with its anode (longer lead) on the same strip as the resistor\'s second lead, and its cathode (shorter lead, flat edge) two rows further down.', addsPlacementIds: ['led1'] },
      { number: 3, instruction: 'Wire the resistor\'s first strip to the positive power rail, and the LED\'s cathode strip to the negative power rail.', addsWireIds: ['w-r1-pos', 'w-led-neg'] },
      { number: 4, instruction: 'Connect the 9V battery to the rails. The LED should light up immediately, steady and constant.', addsPlacementIds: ['battery1'], hint: 'If it stays dark, check the LED is the right way round -- current only flows anode to cathode.' },
    ],
    purpose: 'The single most fundamental circuit in electronics: a battery, a current-limiting resistor, and an LED, wired in one simple loop -- the real starting point every other circuit in this lab builds on.',
    workingModelDescription: 'Once the loop is closed the right way round, current flows continuously from the battery\'s positive terminal, through the resistor, through the LED (only in its forward direction), and back to the battery\'s negative terminal -- the LED lights up steadily for as long as the battery supplies power.',
    forceSection: 'The resistor exists for one real reason: without it, the LED\'s own internal resistance is so low that it would draw far more current than its rating allows the instant it\'s connected -- a genuine short-circuit-like surge that destroys the LED almost instantly. The resistor limits current to a safe value using Ohm\'s Law: R = (Vsupply - Vforward) / Imax.',
    realWorldUse: [
      'Every indicator LED in every appliance -- power lights, charging lights, status lights -- is this exact circuit, just built at a tiny scale on a printed circuit board.',
      'This is the first circuit taught in every electronics course worldwide, because every more complex circuit in this lab is really just several of these loops combined.',
    ],
    extensions: [
      'Try a smaller resistor value and watch what the engine flags -- this lab will refuse to light the LED and explain why, the same real protection a smart circuit needs.',
      'Try wiring the LED backwards on purpose and see the real diode behavior: no current flows at all, in either direction, until it\'s flipped the right way.',
    ],
    safetyNotes: ['Never connect an LED directly across a battery with no resistor -- it will draw excessive current and can be destroyed instantly.'],
  },
  {
    id: 'switch-controlled-led',
    title: 'Switch-Controlled LED',
    branch: 'basic-circuits',
    gradeBand: 'middle',
    board: 'both',
    chapterTags: ['Electricity', 'Electric Circuits'],
    componentIds: ['battery-9v', 'switch-spst', 'resistor-470', 'led-red', 'oscilloscope', 'breadboard-half'],
    referenceCircuit: {
      placements: [
        { componentId: 'battery-9v', instanceId: 'battery1', pinPositions: { pos: { rail: 'top-pos' }, neg: { rail: 'top-neg' } } },
        { componentId: 'switch-spst', instanceId: 'sw1', pinPositions: { a: { row: 1, col: 'a' }, b: { row: 3, col: 'a' } } },
        { componentId: 'resistor-470', instanceId: 'r1', pinPositions: { a: { row: 3, col: 'c' }, b: { row: 5, col: 'a' } } },
        { componentId: 'led-red', instanceId: 'led1', pinPositions: { anode: { row: 5, col: 'c' }, cathode: { row: 7, col: 'a' } } },
        { componentId: 'oscilloscope', instanceId: 'cro1', pinPositions: { probe: { rail: 'top-pos' }, ground: { rail: 'top-neg' } } },
      ],
      wires: [
        { id: 'w-sw-pos', from: { row: 1, col: 'e' }, to: { rail: 'top-pos' }, colorHex: '#dc2626' },
        { id: 'w-led-neg', from: { row: 7, col: 'e' }, to: { rail: 'top-neg' }, colorHex: '#1a1a1a' },
      ],
    },
    buildSteps: [
      { number: 1, instruction: 'Place the SPST toggle switch across two rows.', addsPlacementIds: ['sw1'] },
      { number: 2, instruction: 'Place the resistor from the switch\'s second row to a fresh row two further down, then the LED from there to a row two more further down.', addsPlacementIds: ['r1', 'led1'] },
      { number: 3, instruction: 'Wire the switch\'s first row to the positive rail, and the LED\'s cathode row to the negative rail.', addsWireIds: ['w-sw-pos', 'w-led-neg'] },
      { number: 4, instruction: 'Connect the battery, then flip the switch open and closed -- the LED should follow it exactly, on when closed, off when open.', addsPlacementIds: ['battery1'] },
    ],
    purpose: 'Add real, manual control to the basic LED circuit -- a switch that fully opens or closes the loop, the same on/off principle behind every real light switch.',
    workingModelDescription: 'With the switch open, the loop is physically broken and no current can flow anywhere in it, so the LED stays dark no matter how long the battery is connected. Closing the switch completes the loop and the LED lights immediately -- there\'s no delay, because closing a mechanical switch is instantaneous.',
    forceSection: 'An open switch is a genuine, total break in the conductive path -- air is an excellent insulator, so no current at all crosses the gap between its open contacts. Closing it re-establishes a real, low-resistance metal-to-metal path, and current resumes at exactly the same rate the circuit\'s resistance and voltage dictate.',
    realWorldUse: [
      'This is, literally, every wall light switch, every appliance power switch, and every toggle switch on any piece of equipment.',
      'It\'s also the basic building block of digital logic -- a switch that\'s either fully open or fully closed is the physical origin of the 0/1 binary states used throughout computing.',
    ],
    extensions: [
      'Swap the SPST for a push-button and notice the difference: the LED only lights while you\'re actively holding it, not once you release.',
      'Add a second switch in series with the first -- the LED should now only light when BOTH switches are closed, a real AND-gate behavior built from nothing but two mechanical switches.',
    ],
    safetyNotes: ['Always wire the switch before connecting the battery, so the circuit starts in a safe, open (off) state.'],
  },
  {
    id: 'push-button-led',
    title: 'Push-Button (Momentary) LED',
    branch: 'basic-circuits',
    gradeBand: 'middle',
    board: 'both',
    chapterTags: ['Electricity', 'Electric Circuits'],
    componentIds: ['battery-9v', 'push-button', 'resistor-470', 'led-red', 'oscilloscope', 'breadboard-half'],
    referenceCircuit: {
      placements: [
        { componentId: 'battery-9v', instanceId: 'battery1', pinPositions: { pos: { rail: 'top-pos' }, neg: { rail: 'top-neg' } } },
        { componentId: 'push-button', instanceId: 'pb1', pinPositions: { a: { row: 1, col: 'a' }, b: { row: 3, col: 'a' } } },
        { componentId: 'resistor-470', instanceId: 'r1', pinPositions: { a: { row: 3, col: 'c' }, b: { row: 5, col: 'a' } } },
        { componentId: 'led-red', instanceId: 'led1', pinPositions: { anode: { row: 5, col: 'c' }, cathode: { row: 7, col: 'a' } } },
        { componentId: 'oscilloscope', instanceId: 'cro1', pinPositions: { probe: { rail: 'top-pos' }, ground: { rail: 'top-neg' } } },
      ],
      wires: [
        { id: 'w-pb-pos', from: { row: 1, col: 'e' }, to: { rail: 'top-pos' }, colorHex: '#dc2626' },
        { id: 'w-led-neg', from: { row: 7, col: 'e' }, to: { rail: 'top-neg' }, colorHex: '#1a1a1a' },
      ],
    },
    buildSteps: [
      { number: 1, instruction: 'Place the momentary push-button across two rows -- wired exactly like the toggle switch circuit, just a different kind of switch.', addsPlacementIds: ['pb1'] },
      { number: 2, instruction: 'Place the resistor and LED in series after it, two rows apart each.', addsPlacementIds: ['r1', 'led1'] },
      { number: 3, instruction: 'Wire the button\'s first row to the positive rail, and the LED\'s cathode row to the negative rail.', addsWireIds: ['w-pb-pos', 'w-led-neg'] },
      { number: 4, instruction: 'Connect the battery, then press and hold the button -- the LED lights only while pressed, and goes dark the instant you let go.', addsPlacementIds: ['battery1'] },
    ],
    purpose: 'The same LED loop as before, but controlled by a momentary push-button instead of a toggle switch -- the real mechanical difference between "stays where you leave it" and "only while you\'re touching it".',
    workingModelDescription: 'A spring inside the push-button holds its contacts open by default. Pressing it physically overcomes that spring and closes the contacts, completing the loop and lighting the LED -- releasing the button lets the spring push the contacts back open immediately, breaking the loop again.',
    forceSection: 'This is a genuinely different real-world control model from a toggle switch: a toggle switch stays in whichever state you last set it (a stable mechanical position), while a push-button\'s internal spring actively forces it back open the instant outside pressure is removed -- so it can only ever represent "held" or "not held", never a lasting on/off state.',
    realWorldUse: [
      'Doorbells, keyboard keys, computer mouse buttons, and game controller buttons are all real momentary push-buttons.',
      'Any "press and hold" interaction in real hardware -- a power-on self-test button, a reset button -- relies on exactly this spring-loaded, momentary-only behavior.',
    ],
    extensions: [
      'Compare this side-by-side with the toggle switch circuit and describe, in your own words, the one real mechanical difference between them.',
      'Predict what would happen with TWO push-buttons wired in parallel instead of series -- then build it and check whether the LED lights when either one, or only when both, are pressed.',
    ],
    safetyNotes: ['Always wire the button before connecting the battery, so the circuit starts in a safe, unpressed (off) state.'],
  },
  {
    id: 'two-led-series',
    title: 'Two LEDs in Series',
    branch: 'basic-circuits',
    gradeBand: 'senior',
    board: 'both',
    chapterTags: ['Electricity', 'Electric Circuits', 'Current Electricity'],
    componentIds: ['battery-9v', 'resistor-330', 'led-red', 'led-yellow', 'oscilloscope', 'breadboard-half'],
    referenceCircuit: {
      placements: [
        { componentId: 'battery-9v', instanceId: 'battery1', pinPositions: { pos: { rail: 'top-pos' }, neg: { rail: 'top-neg' } } },
        { componentId: 'resistor-330', instanceId: 'r1', pinPositions: { a: { row: 1, col: 'a' }, b: { row: 3, col: 'a' } } },
        { componentId: 'led-red', instanceId: 'led1', pinPositions: { anode: { row: 3, col: 'c' }, cathode: { row: 5, col: 'a' } } },
        { componentId: 'led-yellow', instanceId: 'led2', pinPositions: { anode: { row: 5, col: 'c' }, cathode: { row: 7, col: 'a' } } },
        { componentId: 'oscilloscope', instanceId: 'cro1', pinPositions: { probe: { rail: 'top-pos' }, ground: { rail: 'top-neg' } } },
      ],
      wires: [
        { id: 'w-r1-pos', from: { row: 1, col: 'e' }, to: { rail: 'top-pos' }, colorHex: '#dc2626' },
        { id: 'w-led2-neg', from: { row: 7, col: 'e' }, to: { rail: 'top-neg' }, colorHex: '#1a1a1a' },
      ],
    },
    buildSteps: [
      { number: 1, instruction: 'Place the resistor, then the red LED, then the yellow LED, each two rows after the last, all in one single chain.', addsPlacementIds: ['r1', 'led1', 'led2'] },
      { number: 2, instruction: 'Wire the resistor\'s first row to the positive rail, and the last LED\'s cathode row to the negative rail.', addsWireIds: ['w-r1-pos', 'w-led2-neg'] },
      { number: 3, instruction: 'Connect the battery -- both LEDs should light together, at the same time, since it\'s all one single loop.', addsPlacementIds: ['battery1'], hint: 'Watch that BOTH light at once, not just one -- that\'s the real signature of a series circuit.' },
    ],
    purpose: 'Chain two different-color LEDs into one single loop, with just one resistor and one shared current path -- the real, hands-on way to see what "series" actually means electrically.',
    workingModelDescription: 'Since there is only one loop and no branch point, exactly the same current flows through the resistor, the red LED, AND the yellow LED, one after another. Both light together at the same brightness-determining current -- but notice this same current now has to overcome BOTH LEDs\' forward voltages added together, not just one.',
    forceSection: 'This is a real, direct demonstration of Kirchhoff\'s Voltage Law: the battery\'s 9V is shared out across the resistor and both LEDs in series, so the current is I = (Vsupply - VforwardLED1 - VforwardLED2) / R -- every extra LED added to the same series loop needs to be accounted for in that same subtraction, or the resistor sizing will be wrong.',
    realWorldUse: [
      'Real LED strip lighting is built from many LEDs in series-parallel combinations, precisely to share current-limiting resistors efficiently across groups.',
      'Old-style decorative string lights are wired the same way -- which is also why, on the cheapest ones, if a single bulb fails the whole series chain can go dark.',
    ],
    extensions: [
      'Calculate by hand what current this exact circuit should draw (using the real forward voltages shown on each LED\'s component card), then compare it to what the lab reports.',
      'Add a third LED in the same series chain and predict whether the resistor value still keeps it safe, before testing it.',
    ],
    safetyNotes: ['A series chain of LEDs needs a real check that the resistor is still large enough for the combined forward-voltage drop -- this lab will flag it if it is not.'],
  },
  {
    id: 'two-led-parallel',
    title: 'Two LEDs in Parallel',
    branch: 'basic-circuits',
    gradeBand: 'senior',
    board: 'both',
    chapterTags: ['Electricity', 'Electric Circuits', 'Current Electricity'],
    componentIds: ['battery-9v', 'resistor-470', 'led-red', 'led-green', 'oscilloscope', 'breadboard-half'],
    referenceCircuit: {
      placements: [
        { componentId: 'battery-9v', instanceId: 'battery1', pinPositions: { pos: { rail: 'top-pos' }, neg: { rail: 'top-neg' } } },
        { componentId: 'resistor-470', instanceId: 'r1', pinPositions: { a: { row: 1, col: 'a' }, b: { row: 3, col: 'a' } } },
        { componentId: 'led-red', instanceId: 'led1', pinPositions: { anode: { row: 3, col: 'c' }, cathode: { row: 5, col: 'a' } } },
        { componentId: 'resistor-470', instanceId: 'r2', pinPositions: { a: { row: 2, col: 'a' }, b: { row: 4, col: 'a' } } },
        { componentId: 'led-green', instanceId: 'led2', pinPositions: { anode: { row: 4, col: 'c' }, cathode: { row: 6, col: 'a' } } },
        { componentId: 'oscilloscope', instanceId: 'cro1', pinPositions: { probe: { rail: 'top-pos' }, ground: { rail: 'top-neg' } } },
      ],
      wires: [
        { id: 'w-r1-pos', from: { row: 1, col: 'e' }, to: { rail: 'top-pos' }, colorHex: '#dc2626' },
        { id: 'w-r2-pos', from: { row: 2, col: 'e' }, to: { rail: 'top-pos' }, colorHex: '#dc2626' },
        { id: 'w-led1-neg', from: { row: 5, col: 'e' }, to: { rail: 'top-neg' }, colorHex: '#1a1a1a' },
        { id: 'w-led2-neg', from: { row: 6, col: 'e' }, to: { rail: 'top-neg' }, colorHex: '#1a1a1a' },
      ],
    },
    buildSteps: [
      { number: 1, instruction: 'Build a complete, independent resistor + red-LED loop, exactly like the Simple LED Circuit.', addsPlacementIds: ['r1', 'led1'], addsWireIds: ['w-r1-pos', 'w-led1-neg'] },
      { number: 2, instruction: 'Build a second, completely separate resistor + green-LED loop, on different rows.', addsPlacementIds: ['r2', 'led2'], addsWireIds: ['w-r2-pos', 'w-led2-neg'] },
      { number: 3, instruction: 'Both loops share the same positive and negative rails -- that shared rail connection is what makes them "parallel". Connect the battery and both LEDs should light, independently.', addsPlacementIds: ['battery1'] },
    ],
    purpose: 'Wire two independent LED loops that share the same two power rails -- the real, hands-on way to see what "parallel" means, and why it behaves completely differently from series.',
    workingModelDescription: 'Each branch is its own complete loop back to the shared rails, so each one gets the FULL 9V across it, independently of the other -- unlike series, where the LEDs had to share the voltage. Removing or breaking one branch has no effect at all on the other, since they don\'t depend on each other electrically.',
    forceSection: 'This is a real demonstration of Kirchhoff\'s Current Law: the battery supplies whatever total current both branches independently demand, and each branch\'s own resistor and LED forward voltage determine ITS OWN current using Ohm\'s Law on that branch alone -- the two branches don\'t share or divide current between each other the way series components share voltage.',
    realWorldUse: [
      'Household electrical wiring is parallel for exactly this reason -- so that switching one lamp off doesn\'t turn off every other lamp and appliance in the house.',
      'Real automotive tail-light and indicator clusters wire their individual bulbs in parallel, so one blown bulb doesn\'t take out the rest of the cluster.',
    ],
    extensions: [
      'Physically disconnect one LED branch\'s wire and confirm the other LED is completely unaffected -- then try the same test on the earlier series circuit and compare what happens.',
      'Add a third parallel branch with a different color LED and predict, before testing, whether it changes the brightness of the first two.',
    ],
    safetyNotes: ['Each parallel branch needs its OWN correctly-sized resistor -- a single shared resistor across multiple parallel LED branches is a common real mistake that under-protects them.'],
  },
  {
    id: 'buzzer-alarm-circuit',
    title: 'Switch-Activated Buzzer Alarm',
    branch: 'basic-circuits',
    gradeBand: 'senior',
    board: 'both',
    chapterTags: ['Electricity', 'Electric Circuits'],
    componentIds: ['battery-9v', 'switch-spst', 'buzzer-piezo', 'oscilloscope', 'breadboard-half'],
    referenceCircuit: {
      placements: [
        { componentId: 'battery-9v', instanceId: 'battery1', pinPositions: { pos: { rail: 'top-pos' }, neg: { rail: 'top-neg' } } },
        { componentId: 'switch-spst', instanceId: 'sw1', pinPositions: { a: { row: 1, col: 'a' }, b: { row: 3, col: 'a' } } },
        { componentId: 'buzzer-piezo', instanceId: 'bz1', pinPositions: { pos: { row: 3, col: 'c' }, neg: { row: 5, col: 'a' } } },
        { componentId: 'oscilloscope', instanceId: 'cro1', pinPositions: { probe: { rail: 'top-pos' }, ground: { rail: 'top-neg' } } },
      ],
      wires: [
        { id: 'w-sw-pos', from: { row: 1, col: 'e' }, to: { rail: 'top-pos' }, colorHex: '#dc2626' },
        { id: 'w-bz-neg', from: { row: 5, col: 'e' }, to: { rail: 'top-neg' }, colorHex: '#1a1a1a' },
      ],
    },
    buildSteps: [
      { number: 1, instruction: 'Place the switch across two rows.', addsPlacementIds: ['sw1'] },
      { number: 2, instruction: 'Place the buzzer with its positive lead on the switch\'s second row, and its negative lead two rows further down. Unlike an LED, a buzzer needs no current-limiting resistor -- it\'s rated to run directly off the supply.', addsPlacementIds: ['bz1'] },
      { number: 3, instruction: 'Wire the switch\'s first row to the positive rail, and the buzzer\'s negative row to the negative rail.', addsWireIds: ['w-sw-pos', 'w-bz-neg'] },
      { number: 4, instruction: 'Connect the battery, then close the switch -- the buzzer sounds instantly and continuously for as long as the switch stays closed.', addsPlacementIds: ['battery1'] },
    ],
    purpose: 'Build a real switch-activated alarm circuit -- the same simple loop-and-switch principle as the LED circuits, but with an audible piezo buzzer as the output instead of light.',
    workingModelDescription: 'Closing the switch completes the loop between the battery and the buzzer, and the buzzer sounds continuously and immediately -- there is no timing or delay involved, it is a direct, real closed-circuit response, exactly like the switch-controlled LED but audible instead of visible.',
    forceSection: 'Inside the piezo buzzer, the applied voltage makes a piezoelectric ceramic disc physically flex thousands of times per second, vibrating a thin diaphragm and producing sound -- a genuine electrical-to-mechanical energy conversion, the same underlying principle (just packaged differently) as a real loudspeaker.',
    realWorldUse: [
      'Real door and window alarm sensors, smoke detectors, and seatbelt-reminder chimes are all switch-or-sensor-activated buzzer circuits at their electrical core.',
      'Microwave and washing-machine "cycle complete" beeps use the exact same piezo buzzer technology, just triggered electronically instead of by a manual switch.',
    ],
    extensions: [
      'Replace the manual switch with a push-button for a doorbell-style "beeps only while pressed" alarm.',
      'Compare this circuit\'s wiring side-by-side with the switch-controlled LED circuit -- notice the buzzer needs no current-limiting resistor, and explain in your own words why not.',
    ],
    safetyNotes: ['Always wire the switch before connecting the battery, so the circuit starts in a safe, silent (off) state.'],
  },
  {
    id: 'dc-motor-circuit',
    title: 'Switch-Controlled DC Motor',
    branch: 'motors-actuators',
    gradeBand: 'senior',
    board: 'both',
    chapterTags: ['Electricity', 'Magnetic Effects of Electric Current'],
    componentIds: ['battery-6v', 'switch-spst', 'motor-dc', 'oscilloscope', 'breadboard-half'],
    referenceCircuit: {
      placements: [
        { componentId: 'battery-6v', instanceId: 'battery1', pinPositions: { pos: { rail: 'top-pos' }, neg: { rail: 'top-neg' } } },
        { componentId: 'switch-spst', instanceId: 'sw1', pinPositions: { a: { row: 1, col: 'a' }, b: { row: 3, col: 'a' } } },
        { componentId: 'motor-dc', instanceId: 'm1', pinPositions: { pos: { row: 3, col: 'c' }, neg: { row: 5, col: 'a' } } },
        { componentId: 'oscilloscope', instanceId: 'cro1', pinPositions: { probe: { rail: 'top-pos' }, ground: { rail: 'top-neg' } } },
      ],
      wires: [
        { id: 'w-sw-pos', from: { row: 1, col: 'e' }, to: { rail: 'top-pos' }, colorHex: '#dc2626' },
        { id: 'w-m-neg', from: { row: 5, col: 'e' }, to: { rail: 'top-neg' }, colorHex: '#1a1a1a' },
      ],
    },
    buildSteps: [
      { number: 1, instruction: 'Place the switch across two rows.', addsPlacementIds: ['sw1'] },
      { number: 2, instruction: 'Place the DC motor with its positive lead on the switch\'s second row, and its negative lead two rows further down -- matched to the 6V battery pack, its real rated voltage.', addsPlacementIds: ['m1'] },
      { number: 3, instruction: 'Wire the switch\'s first row to the positive rail, and the motor\'s negative row to the negative rail.', addsWireIds: ['w-sw-pos', 'w-m-neg'] },
      { number: 4, instruction: 'Connect the 6V battery pack, then close the switch -- the motor spins continuously for as long as the switch stays closed.', addsPlacementIds: ['battery1'] },
    ],
    purpose: 'Build the simplest possible motor-driving circuit -- a battery, a switch, and a DC motor, matched to its real rated voltage -- the real starting point for every motorized project.',
    workingModelDescription: 'Closing the switch completes the loop and current flows continuously through the motor\'s internal coil, producing continuous rotation for as long as the loop stays closed -- opening the switch again breaks the loop and the motor coasts to a stop.',
    forceSection: 'The real force at work is the motor effect: current flowing through the motor\'s internal coil, sitting inside a permanent magnetic field, experiences a real force (F = BIL, the same magnetic-effects-of-current principle taught in the chapter) that pushes the coil around, converting electrical energy directly into continuous mechanical rotation.',
    realWorldUse: [
      'Every small battery-powered fan, toy car, and hobby robot wheel uses exactly this simple switch-and-motor circuit as its core drive mechanism.',
      'Electric window motors, real cordless drill motors, and washing-machine drum motors are all built on the same coil-in-a-magnetic-field principle, just at a much larger scale and voltage.',
    ],
    extensions: [
      'Reverse the motor\'s two leads and observe the real result: the exact same current, just flowing the opposite way through the coil, spins the motor the opposite direction.',
      'Compare this circuit\'s current draw to the buzzer circuit\'s -- a motor typically draws noticeably more current than a buzzer, since it is doing real mechanical work, not just vibrating a diaphragm.',
    ],
    safetyNotes: [
      'Match the battery voltage to the motor\'s real rating -- too high a voltage can overheat or damage a small hobby motor over time.',
      'Always wire the switch before connecting the battery, so the circuit starts in a safe, stopped (off) state.',
    ],
  },
  {
    id: 'led-blinker-555',
    title: 'LED Blinker (555 Timer Astable Multivibrator)',
    branch: 'timers-oscillators',
    gradeBand: 'senior',
    board: 'both',
    chapterTags: ['Electricity', 'Electric Circuits', 'Current Electricity'],
    componentIds: ['battery-9v', 'resistor-1000', 'resistor-100000', 'resistor-470', 'cap-electro-10uf', 'led-red', 'timer-555', 'oscilloscope', 'breadboard-half'],
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
        { componentId: 'oscilloscope', instanceId: 'cro1', pinPositions: {
          probe: { row: 12, col: 'd' },
          ground: { rail: 'top-neg' },
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
