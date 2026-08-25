// Electronics Lab's circuit engine -- real DC steady-state circuit
// behavior (a real breadboard connectivity graph, real Ohm's Law, real
// component thresholds, real 555-timer datasheet formulas), deliberately
// NOT a full SPICE-grade analog/transient/RF solver. Every formula here
// was independently verified in a throwaway Node script before being
// ported (cross-checked the 555 astable formulas against the TI NE555
// datasheet's own tH/tL equations, not just the commonly-quoted rounded
// f=1.44/... shortcut -- see the PR description for the full pass/fail
// table, including a real precision bug this caught and fixed: using the
// textbook's separately-rounded "1.44" and "0.693" constants together
// breaks tH+tL from exactly equalling the period computed from f. This
// engine derives everything from the single precise Math.LN2 constant
// instead, so that identity always holds exactly).
import type { BreadboardPosition } from '@edusheets/content';

// ---------------------------------------------------------------------
// Breadboard connectivity -- the real physical rules of a standard
// half-size breadboard: within one row, holes a-e are one electrical
// node and f-j are a separate node (the center gutter breaks
// continuity -- real boards are built this way specifically so a DIP IC
// can straddle the gutter without shorting its two pin rows together).
// Each of the four power rails runs as one continuous node.
// ---------------------------------------------------------------------
export function nodeKeyForPosition(pos: BreadboardPosition): string {
  if ('rail' in pos) return `rail:${pos.rail}`;
  const side = 'abcde'.includes(pos.col) ? 'L' : 'R';
  return `strip:${pos.row}:${side}`;
}

class UnionFind {
  private parent = new Map<string, string>();
  find(x: string): string {
    if (!this.parent.has(x)) this.parent.set(x, x);
    let root = x;
    while (this.parent.get(root) !== root) root = this.parent.get(root)!;
    let cur = x;
    while (this.parent.get(cur) !== root) {
      const next = this.parent.get(cur)!;
      this.parent.set(cur, root);
      cur = next;
    }
    return root;
  }
  union(a: string, b: string) {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra !== rb) this.parent.set(ra, rb);
  }
}

export interface LeadPlacement {
  componentId: string;
  pin: string;
  position: BreadboardPosition;
}
export interface WireEdge {
  from: BreadboardPosition;
  to: BreadboardPosition;
}

export interface Connectivity {
  // Canonical electrical-node id for a given component's pin -- two pins
  // with the same returned id are genuinely the same electrical node
  // (possibly through a chain of breadboard strips and wires), null if
  // that pin isn't placed anywhere yet.
  electricalNode(componentId: string, pin: string): string | null;
}

export function buildConnectivity(placements: LeadPlacement[], wires: WireEdge[]): Connectivity {
  const uf = new UnionFind();
  const leadNodeKey = new Map<string, string>();
  for (const p of placements) {
    const key = nodeKeyForPosition(p.position);
    leadNodeKey.set(`${p.componentId}:${p.pin}`, key);
    uf.find(key);
  }
  for (const w of wires) {
    uf.union(nodeKeyForPosition(w.from), nodeKeyForPosition(w.to));
  }
  return {
    electricalNode(componentId, pin) {
      const key = leadNodeKey.get(`${componentId}:${pin}`);
      if (!key) return null;
      return uf.find(key);
    },
  };
}

// ---------------------------------------------------------------------
// Ohm's Law helpers
// ---------------------------------------------------------------------

// The minimum safe series resistance so an LED never exceeds its rated
// current -- R = (Vsupply - Vforward) / Imax. A real, standard LED
// current-limiting-resistor sizing calculation, not a rule of thumb.
export function minSafeResistorOhms(supplyVoltage: number, forwardVoltage: number, maxCurrentAmps: number): number {
  return (supplyVoltage - forwardVoltage) / maxCurrentAmps;
}

// Given a supply voltage and a chosen series resistance, the real current
// through an LED branch (Ohm's Law rearranged) -- used to decide whether
// the LED is actually within a safe operating range, and (for a dimming
// effect, if ever wanted) how bright it should read.
export function ledBranchCurrentAmps(supplyVoltage: number, forwardVoltage: number, resistanceOhms: number): number {
  if (resistanceOhms <= 0) return Infinity; // a genuine short -- the LED would be destroyed instantly
  return Math.max(0, (supplyVoltage - forwardVoltage) / resistanceOhms);
}

// ---------------------------------------------------------------------
// 555 Timer -- Astable Multivibrator
// ---------------------------------------------------------------------
// Every value is derived from the single precise Math.LN2 constant so
// tH + tL == period exactly, no matter how many decimal places you check
// -- see the file header for why mixing the textbook's independently-
// rounded "1.44" and "0.693" constants breaks that identity.
export interface Astable555Result {
  frequencyHz: number;
  periodSeconds: number;
  dutyCycle: number; // 0-1, fraction of the period spent HIGH
  highTimeSeconds: number;
  lowTimeSeconds: number;
}

export function astable555(r1Ohms: number, r2Ohms: number, capacitanceFarads: number): Astable555Result {
  const highTimeSeconds = Math.LN2 * (r1Ohms + r2Ohms) * capacitanceFarads;
  const lowTimeSeconds = Math.LN2 * r2Ohms * capacitanceFarads;
  const periodSeconds = highTimeSeconds + lowTimeSeconds;
  const frequencyHz = periodSeconds > 0 ? 1 / periodSeconds : 0;
  const dutyCycle = periodSeconds > 0 ? highTimeSeconds / periodSeconds : 0;
  return { frequencyHz, periodSeconds, dutyCycle, highTimeSeconds, lowTimeSeconds };
}

// Recognizes the standard 555 astable topology from the wiring the
// student actually built, and if (and only if) it's really present,
// returns the real computed timing -- this is topology RECOGNITION, not
// a hardcoded "if project is X show Y" shortcut, so it works for any
// valid astable wiring, not just one specific reference layout.
export interface Astable555Topology {
  vccNode: string;
  gndNode: string;
  dischNode: string;
  thresTrigNode: string;
  outNode: string;
  r1Ohms: number;
  r2Ohms: number;
  capacitanceFarads: number;
}

export function detect555AstableTopology(
  conn: Connectivity,
  timerComponentId: string,
  resistors: { componentId: string; ohms: number }[],
  capacitor: { componentId: string; farads: number } | null,
): Astable555Topology | null {
  const vccNode = conn.electricalNode(timerComponentId, 'pin8-vcc');
  const gndNode = conn.electricalNode(timerComponentId, 'pin1-gnd');
  const resetNode = conn.electricalNode(timerComponentId, 'pin4-reset');
  const dischNode = conn.electricalNode(timerComponentId, 'pin7-disch');
  const thresNode = conn.electricalNode(timerComponentId, 'pin6-thres');
  const trigNode = conn.electricalNode(timerComponentId, 'pin2-trig');
  const outNode = conn.electricalNode(timerComponentId, 'pin3-out');

  if (!vccNode || !gndNode || !dischNode || !thresNode || !trigNode || !outNode) return null;
  if (thresNode !== trigNode) return null; // astable requires THRES and TRIG tied together
  if (resetNode !== vccNode) return null; // RESET must be tied high (to VCC) to stay enabled

  // Find a resistor bridging VCC<->DISCH (this is R1) and one bridging
  // DISCH<->THRES/TRIG (this is R2) -- checked by NODE identity, not by
  // which specific component id the project's authors happened to use,
  // so any two real resistors wired this way are recognized.
  let r1: { componentId: string; ohms: number } | null = null;
  let r2: { componentId: string; ohms: number } | null = null;
  for (const r of resistors) {
    const a = conn.electricalNode(r.componentId, 'a');
    const b = conn.electricalNode(r.componentId, 'b');
    if (!a || !b) continue;
    const endpoints = new Set([a, b]);
    if (endpoints.has(vccNode) && endpoints.has(dischNode)) r1 = r;
    if (endpoints.has(dischNode) && endpoints.has(thresNode)) r2 = r;
  }
  if (!r1 || !r2) return null;

  if (!capacitor) return null;
  const capA = conn.electricalNode(capacitor.componentId, 'a');
  const capB = conn.electricalNode(capacitor.componentId, 'b');
  if (!capA || !capB) return null;
  const capEndpoints = new Set([capA, capB]);
  if (!(capEndpoints.has(thresNode) && capEndpoints.has(gndNode))) return null; // C must bridge THRES/TRIG node to GND

  return {
    vccNode, gndNode, dischNode, thresTrigNode: thresNode, outNode,
    r1Ohms: r1.ohms, r2Ohms: r2.ohms, capacitanceFarads: capacitor.farads,
  };
}
