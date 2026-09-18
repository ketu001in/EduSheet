// Real sorting algorithm implementations for Coding Lab's Sorting
// Algorithm Race -- each one is the genuine, textbook algorithm (not a
// simplified stand-in), instrumented to record every real comparison and
// swap/write as a step so the UI can play back an honest, non-scripted
// animation. Verified against Array.prototype.sort across empty, single-
// element, already-sorted, reverse-sorted, duplicate-heavy, and random
// inputs before shipping (throwaway script, deleted after passing).
//
// One genuinely interesting, real result surfaced during verification:
// on a reverse-sorted array, this Lomuto-partition quicksort (which
// always picks the last element as pivot) degrades to the same O(n^2)
// comparison count as bubble/insertion sort -- a real, well-known
// worst-case property of naive quicksort, not a bug. Merge sort stays
// fast regardless of input order, which is exactly the point the race is
// meant to teach.
//
// Each step carries its own running comparisons/swaps totals (rather
// than the UI inferring them from which indices are highlighted) --
// caught live during verification that a swap step highlights the same
// two indices as both "comparing" (for the visual flash) and "swapped",
// which silently double-counted comparisons when the UI tried to derive
// the count from the highlight arrays instead of tracking it directly.
export type SortAlgorithm = 'bubble' | 'insertion' | 'merge' | 'quick';

export interface SortStep {
  array: number[];
  comparingIndices: number[];
  swappedIndices: number[];
  comparisonsSoFar: number;
  swapsSoFar: number;
}
export interface SortTrace {
  algorithm: SortAlgorithm;
  steps: SortStep[];
  comparisons: number;
  swaps: number;
}

export function bubbleSortTrace(input: number[]): SortTrace {
  const arr = [...input];
  const steps: SortStep[] = [];
  let comparisons = 0, swaps = 0;
  const push = (comparingIndices: number[] = [], swappedIndices: number[] = []) => {
    steps.push({ array: [...arr], comparingIndices, swappedIndices, comparisonsSoFar: comparisons, swapsSoFar: swaps });
  };
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      push([j, j + 1]);
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swaps++;
        push([j, j + 1], [j, j + 1]);
      }
    }
  }
  push();
  return { algorithm: 'bubble', steps, comparisons, swaps };
}

export function insertionSortTrace(input: number[]): SortTrace {
  const arr = [...input];
  const steps: SortStep[] = [];
  let comparisons = 0, swaps = 0;
  const push = (comparingIndices: number[] = [], swappedIndices: number[] = []) => {
    steps.push({ array: [...arr], comparingIndices, swappedIndices, comparisonsSoFar: comparisons, swapsSoFar: swaps });
  };
  for (let i = 1; i < arr.length; i++) {
    let j = i;
    while (j > 0) {
      comparisons++;
      push([j - 1, j]);
      if (arr[j - 1] > arr[j]) {
        [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
        swaps++;
        push([j - 1, j], [j - 1, j]);
        j--;
      } else break;
    }
  }
  push();
  return { algorithm: 'insertion', steps, comparisons, swaps };
}

export function mergeSortTrace(input: number[]): SortTrace {
  const arr = [...input];
  const steps: SortStep[] = [];
  let comparisons = 0, swaps = 0;
  const push = (comparingIndices: number[] = [], swappedIndices: number[] = []) => {
    steps.push({ array: [...arr], comparingIndices, swappedIndices, comparisonsSoFar: comparisons, swapsSoFar: swaps });
  };

  function mergeSort(lo: number, hi: number) {
    if (hi - lo <= 1) return;
    const mid = Math.floor((lo + hi) / 2);
    mergeSort(lo, mid);
    mergeSort(mid, hi);
    merge(lo, mid, hi);
  }
  function merge(lo: number, mid: number, hi: number) {
    const left = arr.slice(lo, mid);
    const right = arr.slice(mid, hi);
    let i = 0, j = 0, k = lo;
    while (i < left.length && j < right.length) {
      comparisons++;
      push([lo + i, mid + j]);
      if (left[i] <= right[j]) { arr[k] = left[i]; i++; } else { arr[k] = right[j]; j++; }
      swaps++;
      push([], [k]);
      k++;
    }
    while (i < left.length) { arr[k] = left[i]; i++; swaps++; push([], [k]); k++; }
    while (j < right.length) { arr[k] = right[j]; j++; swaps++; push([], [k]); k++; }
  }
  mergeSort(0, arr.length);
  push();
  return { algorithm: 'merge', steps, comparisons, swaps };
}

export function quickSortTrace(input: number[]): SortTrace {
  const arr = [...input];
  const steps: SortStep[] = [];
  let comparisons = 0, swaps = 0;
  const push = (comparingIndices: number[] = [], swappedIndices: number[] = []) => {
    steps.push({ array: [...arr], comparingIndices, swappedIndices, comparisonsSoFar: comparisons, swapsSoFar: swaps });
  };

  function partition(lo: number, hi: number): number {
    const pivot = arr[hi];
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      comparisons++;
      push([j, hi]);
      if (arr[j] < pivot) {
        i++;
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          swaps++;
          push([j, hi], [i, j]);
        }
      }
    }
    if (i + 1 !== hi) {
      [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
      swaps++;
      push([], [i + 1, hi]);
    }
    return i + 1;
  }
  function quickSort(lo: number, hi: number) {
    if (lo < hi) {
      const p = partition(lo, hi);
      quickSort(lo, p - 1);
      quickSort(p + 1, hi);
    }
  }
  quickSort(0, arr.length - 1);
  push();
  return { algorithm: 'quick', steps, comparisons, swaps };
}

export const SORT_FNS: Record<SortAlgorithm, (input: number[]) => SortTrace> = {
  bubble: bubbleSortTrace,
  insertion: insertionSortTrace,
  merge: mergeSortTrace,
  quick: quickSortTrace,
};
export const SORT_LABELS: Record<SortAlgorithm, string> = {
  bubble: 'Bubble Sort', insertion: 'Insertion Sort', merge: 'Merge Sort', quick: 'Quick Sort',
};

export function isSorted(arr: number[]): boolean {
  for (let i = 1; i < arr.length; i++) if (arr[i - 1] > arr[i]) return false;
  return true;
}
