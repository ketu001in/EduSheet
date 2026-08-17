// Real drag-and-drop block programming for Coding Lab's Block Coding
// Studio -- built on Google Blockly (the real, open-source library behind
// Code.org, MIT App Inventor, and Microsoft MakeCode), not a hand-rolled
// approximation. Blocks generate genuinely real JavaScript and Python via
// Blockly's own official generators (blockly/javascript,
// blockly/python) -- the toggle between "Blocks" and "Code" view shows
// the literal code that will run, not a fake preview.
//
// One real fix applied here: Blockly's standard `text_print` block emits
// `window.alert(...)` for JavaScript by default (its historical, browser-
// demo-oriented behaviour). Real execution in this app happens inside a
// DOM-less Web Worker (see /public/workers/jsRunner.worker.js), where
// `window` does not exist -- so this module overrides that one generator
// entry to emit `console.log(...)` instead, which the worker captures.
// Every other block (loops, conditionals, math, variables, functions)
// uses Blockly's own, unmodified, official generator.
//
// Every mission below was verified end-to-end with a throwaway Node
// script before shipping: build the exact block tree programmatically,
// generate real JS, execute it for real, and diff the captured output
// against the expected string -- the same discipline as every verified
// formula elsewhere in this app.
// Deliberately the top-level 'blockly' package, not 'blockly/core' +
// 'blockly/blocks' -- the split imports don't auto-load English locale
// strings (Blockly.Msg), which breaks block message interpolation with a
// real runtime error ("Message does not reference all N arg(s)"),
// confirmed while verifying this module. The top-level package bundles
// locale loading for you.
import * as Blockly from 'blockly';
import { javascriptGenerator, Order } from 'blockly/javascript';
import { pythonGenerator } from 'blockly/python';

export type BlockLanguage = 'javascript' | 'python';
export type GradeBand = 'junior' | 'middle' | 'senior' | 'plusTwo';

let patched = false;
export function ensureGeneratorPatches() {
  if (patched) return;
  patched = true;
  javascriptGenerator.forBlock['text_print'] = (block, generator) => {
    const msg = generator.valueToCode(block, 'TEXT', Order.NONE) || "''";
    return `console.log(${msg});\n`;
  };
}

export const BLOCK_TOOLBOX = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category', name: 'Logic', colour: '210',
      contents: [
        { kind: 'block', type: 'controls_if' },
        { kind: 'block', type: 'controls_ifelse' },
        { kind: 'block', type: 'logic_compare' },
        { kind: 'block', type: 'logic_operation' },
        { kind: 'block', type: 'logic_negate' },
        { kind: 'block', type: 'logic_boolean' },
      ],
    },
    {
      kind: 'category', name: 'Loops', colour: '120',
      contents: [
        { kind: 'block', type: 'controls_repeat_ext', inputs: { TIMES: { shadow: { type: 'math_number', fields: { NUM: 10 } } } } },
        { kind: 'block', type: 'controls_whileUntil' },
        { kind: 'block', type: 'controls_for' },
      ],
    },
    {
      kind: 'category', name: 'Math', colour: '230',
      contents: [
        { kind: 'block', type: 'math_number' },
        { kind: 'block', type: 'math_arithmetic' },
        { kind: 'block', type: 'math_modulo' },
        { kind: 'block', type: 'math_random_int' },
        { kind: 'block', type: 'math_change' },
      ],
    },
    {
      kind: 'category', name: 'Text', colour: '160',
      contents: [
        { kind: 'block', type: 'text' },
        { kind: 'block', type: 'text_print' },
        { kind: 'block', type: 'text_join' },
      ],
    },
    { kind: 'category', name: 'Variables', colour: '330', custom: 'VARIABLE' },
    { kind: 'category', name: 'Functions', colour: '290', custom: 'PROCEDURE' },
  ],
};

export function generateCode(workspace: Blockly.Workspace, language: BlockLanguage): string {
  ensureGeneratorPatches();
  const generator = language === 'javascript' ? javascriptGenerator : pythonGenerator;
  return generator.workspaceToCode(workspace);
}

// -- Starter Missions ---------------------------------------------------
// Each mission programmatically builds its starter block layout (rather
// than requiring hand-authored, easy-to-corrupt saved-state JSON), and
// carries a real, exact success check against captured program output.
function newBlock(workspace: Blockly.Workspace, type: string) {
  return workspace.newBlock(type);
}
function chainStatements(...blocks: Blockly.Block[]) {
  for (let i = 0; i < blocks.length - 1; i++) {
    blocks[i].nextConnection?.connect(blocks[i + 1].previousConnection!);
  }
  return blocks[0];
}
function renderAll(workspace: Blockly.Workspace) {
  workspace.getAllBlocks(false).forEach((b) => {
    (b as unknown as { initSvg?: () => void }).initSvg?.();
    (b as unknown as { render?: () => void }).render?.();
  });
  (workspace as unknown as { cleanUp?: () => void }).cleanUp?.();
}

export interface BlockMission {
  id: string;
  title: string;
  gradeBand: GradeBand;
  goal: string;
  hint: string;
  expectedOutput: string;
  build: (workspace: Blockly.Workspace) => void;
}

export const BLOCK_MISSIONS: BlockMission[] = [
  {
    id: 'hello-loop',
    title: 'Hello, Loop!',
    gradeBand: 'junior',
    goal: "Make the program print \"Hello!\" exactly 5 times.",
    hint: 'A "repeat" block from the Loops drawer already has a print block inside -- just check the numbers match.',
    expectedOutput: Array(5).fill('Hello!').join('\n'),
    build: (ws) => {
      const repeatBlock = newBlock(ws, 'controls_repeat_ext');
      const five = newBlock(ws, 'math_number'); five.setFieldValue('5', 'NUM');
      repeatBlock.getInput('TIMES')!.connection!.connect(five.outputConnection!);
      const printBlock = newBlock(ws, 'text_print');
      const txt = newBlock(ws, 'text'); txt.setFieldValue('Hello!', 'TEXT');
      printBlock.getInput('TEXT')!.connection!.connect(txt.outputConnection!);
      repeatBlock.getInput('DO')!.connection!.connect(printBlock.previousConnection!);
      renderAll(ws);
    },
  },
  {
    id: 'count-up',
    title: 'Count Up',
    gradeBand: 'junior',
    goal: 'Print every whole number from 1 to 10, one per line.',
    hint: 'Use a "count with i from ... to ..." block from Loops, and print the variable "i" from Variables each time.',
    expectedOutput: Array.from({ length: 10 }, (_, i) => String(i + 1)).join('\n'),
    build: (ws) => {
      const v = ws.getVariableMap().createVariable('i')!;
      const forBlock = newBlock(ws, 'controls_for');
      forBlock.setFieldValue(v.getId(), 'VAR');
      const from = newBlock(ws, 'math_number'); from.setFieldValue('1', 'NUM');
      const to = newBlock(ws, 'math_number'); to.setFieldValue('10', 'NUM');
      const by = newBlock(ws, 'math_number'); by.setFieldValue('1', 'NUM');
      forBlock.getInput('FROM')!.connection!.connect(from.outputConnection!);
      forBlock.getInput('TO')!.connection!.connect(to.outputConnection!);
      forBlock.getInput('BY')!.connection!.connect(by.outputConnection!);
      renderAll(ws);
    },
  },
  {
    id: 'even-odd',
    title: 'Even or Odd?',
    gradeBand: 'middle',
    goal: 'For every number 1 to 10, print "Even" if it divides evenly by 2, otherwise print "Odd".',
    hint: 'Use "if/else" from Logic, and the remainder (%) block from Math to test divisibility by 2.',
    expectedOutput: Array.from({ length: 10 }, (_, i) => ((i + 1) % 2 === 0 ? 'Even' : 'Odd')).join('\n'),
    build: (ws) => {
      const v = ws.getVariableMap().createVariable('n')!;
      const forBlock = newBlock(ws, 'controls_for');
      forBlock.setFieldValue(v.getId(), 'VAR');
      const from = newBlock(ws, 'math_number'); from.setFieldValue('1', 'NUM');
      const to = newBlock(ws, 'math_number'); to.setFieldValue('10', 'NUM');
      const by = newBlock(ws, 'math_number'); by.setFieldValue('1', 'NUM');
      forBlock.getInput('FROM')!.connection!.connect(from.outputConnection!);
      forBlock.getInput('TO')!.connection!.connect(to.outputConnection!);
      forBlock.getInput('BY')!.connection!.connect(by.outputConnection!);
      renderAll(ws);
    },
  },
  {
    id: 'function-greeting',
    title: 'Write Your Own Function',
    gradeBand: 'senior',
    goal: 'Define a function that prints "Welcome to Coding Lab!", then call it exactly 3 times.',
    hint: 'Use "to do something" from Functions to define it once, then drag "call" blocks from the same drawer to run it multiple times.',
    expectedOutput: Array(3).fill('Welcome to Coding Lab!').join('\n'),
    build: (ws) => {
      const defBlock = newBlock(ws, 'procedures_defnoreturn');
      defBlock.setFieldValue('greet', 'NAME');
      renderAll(ws);
    },
  },
  {
    id: 'countdown',
    title: 'Countdown Blastoff',
    gradeBand: 'junior',
    goal: 'Print 5, 4, 3, 2, 1 (one per line), then print "Blastoff!" on its own line.',
    hint: 'The "count with i from 5 to 1 by -1" loop is already set up -- add a print block for "i" inside it, then a print block for "Blastoff!" after the loop ends.',
    expectedOutput: ['5', '4', '3', '2', '1', 'Blastoff!'].join('\n'),
    build: (ws) => {
      const v = ws.getVariableMap().createVariable('i')!;
      const forBlock = newBlock(ws, 'controls_for');
      forBlock.setFieldValue(v.getId(), 'VAR');
      const from = newBlock(ws, 'math_number'); from.setFieldValue('5', 'NUM');
      const to = newBlock(ws, 'math_number'); to.setFieldValue('1', 'NUM');
      const by = newBlock(ws, 'math_number'); by.setFieldValue('-1', 'NUM');
      forBlock.getInput('FROM')!.connection!.connect(from.outputConnection!);
      forBlock.getInput('TO')!.connection!.connect(to.outputConnection!);
      forBlock.getInput('BY')!.connection!.connect(by.outputConnection!);
      renderAll(ws);
    },
  },
  {
    id: 'multiplication-table',
    title: 'Multiplication Table',
    gradeBand: 'middle',
    goal: 'Print the 5-times table from "5 x 1 = 5" through "5 x 10 = 50", one line each.',
    hint: 'Use "join" from Text (click its gear icon to add more slots) to build a string like "5 x " + i + " = " + (5 * i), then print it inside the loop.',
    expectedOutput: Array.from({ length: 10 }, (_, i) => `5 x ${i + 1} = ${5 * (i + 1)}`).join('\n'),
    build: (ws) => {
      const v = ws.getVariableMap().createVariable('i')!;
      const forBlock = newBlock(ws, 'controls_for');
      forBlock.setFieldValue(v.getId(), 'VAR');
      const from = newBlock(ws, 'math_number'); from.setFieldValue('1', 'NUM');
      const to = newBlock(ws, 'math_number'); to.setFieldValue('10', 'NUM');
      const by = newBlock(ws, 'math_number'); by.setFieldValue('1', 'NUM');
      forBlock.getInput('FROM')!.connection!.connect(from.outputConnection!);
      forBlock.getInput('TO')!.connection!.connect(to.outputConnection!);
      forBlock.getInput('BY')!.connection!.connect(by.outputConnection!);
      renderAll(ws);
    },
  },
  {
    id: 'sum-1-to-100',
    title: "Gauss's Sum",
    gradeBand: 'middle',
    goal: 'Add up every whole number from 1 to 100 and print the final total.',
    hint: 'A variable "sum" already starts at 0. Inside the loop, set "sum" to "sum + i" each time, then print "sum" after the loop ends. (A young Carl Friedrich Gauss reportedly worked this exact sum out in seconds as a schoolboy -- see if your program agrees with him.)',
    expectedOutput: '5050',
    build: (ws) => {
      const vSum = ws.getVariableMap().createVariable('sum')!;
      const vI = ws.getVariableMap().createVariable('i')!;
      const setSum = newBlock(ws, 'variables_set');
      setSum.setFieldValue(vSum.getId(), 'VAR');
      const zero = newBlock(ws, 'math_number'); zero.setFieldValue('0', 'NUM');
      setSum.getInput('VALUE')!.connection!.connect(zero.outputConnection!);

      const forBlock = newBlock(ws, 'controls_for');
      forBlock.setFieldValue(vI.getId(), 'VAR');
      const from = newBlock(ws, 'math_number'); from.setFieldValue('1', 'NUM');
      const to = newBlock(ws, 'math_number'); to.setFieldValue('100', 'NUM');
      const by = newBlock(ws, 'math_number'); by.setFieldValue('1', 'NUM');
      forBlock.getInput('FROM')!.connection!.connect(from.outputConnection!);
      forBlock.getInput('TO')!.connection!.connect(to.outputConnection!);
      forBlock.getInput('BY')!.connection!.connect(by.outputConnection!);

      setSum.nextConnection!.connect(forBlock.previousConnection!);
      renderAll(ws);
    },
  },
  {
    id: 'fizzbuzz',
    title: 'FizzBuzz',
    gradeBand: 'senior',
    goal: 'For numbers 1 to 15: print "FizzBuzz" for multiples of 15, "Fizz" for multiples of 3, "Buzz" for multiples of 5, otherwise print the number itself.',
    hint: 'Use "if/else if/else" from Logic (click its gear icon to add two "else if" branches and an "else"). Check "remainder of i / 15 = 0" first, then "/ 3", then "/ 5" -- order matters, since every multiple of 15 is also a multiple of 3 and 5.',
    expectedOutput: Array.from({ length: 15 }, (_, idx) => {
      const i = idx + 1;
      if (i % 15 === 0) return 'FizzBuzz';
      if (i % 3 === 0) return 'Fizz';
      if (i % 5 === 0) return 'Buzz';
      return String(i);
    }).join('\n'),
    build: (ws) => {
      const v = ws.getVariableMap().createVariable('i')!;
      const forBlock = newBlock(ws, 'controls_for');
      forBlock.setFieldValue(v.getId(), 'VAR');
      const from = newBlock(ws, 'math_number'); from.setFieldValue('1', 'NUM');
      const to = newBlock(ws, 'math_number'); to.setFieldValue('15', 'NUM');
      const by = newBlock(ws, 'math_number'); by.setFieldValue('1', 'NUM');
      forBlock.getInput('FROM')!.connection!.connect(from.outputConnection!);
      forBlock.getInput('TO')!.connection!.connect(to.outputConnection!);
      forBlock.getInput('BY')!.connection!.connect(by.outputConnection!);
      renderAll(ws);
    },
  },
  {
    id: 'is-even-function',
    title: 'Function With a Parameter',
    gradeBand: 'senior',
    goal: 'Finish the "isEven" function so it returns true or false, then call it and print the result for 4, 7, and 10.',
    hint: 'The function and its parameter "n" are already set up. Plug "remainder of n / 2 = 0" into the return slot, then add three "call isEven" blocks (each wrapped in a print block) for 4, 7, and 10.',
    expectedOutput: ['true', 'false', 'true'].join('\n'),
    build: (ws) => {
      const defBlock = newBlock(ws, 'procedures_defreturn');
      defBlock.setFieldValue('isEven', 'NAME');
      (defBlock as unknown as { loadExtraState: (state: unknown) => void }).loadExtraState({ params: [{ name: 'n', id: 'isEvenParamN' }] });
      renderAll(ws);
    },
  },
  {
    id: 'celsius-to-fahrenheit',
    title: 'Temperature Converter Function',
    gradeBand: 'plusTwo',
    goal: 'Finish the "celsiusToFahrenheit" function using the real formula (C x 9 / 5) + 32, then call it and print the result for 0, 100, and 37 degrees Celsius.',
    hint: 'The function and its parameter "celsius" are already set up. Build "(celsius x 9) / 5 + 32" using Math blocks and plug it into the return slot, then add three "call" blocks (each wrapped in a print block) for 0, 100, and 37.',
    expectedOutput: ['32', '212', '98.6'].join('\n'),
    build: (ws) => {
      const defBlock = newBlock(ws, 'procedures_defreturn');
      defBlock.setFieldValue('celsiusToFahrenheit', 'NAME');
      (defBlock as unknown as { loadExtraState: (state: unknown) => void }).loadExtraState({ params: [{ name: 'celsius', id: 'c2fParamC' }] });
      renderAll(ws);
    },
  },
];

export function buildMission(workspace: Blockly.Workspace, missionId: string) {
  const mission = BLOCK_MISSIONS.find((m) => m.id === missionId);
  if (!mission) return;
  workspace.clear();
  mission.build(workspace);
}

export function checkMissionOutput(missionId: string, output: string): boolean {
  const mission = BLOCK_MISSIONS.find((m) => m.id === missionId);
  if (!mission) return false;
  return output.trim() === mission.expectedOutput.trim();
}
