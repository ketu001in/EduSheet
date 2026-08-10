// Tiny domain-agnostic helper shared by every lab's engine (Physics,
// Biology, ...) -- exponential ease-toward-target, used by any "this
// settles into an equilibrium" scene (a lever tipping until it balances,
// an object sinking/floating to its resting depth, a potato strip
// shrinking/swelling toward its new size) so the visual eases smoothly
// toward its target state each frame instead of snapping there instantly.
export function easeToward(current: number, target: number, dtSeconds: number, rate = 4): number {
  const factor = 1 - Math.exp(-rate * dtSeconds);
  return current + (target - current) * factor;
}
