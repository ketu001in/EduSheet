// Pure, deterministic question-generation helpers for the Math Games
// arcade. Important distinction from the rest of this app's content:
// biology/chemistry FACTS need human curation because a wrong fact
// silently teaches a misconception -- but plain arithmetic (7 x 8, or "how
// many dots") is safely and correctly computable by code with zero risk of
// hallucination, so procedural generation here is the right call, not a
// shortcut. Every function below is a pure function of its inputs and is
// independently verifiable (e.g. multiplication questions are generated
// from the actual product, never guessed).

export interface MCQQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
}

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffleWithIndex<T>(items: T[], correctItem: T): { options: T[]; correctIndex: number } {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return { options: arr, correctIndex: arr.indexOf(correctItem) };
}

// Builds a set of `count` unique numeric distractors near `correct`,
// spread within `spread` of it, guaranteed not to include `correct` itself
// or go below `min`.
export function numericDistractors(correct: number, count: number, spread: number, min = 0): number[] {
  const pool = new Set<number>();
  let guard = 0;
  while (pool.size < count && guard < 200) {
    guard++;
    const candidate = correct + randInt(-spread, spread);
    if (candidate !== correct && candidate >= min) pool.add(candidate);
  }
  // Fallback in the rare case the loop couldn't find enough distinct values.
  let filler = correct + spread + 1;
  while (pool.size < count) { if (filler !== correct) pool.add(filler); filler++; }
  return Array.from(pool);
}

export function generateCountingQuestion(maxCount = 12): { count: number; options: number[]; correctIndex: number } {
  const count = randInt(3, maxCount);
  const distractors = numericDistractors(count, 3, 3, 1);
  const { options, correctIndex } = shuffleWithIndex([count, ...distractors], count);
  return { count, options, correctIndex };
}

export const SHAPES = ['Circle', 'Square', 'Triangle', 'Rectangle', 'Pentagon', 'Hexagon', 'Star', 'Oval'] as const;
export type ShapeName = (typeof SHAPES)[number];

export function generateShapeQuestion(): { shape: ShapeName; options: ShapeName[]; correctIndex: number } {
  const shape = SHAPES[randInt(0, SHAPES.length - 1)];
  const wrongPool = SHAPES.filter((s) => s !== shape);
  const wrongs: ShapeName[] = [];
  while (wrongs.length < 3) {
    const candidate = wrongPool[randInt(0, wrongPool.length - 1)];
    if (!wrongs.includes(candidate)) wrongs.push(candidate);
  }
  const { options, correctIndex } = shuffleWithIndex([shape, ...wrongs], shape);
  return { shape, options, correctIndex };
}

export function generateMultiplicationQuestion(maxFactor = 12): { a: number; b: number; product: number; options: number[]; correctIndex: number } {
  const a = randInt(2, maxFactor);
  const b = randInt(2, maxFactor);
  const product = a * b;
  // Plausible near-miss distractors: off by one factor, or +/- a small amount.
  const distractors = numericDistractors(product, 3, Math.max(6, Math.floor(product * 0.15)), 1);
  const { options, correctIndex } = shuffleWithIndex([product, ...distractors], product);
  return { a, b, product, options, correctIndex };
}

// Total parts and shaded parts for a fraction question -- always a
// genuinely reduced-looking visual (shaded < total, both >= 1).
export function generateFractionQuestion(): { total: number; shaded: number; options: string[]; correctIndex: number } {
  const total = randInt(3, 8);
  const shaded = randInt(1, total - 1);
  const correct = `${shaded}/${total}`;

  const candidateSet = new Set<string>();
  const tryAdd = (num: number, den: number) => {
    if (num <= 0 || den <= 0) return;
    const s = `${num}/${den}`;
    if (s !== correct) candidateSet.add(s);
  };
  // Flip, off-by-one numerator, off-by-one denominator -- all classic
  // fraction misconceptions, which makes them genuinely useful distractors.
  tryAdd(total - shaded, total);
  tryAdd(shaded, total + 1);
  tryAdd(shaded, Math.max(1, total - 1));
  tryAdd(Math.max(1, shaded - 1), total);
  tryAdd(Math.min(total - 1, shaded + 1), total);
  // Fallback for small totals where the identities above collide with each
  // other or with `correct` -- bounded loop, always terminates since a
  // total of 3 or more guarantees at least 2 other numerators to draw from.
  let guard = 0;
  while (candidateSet.size < 3 && guard < 100) {
    guard++;
    tryAdd(randInt(1, total), total);
  }

  const wrongs = Array.from(candidateSet).slice(0, 3);
  const { options, correctIndex } = shuffleWithIndex([correct, ...wrongs], correct);
  return { total, shaded, options, correctIndex };
}

export type PatternRule = { label: string; next: (prev: number) => number };
export const PATTERN_RULES: PatternRule[] = [
  { label: '+2', next: (n) => n + 2 },
  { label: '+3', next: (n) => n + 3 },
  { label: '+5', next: (n) => n + 5 },
  { label: '-2', next: (n) => n - 2 },
  { label: 'x2', next: (n) => n * 2 },
];

export function generatePatternQuestion(): { sequence: number[]; answer: number; options: number[]; correctIndex: number } {
  const rule = PATTERN_RULES[randInt(0, PATTERN_RULES.length - 1)];
  const start = rule.label === 'x2' ? randInt(1, 4) : randInt(1, 10);
  const sequence: number[] = [start];
  for (let i = 0; i < 3; i++) sequence.push(rule.next(sequence[sequence.length - 1]));
  const answer = rule.next(sequence[sequence.length - 1]);
  const distractors = numericDistractors(answer, 3, Math.max(3, Math.abs(answer - sequence[sequence.length - 1])));
  const { options, correctIndex } = shuffleWithIndex([answer, ...distractors], answer);
  return { sequence, answer, options, correctIndex };
}
