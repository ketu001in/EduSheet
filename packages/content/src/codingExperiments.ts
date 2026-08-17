import { CodingExperiment } from './codingExperimentTypes';

// 4 real hands-on experiments spanning every school stage, per the
// explicit ask for "projects for all age groups": a real drag-and-drop
// visual programming studio (Google Blockly, generating and genuinely
// executing real JavaScript/Python) with missions across junior through
// senior grade bands, plus three algorithm/data-structure experiments
// that are real, verified implementations, not animations of what an
// algorithm "would" do.
export const CODING_EXPERIMENTS: CodingExperiment[] = [
  {
    id: 'exp-block-coding-studio',
    category: 'visual-programming',
    name: 'Block Coding Studio',
    tagline: 'Drag real blocks together -- watch them become real, runnable JavaScript or Python instantly.',
    overview: 'Build a program by dragging blocks -- loops, conditionals, variables, functions -- and flip a real toggle to see the exact JavaScript or Python code those blocks generate. Press Run and it genuinely executes (in a sandboxed runtime), with real output, not a canned response. Missions span every grade band, from a first loop to writing your own function.',
    whatYoullDo: [
      'Load a starter mission and drag blocks to complete it -- from printing a message 5 times to writing your own function.',
      'Flip between Blocks view and Code view and watch the real JavaScript or Python update live as you build.',
      'Press Run and see the program\'s real output, including real errors if something goes wrong -- exactly like a real code editor.',
    ],
    realWorldTieIn: 'This is the same class of tool (Google Blockly) behind Code.org, MIT App Inventor, and Microsoft MakeCode -- real, professionally used visual-programming technology, not a simplified toy.',
    gradeBands: ['junior', 'middle', 'senior'],
    playgroundType: 'block-coding-studio',
  },
  {
    id: 'exp-sorting-race',
    category: 'algorithms',
    name: 'Sorting Algorithm Race',
    tagline: 'Four real sorting algorithms, one identical random array -- watch efficiency become visible.',
    overview: 'Bubble sort, insertion sort, merge sort, and quick sort all race to sort the exact same random array -- each bar chart plays back its algorithm\'s real, recorded comparisons and swaps, so the algorithms that finish first genuinely are doing less work, not just animating faster.',
    whatYoullDo: [
      'Generate a new random array and start the race -- watch all four algorithms sort it in real time.',
      'Compare the real comparison and swap counts each algorithm actually needed.',
      'Try a few races and notice merge sort\'s lead stays consistent, while quick sort can occasionally struggle -- both real, well-known properties of these algorithms.',
    ],
    realWorldTieIn: 'These are the exact real algorithms (with real Big-O behavior) used to teach algorithmic efficiency in every computer science course -- the same reasoning is why real databases and standard libraries choose specific sorting algorithms for specific situations.',
    gradeBands: ['middle', 'senior', 'plusTwo'],
    playgroundType: 'sorting-race',
  },
  {
    id: 'exp-recursion-visualizer',
    category: 'algorithms',
    name: 'Recursion & Call Stack Visualizer',
    tagline: 'Watch a real call stack genuinely grow and unwind, one real function call at a time.',
    overview: 'Step through a real recursive factorial or Fibonacci function call by call, watching the actual call stack build up as each call happens and unwind as each one returns -- exactly what a real debugger\'s call-stack panel shows, not a diagram of what recursion "looks like".',
    whatYoullDo: [
      'Step forward one call at a time and watch the stack genuinely grow taller with each recursive call.',
      'Watch it unwind as base cases return and the stack pops back down, each return value shown for real.',
      'Switch to Fibonacci and see how many real calls it actually takes -- a real, honest reason recursion needs care.',
    ],
    realWorldTieIn: 'Every real programming language runtime keeps exactly this kind of call stack -- and "stack overflow" errors are a direct, real consequence of a call stack like this one growing too deep.',
    gradeBands: ['senior', 'plusTwo'],
    playgroundType: 'recursion-visualizer',
  },
  {
    id: 'exp-data-structure-playground',
    category: 'data-structures',
    name: 'Data Structure Playground',
    tagline: 'Push, pop, enqueue, dequeue -- on a real stack, queue, and array, not a diagram of one.',
    overview: 'Push and pop a real stack, enqueue and dequeue a real queue, and insert/remove/access a real array by index -- every operation runs the actual data-structure logic and the visual updates to match, so you can directly see why a stack is last-in-first-out and a queue is first-in-first-out.',
    whatYoullDo: [
      'Push several values onto the stack, then pop them and notice they come back in reverse order.',
      'Enqueue several values into the queue, then dequeue them and notice they come back in the same order they went in.',
      'Insert and remove array elements at specific indices and watch every other element\'s position genuinely shift.',
    ],
    realWorldTieIn: 'Stacks and queues aren\'t abstract -- browser back-buttons, undo history, and print-job queues are all real, everyday uses of exactly these two structures.',
    gradeBands: ['junior', 'middle'],
    playgroundType: 'data-structure-playground',
  },
];
