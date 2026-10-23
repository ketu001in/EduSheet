// Shared types for AI Lab -- promoted out of the shared techFoundations
// system (see techFoundationsTypes.ts, still used by Coding Lab) into its
// own dedicated system, the same move Robotics Lab made earlier (see
// roboticsTypes.ts's header). Direct response to feedback that the AI Lab
// "kind of 2D space" perceptron screen needed real improvement and that
// the lab as a whole needed "max topics and vast experiments space":
// real sections (not one flat list), real applications, real history,
// and every interactive backed by a genuinely verified formula/algorithm
// in aiCodingEngine.ts -- never a slider that just "looks like" it's
// doing something.
export type AISection = 'foundations' | 'classic-ml' | 'computer-vision' | 'nlp' | 'ethics';

export type AIPlaygroundType =
  | 'perceptron-trainer'
  | 'xor-demo'
  | 'activation-functions'
  | 'knn'
  | 'linear-regression'
  | 'kmeans'
  | 'decision-tree'
  | 'convolution'
  | 'none';

export interface AIConcept {
  id: string;
  section: AISection;
  name: string;
  tagline: string;
  overview: string;
  howItWorks: string[];
  keyFacts: string[];
  realExamples: string[];
  playgroundType: AIPlaygroundType;
  playgroundConfig?: Record<string, unknown>;
}

// AI + IoT and the real-world Applications Gallery (later phases) --
// mirrors RoboticsApplication's shape (roboticsTypes.ts) deliberately, so
// the same gallery/detail-modal components can eventually be generalized
// rather than re-invented per lab.
export type AIApplicationCategory = 'healthcare' | 'agriculture' | 'iot' | 'everyday' | 'industry' | 'safety';
export type AIApplicationGradeBand = 'junior' | 'middle' | 'senior' | 'plusTwo';

export interface AIApplication {
  id: string;
  name: string;
  category: AIApplicationCategory;
  gradeBand: AIApplicationGradeBand;
  tagline: string;
  overview: string;
  howItWorks: string[];
  realExamples: string[];
  deepFacts: string[];
  realWorldImpact: string;
  careersAndFutures: string;
}
