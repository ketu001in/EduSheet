import { TechFoundationConcept } from './techFoundationsTypes';

// AI Lab and Coding Lab -- kept intentionally foundational for now, per
// explicit instruction to deep-dive Robotics first. Still held to the same
// bar as everywhere else: real, verifiable facts (named researchers,
// dates, documented studies, real algorithmic comparisons), never
// generated, and a genuine formula-backed interactive wherever one exists.
export const AI_CONCEPTS: TechFoundationConcept[] = [
  {
    id: 'ai-vs-traditional-programming',
    lab: 'ai',
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
    lab: 'ai',
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
    lab: 'ai',
    name: "The Perceptron -- AI's Simplest Building Block",
    tagline: 'One artificial neuron doing simple weighted arithmetic -- the direct ancestor of every modern neural network.',
    overview: "Long before deep learning, a single \"perceptron\" was the first working model of how a neural network could learn to classify things.",
    howItWorks: [
      'Each input value is multiplied by its own adjustable "weight", and all the results are added together along with a "bias" value.',
      'If that final sum is positive (or above a threshold), the perceptron outputs one class; if negative, it outputs the other.',
      '"Training" the perceptron means adjusting its weights and bias, based on its mistakes on example data, until it correctly separates the two classes.',
    ],
    keyFacts: [
      'Invented by Frank Rosenblatt in 1958 at Cornell -- the perceptron is the direct ancestor of every modern neural network, including the ones behind image recognition and large language models today.',
      'A single perceptron can only learn to separate data that is "linearly separable" -- a real limitation famously proven in 1969, which temporarily slowed AI research for years.',
      'Modern deep neural networks are, at their core, many perceptron-like units connected in layers -- the same weighted-sum-plus-threshold idea, stacked millions of times.',
    ],
    realExamples: ['The mathematical building block inside every modern neural network layer', 'Simple linear classifiers still used for genuinely simple, linearly-separable problems', 'The Mark I Perceptron machine (1958), one of the first neural-network hardware implementations ever built'],
    playgroundType: 'perceptron',
  },
  {
    id: 'ai-training-data',
    lab: 'ai',
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
    lab: 'ai',
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

export const CODING_CONCEPTS: TechFoundationConcept[] = [
  {
    id: 'coding-algorithms',
    lab: 'coding',
    name: 'Algorithms: A Precise Sequence of Steps',
    tagline: 'The core idea underlying every single computer program ever written.',
    overview: 'An algorithm is a precise, unambiguous, finite sequence of steps to solve a problem.',
    howItWorks: [
      'Every algorithm must be UNAMBIGUOUS -- each step has exactly one clear meaning, with no room for the computer to guess.',
      'Every algorithm must be FINITE -- it must actually finish after a limited number of steps, not run forever.',
      'A single problem can usually be solved by multiple different algorithms, and different algorithms solving the exact same problem can have wildly different speed and efficiency.',
    ],
    keyFacts: [
      'The word "algorithm" derives from the name of the 9th-century Persian mathematician Muhammad ibn Musa al-Khwarizmi, whose work on systematic problem-solving was hugely influential.',
      'A recipe is a genuinely good real-world analogy -- a precise, ordered sequence of steps that reliably produces the same result.',
      'Every app, website, and piece of software you have ever used is built from algorithms, all the way down to how your phone decides which pixel to light up on screen.',
    ],
    realExamples: ['A recipe for baking a cake', 'GPS route-finding directions', 'Sorting a list of names alphabetically'],
    playgroundType: 'none',
  },
  {
    id: 'coding-loops',
    lab: 'coding',
    name: 'Loops and Iteration',
    tagline: 'What makes code scalable -- repeat an instruction without writing it out a thousand times.',
    overview: 'A loop lets a program repeat a set of instructions multiple times without the programmer writing that instruction out over and over by hand.',
    howItWorks: [
      'A "for" loop repeats a fixed, known number of times -- useful when you know exactly how many repetitions you need in advance.',
      'A "while" loop repeats for as long as a condition stays true, stopping automatically the moment it becomes false.',
      'Every loop needs a way to eventually stop -- a loop that never meets its stopping condition is called an "infinite loop", a genuine, common programming bug.',
    ],
    keyFacts: [
      'Without loops, printing "Hello" 1,000 times would require writing the same line of code 1,000 separate times -- loops are precisely what makes code scalable.',
      'A loop that processes every item in a list one at a time is one of the single most common patterns in all of programming.',
      'Modern processors can execute billions of loop iterations per second, which is exactly why even simple loops can do enormous amounts of real work very quickly.',
    ],
    realExamples: ['Checking every item in a shopping cart to calculate a total', 'A game loop that keeps updating the screen 60 times per second', 'Sending the same reminder message to every student on a class list'],
    playgroundType: 'none',
  },
  {
    id: 'coding-conditionals',
    lab: 'coding',
    name: 'Conditionals: Making Decisions in Code',
    tagline: '"If this, then that" -- how a program chooses between different actions.',
    overview: 'Conditionals let a program choose between different actions based on a real, checkable condition, instead of always doing the exact same thing.',
    howItWorks: [
      'An "if" statement checks a condition, something that is either true or false, and only runs its code block when that condition is true.',
      'An optional "else" block runs instead, specifically when the condition is false.',
      'Conditionals can be chained ("else if") to check multiple different conditions in sequence, one after another.',
    ],
    keyFacts: [
      'This is the exact mechanism behind the "reacts differently to right vs wrong answers" behaviour in Tech Lab\'s own beginner Scratch quiz-game project idea.',
      'Every conditional ultimately reduces to a true/false (Boolean) value, named after 19th-century mathematician George Boole, whose algebra of logic underlies all modern digital computing.',
      'A "sense-think-act" robot (see Robotics Lab\'s Control Systems section) uses conditionals constantly in its "think" stage: "if sensor reading is below threshold, then stop the motor".',
    ],
    realExamples: ['An app showing "Correct!" or "Try Again" based on a quiz answer', 'A thermostat deciding whether to turn on heating based on current temperature', 'A traffic light program deciding when to change from red to green'],
    playgroundType: 'none',
  },
  {
    id: 'coding-functions',
    lab: 'coding',
    name: 'Functions: Reusable Blocks of Code',
    tagline: 'Package a sequence of steps under one name, and reuse it everywhere without rewriting it.',
    overview: 'A function packages up a sequence of steps under one name, so that exact same logic can be reused anywhere in a program.',
    howItWorks: [
      'A function is defined once, with a name and optionally some "parameters" -- values it can accept as input.',
      'Once defined, that function can be "called" (used) as many times as needed, from anywhere else in the program.',
      'A function can optionally "return" a result back to wherever it was called from, to be used in further calculations.',
    ],
    keyFacts: [
      'Functions are the primary way real-world programs, which can be millions of lines long, stay organized rather than becoming an impossible single block of code.',
      'Reusing a well-tested function is more reliable than copy-pasting the same logic repeatedly -- fixing a bug in one place fixes it everywhere that function is used.',
      'Almost every programming language, from Scratch\'s custom blocks to Python\'s "def" functions, provides some version of this exact same reusable-block concept.',
    ],
    realExamples: ['A "calculateTotal" function reused every time a shopping cart needs a total', 'A custom Scratch block that makes a sprite jump, reused across multiple game levels', 'A "checkPassword" function used identically on every login screen of an app'],
    playgroundType: 'none',
  },
  {
    id: 'coding-search-efficiency',
    lab: 'coding',
    name: 'Algorithm Efficiency: Linear Search vs Binary Search',
    tagline: 'Two real algorithms, same problem, dramatically different speed as the list grows.',
    overview: 'Linear search and binary search solve the exact same problem, finding an item in a list, at dramatically different speeds, especially as the list grows large.',
    howItWorks: [
      'LINEAR SEARCH checks every single item one by one, from the start, until it finds the target -- it works on any list, sorted or not.',
      'BINARY SEARCH only works on a SORTED list: it checks the middle item, and discards the entire half of the list the target cannot be in -- repeating on the remaining half each time.',
      'Because binary search eliminates half the remaining possibilities with every check, it needs dramatically fewer comparisons than linear search for a large list.',
    ],
    keyFacts: [
      'For a sorted list of 1,000 items, linear search can need up to 1,000 comparisons in the worst case -- binary search needs at most about 10, since 2^10 = 1,024.',
      'This "cut the problem in half repeatedly" idea is called a logarithmic-time algorithm in computer science, and is one of the most powerful, widely reused ideas in all of programming.',
      'Binary search absolutely requires the list to already be sorted first -- run it on an unsorted list and it can give a completely wrong answer, silently.',
    ],
    realExamples: ['Looking up a word in a printed dictionary (a real-world binary search, done by hand)', 'A phone contacts app searching for a name as you type', 'Database systems using sorted indexes specifically to make binary-search-style lookups possible'],
    playgroundType: 'search-race',
  },
];
