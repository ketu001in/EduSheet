import { TechFoundationConcept } from './techFoundationsTypes';

// Coding Lab -- kept intentionally foundational for now (AI Lab was
// promoted to its own dedicated system, see aiTypes.ts/aiFoundations.ts,
// once it needed real sections/history/applications). Still held to the
// same bar as everywhere else: real, verifiable facts (named researchers,
// dates, documented studies, real algorithmic comparisons), never
// generated, and a genuine formula-backed interactive wherever one exists.
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
