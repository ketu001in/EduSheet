// Pure, verified logic for AI Lab and Coding Lab's playable simulations --
// same discipline as roboticsEngineeringEngine.ts and chemEngine.ts: real
// algorithms, verified against hand-checked cases before shipping (script
// run and deleted, see commit history), not illustrative-only numbers.

// -- Perceptron: the actual weighted-sum classification rule -----------------
export function perceptronOutput(w1: number, w2: number, bias: number, x: number, y: number): number {
  return w1 * x + w2 * y + bias;
}
export function perceptronClass(w1: number, w2: number, bias: number, x: number, y: number): 'A' | 'B' {
  return perceptronOutput(w1, w2, bias, x, y) >= 0 ? 'A' : 'B';
}

// -- Perceptron TRAINING: the real Rosenblatt (1958) update rule, not a
// slider being dragged by hand. Labels use the classic {-1, +1} convention
// (not {0,1}) because the update rule's error term (target - prediction)
// only works cleanly with signed labels.
export interface PerceptronWeights { w1: number; w2: number; bias: number }
export function perceptronTrainStep(
  state: PerceptronWeights,
  x: number,
  y: number,
  label: 1 | -1,
  learningRate: number
): PerceptronWeights {
  const prediction = perceptronOutput(state.w1, state.w2, state.bias, x, y) >= 0 ? 1 : -1;
  const error = label - prediction; // 0 if correct, otherwise +-2
  return {
    w1: state.w1 + learningRate * error * x,
    w2: state.w2 + learningRate * error * y,
    bias: state.bias + learningRate * error,
  };
}

export interface LabeledPoint2D { x: number; y: number; label: 1 | -1; displayLabel: string }

// A real, linearly-separable 2-feature toy dataset (link count vs
// exclamation-mark count) -- small enough to see every point, but an
// actual classification problem rather than 8 unlabeled dots.
export const SPAM_TRAINING_POINTS: LabeledPoint2D[] = [
  { x: 1, y: 0, label: -1, displayLabel: 'Not spam' },
  { x: 0, y: 1, label: -1, displayLabel: 'Not spam' },
  { x: 1, y: 1, label: -1, displayLabel: 'Not spam' },
  { x: 2, y: 1, label: -1, displayLabel: 'Not spam' },
  { x: 1, y: 2, label: -1, displayLabel: 'Not spam' },
  { x: 6, y: 5, label: 1, displayLabel: 'Spam' },
  { x: 7, y: 6, label: 1, displayLabel: 'Spam' },
  { x: 5, y: 7, label: 1, displayLabel: 'Spam' },
  { x: 8, y: 4, label: 1, displayLabel: 'Spam' },
];

// -- XOR: the real, historically-pivotal case a single perceptron cannot
// solve (Minsky & Papert, 1969). BEST_POSSIBLE_PERCEPTRON_XOR_SCORE was
// verified with a brute-force grid search over weights/bias in [-3,3]
// (step 0.1, ~227k combinations) -- see aiCodingEngine.verify.js in
// commit history -- confirming no single perceptron ever scores above 3
// of 4 points, empirically proving the claim rather than just asserting
// it.
export const XOR_POINTS: { x: number; y: number; label: 0 | 1 }[] = [
  { x: 0, y: 0, label: 0 },
  { x: 1, y: 0, label: 1 },
  { x: 0, y: 1, label: 1 },
  { x: 1, y: 1, label: 0 },
];
export function perceptronXorScore(w1: number, w2: number, bias: number): number {
  return XOR_POINTS.filter((p) => (perceptronOutput(w1, w2, bias, p.x, p.y) >= 0 ? 1 : 0) === p.label).length;
}
export const BEST_POSSIBLE_PERCEPTRON_XOR_SCORE = 3;

// -- Activation functions: the real, standard formulas used to turn a
// perceptron's raw weighted sum into a neural network unit's output.
export function stepActivation(x: number): number {
  return x >= 0 ? 1 : 0;
}
export function sigmoidActivation(x: number): number {
  return 1 / (1 + Math.exp(-x));
}
export function reluActivation(x: number): number {
  return Math.max(0, x);
}
export function tanhActivation(x: number): number {
  return Math.tanh(x);
}

// -- Linear vs Binary Search: real algorithm implementations, run against
// an actual array, not simulated. Both return the true index found and the
// real number of comparisons the algorithm needed to get there.
export interface SearchResult { index: number; comparisons: number; steps: number[] }

export function linearSearch(arr: number[], target: number): SearchResult {
  const steps: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    steps.push(i);
    if (arr[i] === target) return { index: i, comparisons: steps.length, steps };
  }
  return { index: -1, comparisons: steps.length, steps };
}

export function binarySearch(arr: number[], target: number): SearchResult {
  let lo = 0, hi = arr.length - 1;
  const steps: number[] = [];
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    steps.push(mid);
    if (arr[mid] === target) return { index: mid, comparisons: steps.length, steps };
    if (arr[mid] < target) lo = mid + 1; else hi = mid - 1;
  }
  return { index: -1, comparisons: steps.length, steps };
}
