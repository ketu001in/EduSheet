'use client';
import dynamic from 'next/dynamic';
import { AIExperimentPlaygroundType } from '@edusheets/content';

// AI Lab's Hands-On Experiments dispatcher -- mirrors
// RoboticsExperimentStage.tsx exactly. Medium is chosen per experiment,
// not defaulted to 3D: neural network training, gradient descent, and
// Q-learning are genuinely spatial processes rendered as real 3D scenes
// via SafeR3FCanvas; convolution, word vectors, and evaluation metrics
// use a 2D pixel grid / vector plane / table because that IS the honest
// medium those algorithms actually operate in -- see each scene's own
// header for the reasoning. Every scene is dynamically imported
// (ssr:false) so Three.js only downloads when a 3D scene is actually
// opened, same discipline as Model3DViewer / RoboticsExperimentStage.
const dyn = (loader: () => Promise<{ default: React.ComponentType<any> }>) => dynamic(loader, {
  ssr: false,
  loading: () => <div className="w-full h-64 rounded-2xl bg-slate-50 dark:bg-slate-900/40 animate-pulse" />,
});

const NeuralNetTrainerScene = dyn(() => import('@/components/techlab/NeuralNetTrainer3DScene'));
const GradientDescentScene = dyn(() => import('@/components/techlab/GradientDescent3DScene'));
const QLearningMazeScene = dyn(() => import('@/components/techlab/QLearningMaze3DScene'));
const EdgeDetection = dyn(() => import('@/components/techlab/EdgeDetectionScene'));
const WordVectorAnalogy = dyn(() => import('@/components/techlab/WordVectorAnalogyScene'));
const ConfusionMatrix = dyn(() => import('@/components/techlab/ConfusionMatrixScene'));
const SentimentClassifier = dyn(() => import('@/components/techlab/SentimentClassifierScene'));

export default function AIExperimentStage({ type, config }: { type: AIExperimentPlaygroundType; config: Record<string, any> }) {
  switch (type) {
    case 'neural-net-trainer': return <NeuralNetTrainerScene />;
    case 'gradient-descent-3d': return <GradientDescentScene />;
    case 'q-learning-maze': return <QLearningMazeScene />;
    case 'edge-detection': return <EdgeDetection />;
    case 'word-vector-analogy': return <WordVectorAnalogy />;
    case 'confusion-matrix-lab': return <ConfusionMatrix />;
    case 'sentiment-classifier': return <SentimentClassifier />;
    default: return null;
  }
}
