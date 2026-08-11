// Pure, verified logic for Robotics Lab's playable simulations -- same
// "drives both the visual and the live outcome" philosophy, and same
// verification discipline, as chemEngine.ts/mathEngine.ts. Breadth-first
// search is the one piece of real algorithmic logic here with an
// objectively correct answer (shortest path length, reachable or not),
// so it's the one function verified against hand-checked cases before
// shipping (script run and deleted, see commit history) -- sensor-
// threshold comparisons, swarm flocking, and balance drift are simple
// enough, and have no single "correct" numeric answer to get wrong, that
// they're implemented directly in their respective playground components.

export type GridCell = [number, number]; // [row, col]

// Standard 4-directional BFS shortest path over a grid, where `blocked`
// marks obstacle cells. Returns the path from start to goal INCLUSIVE of
// both endpoints, or null if no path exists. BFS is guaranteed to find the
// shortest path (fewest steps) on an unweighted grid -- exactly the
// property that makes it the right algorithm here, and the one thing
// worth verifying: that it actually returns the shortest path, not just
// *a* path.
export function bfsShortestPath(
  rows: number,
  cols: number,
  blocked: Set<string>,
  start: GridCell,
  goal: GridCell,
): GridCell[] | null {
  const key = (c: GridCell) => `${c[0]},${c[1]}`;
  if (blocked.has(key(start)) || blocked.has(key(goal))) return null;

  const queue: GridCell[] = [start];
  const cameFrom = new Map<string, GridCell | null>();
  cameFrom.set(key(start), null);

  const deltas: GridCell[] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current[0] === goal[0] && current[1] === goal[1]) {
      // Reconstruct path by walking cameFrom back to start.
      const path: GridCell[] = [];
      let node: GridCell | null = current;
      while (node) {
        path.unshift(node);
        node = cameFrom.get(key(node)) ?? null;
      }
      return path;
    }
    for (const [dr, dc] of deltas) {
      const next: GridCell = [current[0] + dr, current[1] + dc];
      if (next[0] < 0 || next[0] >= rows || next[1] < 0 || next[1] >= cols) continue;
      const nKey = key(next);
      if (blocked.has(nKey) || cameFrom.has(nKey)) continue;
      cameFrom.set(nKey, current);
      queue.push(next);
    }
  }
  return null; // goal unreachable
}
