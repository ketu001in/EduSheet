'use client';
import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Cable, Trash2, RotateCcw, FileText, Zap, Move3d } from 'lucide-react';
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
  type EvalComponentInput,
  type VirtualSource,
  type LeadPlacement,
} from '@/lib/circuitEngine';
import { playSelectChime, playSuccessChime, playWarnBuzz, startBuzzerTone, stopBuzzerTone } from '@/lib/uiSoundEngine';

const Breadboard3DScene = dynamic(() => import('./Breadboard3DScene'), {
  ssr: false,
  loading: () => <div className="w-full h-[360px] rounded-2xl bg-slate-50 dark:bg-slate-900/40 animate-pulse" />,
});

// The real, hands-on Electronics Lab workbench -- a genuine interactive
// breadboard, rendered as a real 3D scene (Breadboard3DScene.tsx):
// orbit/zoom/pan the board itself, pick a part from the drawer-fed parts
// bin, click two real holes to place it (or click the power rail), wire
// holes together, flip switches, and watch the SAME real DC engine used
// everywhere else in this lab (circuitEngine.ts's evaluateCircuit /
// detect555AstableTopology / astable555) decide whether it actually
// lights up, buzzes, or spins -- not a canned animation keyed to "this is
// project X", genuine topology evaluation of whatever the student
// actually wired.
//
// This component owns ALL the state and circuit-evaluation logic; the 3D
// scene is purely a rendering/interaction surface that reports clicks
// back up through the same handlers the SVG version used, so the
// verified evaluateCircuit() pipeline underneath never changed.
//
// Scope, stated honestly: free two-click placement supports any real
// 2-pin part (resistor, LED, switch, push-button, motor, buzzer,
// battery). An 8-pin DIP IC (the 555) needs a fixed real footprint, so
// for a project that uses one, "Load Reference Circuit" places it (and
// everything else) pre-wired per the real, engine-verified reference
// layout -- the student can still freely add/remove wires and swap
// values afterward.

function posKey(pos: BreadboardPosition): string {
  return 'rail' in pos ? `rail:${pos.rail}` : `hole:${pos.row}:${pos.col}`;
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
        <span className="ml-auto text-[11px] text-slate-400 flex items-center gap-1"><Move3d className="w-3.5 h-3.5" /> Drag to orbit &middot; scroll to zoom</span>
      </div>

      <p className="text-xs text-slate-500 min-h-[1rem]">
        {mode === 'wire' && !pendingPos && 'Wire Tool: click a hole or power rail, then click a second one to connect them.'}
        {mode === 'wire' && pendingPos && 'Now click the second point to complete the wire.'}
        {mode === 'delete' && 'Delete Tool: click any placed part or wire to remove it.'}
        {mode === 'interact' && placingCatalogId && !pendingPos && `Placing ${ELECTRONICS_COMPONENTS.find((c) => c.id === placingCatalogId)?.name}: click a hole for its "${ELECTRONICS_COMPONENTS.find((c) => c.id === placingCatalogId)?.pins[0]?.label}" lead.`}
        {mode === 'interact' && placingCatalogId && pendingPos && `Now click a hole for its "${ELECTRONICS_COMPONENTS.find((c) => c.id === placingCatalogId)?.pins[1]?.label}" lead.`}
        {mode === 'interact' && !placingCatalogId && (hint || 'Pick a part below to place it, or click a switch/button already on the board to flip it.')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_260px] gap-4 items-start">
        <Breadboard3DScene
          placements={placements}
          wires={wires}
          pendingPos={pendingPos}
          switchStates={switchStates}
          evaluation={evaluation}
          timing={timerResult ? { periodSeconds: timerResult.timing.periodSeconds, dutyCycle: timerResult.timing.dutyCycle } : null}
          onPositionClick={handlePositionClick}
          onComponentClick={handleComponentClick}
          onWireClick={handleWireClick}
          deleteMode={mode === 'delete'}
        />

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
