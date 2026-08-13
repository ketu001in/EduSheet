import { AIConcept } from './aiTypes';

// AI Lab's Foundations section -- migrated and rebuilt from the old
// techFoundations.ts AI_CONCEPTS (Coding Lab's CODING_CONCEPTS stays there
// unchanged). Direct response to feedback that the perceptron screen was
// "kind of 2D space" with little real substance: the toy dataset now has
// real meaning (a spam/not-spam classifier), training happens via the
// actual Rosenblatt update rule rather than hand-dragged sliders, the
// historically pivotal XOR limitation gets its own real, brute-force-
// verified demonstration (see aiCodingEngine.ts), and activation
// functions -- the other missing piece needed to explain how a real
// neural network unit works -- get their own real, plotted interactive.
// Every fact below is independently checkable (named researchers, dated
// papers/events), never generated.
export const AI_FOUNDATIONS: AIConcept[] = [
  {
    id: 'ai-vs-traditional-programming',
    section: 'foundations',
    name: 'What Is AI? (vs Traditional Programming)',
    tagline: 'One starts with rules. The other starts with examples.',
    overview: 'Traditional programming and machine learning solve problems in fundamentally opposite directions.',
    howItWorks: [
      'Traditional programming: a human writes explicit RULES; the computer applies those rules to INPUT data to produce OUTPUT.',
      'Machine learning: a human provides many INPUT-OUTPUT example pairs (training data), and the algorithm works out the RULES, a model, that best fit those examples.',
      'Once trained, that learned model can be applied to brand-new inputs it has never seen before, predicting a reasonable output based on the patterns it found.',
    ],
    keyFacts: [
      'This "rules vs examples" framing is literally how Arthur Samuel, who coined the term "machine learning" in 1959, described it: giving computers the ability to learn without being explicitly programmed for every case.',
      "A traditional program behaves 100% predictably given the same input every time; a trained ML model's output depends entirely on the quality and pattern of its training data.",
      "Not all AI is machine learning -- some AI systems, like simple rule-based chatbots, are just carefully hand-coded traditional programs with no learning involved at all.",
    ],
    realExamples: ['A calculator app (traditional programming: exact rules for arithmetic)', 'Google Teachable Machine image classifiers (machine learning: trained from example photos)', 'Email spam filters (a real mix of rule-based and ML-based techniques)'],
    playgroundType: 'none',
  },
  {
    id: 'ai-types-of-ml',
    section: 'foundations',
    name: 'Types of Machine Learning',
    tagline: 'Three fundamentally different approaches, depending on what training data is even available.',
    overview: 'Machine learning splits into three approaches: supervised, unsupervised, and reinforcement learning.',
    howItWorks: [
      'SUPERVISED learning: trained on labeled examples, input paired with the correct output -- e.g. photos labeled "cat" or "dog".',
      'UNSUPERVISED learning: trained on unlabeled data, looking for hidden patterns or groupings on its own -- e.g. grouping customers into segments with no predefined categories.',
      'REINFORCEMENT learning: an agent learns by trial and error, receiving rewards or penalties for its actions in an environment -- e.g. a game-playing AI learning by playing millions of matches against itself.',
    ],
    keyFacts: [
      "Google Teachable Machine, used elsewhere in Tech Lab's AI projects, is a supervised learning tool -- every training photo is labeled by the student.",
      "DeepMind's AlphaGo, which beat world champion Go players in 2016, was trained substantially using reinforcement learning, playing millions of games against itself.",
      'Unsupervised learning is genuinely harder to evaluate than supervised learning, since there is no single "correct answer" to check the result against.',
    ],
    realExamples: ['Supervised: Teachable Machine classifiers, spam detection', 'Unsupervised: customer segmentation, bank fraud anomaly detection', 'Reinforcement: game-playing AI, robot locomotion training'],
    playgroundType: 'none',
  },
  {
    id: 'ai-perceptron',
    section: 'foundations',
    name: "The Perceptron -- AI's Simplest Building Block",
    tagline: 'One artificial neuron doing simple weighted arithmetic -- the direct ancestor of every modern neural network.',
    overview: "Long before deep learning, a single \"perceptron\" was the first working model of how a neural network could learn to classify things -- and it can genuinely be trained, not just hand-tuned.",
    howItWorks: [
      'Each input value is multiplied by its own adjustable "weight", and all the results are added together along with a "bias" value.',
      'If that final sum is positive (or above a threshold), the perceptron outputs one class; if negative, it outputs the other.',
      'TRAINING means running Rosenblatt\'s actual 1958 update rule on real labeled examples, one at a time: if a point is misclassified, nudge every weight by (learning rate) x (error) x (that input) -- repeat over the whole dataset until every point is correctly classified.',
    ],
    keyFacts: [
      'Invented by Frank Rosenblatt in 1958 at Cornell -- the perceptron is the direct ancestor of every modern neural network, including the ones behind image recognition and large language models today.',
      'A single perceptron can only learn to separate data that is "linearly separable" (a straight line/plane can divide the two classes) -- a real limitation that matters enough to have its own dedicated demonstration below.',
      'Modern deep neural networks are, at their core, many perceptron-like units connected in layers -- the same weighted-sum-plus-threshold idea, stacked millions of times.',
    ],
    realExamples: ['The mathematical building block inside every modern neural network layer', 'Simple linear classifiers still used for genuinely simple, linearly-separable problems', 'The Mark I Perceptron machine (1958), one of the first neural-network hardware implementations ever built'],
    playgroundType: 'perceptron-trainer',
  },
  {
    id: 'ai-xor-limitation',
    section: 'foundations',
    name: 'The XOR Problem -- Where a Single Perceptron Actually Fails',
    tagline: 'A real, provable limitation that briefly slowed down all of AI research.',
    overview: 'Some genuinely simple classification problems cannot be solved by any single perceptron at all, no matter how its weights are tuned -- XOR (exclusive-or) is the classic example.',
    howItWorks: [
      'XOR takes two binary inputs and outputs 1 only when they DIFFER: (0,0)->0, (1,0)->1, (0,1)->1, (1,1)->0.',
      'Plotted on a graph, the two "1" points and the two "0" points cannot be separated by any single straight line -- try every possible weight and bias combination, and at least one point is always misclassified.',
      'The fix is adding a hidden layer: two perceptron-like units feeding into a third one CAN represent XOR, because each hidden unit draws its own line and the output unit combines them -- the seed of every modern multi-layer network.',
    ],
    keyFacts: [
      'This exact limitation was rigorously proven by Marvin Minsky and Seymour Papert in their 1969 book "Perceptrons" -- a landmark, genuinely correct mathematical result, not an opinion.',
      'The XOR proof is widely credited with contributing to the first "AI winter" -- a real, multi-year slowdown in AI research funding and interest through the 1970s, since it dampened enthusiasm for neural-network research specifically.',
      "Multi-layer networks solving exactly this problem, trained via backpropagation (popularized by Rumelhart, Hinton, and Williams' 1986 paper), is what eventually revived neural-network research.",
    ],
    realExamples: ['XOR is the textbook first example every machine learning course uses to introduce why depth (multiple layers) matters', 'The same "combine multiple simple boundaries" idea scales up to how real deep networks separate far more complex data, like images', "Historically real: this is the specific mathematical result that slowed neural-network research for over a decade"],
    playgroundType: 'xor-demo',
  },
  {
    id: 'ai-neural-networks',
    section: 'foundations',
    name: 'Neural Networks: Stacking Perceptrons in Layers',
    tagline: 'The exact fix for the XOR problem above -- and the basis of every modern deep learning system.',
    overview: 'A neural network connects many perceptron-like units ("neurons") in layers, letting the network represent far more complex patterns than any single perceptron could alone.',
    howItWorks: [
      'An INPUT layer receives the raw data; one or more HIDDEN layers each combine the previous layer\'s outputs with their own weights; an OUTPUT layer produces the final prediction.',
      'Each neuron still does the same basic perceptron arithmetic (weighted sum + bias) -- but then passes that sum through an activation function (see below) before sending it to the next layer.',
      'A network with just one hidden layer of enough units can already represent XOR and, more generally, any non-linearly-separable boundary -- "deep learning" simply means using many hidden layers, letting the network build up increasingly complex features layer by layer.',
    ],
    keyFacts: [
      'The word "deep" in deep learning literally refers to having many hidden layers stacked -- not any deeper meaning than that.',
      'Backpropagation -- the algorithm that actually trains multi-layer networks by working out how much each weight in every layer contributed to the final error -- was popularized by a highly-cited 1986 paper from David Rumelhart, Geoffrey Hinton, and Ronald Williams.',
      "Modern large models (like the ones behind image recognition and language AI) can have hundreds of layers and billions of individual weights -- the same layered structure, just at an enormous scale.",
    ],
    realExamples: ['Image recognition networks with dozens of convolutional layers', 'The hidden layers inside every modern voice assistant\'s speech recognition model', 'A simple 1-hidden-layer network solving XOR, the smallest possible example of "why depth matters"'],
    playgroundType: 'none',
  },
  {
    id: 'ai-activation-functions',
    section: 'foundations',
    name: 'Activation Functions: How a Neuron Decides What to Pass On',
    tagline: 'The real formulas that turn a raw weighted sum into a neuron\'s actual output.',
    overview: 'An activation function takes a neuron\'s raw weighted sum and transforms it into the value actually passed to the next layer -- the specific choice of function has real, measurable consequences for how well a network trains.',
    howItWorks: [
      'STEP: outputs exactly 1 or 0 depending on the sign of the sum -- the original 1958 perceptron\'s function, simple but not smoothly trainable by gradient-based methods.',
      'SIGMOID: squashes any input into a smooth curve between 0 and 1 -- historically popular, and still used to output a genuine probability.',
      'TANH: like sigmoid but zero-centered, squashing input into a range between -1 and 1.',
      'RELU (Rectified Linear Unit): outputs the input directly if positive, otherwise 0 -- simple, fast to compute, and the dominant choice in most modern deep networks.',
    ],
    keyFacts: [
      'Sigmoid and tanh both suffer from a real, well-documented problem called "vanishing gradients" in deep networks -- their curves flatten out for large inputs, which slows or stalls training in networks with many layers.',
      'ReLU\'s simplicity (and its resistance to the vanishing-gradient problem) is a major reason it became the standard choice as networks got dramatically deeper through the 2010s, including in AlexNet, the 2012 network that helped launch the modern deep learning era.',
      'A network built entirely from linear operations, with no non-linear activation function at all, mathematically collapses into being no more powerful than a single-layer perceptron, no matter how many layers it has -- the activation function is precisely what makes depth actually useful.',
    ],
    realExamples: ['Sigmoid: the output layer of a model predicting "probability this email is spam"', 'ReLU: the hidden layers of most modern image-recognition and language models', 'Tanh: historically common in the hidden layers of earlier-generation neural networks'],
    playgroundType: 'activation-functions',
  },
  {
    id: 'ai-training-data',
    section: 'foundations',
    name: 'Training Data: The Fuel of Machine Learning',
    tagline: 'A model is only ever as good as the data it learned from -- genuinely the single biggest factor in whether AI works.',
    overview: 'Training data quality and representativeness is usually the single biggest factor in whether a machine learning system works well or badly.',
    howItWorks: [
      'More training examples generally let a model learn more reliable, general patterns, rather than memorizing quirks of just a few examples.',
      'Training data must be representative -- covering the real variety of cases the model will actually see, not just the easiest examples to collect.',
      '"Overfitting" happens when a model learns the training examples too exactly, including their noise, and then performs poorly on new, real-world data.',
    ],
    keyFacts: [
      '"Garbage in, garbage out" is a genuinely accurate description of machine learning -- a model trained on biased or unrepresentative data makes biased or unreliable predictions, no matter how sophisticated its algorithm is.',
      'Large modern language models are trained on datasets containing many billions of words -- unimaginable scale for a classroom project, but the same underlying principle as training a Teachable Machine model on 20 photos.',
      'Data labeling -- humans manually tagging training examples with correct answers -- is a genuine, large global industry, since supervised learning depends entirely on correctly labeled data.',
    ],
    realExamples: ['A Teachable Machine model trained on too few photos performing badly on new ones', 'Self-driving car companies collecting millions of real driving miles as training data', 'ImageNet, a famous dataset of over 14 million labeled images that helped launch the modern deep learning era'],
    playgroundType: 'none',
  },
  {
    id: 'ai-bias',
    section: 'ethics',
    name: 'Bias in AI',
    tagline: 'A real, well-documented problem -- not a hypothetical one.',
    overview: "When training data doesn't fairly represent the real world, the resulting AI model can make systematically unfair or inaccurate predictions for underrepresented groups.",
    howItWorks: [
      'If a training dataset over-represents certain groups or situations and under-represents others, the model learns patterns that work well for the over-represented cases and poorly for the rest.',
      'This bias can enter completely unintentionally, through whoever happened to be easiest or cheapest to collect data from.',
      "Detecting bias requires deliberately testing a model's performance separately across different real-world groups, not just checking its overall average accuracy.",
    ],
    keyFacts: [
      'A well-documented real case: early facial recognition systems from multiple major companies were shown in peer-reviewed research (the 2018 "Gender Shades" study) to have significantly higher error rates on darker-skinned faces and women, tracing directly back to unbalanced training data.',
      'Bias is not fixed by "better algorithms" alone -- it fundamentally requires more representative, more carefully audited training data.',
      'Recognizing and testing for AI bias is now a standard, required part of responsible AI development at major technology companies.',
    ],
    realExamples: ['Facial recognition accuracy gaps across skin tones, documented in real published research', "Hiring-screening AI tools shown to replicate biases present in a company's past hiring data", 'Voice assistants historically performing worse on certain accents due to unbalanced training data'],
    playgroundType: 'none',
  },
];
