// Pure, verified logic for AI Lab and Coding Lab's playable simulations --
// same discipline as roboticsEngineeringEngine.ts and chemEngine.ts: real
// algorithms, verified against hand-checked cases before shipping (script
// run and deleted, see commit history), not illustrative-only numbers.

// -- Perceptron: the actual weighted-sum classification rule -----------------
export function perceptronOutput(w1: number, w2: number, bias: number, x: number, y: number): number {
  return w1 * x + w2 * y + bias;
}
export function perceptronClass(w1: number, w2: number, bias: number, x: number, y: number): 'A' | 'B' {
  return perceptronOutput(w1, w2, bias, x, y) >= 0 ? 'A' : 'B';
}

// -- Linear vs Binary Search: real algorithm implementations, run against
// an actual array, not simulated. Both return the true index found and the
// real number of comparisons the algorithm needed to get there.
export interface SearchResult { index: number; comparisons: number; steps: number[] }

export function linearSearch(arr: number[], target: number): SearchResult {
  const steps: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    steps.push(i);
    if (arr[i] === target) return { index: i, comparisons: steps.length, steps };
  }
  return { index: -1, comparisons: steps.length, steps };
}

export function binarySearch(arr: number[], target: number): SearchResult {
  let lo = 0, hi = arr.length - 1;
  const steps: number[] = [];
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    steps.push(mid);
    if (arr[mid] === target) return { index: mid, comparisons: steps.length, steps };
    if (arr[mid] < target) lo = mid + 1; else hi = mid - 1;
  }
  return { index: -1, comparisons: steps.length, steps };
}
