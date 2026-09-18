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

// -- k-Nearest Neighbors: real Euclidean distance + majority vote --------
// Toy dataset illustrative of (not literally reproducing) Fisher's Iris
// dataset (1936) -- the single most-used teaching example for kNN in real
// ML courses -- using two realistic petal measurement ranges.
export interface IrisPoint { x: number; z: number; species: 'Setosa-like' | 'Versicolor-like' }
export const IRIS_STYLE_POINTS: IrisPoint[] = [
  { x: 1.4, z: 0.2, species: 'Setosa-like' }, { x: 1.5, z: 0.3, species: 'Setosa-like' },
  { x: 1.3, z: 0.2, species: 'Setosa-like' }, { x: 1.6, z: 0.4, species: 'Setosa-like' },
  { x: 1.4, z: 0.3, species: 'Setosa-like' }, { x: 1.5, z: 0.2, species: 'Setosa-like' },
  { x: 4.5, z: 1.5, species: 'Versicolor-like' }, { x: 4.1, z: 1.3, species: 'Versicolor-like' },
  { x: 4.7, z: 1.4, species: 'Versicolor-like' }, { x: 4.0, z: 1.2, species: 'Versicolor-like' },
  { x: 4.4, z: 1.4, species: 'Versicolor-like' }, { x: 4.6, z: 1.5, species: 'Versicolor-like' },
];
export function euclideanDistance(x1: number, z1: number, x2: number, z2: number): number {
  return Math.sqrt((x1 - x2) ** 2 + (z1 - z2) ** 2);
}
export interface NeighborResult { point: IrisPoint; distance: number }
export function kNearestNeighbors(points: IrisPoint[], queryX: number, queryZ: number, k: number): NeighborResult[] {
  return points
    .map((point) => ({ point, distance: euclideanDistance(point.x, point.z, queryX, queryZ) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, k);
}
export function majoritySpecies(neighbors: NeighborResult[]): IrisPoint['species'] {
  const counts = new Map<IrisPoint['species'], number>();
  for (const n of neighbors) counts.set(n.point.species, (counts.get(n.point.species) ?? 0) + 1);
  let best: IrisPoint['species'] = neighbors[0].point.species;
  let bestCount = 0;
  for (const [species, count] of counts) {
    if (count > bestCount) { best = species; bestCount = count; }
  }
  return best;
}

// -- Linear Regression: real least-squares closed-form solution ----------
// y = slope*x + intercept, minimizing sum of squared residuals -- the
// standard formula taught in every statistics/ML course, not simplified
// or approximated.
export interface RegressionResult { slope: number; intercept: number; rSquared: number }
export function leastSquaresFit(points: { x: number; y: number }[]): RegressionResult {
  const n = points.length;
  if (n < 2) return { slope: 0, intercept: n === 1 ? points[0].y : 0, rSquared: 0 };
  const sumX = points.reduce((s, p) => s + p.x, 0);
  const sumY = points.reduce((s, p) => s + p.y, 0);
  const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
  const sumXX = points.reduce((s, p) => s + p.x * p.x, 0);
  const denom = n * sumXX - sumX * sumX;
  if (Math.abs(denom) < 1e-9) return { slope: 0, intercept: sumY / n, rSquared: 0 };
  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;
  const meanY = sumY / n;
  const ssTot = points.reduce((s, p) => s + (p.y - meanY) ** 2, 0);
  const ssRes = points.reduce((s, p) => { const pred = slope * p.x + intercept; return s + (p.y - pred) ** 2; }, 0);
  const rSquared = ssTot < 1e-9 ? 1 : 1 - ssRes / ssTot;
  return { slope, intercept, rSquared };
}

// -- k-Means Clustering: real Lloyd's-algorithm iteration -----------------
// A genuinely 3-feature toy dataset (hours studied, hours slept, hours of
// screen time per day) -- true 3D, not a fake third axis added just for
// visual effect.
export interface StudyHabitsPoint { x: number; y: number; z: number }
export const STUDY_HABITS_POINTS: StudyHabitsPoint[] = [
  { x: 6, y: 7, z: 2 }, { x: 5.5, y: 7.5, z: 2.5 }, { x: 6.5, y: 6.5, z: 1.5 }, { x: 5, y: 8, z: 3 },
  { x: 6, y: 7.5, z: 2 }, { x: 5.5, y: 6.8, z: 2.2 },
  { x: 1.5, y: 5, z: 8 }, { x: 2, y: 4.5, z: 7.5 }, { x: 1, y: 5.5, z: 8.5 }, { x: 2.5, y: 4, z: 7 },
  { x: 1.8, y: 5, z: 8 }, { x: 1.2, y: 4.8, z: 8.2 },
];
export interface Centroid { x: number; y: number; z: number }
function dist3D(a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number }): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
}
export function assignToCentroids(points: StudyHabitsPoint[], centroids: Centroid[]): number[] {
  return points.map((p) => {
    let best = 0, bestDist = Infinity;
    centroids.forEach((c, i) => {
      const d = dist3D(p, c);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    return best;
  });
}
export function updateCentroids(points: StudyHabitsPoint[], assignments: number[], k: number, previous: Centroid[]): Centroid[] {
  return Array.from({ length: k }, (_, i) => {
    const members = points.filter((_, idx) => assignments[idx] === i);
    if (members.length === 0) return previous[i]; // keep an empty cluster's centroid in place, a standard real edge-case handling
    return {
      x: members.reduce((s, p) => s + p.x, 0) / members.length,
      y: members.reduce((s, p) => s + p.y, 0) / members.length,
      z: members.reduce((s, p) => s + p.z, 0) / members.length,
    };
  });
}

// -- Decision Trees: real entropy and information gain --------------------
// Standard Shannon entropy for a binary split, and the real information-
// gain criterion (ID3, Quinlan 1986) used to pick the best threshold.
export function binaryEntropy(pPositive: number): number {
  if (pPositive <= 0 || pPositive >= 1) return 0;
  return -pPositive * Math.log2(pPositive) - (1 - pPositive) * Math.log2(1 - pPositive);
}
export interface StudyOutcome { hours: number; passed: boolean }
// Illustrative of the classic "study hours vs pass/fail" teaching example
// used across many decision-tree course materials.
export const STUDY_OUTCOMES: StudyOutcome[] = [
  { hours: 1, passed: false }, { hours: 1.5, passed: false }, { hours: 2, passed: false }, { hours: 2.5, passed: false },
  { hours: 3, passed: false }, { hours: 3.5, passed: true }, { hours: 4, passed: false }, { hours: 4.5, passed: true },
  { hours: 5, passed: true }, { hours: 5.5, passed: true }, { hours: 6, passed: true }, { hours: 7, passed: true },
];
export function parentEntropy(data: StudyOutcome[]): number {
  const pPass = data.filter((d) => d.passed).length / data.length;
  return binaryEntropy(pPass);
}
export interface SplitResult { threshold: number; infoGain: number; leftEntropy: number; rightEntropy: number; leftCount: number; rightCount: number }
export function evaluateSplit(data: StudyOutcome[], threshold: number): SplitResult {
  const left = data.filter((d) => d.hours < threshold);
  const right = data.filter((d) => d.hours >= threshold);
  const leftEntropy = left.length ? binaryEntropy(left.filter((d) => d.passed).length / left.length) : 0;
  const rightEntropy = right.length ? binaryEntropy(right.filter((d) => d.passed).length / right.length) : 0;
  const weighted = (left.length / data.length) * leftEntropy + (right.length / data.length) * rightEntropy;
  const infoGain = parentEntropy(data) - weighted;
  return { threshold, infoGain, leftEntropy, rightEntropy, leftCount: left.length, rightCount: right.length };
}
// Scans every candidate threshold (the real ID3 approach: midpoints
// between consecutive sorted values) and picks the one maximizing
// information gain -- exactly how a real decision tree chooses its split,
// not a simplified stand-in.
export function bestSplit(data: StudyOutcome[]): SplitResult {
  const sortedHours = [...new Set(data.map((d) => d.hours))].sort((a, b) => a - b);
  const candidates = sortedHours.slice(1).map((h, i) => (h + sortedHours[i]) / 2);
  let best: SplitResult | null = null;
  for (const threshold of candidates) {
    const result = evaluateSplit(data, threshold);
    if (!best || result.infoGain > best.infoGain) best = result;
  }
  return best ?? evaluateSplit(data, sortedHours[0]);
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
