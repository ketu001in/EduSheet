'use client';
import { useState } from 'react';
import { Zap, RefreshCw, Play } from 'lucide-react';
import { AIPlaygroundType } from '@edusheets/content';
import {
  perceptronOutput, perceptronTrainStep, perceptronClass, SPAM_TRAINING_POINTS, PerceptronWeights,
  XOR_POINTS, perceptronXorScore, BEST_POSSIBLE_PERCEPTRON_XOR_SCORE,
  stepActivation, sigmoidActivation, reluActivation, tanhActivation,
} from '@/lib/aiCodingEngine';

// AI Lab's playground dispatcher -- see aiTypes.ts's header for why this
// is a dedicated file rather than sharing TechFoundationStage.tsx (which
// now only serves Coding Lab's search-race).
export default function AIFoundationStage({ type }: { type: AIPlaygroundType }) {
  switch (type) {
    case 'perceptron-trainer': return <PerceptronTrainerScene />;
    case 'xor-demo': return <XorDemoScene />;
    case 'activation-functions': return <ActivationFunctionsScene />;
    default: return null;
  }
}

function StageCard({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border-2 border-dashed border-primary-300 dark:border-primary-800 bg-primary-50/40 dark:bg-primary-950/10 p-4 md:p-5 space-y-3">{children}</div>;
}

// -- Perceptron trainer: a real spam/not-spam toy dataset, trained via the
// actual Rosenblatt (1958) update rule, one misclassified point at a time.
const PLOT_MAX = 8; // both features (link count, exclamation count) range 0-8
function toPlotScreen(x: number, y: number) {
  return { sx: (x / PLOT_MAX) * 180 + 10, sy: 190 - (y / PLOT_MAX) * 180 };
}
function boundaryLinePoints(w1: number, w2: number, bias: number, xMin: number, xMax: number, toScreen: (x: number, y: number) => { sx: number; sy: number }) {
  if (Math.abs(w2) < 0.001) return null;
  const y1 = -(w1 * xMin + bias) / w2;
  const y2 = -(w1 * xMax + bias) / w2;
  const p1 = toScreen(xMin, y1);
  const p2 = toScreen(xMax, y2);
  return `${p1.sx},${p1.sy} ${p2.sx},${p2.sy}`;
}

function PerceptronTrainerScene() {
  const [weights, setWeights] = useState<PerceptronWeights>({ w1: 0, w2: 0, bias: 0 });
  const [trainIndex, setTrainIndex] = useState(0);
  const [steps, setSteps] = useState(0);

  const correct = SPAM_TRAINING_POINTS.filter((p) => (perceptronOutput(weights.w1, weights.w2, weights.bias, p.x, p.y) >= 0 ? 1 : -1) === p.label).length;
  const converged = correct === SPAM_TRAINING_POINTS.length;

  const trainStep = () => {
    if (converged) return;
    // Find the next misclassified point, cycling from trainIndex, and
    // apply the real perceptron update rule to it -- exactly how
    // Rosenblatt's 1958 algorithm actually trains, not a hand-tuned slider.
    for (let i = 0; i < SPAM_TRAINING_POINTS.length; i++) {
      const idx = (trainIndex + i) % SPAM_TRAINING_POINTS.length;
      const p = SPAM_TRAINING_POINTS[idx];
      const predicted = perceptronOutput(weights.w1, weights.w2, weights.bias, p.x, p.y) >= 0 ? 1 : -1;
      if (predicted !== p.label) {
        setWeights(perceptronTrainStep(weights, p.x, p.y, p.label, 0.2));
        setTrainIndex((idx + 1) % SPAM_TRAINING_POINTS.length);
        setSteps((s) => s + 1);
        return;
      }
    }
  };
  const reset = () => { setWeights({ w1: 0, w2: 0, bias: 0 }); setTrainIndex(0); setSteps(0); };

  const linePoints = boundaryLinePoints(weights.w1, weights.w2, weights.bias, -1, PLOT_MAX + 1, toPlotScreen);

  return (
    <StageCard>
      <div className="flex items-center gap-2 text-sm font-bold text-primary-700 dark:text-primary-300">
        <Zap className="w-4 h-4" /> Train a Real Spam Classifier
      </div>
      <p className="text-center text-xs text-slate-500">X-axis: number of links in the email. Y-axis: number of exclamation marks. Each "Train Step" applies Rosenblatt&apos;s actual 1958 update rule to one misclassified email.</p>
      <div className="flex justify-center">
        <svg viewBox="0 0 200 200" className="w-60 h-60 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800">
          <line x1={10} y1={10} x2={10} y2={190} className="stroke-slate-200 dark:stroke-slate-700" strokeWidth={1} />
          <line x1={10} y1={190} x2={190} y2={190} className="stroke-slate-200 dark:stroke-slate-700" strokeWidth={1} />
          {linePoints && <polyline points={linePoints} className="stroke-primary-600" strokeWidth={2} fill="none" />}
          {SPAM_TRAINING_POINTS.map((p, i) => {
            const { sx, sy } = toPlotScreen(p.x, p.y);
            const isCorrect = (perceptronOutput(weights.w1, weights.w2, weights.bias, p.x, p.y) >= 0 ? 1 : -1) === p.label;
            return (
              <circle key={i} cx={sx} cy={sy} r={6} className={p.label === 1 ? 'fill-amber-500' : 'fill-sky-500'} stroke={isCorrect ? 'none' : '#dc2626'} strokeWidth={isCorrect ? 0 : 2.5} />
            );
          })}
        </svg>
      </div>
      <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-slate-500">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" /> Not spam</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Spam</span>
        <span>Red outline = misclassified</span>
      </div>
      <div className="flex justify-center gap-2">
        <button onClick={trainStep} disabled={converged} className="px-4 py-2 rounded-lg bg-primary-600 text-white font-bold text-sm flex items-center gap-1.5 disabled:opacity-50"><Play className="w-4 h-4" /> Train Step</button>
        <button onClick={reset} className="px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-800 font-bold text-sm flex items-center gap-1.5"><RefreshCw className="w-4 h-4" /> Reset</button>
      </div>
      <p className={`text-center text-sm font-bold ${converged ? 'text-accent-600' : 'text-slate-500'}`}>
        {correct}/{SPAM_TRAINING_POINTS.length} correctly classified after {steps} training step{steps === 1 ? '' : 's'}{converged ? ' -- fully trained!' : ''}
      </p>
    </StageCard>
  );
}

// -- XOR demo: prove, live, that no single perceptron can ever separate
// XOR -- BEST_POSSIBLE_PERCEPTRON_XOR_SCORE was verified by brute-force
// grid search (see aiCodingEngine.ts's comment).
function toXorScreen(x: number, y: number) {
  return { sx: x * 160 + 20, sy: 180 - y * 160 };
}
function XorDemoScene() {
  const [w1, setW1] = useState(1);
  const [w2, setW2] = useState(1);
  const [bias, setBias] = useState(-0.5);
  const score = perceptronXorScore(w1, w2, bias);
  const linePoints = boundaryLinePoints(w1, w2, bias, -0.5, 1.5, toXorScreen);

  return (
    <StageCard>
      <div className="flex items-center gap-2 text-sm font-bold text-primary-700 dark:text-primary-300">
        <Zap className="w-4 h-4" /> Try to Beat XOR
      </div>
      <p className="text-center text-xs text-slate-500">Adjust the weights however you like -- no single straight line can ever separate the 1s from the 0s below.</p>
      <div className="flex justify-center">
        <svg viewBox="0 0 200 200" className="w-56 h-56 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800">
          <line x1={20} y1={20} x2={20} y2={180} className="stroke-slate-200 dark:stroke-slate-700" strokeWidth={1} />
          <line x1={20} y1={180} x2={180} y2={180} className="stroke-slate-200 dark:stroke-slate-700" strokeWidth={1} />
          {linePoints && <polyline points={linePoints} className="stroke-primary-600" strokeWidth={2} fill="none" />}
          {XOR_POINTS.map((p, i) => {
            const { sx, sy } = toXorScreen(p.x, p.y);
            const isCorrect = (perceptronOutput(w1, w2, bias, p.x, p.y) >= 0 ? 1 : 0) === p.label;
            return (
              <g key={i}>
                <circle cx={sx} cy={sy} r={9} className={p.label === 1 ? 'fill-amber-500' : 'fill-sky-500'} stroke={isCorrect ? 'none' : '#dc2626'} strokeWidth={isCorrect ? 0 : 2.5} />
                <text x={sx} y={sy + 3} textAnchor="middle" className="fill-white text-[9px] font-bold">{p.label}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <label className="block text-xs font-bold text-slate-500 space-y-1">
          <span>Weight w1 ({w1.toFixed(1)})</span>
          <input type="range" min={-3} max={3} step={0.1} value={w1} onChange={(e) => setW1(parseFloat(e.target.value))} className="w-full accent-primary-600" />
        </label>
        <label className="block text-xs font-bold text-slate-500 space-y-1">
          <span>Weight w2 ({w2.toFixed(1)})</span>
          <input type="range" min={-3} max={3} step={0.1} value={w2} onChange={(e) => setW2(parseFloat(e.target.value))} className="w-full accent-primary-600" />
        </label>
        <label className="block text-xs font-bold text-slate-500 space-y-1">
          <span>Bias ({bias.toFixed(1)})</span>
          <input type="range" min={-3} max={3} step={0.1} value={bias} onChange={(e) => setBias(parseFloat(e.target.value))} className="w-full accent-primary-600" />
        </label>
      </div>
      <p className="text-center text-sm font-bold text-slate-500">{score}/4 correctly classified</p>
      <p className="text-center text-[11px] text-slate-400">Verified best possible for any single perceptron: <span className="font-bold text-primary-600">{BEST_POSSIBLE_PERCEPTRON_XOR_SCORE}/4</span> -- checked against 227,000+ weight combinations, never 4/4.</p>
    </StageCard>
  );
}

// -- Activation functions: real formulas, plotted live -----------------------
type FnId = 'step' | 'sigmoid' | 'tanh' | 'relu';
const FN_DEFS: Record<FnId, { label: string; fn: (x: number) => number; yMin: number; yMax: number }> = {
  step: { label: 'Step', fn: stepActivation, yMin: -0.2, yMax: 1.2 },
  sigmoid: { label: 'Sigmoid', fn: sigmoidActivation, yMin: -0.1, yMax: 1.1 },
  tanh: { label: 'Tanh', fn: tanhActivation, yMin: -1.2, yMax: 1.2 },
  relu: { label: 'ReLU', fn: reluActivation, yMin: -0.5, yMax: 6.2 },
};
function ActivationFunctionsScene() {
  const [fnId, setFnId] = useState<FnId>('sigmoid');
  const [x, setX] = useState(0);
  const { fn, yMin, yMax } = FN_DEFS[fnId];
  const y = fn(x);

  const toScreen = (px: number, py: number) => ({
    sx: ((px + 6) / 12) * 180 + 10,
    sy: 190 - ((py - yMin) / (yMax - yMin)) * 180,
  });
  const curvePoints = Array.from({ length: 97 }, (_, i) => {
    const px = -6 + (i / 96) * 12;
    const { sx, sy } = toScreen(px, fn(px));
    return `${sx},${sy}`;
  }).join(' ');
  const marker = toScreen(x, y);

  return (
    <StageCard>
      <div className="flex items-center gap-2 text-sm font-bold text-primary-700 dark:text-primary-300">
        <Zap className="w-4 h-4" /> Plot a Real Activation Function
      </div>
      <div className="flex justify-center gap-1.5 flex-wrap">
        {(Object.keys(FN_DEFS) as FnId[]).map((id) => (
          <button key={id} onClick={() => setFnId(id)} className={`px-3 py-1 rounded-full text-xs font-bold border-2 transition-all ${fnId === id ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'border-slate-200 dark:border-slate-800'}`}>{FN_DEFS[id].label}</button>
        ))}
      </div>
      <div className="flex justify-center">
        <svg viewBox="0 0 200 200" className="w-60 h-60 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800">
          <line x1={10} y1={190} x2={190} y2={190} className="stroke-slate-200 dark:stroke-slate-700" strokeWidth={1} />
          <line x1={toScreen(0, 0).sx} y1={10} x2={toScreen(0, 0).sx} y2={190} className="stroke-slate-200 dark:stroke-slate-700" strokeWidth={1} />
          <polyline points={curvePoints} className="stroke-primary-600" strokeWidth={2} fill="none" />
          <circle cx={marker.sx} cy={marker.sy} r={5} className="fill-accent-500" />
        </svg>
      </div>
      <label className="block text-xs font-bold text-slate-500 space-y-1 max-w-xs mx-auto">
        <span>Input x ({x.toFixed(1)})</span>
        <input type="range" min={-6} max={6} step={0.1} value={x} onChange={(e) => setX(parseFloat(e.target.value))} className="w-full accent-primary-600" />
      </label>
      <p className="text-center text-sm font-bold text-slate-600 dark:text-slate-300">{FN_DEFS[fnId].label}({x.toFixed(1)}) = {y.toFixed(3)}</p>
    </StageCard>
  );
}
