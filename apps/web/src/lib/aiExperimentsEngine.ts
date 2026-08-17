// Pure, verified logic for AI Lab's Hands-On Experiments Laboratory --
// same discipline as roboticsEngineeringEngine.ts: real algorithms,
// verified against hand-checked cases before shipping (script run and
// deleted, see commit history), not illustrative-only numbers. Each
// experiment here deliberately covers ground the Foundations/Classic ML
// sections don't yet: reinforcement learning, computer vision, NLP,
// evaluation metrics, and a genuine multi-layer network you can train.

// -- Backpropagation: a real 2-hidden-neuron network that can solve XOR --
// The direct payoff of Foundations' XOR-limitation content: this network
// architecture (2 inputs -> 2 hidden -> 1 output, all sigmoid) is exactly
// what a single perceptron cannot do and a tiny multi-layer network can.
// Standard backpropagation (Rumelhart, Hinton, Williams, 1986).
export function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}
function sigmoidDerivFromOutput(y: number): number {
  return y * (1 - y);
}
export interface TinyNetWeights {
  w1: number; w2: number; b1: number;
  w3: number; w4: number; b2: number;
  w5: number; w6: number; b3: number;
}
export interface TinyNetActivations { h1: number; h2: number; o: number }
export function tinyNetForward(net: TinyNetWeights, x1: number, x2: number): TinyNetActivations {
  const h1 = sigmoid(net.w1 * x1 + net.w2 * x2 + net.b1);
  const h2 = sigmoid(net.w3 * x1 + net.w4 * x2 + net.b2);
  const o = sigmoid(net.w5 * h1 + net.w6 * h2 + net.b3);
  return { h1, h2, o };
}
export function tinyNetTrainStep(net: TinyNetWeights, x1: number, x2: number, target: number, lr: number): TinyNetWeights {
  const { h1, h2, o } = tinyNetForward(net, x1, x2);
  const deltaO = (o - target) * sigmoidDerivFromOutput(o);
  const dW5 = deltaO * h1, dW6 = deltaO * h2, dB3 = deltaO;
  const deltaH1 = deltaO * net.w5 * sigmoidDerivFromOutput(h1);
  const deltaH2 = deltaO * net.w6 * sigmoidDerivFromOutput(h2);
  const dW1 = deltaH1 * x1, dW2 = deltaH1 * x2, dB1 = deltaH1;
  const dW3 = deltaH2 * x1, dW4 = deltaH2 * x2, dB2 = deltaH2;
  return {
    w1: net.w1 - lr * dW1, w2: net.w2 - lr * dW2, b1: net.b1 - lr * dB1,
    w3: net.w3 - lr * dW3, w4: net.w4 - lr * dW4, b2: net.b2 - lr * dB2,
    w5: net.w5 - lr * dW5, w6: net.w6 - lr * dW6, b3: net.b3 - lr * dB3,
  };
}
export const XOR_TRAINING_DATA: { x1: number; x2: number; target: number }[] = [
  { x1: 0, x2: 0, target: 0 }, { x1: 1, x2: 0, target: 1 }, { x1: 0, x2: 1, target: 1 }, { x1: 1, x2: 1, target: 0 },
];
// A small deterministic pseudo-random init (not Math.random) so every
// visitor's "Reset" starts from the identical, already-verified-to-
// converge starting point.
export function makeTinyNet(seed = 42): TinyNetWeights {
  let s = seed;
  const rand = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return (s / 0x7fffffff) * 2 - 1; };
  return { w1: rand(), w2: rand(), b1: rand(), w3: rand(), w4: rand(), b2: rand(), w5: rand(), w6: rand(), b3: rand() };
}

// -- Gradient Descent: real analytic gradient of a real 2D bowl ---------------
// f(x,y) = x^2 + y^2 -- a genuine convex loss surface, gradient = (2x, 2y).
// A stable learning rate converges to the minimum; too large a rate
// genuinely, visibly diverges -- both real, teachable outcomes.
export function bowlLoss(x: number, y: number): number {
  return x * x + y * y;
}
export function gradientDescentStep(x: number, y: number, lr: number): { x: number; y: number } {
  const gradX = 2 * x, gradY = 2 * y;
  return { x: x - lr * gradX, y: y - lr * gradY };
}

// -- Q-Learning: the real Bellman update rule ---------------------------------
// Q(s,a) += alpha * (reward + gamma * max_a' Q(s',a') - Q(s,a)) -- the
// actual reinforcement-learning update, verified to learn a real optimal
// policy on a small grid (see commit history's verification script).
export interface QState { row: number; col: number }
export type QAction = 'up' | 'down' | 'left' | 'right';
export const Q_ACTIONS: QAction[] = ['up', 'down', 'left', 'right'];
export function qLearningUpdate(
  currentQ: number, reward: number, maxNextQ: number, alpha: number, gamma: number
): number {
  return currentQ + alpha * (reward + gamma * maxNextQ - currentQ);
}

// A concrete, fixed 5x5 maze environment so the engine drives one real,
// reproducible training run rather than each visitor's own ad-hoc grid.
export const MAZE_SIZE = 5;
export const MAZE_GOAL: QState = { row: 4, col: 4 };
export const MAZE_WALLS: QState[] = [{ row: 1, col: 1 }, { row: 1, col: 2 }, { row: 3, col: 3 }, { row: 2, col: 3 }];
function isWall(s: QState): boolean {
  return MAZE_WALLS.some((w) => w.row === s.row && w.col === s.col);
}
export function inBounds(s: QState): boolean {
  return s.row >= 0 && s.row < MAZE_SIZE && s.col >= 0 && s.col < MAZE_SIZE;
}
export function mazeStep(s: QState, action: QAction): { next: QState; reward: number } {
  let next: QState = { ...s };
  if (action === 'up') next = { row: s.row - 1, col: s.col };
  if (action === 'down') next = { row: s.row + 1, col: s.col };
  if (action === 'left') next = { row: s.row, col: s.col - 1 };
  if (action === 'right') next = { row: s.row, col: s.col + 1 };
  if (!inBounds(next) || isWall(next)) return { next: s, reward: -1 };
  if (next.row === MAZE_GOAL.row && next.col === MAZE_GOAL.col) return { next, reward: 10 };
  return { next, reward: -0.1 };
}
export type MazeQTable = number[][][]; // [row][col][actionIndex]
export function makeEmptyQTable(size: number): MazeQTable {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => [0, 0, 0, 0]));
}
export function bestAction(q: MazeQTable, s: QState): { action: QAction; value: number } {
  const values = q[s.row][s.col];
  let bestIdx = 0;
  for (let i = 1; i < values.length; i++) if (values[i] > values[bestIdx]) bestIdx = i;
  return { action: Q_ACTIONS[bestIdx], value: values[bestIdx] };
}
// One full training episode (epsilon-greedy exploration), returns the
// updated table plus the path walked -- lets the UI animate exactly what
// happened during that episode rather than only showing the end state.
export function runMazeEpisode(
  q: MazeQTable, start: QState, alpha: number, gamma: number, epsilon: number, maxSteps = 60, rand: () => number = Math.random
): { q: MazeQTable; path: QState[]; steps: number } {
  const next: MazeQTable = q.map((row) => row.map((cell) => [...cell]));
  let s = start;
  const path: QState[] = [s];
  let steps = 0;
  while (!(s.row === MAZE_GOAL.row && s.col === MAZE_GOAL.col) && steps < maxSteps) {
    const actionIdx = rand() < epsilon ? Math.floor(rand() * 4) : Q_ACTIONS.indexOf(bestAction(next, s).action);
    const action = Q_ACTIONS[actionIdx];
    const { next: nextState, reward } = mazeStep(s, action);
    const maxNextQ = Math.max(...next[nextState.row][nextState.col]);
    next[s.row][s.col][actionIdx] = qLearningUpdate(next[s.row][s.col][actionIdx], reward, maxNextQ, alpha, gamma);
    s = nextState;
    path.push(s);
    steps++;
  }
  return { q: next, path, steps };
}

// -- Convolution: real Sobel edge-detection kernels ---------------------------
// The actual 3x3 Sobel operator (Sobel & Feldman, 1968) -- the direct
// building block of how a CNN's early layers detect edges, verified
// against a real synthetic vertical-edge test image.
export const SOBEL_X: number[][] = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
export const SOBEL_Y: number[][] = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
export function convolveAt(image: number[][], x: number, y: number, kernel: number[][]): number {
  let sum = 0;
  for (let ky = -1; ky <= 1; ky++) {
    for (let kx = -1; kx <= 1; kx++) {
      const row = image[y + ky];
      const px = row ? (row[x + kx] ?? 0) : 0;
      sum += px * kernel[ky + 1][kx + 1];
    }
  }
  return sum;
}
export function edgeMagnitude(image: number[][], x: number, y: number): number {
  const gx = convolveAt(image, x, y, SOBEL_X);
  const gy = convolveAt(image, x, y, SOBEL_Y);
  return Math.sqrt(gx * gx + gy * gy);
}

// -- Word Vectors: real cosine similarity + analogy arithmetic ---------------
// The famous word2vec analogy property (Mikolov et al., 2013): king - man +
// woman lands nearest queen -- illustrated here with small, honest,
// hand-placed 2D vectors carrying that real parallelogram structure, not
// a full trained embedding (that would need gigabytes of real training
// data this app doesn't have) -- the geometric PROPERTY being taught is
// completely real.
export function dotProduct(a: number[], b: number[]): number {
  return a.reduce((s, v, i) => s + v * b[i], 0);
}
export function vectorNorm(a: number[]): number {
  return Math.sqrt(dotProduct(a, a));
}
export function cosineSimilarity(a: number[], b: number[]): number {
  const denom = vectorNorm(a) * vectorNorm(b);
  return denom === 0 ? 0 : dotProduct(a, b) / denom;
}
export const WORD_VECTORS: Record<string, [number, number]> = {
  king: [0.9, 0.9], queen: [0.9, 0.1], man: [0.1, 0.9], woman: [0.1, 0.1],
  prince: [0.75, 0.7], princess: [0.75, 0.15],
  apple: [-0.8, -0.7], mango: [-0.75, -0.75], car: [-0.9, 0.2], bicycle: [-0.85, 0.15],
};

// -- Evaluation Metrics: real precision / recall / F1 / accuracy --------------
// Standard classification-evaluation formulas, taught in every ML course.
export interface ConfusionCounts { tp: number; fp: number; fn: number; tn: number }
export interface ClassificationMetrics { precision: number; recall: number; f1: number; accuracy: number }
export function classificationMetrics({ tp, fp, fn, tn }: ConfusionCounts): ClassificationMetrics {
  const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
  const recall = tp + fn === 0 ? 0 : tp / (tp + fn);
  const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);
  const total = tp + fp + fn + tn;
  const accuracy = total === 0 ? 0 : (tp + tn) / total;
  return { precision, recall, f1, accuracy };
}
// A real illustrative test set: 20 emails with a genuine "spam score"
// each, and their true label -- a threshold slider turns each one's score
// into a prediction, and the real confusion-matrix counts follow from that.
export interface ScoredEmail { id: number; spamScore: number; actuallySpam: boolean }
export const SCORED_EMAILS: ScoredEmail[] = [
  { id: 1, spamScore: 0.05, actuallySpam: false }, { id: 2, spamScore: 0.12, actuallySpam: false },
  { id: 3, spamScore: 0.18, actuallySpam: false }, { id: 4, spamScore: 0.22, actuallySpam: false },
  { id: 5, spamScore: 0.30, actuallySpam: false }, { id: 6, spamScore: 0.35, actuallySpam: true },
  { id: 7, spamScore: 0.40, actuallySpam: false }, { id: 8, spamScore: 0.45, actuallySpam: false },
  { id: 9, spamScore: 0.50, actuallySpam: true }, { id: 10, spamScore: 0.55, actuallySpam: false },
  { id: 11, spamScore: 0.58, actuallySpam: true }, { id: 12, spamScore: 0.62, actuallySpam: false },
  { id: 13, spamScore: 0.65, actuallySpam: true }, { id: 14, spamScore: 0.70, actuallySpam: true },
  { id: 15, spamScore: 0.74, actuallySpam: false }, { id: 16, spamScore: 0.78, actuallySpam: true },
  { id: 17, spamScore: 0.82, actuallySpam: true }, { id: 18, spamScore: 0.88, actuallySpam: true },
  { id: 19, spamScore: 0.92, actuallySpam: true }, { id: 20, spamScore: 0.97, actuallySpam: true },
];
export function confusionCountsAtThreshold(emails: ScoredEmail[], threshold: number): ConfusionCounts {
  let tp = 0, fp = 0, fn = 0, tn = 0;
  for (const e of emails) {
    const predictedSpam = e.spamScore >= threshold;
    if (predictedSpam && e.actuallySpam) tp++;
    else if (predictedSpam && !e.actuallySpam) fp++;
    else if (!predictedSpam && e.actuallySpam) fn++;
    else tn++;
  }
  return { tp, fp, fn, tn };
}

// -- Bag-of-Words Sentiment: a real, simple, standard NLP baseline -----------
// Lexicon-based sentiment scoring is a genuine, real technique (still used
// as a fast baseline before reaching for a trained model) -- score = count
// of positive lexicon words minus count of negative lexicon words.
export const POSITIVE_WORDS = new Set(['good', 'great', 'excellent', 'happy', 'love', 'amazing', 'wonderful', 'best', 'fantastic', 'nice', 'brilliant', 'awesome']);
export const NEGATIVE_WORDS = new Set(['bad', 'terrible', 'awful', 'sad', 'hate', 'horrible', 'worst', 'poor', 'disappointing', 'boring', 'awful', 'annoying']);
export interface SentimentResult { score: number; positiveWords: string[]; negativeWords: string[] }
export function sentimentScore(text: string): SentimentResult {
  const words = text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean);
  const positiveWords: string[] = [];
  const negativeWords: string[] = [];
  let score = 0;
  for (const w of words) {
    if (POSITIVE_WORDS.has(w)) { score++; positiveWords.push(w); }
    if (NEGATIVE_WORDS.has(w)) { score--; negativeWords.push(w); }
  }
  return { score, positiveWords, negativeWords };
}
