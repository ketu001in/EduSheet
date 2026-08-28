'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Zap, RefreshCw, Play, Sparkles } from 'lucide-react';
import { AIPlaygroundType } from '@edusheets/content';
import {
  perceptronOutput, perceptronTrainStep, SPAM_TRAINING_POINTS, PerceptronWeights,
  XOR_POINTS, perceptronXorScore, BEST_POSSIBLE_PERCEPTRON_XOR_SCORE,
  stepActivation, sigmoidActivation, reluActivation, tanhActivation,
} from '@/lib/aiCodingEngine';
import type { DecisionPlanePoint } from '@/components/techlab/DecisionPlaneScene';
// Linear regression and decision trees are plain SVG (no WebGL), so they
// don't need ssr:false code-splitting the way the 3D scenes below do.
import LinearRegressionScene from '@/components/techlab/LinearRegressionScene';
import DecisionTreeScene from '@/components/techlab/DecisionTreeScene';

// AI Lab's playground dispatcher -- see aiTypes.ts's header for why this
// is a dedicated file rather than sharing TechFoundationStage.tsx (which
// now only serves Coding Lab's search-race). Playgrounds that need a real
// 3D scene lazy-load it (ssr:false) so Three.js only downloads when a
// visitor actually opens one of those concepts, same discipline as
// Model3DViewer.
const DecisionPlaneScene = dynamic(() => import('@/components/techlab/DecisionPlaneScene'), {
  ssr: false,
  loading: () => <div className="w-full h-64 rounded-2xl bg-slate-50 dark:bg-slate-900/40 animate-pulse" />,
});
const KnnScene = dynamic(() => import('@/components/techlab/KnnScene'), {
  ssr: false,
  loading: () => <div className="w-full h-64 rounded-2xl bg-slate-50 dark:bg-slate-900/40 animate-pulse" />,
});
const KMeansScene = dynamic(() => import('@/components/techlab/KMeansScene'), {
  ssr: false,
  loading: () => <div className="w-full h-64 rounded-2xl bg-slate-50 dark:bg-slate-900/40 animate-pulse" />,
});

export default function AIFoundationStage({ type }: { type: AIPlaygroundType }) {
  switch (type) {
    case 'perceptron-trainer': return <PerceptronTrainerScene />;
    case 'xor-demo': return <XorDemoScene />;
    case 'activation-functions': return <ActivationFunctionsScene />;
    case 'knn': return <KnnScene />;
    case 'linear-regression': return <LinearRegressionScene />;
    case 'kmeans': return <KMeansScene />;
    case 'decision-tree': return <DecisionTreeScene />;
    default: return null;
  }
}

function StageCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-primary-200 dark:border-primary-900 bg-gradient-to-br from-primary-50/60 via-white to-accent-50/40 dark:from-primary-950/20 dark:via-slate-950 dark:to-accent-950/10 p-4 md:p-5 space-y-3 shadow-sm">
      {children}
    </div>
  );
}

function StageHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
      <Zap className="w-4 h-4 text-primary-600" /> {children}
    </div>
  );
}

// -- Perceptron trainer: a real spam/not-spam toy dataset, trained via the
// actual Rosenblatt (1958) update rule, one misclassified point at a time
// -- rendered as a genuine rotatable 3D decision plane (drag to spin).
const SPAM_MAX = 8; // both features (link count, exclamation count) range 0-8

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

  const scenePoints: DecisionPlanePoint[] = SPAM_TRAINING_POINTS.map((p) => ({
    x: p.x, z: p.y,
    correct: (perceptronOutput(weights.w1, weights.w2, weights.bias, p.x, p.y) >= 0 ? 1 : -1) === p.label,
    colorClass: p.label === 1 ? 'a' : 'b',
  }));

  return (
    <StageCard>
      <StageHeading>Train a Real Spam Classifier</StageHeading>
      <p className="text-center text-xs text-slate-500">One axis: links in the email. Other axis: exclamation marks. Height: the perceptron's weighted sum -- drag to rotate. Each "Train Step" applies Rosenblatt&apos;s actual 1958 update rule to one misclassified email.</p>
      <DecisionPlaneScene points={scenePoints} w1={weights.w1} w2={weights.w2} bias={weights.bias} xMax={SPAM_MAX} zMax={SPAM_MAX} height={280} />
      <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-slate-500">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" /> Not spam</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Spam</span>
        <span>Red ring = misclassified</span>
      </div>
      <div className="flex justify-center gap-2">
        <button onClick={trainStep} disabled={converged} className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold text-sm flex items-center gap-1.5 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"><Play className="w-4 h-4" /> Train Step</button>
        <button onClick={reset} className="px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-800 font-bold text-sm flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"><RefreshCw className="w-4 h-4" /> Reset</button>
      </div>
      <p className={`text-center text-sm font-bold transition-all ${converged ? 'text-accent-600 scale-105' : 'text-slate-500'}`}>
        {converged && <Sparkles className="w-4 h-4 inline mr-1 -mt-0.5" />}
        {correct}/{SPAM_TRAINING_POINTS.length} correctly classified after {steps} training step{steps === 1 ? '' : 's'}{converged ? ' -- fully trained!' : ''}
      </p>
    </StageCard>
  );
}

// -- XOR demo: prove, live, that no single perceptron can ever separate
// XOR -- BEST_POSSIBLE_PERCEPTRON_XOR_SCORE was verified by brute-force
// grid search (see aiCodingEngine.ts's comment). Also a rotatable 3D
// plane, since seeing it fail to separate all four corners from every
// angle is far more convincing than a flat line ever could be.
function XorDemoScene() {
  const [w1, setW1] = useState(1);
  const [w2, setW2] = useState(1);
  const [bias, setBias] = useState(-0.5);
  const score = perceptronXorScore(w1, w2, bias);

  const scenePoints: DecisionPlanePoint[] = XOR_POINTS.map((p) => ({
    x: p.x, z: p.y,
    correct: (perceptronOutput(w1, w2, bias, p.x, p.y) >= 0 ? 1 : 0) === p.label,
    colorClass: p.label === 1 ? 'a' : 'b',
  }));

  return (
    <StageCard>
      <StageHeading>Try to Beat XOR</StageHeading>
      <p className="text-center text-xs text-slate-500">Adjust the weights however you like and rotate the view -- no single plane can ever sort all four corners onto the correct side.</p>
      <DecisionPlaneScene points={scenePoints} w1={w1} w2={w2} bias={bias} xMax={1} zMax={1} height={280} />
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

// -- Activation functions: real formulas, plotted live -- a function curve
// is genuinely clearest as a 2D graph (forcing this into 3D would add
// nothing but noise), so this stays a crisp SVG plot with a modernized,
// gradient-filled treatment instead.
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
  const zeroY = toScreen(0, 0).sy;
  const fillPoints = `10,${zeroY} ${curvePoints} 190,${zeroY}`;
  const marker = toScreen(x, y);

  return (
    <StageCard>
      <StageHeading>Plot a Real Activation Function</StageHeading>
      <div className="flex justify-center gap-1.5 flex-wrap">
        {(Object.keys(FN_DEFS) as FnId[]).map((id) => (
          <button key={id} onClick={() => setFnId(id)} className={`px-3 py-1 rounded-full text-xs font-bold border-2 transition-all hover:scale-105 active:scale-95 ${fnId === id ? 'border-primary-600 bg-gradient-to-r from-primary-600 to-accent-500 text-white shadow-md' : 'border-slate-200 dark:border-slate-800'}`}>{FN_DEFS[id].label}</button>
        ))}
      </div>
      <div className="flex justify-center">
        <svg viewBox="0 0 200 200" className="w-60 h-60 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800">
          <defs>
            <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1={10} y1={190} x2={190} y2={190} className="stroke-slate-200 dark:stroke-slate-700" strokeWidth={1} />
          <line x1={toScreen(0, 0).sx} y1={10} x2={toScreen(0, 0).sx} y2={190} className="stroke-slate-200 dark:stroke-slate-700" strokeWidth={1} />
          <polygon points={fillPoints} fill="url(#curveFill)" />
          <polyline points={curvePoints} className="stroke-primary-600" strokeWidth={2.5} fill="none" strokeLinecap="round" />
          <circle cx={marker.sx} cy={marker.sy} r={6} className="fill-accent-500" stroke="white" strokeWidth={2} />
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
