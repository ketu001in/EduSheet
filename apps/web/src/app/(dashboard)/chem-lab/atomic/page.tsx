'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { DndContext, useDraggable, useDroppable, DragEndEvent } from '@dnd-kit/core';
import {
  ChevronLeft, Atom, Info, Plus, Minus, Orbit, Zap, History, Layers, Users,
  X, PartyPopper, Sparkles, Link2, ArrowRightLeft, FlaskConical, Share2, RotateCcw,
} from 'lucide-react';
import {
  ATOMIC_MODELS, SUBATOMIC_PARTICLES, ELEMENT_SHELL_CONFIGS, bohrBuryShells,
  PERIODIC_TABLE, PeriodicElement, IONIC_BOND_PAIRS, COVALENT_MOLECULES,
  IonicBondPair, CovalentMolecule,
} from '@edusheets/content';

const SHELL_LABELS = ['K', 'L', 'M', 'N'];
const SHELL_MAX = [2, 8, 8, 20]; // N shown uncapped in this builder -- Z<=20 never fills it past 2 anyway
const SHELL_RADII = [30, 52, 74, 96];
const SHELL_COLOR = ['text-red-500', 'text-amber-500', 'text-emerald-500', 'text-primary-600'];

// ---------------------------------------------------------------------------
// Pure visualization -- takes counts, draws the Bohr diagram. Reused by both
// the live Builder preview and the static Element Deep-Dive gallery.
// ---------------------------------------------------------------------------
function BohrDiagram({ protons, neutrons, shells, size = 260 }: { protons: number; neutrons: number; shells: number[]; size?: number }) {
  const c = size / 2;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[280px] mx-auto">
      {shells.map((count, shellIdx) => {
        if (count <= 0) return null;
        const r = SHELL_RADII[shellIdx] * (size / 260);
        return (
          <g key={shellIdx}>
            <circle cx={c} cy={c} r={r} fill="none" strokeWidth={1.5} strokeDasharray="3 3" className={`${SHELL_COLOR[shellIdx]} opacity-50`} stroke="currentColor" />
            {Array.from({ length: count }, (_, i) => {
              const angle = (2 * Math.PI * i) / count - Math.PI / 2;
              return (
                <circle
                  key={i}
                  cx={c + r * Math.cos(angle)}
                  cy={c + r * Math.sin(angle)}
                  r={5 * (size / 260)}
                  className={SHELL_COLOR[shellIdx]}
                  fill="currentColor"
                />
              );
            })}
          </g>
        );
      })}
      <circle cx={c} cy={c} r={18 * (size / 260)} className="fill-slate-800 dark:fill-slate-200" />
      <text x={c} y={c - 3} textAnchor="middle" className="fill-white dark:fill-slate-900 text-[9px] font-bold">{protons}p+</text>
      <text x={c} y={c + 9} textAnchor="middle" className="fill-white dark:fill-slate-900 text-[9px] font-bold">{neutrons}n0</text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Build an Atom -- protons/neutrons via steppers (order doesn't matter, so
// no need to drag them), electrons via drag-and-drop onto a shell (order
// and destination is the whole point pedagogically).
// ---------------------------------------------------------------------------
function ElectronSupplyChip() {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: 'electron-supply' });
  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`px-4 py-3 rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-grab active:cursor-grabbing select-none touch-none hover:shadow-[3px_3px_0_var(--color-ink)] transition-all ${isDragging ? 'opacity-30' : ''}`}
    >
      <span className="block text-sm font-bold text-primary-600">e-</span>
      <span className="block text-[10px] text-slate-500">Drag to a shell</span>
    </button>
  );
}

function ShellDropZone({ index, count, onRemove }: { index: number; count: number; onRemove: () => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: `shell:${index}` });
  const atCapacity = index < 3 && count >= SHELL_MAX[index];
  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[110px] rounded-2xl border-2 p-3 text-center transition-all ${
        isOver ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 scale-105' : atCapacity ? 'border-accent-400 dark:border-accent-700 bg-accent-50/50 dark:bg-accent-950/20' : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      <p className={`text-xs font-bold mb-1 ${SHELL_COLOR[index]}`}>{SHELL_LABELS[index]} shell</p>
      <p className="text-lg font-bold">{count}</p>
      <p className="text-[10px] text-slate-400 mb-2">{index < 3 ? `max ${SHELL_MAX[index]}` : 'overflow'}</p>
      {count > 0 && (
        <button onClick={onRemove} className="text-[10px] font-bold text-slate-400 hover:text-red-600 flex items-center gap-0.5 mx-auto">
          <Minus className="w-3 h-3" /> remove one
        </button>
      )}
    </div>
  );
}

function Stepper({ label, value, onChange, color }: { label: string; value: number; onChange: (v: number) => void; color: string }) {
  return (
    <div className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-3">
      <span className={`text-sm font-bold ${color}`}>{label}</span>
      <div className="flex items-center gap-2">
        <button onClick={() => onChange(Math.max(0, value - 1))} className="w-8 h-8 rounded-full border-2 border-slate-900 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800">
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="w-8 text-center font-bold">{value}</span>
        <button onClick={() => onChange(Math.min(30, value + 1))} className="w-8 h-8 rounded-full border-2 border-slate-900 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function BuildAnAtom() {
  const [protons, setProtons] = useState(6);
  const [neutrons, setNeutrons] = useState(6);
  const [shellElectrons, setShellElectrons] = useState<number[]>([2, 4, 0, 0]);

  const totalElectrons = shellElectrons.reduce((a, b) => a + b, 0);
  const correctShells = useMemo(() => bohrBuryShells(totalElectrons), [totalElectrons]);
  const shellsCorrect = JSON.stringify(shellElectrons.filter((n) => n > 0)) === JSON.stringify(correctShells);

  const identified = ELEMENT_SHELL_CONFIGS.find((e) => e.atomicNumber === protons);
  const charge = totalElectrons - protons; // positive electrons => anion (extra e-), fewer => cation
  const commonNeutrons = identified ? Math.round(parseFloat(PERIODIC_TABLE.find((p) => p.atomicNumber === protons)?.atomicMass || '0')) - protons : null;
  const isAtCommonIon = identified?.commonIon ? charge === -identified.commonIon.charge : false;

  const tryCommonIon = () => {
    if (!identified?.commonIon) return;
    const targetElectrons = protons - identified.commonIon.charge;
    setShellElectrons(() => {
      const filled = bohrBuryShells(targetElectrons);
      return [0, 1, 2, 3].map((i) => filled[i] || 0);
    });
  };
  const resetToNeutral = () => {
    setShellElectrons(() => {
      const filled = bohrBuryShells(protons);
      return [0, 1, 2, 3].map((i) => filled[i] || 0);
    });
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { over } = e;
    if (!over) return;
    const shellIdx = Number(String(over.id).replace('shell:', ''));
    setShellElectrons((prev) => {
      const next = [...prev];
      next[shellIdx] = (next[shellIdx] || 0) + 1;
      return next;
    });
  };
  const removeFromShell = (idx: number) => {
    setShellElectrons((prev) => {
      const next = [...prev];
      next[idx] = Math.max(0, (next[idx] || 0) - 1);
      return next;
    });
  };
  const reset = () => { setProtons(6); setNeutrons(6); setShellElectrons([2, 4, 0, 0]); };

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-display text-xl font-semibold flex items-center gap-2"><Orbit className="w-5 h-5 text-primary-600" /> Build an Atom</h2>
        <button onClick={reset} className="text-xs font-bold text-slate-500 hover:text-primary-600">Reset to Carbon</button>
      </div>
      <p className="text-sm text-slate-500">Set the protons and neutrons, then drag electrons into the K, L, M, N shells -- in order, following the same rules real atoms do.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Stepper label="Protons (p+)" value={protons} onChange={setProtons} color="text-red-500" />
          <Stepper label="Neutrons (n0)" value={neutrons} onChange={setNeutrons} color="text-slate-500" />
          <BohrDiagram protons={protons} neutrons={neutrons} shells={shellElectrons} />
        </div>

        <DndContext onDragEnd={handleDragEnd}>
          <div className="space-y-3">
            <div className="flex justify-center">
              <ElectronSupplyChip />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {SHELL_LABELS.map((_, i) => (
                <ShellDropZone key={i} index={i} count={shellElectrons[i] || 0} onRemove={() => removeFromShell(i)} />
              ))}
            </div>
          </div>
        </DndContext>
      </div>

      <div className={`rounded-2xl p-5 space-y-2 border-2 ${identified ? 'bg-accent-50 dark:bg-accent-950/20 border-accent-400 dark:border-accent-700' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'}`}>
        {identified ? (
          <p className="flex items-center gap-2 font-bold text-accent-700 dark:text-accent-400"><PartyPopper className="w-5 h-5" /> {identified.name} ({identified.symbol})</p>
        ) : (
          <p className="text-sm text-slate-500">{protons} protons doesn&apos;t match any of the first 20 elements this tool covers.</p>
        )}
        {identified && (
          <div className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
            <p>
              {totalElectrons === protons
                ? 'This is a neutral atom -- equal protons and electrons.'
                : charge > 0
                ? `This is an ion with a ${charge}- charge (${totalElectrons} electrons vs ${protons} protons) -- an anion.`
                : `This is an ion with a ${Math.abs(charge)}+ charge (${totalElectrons} electrons vs ${protons} protons) -- a cation.`}
            </p>
            {commonNeutrons !== null && (
              <p>{neutrons === commonNeutrons ? `${neutrons} neutrons matches ${identified.name}'s most common isotope.` : `${neutrons} neutrons is an isotope of ${identified.name} (its most common form has ${commonNeutrons}).`}</p>
            )}
            <p className={shellsCorrect ? 'text-accent-700 dark:text-accent-400 font-semibold' : 'text-amber-700 dark:text-amber-400'}>
              {shellsCorrect
                ? `Shell distribution is correct: ${correctShells.join(', ')} -- exactly how a real atom with ${totalElectrons} electrons fills its shells.`
                : `Not quite the real shell order yet -- ${totalElectrons} electrons should fill as ${correctShells.join(', ')} (fill K fully before L, L fully before M).`}
            </p>
            {identified.commonIon && (
              <div className="pt-2 flex flex-wrap items-center gap-2">
                {!isAtCommonIon ? (
                  <button onClick={tryCommonIon} className="text-xs font-bold px-3 py-1.5 rounded-full bg-primary-600 text-white hover:bg-primary-700 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> Try {identified.symbol}{identified.commonIon.charge > 0 ? '+'.repeat(identified.commonIon.charge) : '-'.repeat(Math.abs(identified.commonIon.charge))}
                  </button>
                ) : (
                  <button onClick={resetToNeutral} className="text-xs font-bold px-3 py-1.5 rounded-full border-2 border-slate-900 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5" /> Back to neutral {identified.symbol}
                  </button>
                )}
                {isAtCommonIon && <p className="text-xs text-slate-500 w-full">{identified.commonIon.note}</p>}
              </div>
            )}
          </div>
        )}
      </div>

      <a href="#bonding-lab" className="flex items-center justify-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700">
        Now try bonding two atoms together <Link2 className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Ionic Bonding Lab -- drag the metal's valence electron(s) onto the
// nonmetal atom(s) that need them. Each drop is rendered by re-running
// bohrBuryShells() on the metal's/nonmetal's live electron count, so the
// shell diagrams visibly empty out / fill up in real time, using the exact
// same verified shell-filling logic as Build an Atom above.
// ---------------------------------------------------------------------------
function IonicElectronChip() {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: 'ionic-electron' });
  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`px-3 py-2 rounded-lg border-2 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-grab active:cursor-grabbing select-none touch-none hover:shadow-[3px_3px_0_var(--color-ink)] transition-all ${isDragging ? 'opacity-30' : ''}`}
    >
      <span className="text-xs font-bold text-red-500">e-</span>
    </button>
  );
}

function NonmetalTarget({ index, filled, needed, symbol }: { index: number; filled: number; needed: number; symbol: string }) {
  const { setNodeRef, isOver } = useDroppable({ id: `nonmetal:${index}` });
  const complete = filled >= needed;
  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl border-2 px-3 py-1.5 text-center transition-all ${
        isOver ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 scale-105' : complete ? 'border-accent-400 dark:border-accent-700 bg-accent-50/50 dark:bg-accent-950/20' : 'border-dashed border-slate-300 dark:border-slate-700'
      }`}
    >
      <p className="text-[10px] font-bold text-slate-400">{complete ? `${symbol}${'-'.repeat(needed)} formed` : `${symbol} needs ${needed - filled} more e-`}</p>
    </div>
  );
}

function IonicBondPlayground({ pair }: { pair: IonicBondPair }) {
  const [given, setGiven] = useState<number[]>(() => new Array(pair.nonmetalCount).fill(0));
  const metalConfig = ELEMENT_SHELL_CONFIGS.find((e) => e.atomicNumber === pair.metalAtomicNumber)!;
  const nonmetalConfig = ELEMENT_SHELL_CONFIGS.find((e) => e.atomicNumber === pair.nonmetalAtomicNumber)!;
  const totalGiven = given.reduce((a, b) => a + b, 0);
  const metalValence = metalConfig.shells[metalConfig.shells.length - 1];
  const metalShells = bohrBuryShells(metalConfig.atomicNumber - totalGiven);
  const complete = given.every((g) => g >= pair.electronsPerNonmetal);

  const handleDragEnd = (e: DragEndEvent) => {
    const { over } = e;
    if (!over || complete || totalGiven >= metalValence) return;
    const idx = Number(String(over.id).replace('nonmetal:', ''));
    if (Number.isNaN(idx)) return;
    setGiven((prev) => {
      if (prev[idx] >= pair.electronsPerNonmetal) return prev;
      const next = [...prev];
      next[idx] += 1;
      return next;
    });
  };

  return (
    <div className="space-y-5">
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <div className="text-center">
            <BohrDiagram protons={metalConfig.atomicNumber} neutrons={0} shells={metalShells} size={180} />
            <p className="font-bold text-sm">{metalConfig.name} {totalGiven > 0 && <span className="text-red-500">{totalGiven >= metalValence ? `${metalConfig.symbol}${'+'.repeat(metalValence)}` : ''}</span>}</p>
            {totalGiven < metalValence && (
              <div className="flex justify-center mt-1">
                <IonicElectronChip />
              </div>
            )}
          </div>
          <ArrowRightLeft className={`w-6 h-6 shrink-0 ${complete ? 'text-accent-600' : 'text-slate-300 dark:text-slate-700'}`} />
          <div className="flex flex-wrap items-center justify-center gap-4">
            {given.map((g, i) => (
              <div key={i} className="text-center">
                <BohrDiagram protons={nonmetalConfig.atomicNumber} neutrons={0} shells={bohrBuryShells(nonmetalConfig.atomicNumber + g)} size={150} />
                <p className="font-bold text-sm mb-1">{nonmetalConfig.name}</p>
                <NonmetalTarget index={i} filled={g} needed={pair.electronsPerNonmetal} symbol={nonmetalConfig.symbol} />
              </div>
            ))}
          </div>
        </div>
      </DndContext>

      {complete && (
        <div className="rounded-2xl p-5 border-2 border-accent-400 dark:border-accent-700 bg-accent-50 dark:bg-accent-950/20 space-y-2">
          <p className="flex items-center gap-2 font-bold text-accent-700 dark:text-accent-400"><PartyPopper className="w-5 h-5" /> {pair.compoundName} ({pair.formula}) formed!</p>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{pair.explanation}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300"><strong>Real-world use:</strong> {pair.realWorldUse}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300"><strong>Fun fact:</strong> {pair.funFact}</p>
        </div>
      )}
    </div>
  );
}

function IonicBondingLab() {
  const [pairId, setPairId] = useState(IONIC_BOND_PAIRS[0].id);
  const pair = IONIC_BOND_PAIRS.find((p) => p.id === pairId)!;
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">Pick a pair, then drag the metal&apos;s spare electron(s) onto the nonmetal atom(s) that need them.</p>
      <div className="flex flex-wrap gap-2">
        {IONIC_BOND_PAIRS.map((p) => (
          <button
            key={p.id}
            onClick={() => setPairId(p.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${p.id === pairId ? 'bg-primary-600 text-white border-primary-600' : 'border-slate-200 dark:border-slate-800 hover:border-primary-400'}`}
          >
            {p.formula}
          </button>
        ))}
      </div>
      <IonicBondPlayground key={pair.id} pair={pair} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Covalent Bonding Lab -- drag an electron chip onto each bond zone between
// the central atom and an outer atom to form a shared pair. Scoped to
// single-bond molecules only, see COVALENT_MOLECULES's comment.
// ---------------------------------------------------------------------------
function CovalentElectronChip() {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: 'covalent-electron' });
  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`px-3 py-2 rounded-lg border-2 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-grab active:cursor-grabbing select-none touch-none hover:shadow-[3px_3px_0_var(--color-ink)] transition-all mx-auto ${isDragging ? 'opacity-30' : ''}`}
    >
      <span className="text-xs font-bold text-primary-600">e-</span>
    </button>
  );
}

function BondZone({ index, bonded }: { index: number; bonded: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: `bond:${index}` });
  return (
    <div
      ref={setNodeRef}
      className={`w-14 h-10 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${
        isOver ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 scale-110' : bonded ? 'border-accent-400 dark:border-accent-700 bg-accent-50/50 dark:bg-accent-950/20' : 'border-dashed border-slate-300 dark:border-slate-700'
      }`}
    >
      {bonded ? (
        <span className="flex gap-0.5">
          <span className="w-2 h-2 rounded-full bg-accent-600" />
          <span className="w-2 h-2 rounded-full bg-accent-600" />
        </span>
      ) : (
        <Share2 className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
      )}
    </div>
  );
}

function CovalentBondPlayground({ molecule }: { molecule: CovalentMolecule }) {
  const [bonds, setBonds] = useState<boolean[]>(() => new Array(molecule.outerAtomicNumbers.length).fill(false));
  const centralConfig = ELEMENT_SHELL_CONFIGS.find((e) => e.atomicNumber === molecule.centralAtomicNumber)!;
  const complete = bonds.every(Boolean);

  const handleDragEnd = (e: DragEndEvent) => {
    const { over } = e;
    if (!over) return;
    const idx = Number(String(over.id).replace('bond:', ''));
    if (Number.isNaN(idx)) return;
    setBonds((prev) => {
      const next = [...prev];
      next[idx] = true;
      return next;
    });
  };

  return (
    <div className="space-y-5">
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex flex-col items-center gap-3">
          {!complete && (
            <div className="flex justify-center">
              <CovalentElectronChip />
            </div>
          )}
          <div className="text-center">
            <BohrDiagram protons={centralConfig.atomicNumber} neutrons={0} shells={centralConfig.shells} size={170} />
            <p className="font-bold text-sm">{centralConfig.name}</p>
          </div>
          <div className="flex flex-wrap items-start justify-center gap-3">
            {molecule.outerAtomicNumbers.map((atomicNumber, i) => {
              const outerConfig = ELEMENT_SHELL_CONFIGS.find((e) => e.atomicNumber === atomicNumber)!;
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <BondZone index={i} bonded={bonds[i]} />
                  <BohrDiagram protons={outerConfig.atomicNumber} neutrons={0} shells={outerConfig.shells} size={110} />
                  <p className="text-xs font-bold">{outerConfig.symbol}</p>
                </div>
              );
            })}
          </div>
        </div>
      </DndContext>

      {complete && (
        <div className="rounded-2xl p-5 border-2 border-accent-400 dark:border-accent-700 bg-accent-50 dark:bg-accent-950/20 space-y-2">
          <p className="flex items-center gap-2 font-bold text-accent-700 dark:text-accent-400"><PartyPopper className="w-5 h-5" /> {molecule.name} ({molecule.formula}) formed!</p>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{molecule.explanation}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300"><strong>Real-world use:</strong> {molecule.realWorldUse}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300"><strong>Fun fact:</strong> {molecule.funFact}</p>
        </div>
      )}
    </div>
  );
}

function CovalentBondingLab() {
  const [moleculeId, setMoleculeId] = useState(COVALENT_MOLECULES[0].id);
  const molecule = COVALENT_MOLECULES.find((m) => m.id === moleculeId)!;
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">Pick a molecule, then drag an electron onto each bond zone to share a pair between the atoms.</p>
      <div className="flex flex-wrap gap-2">
        {COVALENT_MOLECULES.map((m) => (
          <button
            key={m.id}
            onClick={() => setMoleculeId(m.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${m.id === moleculeId ? 'bg-primary-600 text-white border-primary-600' : 'border-slate-200 dark:border-slate-800 hover:border-primary-400'}`}
          >
            {m.formula}
          </button>
        ))}
      </div>
      <CovalentBondPlayground key={molecule.id} molecule={molecule} />
    </div>
  );
}

function BondingLab() {
  const [mode, setMode] = useState<'ionic' | 'covalent'>('ionic');
  return (
    <div id="bonding-lab" className="glass-card rounded-3xl p-6 md:p-8 space-y-5 scroll-mt-20">
      <h2 className="font-display text-xl font-semibold flex items-center gap-2"><FlaskConical className="w-5 h-5 text-primary-600" /> Bonding Lab</h2>
      <p className="text-sm text-slate-500">Full interactive experiments: drag electrons between atoms to actually form real compounds and molecules, with the same shell diagrams as the builder above.</p>
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl w-fit">
        <button onClick={() => setMode('ionic')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'ionic' ? 'bg-white dark:bg-slate-900 shadow-sm' : 'text-slate-500'}`}>Ionic Bonding</button>
        <button onClick={() => setMode('covalent')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'covalent' ? 'bg-white dark:bg-slate-900 shadow-sm' : 'text-slate-500'}`}>Covalent Bonding</button>
      </div>
      {mode === 'ionic' ? <IonicBondingLab /> : <CovalentBondingLab />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Element Deep-Dive gallery (elements 1-20 only, matching the Builder's
// verified range) -- cross-references the full PERIODIC_TABLE entry for
// category/mass/summary so nothing is duplicated between the two pages.
// ---------------------------------------------------------------------------
function ElementDeepDive() {
  const [selected, setSelected] = useState<typeof ELEMENT_SHELL_CONFIGS[number] | null>(null);
  const periodicMatch: PeriodicElement | undefined = selected ? PERIODIC_TABLE.find((p) => p.atomicNumber === selected.atomicNumber) : undefined;
  const valence = selected ? selected.shells[selected.shells.length - 1] : 0;

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 space-y-4">
      <h2 className="font-display text-xl font-semibold flex items-center gap-2"><Layers className="w-5 h-5 text-primary-600" /> Element Deep-Dive</h2>
      <p className="text-sm text-slate-500">The first 20 elements, shell by shell -- tap one for the full picture.</p>
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-2">
        {ELEMENT_SHELL_CONFIGS.map((el) => (
          <button
            key={el.atomicNumber}
            onClick={() => setSelected(el)}
            className="aspect-square rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-surface-light dark:bg-surface-dark hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--color-ink)] transition-all flex flex-col items-center justify-center"
          >
            <span className="text-[9px] text-slate-400">{el.atomicNumber}</span>
            <span className="text-sm font-bold text-primary-600">{el.symbol}</span>
          </button>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 space-y-5">
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
            <div className="text-center">
              <BohrDiagram
                protons={selected.atomicNumber}
                neutrons={Math.round(parseFloat(periodicMatch?.atomicMass || '0')) - selected.atomicNumber}
                shells={selected.shells}
              />
              <h3 className="text-xl font-bold mt-2">{selected.name} ({selected.symbol})</h3>
              <p className="text-sm text-slate-500 capitalize">{periodicMatch?.category}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Shell Configuration</p>
                <p className="font-bold">{selected.shells.join(', ')} ({SHELL_LABELS.slice(0, selected.shells.length).join(',')})</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Valence Electrons</p>
                <p className="font-bold">{valence} (outermost shell)</p>
              </div>
            </div>
            {periodicMatch && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Did You Know?</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{periodicMatch.summary}</p>
              </div>
            )}
            <Link href="/chem-lab/periodic-table" className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 justify-center">
              See full periodic table entry <Atom className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AtomicChemistryPage() {
  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-6">
      <div className="sticky top-0 z-30 isolate px-3 py-2 rounded-xl bg-bg-light dark:bg-bg-dark border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
        <Link href="/chem-lab" className="text-sm font-medium text-slate-500 hover:text-primary-600 flex items-center gap-1.5">
          <ChevronLeft className="w-4 h-4" /> Back to Chem Lab
        </Link>
      </div>

      <div>
        <h1 className="font-display text-3xl font-semibold mb-2 flex items-center gap-2"><Orbit className="w-7 h-7 text-primary-600" /> Atomic Chemistry</h1>
        <p className="text-slate-500 text-sm">Build a real atom shell by shell, and dig into the structure behind the Periodic Table.</p>
      </div>

      <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        This deep-dive covers elements 1-20 (Hydrogen to Calcium) -- exactly the range CBSE/ICSE teaches shell-by-shell electron filling for, since the simple K-L-M-N rule genuinely stops matching real atoms once d-orbitals get involved past this point. For every element (all 118), see the <Link href="/chem-lab/periodic-table" className="underline font-semibold text-primary-600">Periodic Table</Link>.
      </div>

      <BuildAnAtom />
      <BondingLab />
      <ElementDeepDive />

      <div className="glass-card rounded-3xl p-6 md:p-8 space-y-4">
        <h2 className="font-display text-xl font-semibold flex items-center gap-2"><History className="w-5 h-5 text-primary-600" /> Atomic Models Through History</h2>
        <div className="space-y-3">
          {ATOMIC_MODELS.map((m, i) => (
            <div key={m.id} className="flex gap-4">
              <div className="flex flex-col items-center shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center">{i + 1}</div>
                {i < ATOMIC_MODELS.length - 1 && <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-800 my-1" />}
              </div>
              <div className="pb-4">
                <p className="font-bold text-sm">{m.name} <span className="text-xs font-normal text-slate-400">-- {m.scientist}, {m.year}</span></p>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-1">{m.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 md:p-8 space-y-4">
        <h2 className="font-display text-xl font-semibold flex items-center gap-2"><Zap className="w-5 h-5 text-primary-600" /> Subatomic Particles</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] font-bold text-slate-400 uppercase">
                <th className="pb-2">Particle</th><th className="pb-2">Symbol</th><th className="pb-2">Charge</th><th className="pb-2">Relative Mass</th><th className="pb-2">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {SUBATOMIC_PARTICLES.map((p) => (
                <tr key={p.name}>
                  <td className="py-2 font-bold">{p.name}</td>
                  <td className="py-2 font-mono text-primary-600">{p.symbol}</td>
                  <td className="py-2 text-slate-600 dark:text-slate-300">{p.charge}</td>
                  <td className="py-2 text-slate-600 dark:text-slate-300">{p.relativeMass}</td>
                  <td className="py-2 text-slate-600 dark:text-slate-300">{p.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 md:p-8 space-y-3">
        <h2 className="font-display text-xl font-semibold flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary-600" /> Valence Electrons &amp; Reactivity</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          The electrons in an atom&apos;s <strong>outermost</strong> shell -- called valence electrons -- are what actually determine how it behaves chemically. Atoms &quot;want&quot; a full outer shell (2 for the first shell, 8 for the rest), so an atom with just 1-2 valence electrons tends to <strong>lose</strong> them easily (metals, like Sodium losing its 1 outer electron), an atom with 6-7 valence electrons tends to <strong>gain</strong> a few to fill up (nonmetals, like Chlorine gaining 1), and an atom that already has a full outer shell (like Neon or Argon) is essentially unreactive -- the noble gases.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          This is exactly why Sodium (1 valence electron) reacts so readily with Chlorine (7 valence electrons, needs 1 more) to form table salt -- Sodium hands over its one spare electron, Chlorine's shell fills up, and both end up more stable.
        </p>
      </div>

      <div className="glass-card rounded-3xl p-6 md:p-8 space-y-3">
        <h2 className="font-display text-xl font-semibold flex items-center gap-2"><Users className="w-5 h-5 text-primary-600" /> Isotopes: Same Element, Different Weight</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Every atom of an element must have the same number of <strong>protons</strong> -- that's literally what defines which element it is. But atoms of the same element can have <strong>different numbers of neutrons</strong>, making them slightly heavier or lighter versions of the same element, called isotopes.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 p-4">
            <p className="font-bold text-sm mb-1">Carbon-12 vs Carbon-14</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">Both have 6 protons (that's what makes them carbon), but Carbon-12 has 6 neutrons while Carbon-14 has 8. Carbon-14 is radioactive and decays at a known, steady rate -- which is exactly how carbon dating estimates the age of ancient fossils and artifacts.</p>
          </div>
          <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 p-4">
            <p className="font-bold text-sm mb-1">Hydrogen's Three Isotopes</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">Protium (0 neutrons, by far the most common), Deuterium (1 neutron, used in "heavy water"), and Tritium (2 neutrons, radioactive) -- all still hydrogen, all with exactly 1 proton, just different weights.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
