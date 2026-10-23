import { AIExperiment } from './aiExperimentTypes';

// 7 real hands-on experiments, each a genuine design-and-iterate loop
// backed by algorithms verified in aiExperimentsEngine.ts -- not a
// slider that merely looks like it's doing something. Medium (3D scene
// vs. 2D/tabular) was chosen per experiment, not defaulted: neural
// network training, gradient descent, and Q-learning are genuinely
// spatial processes, so they're real 3D scenes; a 2D pixel grid, a 2D
// vector plane, and a list of emails are the honest medium for
// convolution, word-vector arithmetic, and confusion-matrix metrics --
// forcing those into 3D would add a fake extra axis, not real clarity.
export const AI_EXPERIMENTS: AIExperiment[] = [
  {
    id: 'exp-neural-net-trainer',
    category: 'neural-networks',
    name: 'Neural Network Trainer: Solving XOR',
    tagline: 'The exact problem a single perceptron provably cannot solve -- watch a real 2-layer network learn it, weight by weight.',
    overview: 'Train a genuine 2-input, 2-hidden-neuron, 1-output neural network with real backpropagation on the full XOR dataset -- watch the decision surface twist itself from useless to correct as gradients actually flow backward through the network, one epoch at a time.',
    whatYoullDo: [
      'Start an untrained network and see its decision surface is close to a flat, useless guess.',
      'Run real backpropagation training and watch the surface visibly fold into the two-region shape XOR needs.',
      'Reset and change the learning rate -- see training converge slower, faster, or not at all, exactly like real training runs.',
    ],
    realWorldTieIn: 'This is the exact algorithm (Rumelhart, Hinton & Williams, 1986) underneath every modern deep learning model -- the same backward gradient flow, just scaled up from 2 hidden neurons to billions.',
    componentsUsed: ['2-2-1 neural network', 'Sigmoid activations', 'Backpropagation trainer'],
    outputType: 'training',
    difficulty: 'intermediate',
    playgroundType: 'neural-net-trainer',
  },
  {
    id: 'exp-gradient-descent-landscape',
    category: 'optimization',
    name: 'Gradient Descent Landscape',
    tagline: 'Drop a ball on a real loss surface and watch it roll downhill -- or fly off the edge if you push it too hard.',
    overview: 'Place a marker anywhere on a real 3D bowl-shaped loss surface and watch real gradient descent walk it step by step toward the minimum -- then push the learning rate too high and watch the exact same real math genuinely diverge instead.',
    whatYoullDo: [
      'Click anywhere on the surface to start and watch the marker roll downhill toward the minimum.',
      'Raise the learning rate gradually and find the point where descent starts overshooting the bottom.',
      'Push it further and watch real, visible divergence -- the marker flying further from the minimum with every step, a genuine and common training failure.',
    ],
    realWorldTieIn: 'Every neural network (including the one in the experiment next to this one) is trained by exactly this algorithm -- gradient descent on a loss surface, just with millions of dimensions instead of two.',
    componentsUsed: ['Loss surface f(x,y) = x² + y²', 'Gradient descent optimizer'],
    outputType: 'training',
    difficulty: 'beginner',
    playgroundType: 'gradient-descent-3d',
  },
  {
    id: 'exp-q-learning-maze',
    category: 'reinforcement-learning',
    name: 'Q-Learning Maze Runner',
    tagline: 'No one tells the agent the way out -- it learns the path purely from trial, error, and reward.',
    overview: 'Watch a real reinforcement-learning agent explore a 3D grid maze with no map and no instructions -- only a reward at the goal and a real Bellman-equation update after every move -- and see it genuinely learn, over real training episodes, which direction to move from every single cell.',
    whatYoullDo: [
      'Run training episodes and watch the agent wander randomly at first, then increasingly head straight for the goal.',
      'Reveal the learned Q-values on the grid and see the real learned "value" of every cell, highest near the goal.',
      'Switch to "policy mode" and watch the agent walk the shortest path it discovered entirely on its own.',
    ],
    realWorldTieIn: 'Q-learning (Watkins, 1989) is the same family of algorithm behind real game-playing AI (including early Atari-playing agents) and real robot navigation systems that learn by trial and error rather than being explicitly programmed.',
    componentsUsed: ['5x5 grid maze', 'Q-table', 'Bellman update rule'],
    outputType: 'search',
    difficulty: 'advanced',
    playgroundType: 'q-learning-maze',
    playgroundConfig: { gridSize: 5 },
  },
  {
    id: 'exp-edge-detection',
    category: 'computer-vision',
    name: 'Edge Detection Lab (Sobel Kernel)',
    tagline: 'The actual first step inside a real computer-vision model -- run it yourself, pixel by pixel.',
    overview: 'Run the real 3x3 Sobel convolution kernel over an editable pixel grid and watch genuine horizontal and vertical gradients get computed at every pixel -- draw a shape, then see exactly which pixels the algorithm marks as an edge and why, using the literal formula real CNNs build on.',
    whatYoullDo: [
      'Paint a simple shape onto the pixel grid using light and dark pixels.',
      'Run the real Sobel kernel and watch the edge-strength map compute live, pixel by pixel.',
      'Click any single pixel to see its exact Gx, Gy, and combined gradient magnitude -- the real numbers behind the highlight.',
    ],
    realWorldTieIn: 'The Sobel operator (Sobel & Feldman, 1968) is a genuine, still-used edge-detection kernel, and convolution -- sliding a small kernel like this across an image -- is the exact core operation inside every convolutional neural network.',
    componentsUsed: ['8x8 editable pixel grid', 'Sobel Gx/Gy kernels', 'Convolution engine'],
    outputType: 'vision',
    difficulty: 'intermediate',
    playgroundType: 'edge-detection',
    playgroundConfig: { gridSize: 8 },
  },
  {
    id: 'exp-word-vector-analogy',
    category: 'nlp',
    name: 'Word Vector Analogy Playground',
    tagline: 'king - man + woman lands almost exactly on queen -- a real, famous property of word embeddings, shown honestly.',
    overview: 'Explore a small set of hand-placed word vectors on a real 2D plane -- king, queen, man, woman and more -- and use real vector arithmetic and cosine similarity to test the famous word2vec analogy property, seeing exactly which word the math lands closest to.',
    whatYoullDo: [
      'Pick two analogy words (like man/woman) and a starting word (like king), and watch the real vector arithmetic compute a target point.',
      'See the real cosine-similarity ranking of every other word against that computed point.',
      'Try a distractor-heavy set of words and see the analogy still correctly beat unrelated words.',
    ],
    realWorldTieIn: 'This is the real, famous analogy property discovered in word2vec (Mikolov et al., 2013) -- shown here with small, honest, hand-placed 2D vectors carrying the real parallelogram structure, not a claim of reproducing a full trained embedding model.',
    componentsUsed: ['2D word vector space', 'Cosine similarity', 'Vector arithmetic'],
    outputType: 'language',
    difficulty: 'intermediate',
    playgroundType: 'word-vector-analogy',
  },
  {
    id: 'exp-confusion-matrix-lab',
    category: 'model-evaluation',
    name: 'Spam Filter: Confusion Matrix Lab',
    tagline: 'A model is never just "accurate" -- drag the threshold and watch precision and recall genuinely trade off.',
    overview: 'A real spam classifier has already scored 20 emails from 0 (definitely not spam) to 1 (definitely spam) -- drag a decision threshold and watch the real confusion matrix, precision, recall, F1, and accuracy recompute live from the actual predictions that threshold produces.',
    whatYoullDo: [
      'Drag the threshold to 0 and see every email classified spam -- perfect recall, terrible precision.',
      'Drag it to 1 and see the opposite failure -- perfect precision, almost no recall.',
      'Find a middle threshold and watch F1 genuinely peak somewhere in between, then explain why in your own words.',
    ],
    realWorldTieIn: 'Precision/recall trade-offs like this are exactly why real spam filters, medical screening models, and fraud detectors don\'t just report "accuracy" -- the threshold you pick changes what kind of mistake the model makes.',
    componentsUsed: ['20 pre-scored emails', 'Decision threshold', 'Confusion matrix'],
    outputType: 'metrics',
    difficulty: 'intermediate',
    playgroundType: 'confusion-matrix-lab',
  },
  {
    id: 'exp-sentiment-classifier',
    category: 'nlp',
    name: 'Bag-of-Words Sentiment Classifier',
    tagline: 'Type any sentence and watch a real, simple NLP baseline score it word by word.',
    overview: 'Type any sentence and watch a genuine bag-of-words sentiment scorer highlight every word it recognizes from a real positive/negative lexicon, tallying a live score -- the same simple, real technique used as a fast baseline before reaching for a trained model.',
    whatYoullDo: [
      'Type a clearly positive sentence and watch which exact words get counted, and why the score lands where it does.',
      'Type a sentence with no lexicon words at all and see the honest "neutral, no signal" result.',
      'Try to trick the classifier with sarcasm or negation, and see it fail the way a real bag-of-words model genuinely would.',
    ],
    realWorldTieIn: 'Lexicon-based sentiment scoring is a real, still-used fast baseline in real NLP pipelines -- and its real, honest failure on sarcasm and negation is exactly why more advanced models (like the neural network in this same lab) are needed for harder cases.',
    componentsUsed: ['Positive/negative word lexicon', 'Bag-of-words scorer'],
    outputType: 'language',
    difficulty: 'beginner',
    playgroundType: 'sentiment-classifier',
  },
];
