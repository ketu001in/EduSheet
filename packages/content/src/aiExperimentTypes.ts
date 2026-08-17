// Shared types for AI Lab's "Hands-On Experiments Laboratory" tab --
// same move as roboticsExperimentTypes.ts: the Foundations/Classic ML
// tabs, however real their content, are still a knowledgebase with
// widgets embedded in it. This is the actual lab -- design something,
// run it, watch it genuinely succeed or fail, change a parameter, run it
// again. Each experiment is backed by real, verified algorithms in
// aiExperimentsEngine.ts, deliberately covering ground Foundations/
// Classic ML don't: a real trainable multi-layer network, reinforcement
// learning, computer vision, NLP, and model evaluation.
export type AIExperimentCategory =
  | 'neural-networks'
  | 'optimization'
  | 'reinforcement-learning'
  | 'computer-vision'
  | 'nlp'
  | 'model-evaluation';

export type AIExperimentOutputType = 'training' | 'search' | 'vision' | 'language' | 'metrics';
export type AIExperimentDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type AIExperimentPlaygroundType =
  | 'neural-net-trainer'
  | 'gradient-descent-3d'
  | 'q-learning-maze'
  | 'edge-detection'
  | 'word-vector-analogy'
  | 'confusion-matrix-lab'
  | 'sentiment-classifier';

export interface AIExperiment {
  id: string;
  category: AIExperimentCategory;
  name: string;
  tagline: string;
  overview: string;
  whatYoullDo: string[];
  realWorldTieIn: string;
  componentsUsed: string[];
  outputType: AIExperimentOutputType;
  difficulty: AIExperimentDifficulty;
  playgroundType: AIExperimentPlaygroundType;
  playgroundConfig?: Record<string, unknown>;
}
