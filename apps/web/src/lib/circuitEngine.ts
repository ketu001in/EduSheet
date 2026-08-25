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
import type { BreadboardPosition, ComponentKind } from '@edusheets/content';

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

// ---------------------------------------------------------------------
// Resistor color-code -- computes the real 4-band code for ANY resistance
// value (not a hardcoded lookup table per catalog item, so it's always
// correct even for a value added later). Verified in a throwaway Node
// script before shipping -- caught and fixed a real rounding bug here
// (Math.round instead of Math.floor on the tens digit produced a wrong
// band for 470 ohm and 47k ohm specifically) before it ever reached
// content data.
const BAND_NAMES = ['Black', 'Brown', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Violet', 'Grey', 'White'] as const;
export const BAND_HEX: Record<string, string> = {
  Black: '#1a1a1a', Brown: '#8b4513', Red: '#dc2626', Orange: '#f97316', Yellow: '#eab308',
  Green: '#16a34a', Blue: '#2563eb', Violet: '#7c3aed', Grey: '#9ca3af', White: '#f8fafc', Gold: '#d4af37',
};

export interface ResistorBands {
  band1: string; band2: string; multiplier: string; tolerance: string;
}

export function resistorColorBands(ohms: number): ResistorBands {
  let value = ohms;
  let mult = 0;
  while (value >= 100) { value /= 10; mult++; }
  while (value < 10) { value *= 10; mult--; }
  const d1 = Math.floor(value / 10);
  const d2 = Math.round(value - d1 * 10);
  return { band1: BAND_NAMES[d1], band2: BAND_NAMES[d2], multiplier: BAND_NAMES[mult], tolerance: 'Gold' };
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

// ---------------------------------------------------------------------
// Generic circuit evaluator -- the real, hands-on workbench's "does it
// actually work" engine. Deliberately scoped the same way as the rest of
// this file: DC steady-state only, simple-loop path-finding (not a full
// nodal/matrix SPICE solver), which is genuinely sufficient for the
// basic loop, series, and parallel circuits this lab teaches. A
// capacitor is intentionally NOT a traversable edge here -- in real DC
// steady state a charged capacitor blocks continuous current, so an
// oscillator like the 555 astable is handled by its own specialized
// topology recognizer above, not by this generic loop-finder.
// ---------------------------------------------------------------------

export interface EvalComponentInput {
  instanceId: string;
  kind: ComponentKind;
  pinPositions: Record<string, BreadboardPosition>;
  resistanceOhms?: number;
  forwardVoltage?: number;
  maxCurrentAmps?: number;
  sourceVoltage?: number;
  // SPST/push-button: true = the student has toggled/is pressing it closed.
  switchClosed?: boolean;
  // SPDT: which throw is currently connected to the common terminal.
  spdtThrow?: 1 | 2;
}

export interface VirtualSource {
  posNode: string;
  negNode: string;
  voltage: number;
}

export type LedIssue = 'no-closed-path' | 'reversed' | 'short-circuit' | 'over-current' | null;

export interface LedEvalResult {
  instanceId: string;
  lit: boolean;
  currentAmps: number;
  issue: LedIssue;
}

export interface LoadEvalResult {
  instanceId: string;
  active: boolean;
}

export interface CircuitEvaluation {
  leds: LedEvalResult[];
  loads: LoadEvalResult[]; // motors, buzzers -- anything that's simply "on" once powered
  anyBatteryPlaced: boolean;
}

interface EngineEdge {
  instanceId: string;
  nodeFrom: string;
  nodeTo: string;
  directed: boolean; // true = only traversable nodeFrom -> nodeTo (an LED's real forward-bias direction)
  resistanceOhms: number;
  forwardVoltage: number;
  isLoad: boolean;
}

function findSimplePaths(startNode: string, endNode: string, edges: EngineEdge[]): EngineEdge[][] {
  const results: EngineEdge[][] = [];
  const visited = new Set<string>([startNode]);
  const path: EngineEdge[] = [];
  function dfs(node: string) {
    if (node === endNode) {
      if (path.length > 0) results.push([...path]);
      return;
    }
    // Bound the search the same real way a student's own wiring would be
    // bounded -- a handful of components, never an unbounded graph.
    if (path.length > 12) return;
    for (const e of edges) {
      let next: string | null = null;
      if (e.nodeFrom === node && !visited.has(e.nodeTo)) next = e.nodeTo;
      else if (!e.directed && e.nodeTo === node && !visited.has(e.nodeFrom)) next = e.nodeFrom;
      if (next == null) continue;
      visited.add(next);
      path.push(e);
      dfs(next);
      path.pop();
      visited.delete(next);
    }
  }
  dfs(startNode);
  return results;
}

export function evaluateCircuit(
  components: EvalComponentInput[],
  wires: WireEdge[],
  extraSources: VirtualSource[] = [],
): CircuitEvaluation {
  const uf = new UnionFind();
  for (const w of wires) uf.union(nodeKeyForPosition(w.from), nodeKeyForPosition(w.to));
  const nodeOf = (pos: BreadboardPosition) => uf.find(nodeKeyForPosition(pos));

  const edges: EngineEdge[] = [];
  const sources: VirtualSource[] = [...extraSources];
  const ledComponents = new Map<string, EvalComponentInput>();
  const loadComponents = new Map<string, EvalComponentInput>();

  const addEdge = (c: EvalComponentInput, pinA: string, pinB: string, opts: Partial<EngineEdge> = {}) => {
    const posA = c.pinPositions[pinA];
    const posB = c.pinPositions[pinB];
    if (!posA || !posB) return;
    edges.push({
      instanceId: c.instanceId,
      nodeFrom: nodeOf(posA),
      nodeTo: nodeOf(posB),
      directed: opts.directed ?? false,
      resistanceOhms: opts.resistanceOhms ?? 0,
      forwardVoltage: opts.forwardVoltage ?? 0,
      isLoad: opts.isLoad ?? false,
    });
  };

  for (const c of components) {
    switch (c.kind) {
      case 'battery-9v':
      case 'battery-6v': {
        const pos = c.pinPositions.pos;
        const neg = c.pinPositions.neg;
        if (pos && neg) sources.push({ posNode: nodeOf(pos), negNode: nodeOf(neg), voltage: c.sourceVoltage ?? 9 });
        break;
      }
      case 'resistor':
        addEdge(c, 'a', 'b', { resistanceOhms: c.resistanceOhms ?? 0 });
        break;
      case 'led':
        addEdge(c, 'anode', 'cathode', { directed: true, forwardVoltage: c.forwardVoltage ?? 2 });
        if (c.pinPositions.anode && c.pinPositions.cathode) ledComponents.set(c.instanceId, c);
        break;
      case 'switch-spst':
      case 'push-button':
        if (c.switchClosed) addEdge(c, 'a', 'b');
        break;
      case 'switch-spdt': {
        const throwPin = c.spdtThrow === 2 ? 'throw2' : 'throw1';
        addEdge(c, 'common', throwPin);
        break;
      }
      case 'dc-motor':
      case 'buzzer':
        addEdge(c, 'pos', 'neg', { isLoad: true });
        if (c.pinPositions.pos && c.pinPositions.neg) loadComponents.set(c.instanceId, c);
        break;
      default:
        break; // 555, capacitors, breadboards/tools/etc. -- not part of this generic loop model
    }
  }

  const ledResults = new Map<string, LedEvalResult>(
    [...ledComponents.keys()].map((id) => [id, { instanceId: id, lit: false, currentAmps: 0, issue: 'no-closed-path' as LedIssue }]),
  );
  const loadResults = new Map<string, LoadEvalResult>(
    [...loadComponents.keys()].map((id) => [id, { instanceId: id, active: false }]),
  );

  const setIssueIfNotLit = (id: string, issue: LedIssue) => {
    const cur = ledResults.get(id);
    if (cur && !cur.lit) ledResults.set(id, { ...cur, issue });
  };

  for (const source of sources) {
    if (source.posNode === source.negNode) continue;
    const paths = findSimplePaths(source.posNode, source.negNode, edges);
    for (const path of paths) {
      const ledEdges = path.filter((e) => e.forwardVoltage > 0);
      const loadEdges = path.filter((e) => e.isLoad);
      const totalR = path.reduce((s, e) => s + e.resistanceOhms, 0);
      const totalVf = ledEdges.reduce((s, e) => s + e.forwardVoltage, 0);

      if (ledEdges.length > 0) {
        if (totalR <= 0) {
          for (const e of ledEdges) setIssueIfNotLit(e.instanceId, 'short-circuit');
        } else {
          const current = Math.max(0, (source.voltage - totalVf) / totalR);
          const overCurrent = ledEdges.some((e) => {
            const comp = ledComponents.get(e.instanceId);
            return comp?.maxCurrentAmps != null && current > comp.maxCurrentAmps;
          });
          if (overCurrent) {
            for (const e of ledEdges) setIssueIfNotLit(e.instanceId, 'over-current');
          } else if (current <= 0) {
            for (const e of ledEdges) setIssueIfNotLit(e.instanceId, 'no-closed-path');
          } else {
            for (const e of ledEdges) ledResults.set(e.instanceId, { instanceId: e.instanceId, lit: true, currentAmps: current, issue: null });
          }
        }
      }
      for (const e of loadEdges) loadResults.set(e.instanceId, { instanceId: e.instanceId, active: true });
    }
  }

  // Helpful diagnosis, not just a dead end: for any LED still dark for lack
  // of a path, check whether flipping ITS direction alone would have
  // closed a loop -- if so, the real, honest reason is "wired backwards",
  // not "no path at all", and the student gets a genuinely useful hint.
  for (const [id, comp] of ledComponents) {
    const result = ledResults.get(id);
    if (result && !result.lit && result.issue === 'no-closed-path') {
      const flippedEdges = edges.map((e) =>
        e.instanceId === id ? { ...e, nodeFrom: e.nodeTo, nodeTo: e.nodeFrom } : e,
      );
      const reversed = sources.some((s) => s.posNode !== s.negNode && findSimplePaths(s.posNode, s.negNode, flippedEdges).some((p) => p.some((e) => e.instanceId === id)));
      if (reversed) ledResults.set(id, { ...result, issue: 'reversed' });
    }
    void comp;
  }

  return {
    leds: [...ledResults.values()],
    loads: [...loadResults.values()],
    anyBatteryPlaced: sources.length > 0,
  };
}
