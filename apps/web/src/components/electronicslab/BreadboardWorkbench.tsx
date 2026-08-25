'use client';
import { useEffect, useMemo, useState } from 'react';
import { Cable, Trash2, RotateCcw, FileText, Zap } from 'lucide-react';
import {
  ELECTRONICS_COMPONENTS,
  type ElectronicsProject,
  type ComponentPlacement,
  type WireConnection,
  type BreadboardPosition,
} from '@edusheets/content';
import {
  evaluateCircuit,
  buildConnectivity,
  detect555AstableTopology,
  astable555,
  resistorColorBands,
  BAND_HEX,
  type EvalComponentInput,
  type VirtualSource,
  type LeadPlacement,
} from '@/lib/circuitEngine';
import { playSelectChime, playSuccessChime, playWarnBuzz, startBuzzerTone, stopBuzzerTone } from '@/lib/uiSoundEngine';

// The real, hands-on Electronics Lab workbench -- a genuine interactive
// breadboard: pick a part from the drawer-fed parts bin, click two real
// holes to place it (or click the power rail), wire holes together, flip
// switches, and watch the SAME real DC engine used everywhere else in this
// lab (circuitEngine.ts's evaluateCircuit / detect555AstableTopology /
// astable555) decide whether it actually lights up, buzzes, or spins --
// not a canned animation keyed to "this is project X", genuine topology
// evaluation of whatever the student actually wired.
//
// Deliberately 2D (SVG), not 3D -- real pixel-precise click targets for
// placement/wiring are what this needs, and WebGL canvases have been
// unreliable to interact with reliably elsewhere in this session; a 2D
// schematic-style board is also how every real breadboard simulator
// (Tinkercad Circuits, Fritzing) presents the actual wiring workbench,
// even when other parts of the tool are 3D.
//
// Scope, stated honestly: free two-click placement supports any real
// 2-pin part (resistor, LED, switch, push-button, motor, buzzer,
// battery). An 8-pin DIP IC (the 555) needs a fixed real footprint, so
// for a project that uses one, "Load Reference Circuit" places it (and
// everything else) pre-wired per the real, engine-verified reference
// layout -- the student can still freely add/remove wires and swap
// values afterward.

const COLS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'] as const;
const ROWS = 20;
const HOLE_GAP = 16;
const GUTTER = 14;
const LEFT_PAD = 14;
const TOP_RAIL_H = 46;
const BOTTOM_RAIL_H = 46;
const BOARD_WIDTH = LEFT_PAD * 2 + 9 * HOLE_GAP + GUTTER;
const BOARD_HEIGHT = TOP_RAIL_H + (ROWS - 1) * HOLE_GAP + BOTTOM_RAIL_H;

function colX(col: string): number {
  const idx = COLS.indexOf(col as (typeof COLS)[number]);
  return LEFT_PAD + idx * HOLE_GAP + (idx >= 5 ? GUTTER : 0);
}
function rowY(row: number): number {
  return TOP_RAIL_H + (row - 1) * HOLE_GAP;
}
function railY(rail: string): number {
  if (rail === 'top-pos') return 14;
  if (rail === 'top-neg') return 30;
  if (rail === 'bottom-pos') return rowY(ROWS) + 18;
  return rowY(ROWS) + 32;
}
function posKey(pos: BreadboardPosition): string {
  return 'rail' in pos ? `rail:${pos.rail}` : `hole:${pos.row}:${pos.col}`;
}
function posToPixel(pos: BreadboardPosition, anchorX?: number): { x: number; y: number } {
  if ('rail' in pos) return { x: anchorX ?? BOARD_WIDTH / 2, y: railY(pos.rail) };
  return { x: colX(pos.col), y: rowY(pos.row) };
}
function resolvePair(a: BreadboardPosition, b: BreadboardPosition): [{ x: number; y: number }, { x: number; y: number }] {
  const bIsRail = 'rail' in b;
  const aIsRail = 'rail' in a;
  const bPx = !bIsRail ? posToPixel(b) : null;
  const aPx = !aIsRail ? posToPixel(a) : null;
  return [aIsRail ? posToPixel(a, bPx?.x) : aPx!, bIsRail ? posToPixel(b, aPx?.x) : bPx!];
}

type Mode = 'interact' | 'wire' | 'delete';

export default function BreadboardWorkbench({ project }: { project: ElectronicsProject }) {
  const [placements, setPlacements] = useState<ComponentPlacement[]>([]);
  const [wires, setWires] = useState<WireConnection[]>([]);
  const [switchStates, setSwitchStates] = useState<Record<string, boolean>>({});
  const [mode, setMode] = useState<Mode>('interact');
  const [placingCatalogId, setPlacingCatalogId] = useState<string | null>(null);
  const [pendingPos, setPendingPos] = useState<BreadboardPosition | null>(null);
  const [instanceSeq, setInstanceSeq] = useState(1);
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    setPlacements([]); setWires([]); setSwitchStates({}); setMode('interact');
    setPlacingCatalogId(null); setPendingPos(null); setInstanceSeq(1); setHint(null);
  }, [project.id]);

  const partsBin = useMemo(
    () => project.componentIds.map((id) => ELECTRONICS_COMPONENTS.find((c) => c.id === id)).filter((c): c is NonNullable<typeof c> => !!c),
    [project.componentIds],
  );
  const placeableParts = partsBin.filter((c) => c.pins.length === 2);
  const complexParts = partsBin.filter((c) => c.pins.length > 2);

  function selectForPlacing(catalogId: string) {
    setMode('interact');
    setPendingPos(null);
    setPlacingCatalogId((cur) => (cur === catalogId ? null : catalogId));
  }

  function handlePositionClick(pos: BreadboardPosition) {
    if (mode === 'wire') {
      if (!pendingPos) { setPendingPos(pos); return; }
      if (posKey(pendingPos) === posKey(pos)) { setPendingPos(null); return; }
      const touchesPos = ('rail' in pos && pos.rail.includes('pos')) || ('rail' in pendingPos && pendingPos.rail.includes('pos'));
      const touchesNeg = ('rail' in pos && pos.rail.includes('neg')) || ('rail' in pendingPos && pendingPos.rail.includes('neg'));
      const colorHex = touchesPos ? '#dc2626' : touchesNeg ? '#1a1a1a' : '#2563eb';
      setWires((w) => [...w, { id: `wire-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, from: pendingPos, to: pos, colorHex }]);
      setPendingPos(null);
      playSelectChime();
      return;
    }
    if (placingCatalogId) {
      const spec = ELECTRONICS_COMPONENTS.find((c) => c.id === placingCatalogId);
      if (!spec || spec.pins.length !== 2) return;
      if (!pendingPos) { setPendingPos(pos); return; }
      if (posKey(pendingPos) === posKey(pos)) { setHint('Pick a different hole for the second lead.'); return; }
      const instanceId = `${spec.id}-${instanceSeq}`;
      setPlacements((p) => [...p, { componentId: spec.id, instanceId, pinPositions: { [spec.pins[0].id]: pendingPos, [spec.pins[1].id]: pos } }]);
      setInstanceSeq((n) => n + 1);
      setPendingPos(null);
      setPlacingCatalogId(null);
      playSelectChime();
    }
  }

  function handleComponentClick(instanceId: string, kind: string) {
    if (mode === 'delete') {
      setPlacements((p) => p.filter((pl) => pl.instanceId !== instanceId));
      setSwitchStates((s) => { const next = { ...s }; delete next[instanceId]; return next; });
      playWarnBuzz();
      return;
    }
    if (kind === 'switch-spst' || kind === 'push-button') {
      setSwitchStates((s) => ({ ...s, [instanceId]: !s[instanceId] }));
      playSelectChime();
    }
  }

  function handleWireClick(wireId: string) {
    if (mode === 'delete') { setWires((w) => w.filter((x) => x.id !== wireId)); playWarnBuzz(); }
  }

  function loadReference() {
    setPlacements(project.referenceCircuit.placements);
    setWires(project.referenceCircuit.wires);
    setSwitchStates({});
    setPlacingCatalogId(null); setPendingPos(null); setHint(null);
    setInstanceSeq(project.referenceCircuit.placements.length + 1);
    setMode('interact');
    playSuccessChime();
  }
  function clearBoard() {
    setPlacements([]); setWires([]); setSwitchStates({}); setPlacingCatalogId(null); setPendingPos(null); setHint(null); setMode('interact');
  }

  // -- Real circuit evaluation -- the SAME engine used everywhere else in
  // this lab, run live against whatever the student has actually wired.
  const evalComponents: EvalComponentInput[] = useMemo(
    () =>
      placements.map((p) => {
        const spec = ELECTRONICS_COMPONENTS.find((c) => c.id === p.componentId)!;
        return {
          instanceId: p.instanceId,
          kind: spec.kind,
          pinPositions: p.pinPositions,
          resistanceOhms: p.valueOverride?.resistanceOhms ?? spec.electrical?.resistanceOhms,
          forwardVoltage: spec.electrical?.forwardVoltage,
          maxCurrentAmps: spec.electrical?.maxCurrentAmps,
          sourceVoltage: spec.electrical?.voltage,
          switchClosed: !!switchStates[p.instanceId],
        };
      }),
    [placements, switchStates],
  );
  const wireEdges = useMemo(() => wires.map((w) => ({ from: w.from, to: w.to })), [wires]);

  const timerPlacement = placements.find((p) => ELECTRONICS_COMPONENTS.find((c) => c.id === p.componentId)?.kind === 'timer-555');
  const batteryPlacement = placements.find((p) => {
    const k = ELECTRONICS_COMPONENTS.find((c) => c.id === p.componentId)?.kind;
    return k === 'battery-9v' || k === 'battery-6v';
  });
  const batteryVoltage = batteryPlacement ? ELECTRONICS_COMPONENTS.find((c) => c.id === batteryPlacement.componentId)?.electrical?.voltage ?? 9 : 9;

  const timerResult = useMemo(() => {
    if (!timerPlacement) return null;
    const leads: LeadPlacement[] = placements.flatMap((p) => Object.entries(p.pinPositions).map(([pin, position]) => ({ componentId: p.instanceId, pin, position })));
    const conn = buildConnectivity(leads, wireEdges);
    const resistors = placements
      .filter((p) => ELECTRONICS_COMPONENTS.find((c) => c.id === p.componentId)?.kind === 'resistor')
      .map((p) => ({ componentId: p.instanceId, ohms: p.valueOverride?.resistanceOhms ?? ELECTRONICS_COMPONENTS.find((c) => c.id === p.componentId)?.electrical?.resistanceOhms ?? 0 }));
    const capPlacement = placements.find((p) => ELECTRONICS_COMPONENTS.find((c) => c.id === p.componentId)?.kind === 'capacitor');
    const capacitor = capPlacement
      ? { componentId: capPlacement.instanceId, farads: capPlacement.valueOverride?.capacitanceFarads ?? ELECTRONICS_COMPONENTS.find((c) => c.id === capPlacement.componentId)?.electrical?.capacitanceFarads ?? 0 }
      : null;
    const topology = detect555AstableTopology(conn, timerPlacement.instanceId, resistors, capacitor);
    if (!topology) return null;
    return { topology, timing: astable555(topology.r1Ohms, topology.r2Ohms, topology.capacitanceFarads) };
  }, [placements, wireEdges, timerPlacement]);

  const extraSources: VirtualSource[] = useMemo(
    () => (timerResult ? [{ posNode: timerResult.topology.outNode, negNode: timerResult.topology.gndNode, voltage: batteryVoltage }] : []),
    [timerResult, batteryVoltage],
  );
  const evaluation = useMemo(() => evaluateCircuit(evalComponents, wireEdges, extraSources), [evalComponents, wireEdges, extraSources]);

  const buzzerActive = evaluation.loads.some((l) => {
    const p = placements.find((pl) => pl.instanceId === l.instanceId);
    return l.active && p && ELECTRONICS_COMPONENTS.find((c) => c.id === p.componentId)?.kind === 'buzzer';
  });
  useEffect(() => {
    if (buzzerActive) startBuzzerTone(); else stopBuzzerTone();
    return () => stopBuzzerTone();
  }, [buzzerActive]);

  const litCount = evaluation.leds.filter((l) => l.lit).length;
  const activeLoadCount = evaluation.loads.filter((l) => l.active).length;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => { setMode((m) => (m === 'wire' ? 'interact' : 'wire')); setPlacingCatalogId(null); setPendingPos(null); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border-2 border-slate-900 dark:border-slate-700 ${mode === 'wire' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-900'}`}
        >
          <Cable className="w-3.5 h-3.5" /> Wire Tool
        </button>
        <button
          onClick={() => { setMode((m) => (m === 'delete' ? 'interact' : 'delete')); setPlacingCatalogId(null); setPendingPos(null); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border-2 border-slate-900 dark:border-slate-700 ${mode === 'delete' ? 'bg-red-600 text-white' : 'bg-white dark:bg-slate-900'}`}
        >
          <Trash2 className="w-3.5 h-3.5" /> Delete Tool
        </button>
        <button onClick={loadReference} className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border-2 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-900">
          <FileText className="w-3.5 h-3.5" /> Load Reference Circuit
        </button>
        <button onClick={clearBoard} className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border-2 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-900">
          <RotateCcw className="w-3.5 h-3.5" /> Clear Board
        </button>
      </div>

      <p className="text-xs text-slate-500 min-h-[1rem]">
        {mode === 'wire' && !pendingPos && 'Wire Tool: click a hole or power rail, then click a second one to connect them.'}
        {mode === 'wire' && pendingPos && 'Now click the second point to complete the wire.'}
        {mode === 'delete' && 'Delete Tool: click any placed part or wire to remove it.'}
        {mode === 'interact' && placingCatalogId && !pendingPos && `Placing ${ELECTRONICS_COMPONENTS.find((c) => c.id === placingCatalogId)?.name}: click a hole for its "${ELECTRONICS_COMPONENTS.find((c) => c.id === placingCatalogId)?.pins[0]?.label}" lead.`}
        {mode === 'interact' && placingCatalogId && pendingPos && `Now click a hole for its "${ELECTRONICS_COMPONENTS.find((c) => c.id === placingCatalogId)?.pins[1]?.label}" lead.`}
        {mode === 'interact' && !placingCatalogId && (hint || 'Pick a part below to place it, or click a switch/button already on the board to flip it.')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 items-start">
        <div className="bg-[#e8e4da] dark:bg-[#3a3628] rounded-2xl p-3 border-2 border-slate-900 dark:border-slate-700 mx-auto">
          {timerResult && (
            <style>{`@keyframes wb-555-blink { 0% { opacity: 1; } ${Math.max(1, Math.min(99, timerResult.timing.dutyCycle * 100)).toFixed(2)}% { opacity: 1; } ${Math.min(99.9, Math.max(1.1, timerResult.timing.dutyCycle * 100 + 0.1)).toFixed(2)}% { opacity: 0.15; } 100% { opacity: 0.15; }}`}</style>
          )}
          <style>{`@keyframes wb-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
          <svg viewBox={`0 0 ${BOARD_WIDTH} ${BOARD_HEIGHT}`} width={BOARD_WIDTH * 1.8} height={BOARD_HEIGHT * 1.8}>
            {/* Power rails */}
            <rect x={LEFT_PAD - 6} y={4} width={BOARD_WIDTH - (LEFT_PAD - 6) * 2} height={38} rx={4} fill="#d1cdbf" />
            <rect x={LEFT_PAD - 6} y={rowY(ROWS) + 8} width={BOARD_WIDTH - (LEFT_PAD - 6) * 2} height={38} rx={4} fill="#d1cdbf" />
            {(['top-pos', 'top-neg', 'bottom-pos', 'bottom-neg'] as const).map((rail) => (
              <rect
                key={rail}
                x={LEFT_PAD - 4} y={railY(rail) - 6} width={BOARD_WIDTH - (LEFT_PAD - 4) * 2} height={12}
                fill={rail.includes('pos') ? '#dc262622' : '#1a1a1a22'}
                stroke={pendingPos && 'rail' in pendingPos && pendingPos.rail === rail ? '#f59e0b' : 'none'}
                strokeWidth={2}
                className="cursor-pointer"
                onClick={() => handlePositionClick({ rail })}
              />
            ))}
            <text x={4} y={railY('top-pos') + 3} fontSize={9} fontWeight="bold" fill="#dc2626">+</text>
            <text x={4} y={railY('top-neg') + 3} fontSize={9} fontWeight="bold" fill="#1a1a1a">-</text>
            <text x={4} y={railY('bottom-pos') + 3} fontSize={9} fontWeight="bold" fill="#dc2626">+</text>
            <text x={4} y={railY('bottom-neg') + 3} fontSize={9} fontWeight="bold" fill="#1a1a1a">-</text>

            {/* Hole grid */}
            {Array.from({ length: ROWS }, (_, i) => i + 1).map((row) =>
              COLS.map((col) => {
                const pos: BreadboardPosition = { row, col };
                const selected = pendingPos && !('rail' in pendingPos) && pendingPos.row === row && pendingPos.col === col;
                return (
                  <circle
                    key={`${row}-${col}`}
                    cx={colX(col)} cy={rowY(row)} r={selected ? 2.6 : 1.6}
                    fill={selected ? '#f59e0b' : '#9ca3af'}
                    className="cursor-pointer"
                    onClick={() => handlePositionClick(pos)}
                  />
                );
              }),
            )}
            {/* Gutter marker */}
            <line x1={(colX('e') + colX('f')) / 2} y1={TOP_RAIL_H - 4} x2={(colX('e') + colX('f')) / 2} y2={rowY(ROWS) + 4} stroke="#00000018" strokeWidth={3} />

            {/* Wires */}
            {wires.map((w) => {
              const [p1, p2] = resolvePair(w.from, w.to);
              return (
                <line
                  key={w.id} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                  stroke={w.colorHex} strokeWidth={mode === 'delete' ? 3 : 2.2} strokeLinecap="round"
                  opacity={mode === 'delete' ? 0.85 : 0.9}
                  className="cursor-pointer"
                  onClick={() => handleWireClick(w.id)}
                >
                  <title>{mode === 'delete' ? 'Click to remove this wire' : 'Wire'}</title>
                </line>
              );
            })}

            {/* Placed components */}
            {placements.map((p) => {
              const spec = ELECTRONICS_COMPONENTS.find((c) => c.id === p.componentId);
              if (!spec) return null;
              const pinIds = Object.keys(p.pinPositions);
              if (pinIds.length < 2) return null;
              const [pos1, pos2] = [p.pinPositions[pinIds[0]], p.pinPositions[pinIds[1]]];
              const [px1, px2] = resolvePair(pos1, pos2);
              const mx = (px1.x + px2.x) / 2;
              const my = (px1.y + px2.y) / 2;
              const ledResult = evaluation.leds.find((l) => l.instanceId === p.instanceId);
              const loadResult = evaluation.loads.find((l) => l.instanceId === p.instanceId);
              const isClosed = !!switchStates[p.instanceId];
              const ohms = p.valueOverride?.resistanceOhms ?? spec.electrical?.resistanceOhms;
              const bands = spec.kind === 'resistor' && ohms ? resistorColorBands(ohms) : null;
              const shouldBlink = timerResult && ledResult?.lit;

              let title = spec.name;
              if (ledResult) {
                title = ledResult.lit ? `${spec.name}: lit, ~${(ledResult.currentAmps * 1000).toFixed(1)} mA` : `${spec.name}: dark -- ${{
                  'no-closed-path': 'no complete circuit path yet', reversed: 'wired backwards -- flip the LED around', 'short-circuit': 'no resistor in this loop -- would burn out instantly', 'over-current': 'current too high for this LED -- use a larger resistor',
                }[ledResult.issue ?? 'no-closed-path']}`;
              } else if (loadResult) {
                title = `${spec.name}: ${loadResult.active ? 'active' : 'off'}`;
              } else if (spec.kind === 'switch-spst' || spec.kind === 'push-button') {
                title = `${spec.name}: ${isClosed ? 'closed (on) -- click to open' : 'open (off) -- click to close'}`;
              }

              return (
                <g key={p.instanceId} className="cursor-pointer" onClick={() => handleComponentClick(p.instanceId, spec.kind)}>
                  <title>{title}</title>
                  <line x1={px1.x} y1={px1.y} x2={px2.x} y2={px2.y} stroke="#71717a" strokeWidth={1.4} />
                  {mode === 'delete' && <circle cx={mx} cy={my} r={9} fill="none" stroke="#dc2626" strokeDasharray="2,2" strokeWidth={1.5} />}

                  {spec.kind === 'resistor' && (
                    <g>
                      <rect x={mx - 7} y={my - 3.5} width={14} height={7} rx={1.5} fill="#D2B48C" stroke="#8b6a4a" strokeWidth={0.6} />
                      {bands && [bands.band1, bands.band2, bands.multiplier].map((b, i) => (
                        <rect key={i} x={mx - 4.5 + i * 3} y={my - 3.5} width={1.6} height={7} fill={BAND_HEX[b]} />
                      ))}
                    </g>
                  )}

                  {spec.kind === 'led' && (
                    <g style={shouldBlink ? { animation: `wb-555-blink ${Math.max(0.05, Math.min(10, timerResult!.timing.periodSeconds))}s steps(1) infinite` } : undefined}>
                      {ledResult?.lit && <circle cx={mx} cy={my} r={10} fill={spec.colorHex} opacity={0.3} />}
                      <circle cx={mx} cy={my} r={5.5} fill={ledResult?.lit ? spec.colorHex : '#6b7280'} opacity={ledResult?.lit ? 1 : 0.4} stroke="#1a1a1a" strokeWidth={0.6} />
                      {ledResult && !ledResult.lit && ledResult.issue && ledResult.issue !== 'no-closed-path' && (
                        <text x={mx + 7} y={my - 6} fontSize={9} fontWeight="bold" fill="#dc2626">!</text>
                      )}
                    </g>
                  )}

                  {(spec.kind === 'switch-spst' || spec.kind === 'push-button') && (
                    <rect x={mx - 6} y={my - 6} width={12} height={12} rx={2} fill={isClosed ? '#16a34a' : '#dc2626'} stroke="#1a1a1a" strokeWidth={0.6} />
                  )}

                  {spec.kind === 'buzzer' && (
                    <circle cx={mx} cy={my} r={6.5} fill="#0f766e" stroke="#1a1a1a" strokeWidth={0.6} style={loadResult?.active ? { animation: 'wb-pulse 0.35s infinite' } : undefined} />
                  )}

                  {(spec.kind === 'dc-motor' || spec.kind === 'motor-servo' || spec.kind === 'motor-stepper') && (
                    <circle cx={mx} cy={my} r={7} fill="#475569" stroke="#1a1a1a" strokeWidth={0.6} style={loadResult?.active ? { animation: 'wb-pulse 0.5s infinite' } : undefined} />
                  )}

                  {(spec.kind === 'battery-9v' || spec.kind === 'battery-6v') && (
                    <rect x={mx - 8} y={my - 5} width={16} height={10} rx={1.5} fill="#1a1a1a" stroke="#000" strokeWidth={0.6} />
                  )}

                  {spec.kind === 'timer-555' && <rect x={mx - 5} y={my - 5} width={10} height={10} fill="#1e293b" />}
                  {spec.kind === 'capacitor' && <rect x={mx - 4} y={my - 5} width={8} height={10} rx={1} fill="#2563eb" />}
                </g>
              );
            })}

            {/* Pending placement/wire marker */}
            {pendingPos && !('rail' in pendingPos) && (
              <circle cx={colX(pendingPos.col)} cy={rowY(pendingPos.row)} r={4} fill="none" stroke="#f59e0b" strokeWidth={1.5}>
                <animate attributeName="r" values="3;6;3" dur="1s" repeatCount="indefinite" />
              </circle>
            )}
          </svg>
        </div>

        <div className="space-y-3 min-w-0">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 p-2.5">
              <p className="text-[10px] font-bold text-amber-600 uppercase">LEDs Lit</p>
              <p className="font-mono font-bold">{litCount} / {evaluation.leds.length}</p>
            </div>
            <div className="rounded-xl bg-teal-50 dark:bg-teal-900/20 p-2.5">
              <p className="text-[10px] font-bold text-teal-600 uppercase">Loads Active</p>
              <p className="font-mono font-bold">{activeLoadCount} / {evaluation.loads.length}</p>
            </div>
            <div className="rounded-xl bg-primary-50 dark:bg-primary-900/20 p-2.5">
              <p className="text-[10px] font-bold text-primary-600 uppercase">{timerResult ? 'Blink Rate' : 'Battery'}</p>
              <p className="font-mono font-bold">{timerResult ? `${timerResult.timing.frequencyHz.toFixed(2)} Hz` : batteryPlacement ? `${batteryVoltage}V` : '--'}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1"><Zap className="w-3 h-3" /> Parts Bin -- click to place</p>
            <div className="flex flex-wrap gap-1.5">
              {placeableParts.map((c) => (
                <button
                  key={c.id}
                  onClick={() => selectForPlacing(c.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border-2 border-slate-900 dark:border-slate-700 ${placingCatalogId === c.id ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200'}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
            {complexParts.length > 0 && (
              <p className="text-[11px] text-slate-400 mt-1.5">{complexParts.map((c) => c.name).join(', ')} {complexParts.length === 1 ? 'needs' : 'need'} a fixed real footprint -- use "Load Reference Circuit" to place {complexParts.length === 1 ? 'it' : 'them'}, then wire freely around {complexParts.length === 1 ? 'it' : 'them'}.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
