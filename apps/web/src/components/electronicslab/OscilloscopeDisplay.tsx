'use client';
import { useMemo, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import type { OscilloscopeTrace } from '@/lib/circuitEngine';

// A real, modern oscilloscope readout -- deliberately plain React/SVG,
// not a WebGL scene. Two earlier Electronics Lab features (the drawer
// part-picker) failed live specifically because they lived inside the
// R3F/WebGL layer and depended on its frame loop, which this session
// confirmed by direct instrumentation was not reliably ticking. A CRO
// trace is exactly the kind of thing that MUST be trustworthy, so it's
// built on the same guaranteed-reliable ground: ordinary React state,
// ordinary DOM, recomputed once per real state change, never per-frame.
//
// Design informed by how real modern circuit simulators do this
// (Tinkercad Circuits, Falstad/CircuitJS, EveryCircuit) -- a real,
// adjustable VOLTS/DIV and TIME/DIV (not just an auto-fit static image),
// a clean flat-modern screen rather than a literal beige-CRT skeuomorph,
// and a STABLE (not scrolling) trace for a periodic signal -- a real
// bench scope with its sweep triggered on a repeating signal shows
// exactly this: one steady, readable cycle, not a smear.
//
// Always mounted on the bench (see BreadboardWorkbench.tsx) rather than
// only appearing once a CRO is wired in, so `trace.kind === 'unknown'`
// (no probe connected yet) is a real, expected, first-seen state, not
// an edge case -- it gets its own clear on-screen message.
const VOLTS_PER_DIV_PRESETS = [0.5, 1, 2, 5, 10];
const TIME_PER_DIV_PRESETS = [0.02, 0.05, 0.1, 0.2, 0.5, 1, 2];
const H_DIVS = 10;
const V_DIVS = 8;

function snapToPreset(ideal: number, presets: number[]): number {
  const found = presets.find((p) => p >= ideal);
  return found ?? presets[presets.length - 1];
}

export default function OscilloscopeDisplay({ trace, wide = false }: { trace: OscilloscopeTrace; wide?: boolean }) {
  // 0V is always the vertical CENTER of the screen (a real scope's own
  // ground reference), so a one-directional signal like 0-9V only uses
  // the upper half of the display -- the needed volts/div has to fit
  // the larger of |max| and |min| within half the divisions, not the
  // full peak-to-peak span across all of them (which under-scales and
  // clips the top, a real bug caught by checking the actual rendered
  // trace coordinates rather than assuming the math was right).
  const defaultVoltsPerDiv = useMemo(() => {
    const reach = Math.max(Math.abs(trace.maxVoltage), Math.abs(trace.minVoltage)) || 1;
    return snapToPreset(reach / (V_DIVS / 2) / 0.85, VOLTS_PER_DIV_PRESETS);
  }, [trace.maxVoltage, trace.minVoltage]);
  const defaultTimePerDiv = useMemo(
    () => snapToPreset(trace.periodSeconds ? (trace.periodSeconds * 2.2) / H_DIVS : 0.1, TIME_PER_DIV_PRESETS),
    [trace.periodSeconds],
  );
  const [voltsPerDiv, setVoltsPerDiv] = useState(defaultVoltsPerDiv);
  const [timePerDiv, setTimePerDiv] = useState(defaultTimePerDiv);

  // Reset the manual scale whenever the underlying signal genuinely
  // changes shape (a different project, a different value swapped in) --
  // real state, not per-frame, so this is cheap and correct.
  const scaleKey = `${trace.kind}-${trace.periodSeconds}-${trace.minVoltage}-${trace.maxVoltage}`;
  const [lastScaleKey, setLastScaleKey] = useState(scaleKey);
  if (scaleKey !== lastScaleKey) {
    setLastScaleKey(scaleKey);
    setVoltsPerDiv(defaultVoltsPerDiv);
    setTimePerDiv(defaultTimePerDiv);
  }

  const width = wide ? 1000 : 400;
  const height = wide ? 260 : 280;
  const gridW = width - 20;
  const gridH = height - 20;
  const originY = 10 + gridH / 2;

  const totalTime = timePerDiv * H_DIVS;
  const samples = wide ? 400 : 240;
  const points = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= samples; i++) {
      const t = (i / samples) * totalTime;
      const v = trace.voltageAtT(t);
      const x = 10 + (i / samples) * gridW;
      const y = originY - (v / voltsPerDiv) * (gridH / V_DIVS);
      pts.push(`${x.toFixed(1)},${Math.max(10, Math.min(height - 10, y)).toFixed(1)}`);
    }
    return pts.join(' ');
  }, [trace, totalTime, samples, voltsPerDiv, gridW, gridH, originY, height]);

  const amplitude = trace.maxVoltage - trace.minVoltage;
  const notConnected = trace.kind === 'unknown';

  const readouts = (
    <div className={`grid grid-cols-3 gap-2 text-center ${wide ? '' : 'pt-1'}`}>
      <div className="rounded-lg bg-slate-900 p-2">
        <p className="text-[9px] font-bold text-slate-500 uppercase">Amplitude</p>
        <p className="text-xs font-mono font-bold text-emerald-400">{notConnected ? '--' : amplitude < 0.01 ? '0' : `${amplitude.toFixed(2)} Vpp`}</p>
      </div>
      <div className="rounded-lg bg-slate-900 p-2">
        <p className="text-[9px] font-bold text-slate-500 uppercase">Period</p>
        <p className="text-xs font-mono font-bold text-emerald-400">{trace.periodSeconds != null ? `${trace.periodSeconds.toFixed(2)}s` : '--'}</p>
      </div>
      <div className="rounded-lg bg-slate-900 p-2">
        <p className="text-[9px] font-bold text-slate-500 uppercase">Frequency</p>
        <p className="text-xs font-mono font-bold text-emerald-400">{trace.frequencyHz != null ? `${trace.frequencyHz.toFixed(2)} Hz` : '--'}</p>
      </div>
    </div>
  );
  const controls = (
    <div className="grid grid-cols-2 gap-2">
      <ScaleControl label="VOLTS/DIV" value={voltsPerDiv} unit="V" presets={VOLTS_PER_DIV_PRESETS} onChange={setVoltsPerDiv} />
      <ScaleControl label="TIME/DIV" value={timePerDiv} unit="s" presets={TIME_PER_DIV_PRESETS} onChange={setTimePerDiv} />
    </div>
  );

  return (
    <div className="rounded-2xl border-2 border-slate-900 dark:border-slate-700 bg-slate-950 overflow-hidden">
      <div className="p-3">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full rounded-lg" style={{ background: '#031008' }}>
          {/* Grid */}
          {Array.from({ length: H_DIVS + 1 }, (_, i) => (
            <line key={`v${i}`} x1={10 + (i * gridW) / H_DIVS} y1={10} x2={10 + (i * gridW) / H_DIVS} y2={height - 10} stroke="#16a34a" strokeOpacity={i === H_DIVS / 2 ? 0.45 : 0.15} strokeWidth={i === H_DIVS / 2 ? 1.2 : 0.6} />
          ))}
          {Array.from({ length: V_DIVS + 1 }, (_, i) => (
            <line key={`h${i}`} x1={10} y1={10 + (i * gridH) / V_DIVS} x2={width - 10} y2={10 + (i * gridH) / V_DIVS} stroke="#16a34a" strokeOpacity={i === V_DIVS / 2 ? 0.45 : 0.15} strokeWidth={i === V_DIVS / 2 ? 1.2 : 0.6} />
          ))}
          {/* Trace */}
          <polyline points={points} fill="none" stroke={notConnected ? '#475569' : '#4ade80'} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" style={notConnected ? undefined : { filter: 'drop-shadow(0 0 3px #4ade8099)' }} />
          {notConnected && (
            <text x={width / 2} y={height / 2 - 18} textAnchor="middle" fontSize={wide ? 13 : 11} fontFamily="monospace" fill="#64748b">NO SIGNAL</text>
          )}
        </svg>
      </div>

      {/* "What am I looking at?" -- a real, readable-prose explanation of
          what this specific trace actually means, not just its
          technical name. This is the direct fix for the scope reading
          as "irrelevant" and "not understandable" in real use: the
          numbers were always correct, but nothing explained them in
          plain language. Genuinely readable text (not tiny green
          monospace on black), on its own light panel so it reads as
          real instructional content, not an instrument readout. */}
      <div className="mx-3 mb-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-3">
        <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">{trace.label} -- what does this mean?</p>
        <p className="text-xs text-amber-900/90 dark:text-amber-200/90 leading-relaxed">{trace.explanation}</p>
      </div>

      {wide ? (
        <div className="px-3 pb-3 flex flex-wrap items-center gap-4">
          <div className="w-64">{controls}</div>
          <div className="w-72">{readouts}</div>
        </div>
      ) : (
        <div className="px-3 pb-3 space-y-2">
          {controls}
          {readouts}
        </div>
      )}
    </div>
  );
}

function ScaleControl({ label, value, unit, presets, onChange }: { label: string; value: number; unit: string; presets: number[]; onChange: (v: number) => void }) {
  const idx = presets.indexOf(value);
  const step = (dir: -1 | 1) => {
    const nextIdx = Math.min(presets.length - 1, Math.max(0, (idx === -1 ? 0 : idx) + dir));
    onChange(presets[nextIdx]);
  };
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-900 px-2 py-1.5">
      <span className="text-[9px] font-bold text-slate-500 uppercase">{label}</span>
      <div className="flex items-center gap-1">
        <button onClick={() => step(-1)} className="p-0.5 rounded hover:bg-slate-800 text-slate-400"><Minus className="w-3 h-3" /></button>
        <span className="text-[11px] font-mono font-bold text-emerald-400 w-12 text-center">{value}{unit}</span>
        <button onClick={() => step(1)} className="p-0.5 rounded hover:bg-slate-800 text-slate-400"><Plus className="w-3 h-3" /></button>
      </div>
    </div>
  );
}
