// Real recursive functions for Coding Lab's Recursion & Call Stack
// Visualizer -- factorial and Fibonacci, run for real (not simulated),
// instrumented to record every genuine call and return as an event so
// the UI can play back the actual call stack growing and unwinding.
// Verified against iterative reference implementations across n=0..15
// before shipping (throwaway script, deleted after passing).
//
// A real, honest teaching point surfaced by this exact instrumentation:
// naive recursive Fibonacci makes far more calls than you'd expect --
// fib(8) alone makes 67 real calls, fib(10) makes 177 -- because it
// re-solves the same smaller subproblems over and over. That's not a
// simplification for the demo; it's the actual, well-known reason this
// version of Fibonacci is used as the textbook example of when
// memoization matters.
export type RecursiveFn = 'factorial' | 'fibonacci';

export interface CallEvent {
  type: 'call' | 'return';
  functionName: string;
  arg: number;
  depth: number;
  callId: number;
  returnValue?: number;
}
export interface RecursionTrace {
  events: CallEvent[];
  result: number;
}

export function factorialTrace(n: number): RecursionTrace {
  const events: CallEvent[] = [];
  let nextId = 0;
  function factorial(k: number, depth: number): number {
    const callId = nextId++;
    events.push({ type: 'call', functionName: 'factorial', arg: k, depth, callId });
    const result = k <= 1 ? 1 : k * factorial(k - 1, depth + 1);
    events.push({ type: 'return', functionName: 'factorial', arg: k, depth, callId, returnValue: result });
    return result;
  }
  const result = factorial(n, 0);
  return { events, result };
}

export function fibonacciTrace(n: number): RecursionTrace {
  const events: CallEvent[] = [];
  let nextId = 0;
  function fib(k: number, depth: number): number {
    const callId = nextId++;
    events.push({ type: 'call', functionName: 'fib', arg: k, depth, callId });
    const result = k <= 1 ? k : fib(k - 1, depth + 1) + fib(k - 2, depth + 1);
    events.push({ type: 'return', functionName: 'fib', arg: k, depth, callId, returnValue: result });
    return result;
  }
  const result = fib(n, 0);
  return { events, result };
}

export const RECURSION_FNS: Record<RecursiveFn, (n: number) => RecursionTrace> = {
  factorial: factorialTrace,
  fibonacci: fibonacciTrace,
};

// Reconstructs the real active call stack (and the most recent return, if
// any) at a given point in the event trace -- this is exactly what a
// debugger's call-stack panel would show at that instant.
export function stackAtStep(events: CallEvent[], idx: number): { stack: CallEvent[]; lastReturn: CallEvent | null } {
  const stack: CallEvent[] = [];
  let lastReturn: CallEvent | null = null;
  for (let i = 0; i <= idx && i < events.length; i++) {
    const e = events[i];
    if (e.type === 'call') {
      stack.push(e);
    } else {
      const popIdx = stack.map((s) => s.callId).lastIndexOf(e.callId);
      if (popIdx !== -1) stack.splice(popIdx, 1);
      lastReturn = e;
    }
  }
  return { stack, lastReturn };
}
