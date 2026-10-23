// Real stack (LIFO), queue (FIFO), and array operations for Coding Lab's
// Data Structure Playground. Small, genuinely correct implementations --
// verified against hand-traced push/pop and enqueue/dequeue sequences
// (LIFO/FIFO ordering, empty-structure edge cases) before shipping.
export function stackPush<T>(stack: T[], value: T): T[] {
  return [...stack, value];
}
export function stackPop<T>(stack: T[]): { next: T[]; popped: T | undefined } {
  if (stack.length === 0) return { next: stack, popped: undefined };
  return { next: stack.slice(0, -1), popped: stack[stack.length - 1] };
}
export function queueEnqueue<T>(queue: T[], value: T): T[] {
  return [...queue, value];
}
export function queueDequeue<T>(queue: T[]): { next: T[]; dequeued: T | undefined } {
  if (queue.length === 0) return { next: queue, dequeued: undefined };
  return { next: queue.slice(1), dequeued: queue[0] };
}
export function arrayInsertAt<T>(arr: T[], index: number, value: T): T[] {
  const clamped = Math.max(0, Math.min(index, arr.length));
  const next = [...arr];
  next.splice(clamped, 0, value);
  return next;
}
export function arrayRemoveAt<T>(arr: T[], index: number): { next: T[]; removed: T | undefined } {
  if (index < 0 || index >= arr.length) return { next: arr, removed: undefined };
  const next = [...arr];
  const [removed] = next.splice(index, 1);
  return { next, removed };
}
