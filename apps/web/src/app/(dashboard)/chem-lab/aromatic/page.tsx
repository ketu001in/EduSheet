'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { DndContext, useDraggable, useDroppable, DragEndEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core';
import {
  ChevronLeft, Atom, Info, ShieldAlert, Sparkles, FlaskConical, RefreshCw, Globe,
  X, Hammer, Grid3x3, Eraser, PartyPopper,
} from 'lucide-react';
import {
  AROMATIC_MODULES, BENZENE_SUBSTITUENTS, BENZENE_DERIVATIVES, BenzeneDerivative,
} from '@edusheets/content';
import Tilt3DCard from '@/components/labshared/Tilt3DCard';

const Benzene3DScene = dynamic(() => import('@/components/chemlab/Benzene3DScene'), {
  ssr: false,
  loading: () => <div className="w-full h-[260px] rounded-2xl bg-slate-50 dark:bg-slate-900/40 animate-pulse" />,
});

// ---------------------------------------------------------------------------
// Shared ring geometry -- six points around a hexagon, reused by every
// diagram on this page (theory toggle, builder, explore gallery/detail).
// ---------------------------------------------------------------------------
const HEX_POINTS = Array.from({ length: 6 }, (_, i) => {
  const angle = (Math.PI / 180) * (60 * i - 90);
  return { x: 100 + 70 * Math.cos(angle), y: 100 + 70 * Math.sin(angle) };
});

function substituentById(id: string) {
  return BENZENE_SUBSTITUENTS.find((s) => s.id === id);
}

// A hexagon's "gap" between two positions (0-5) -- the number of steps
// apart going the SHORTER way around the ring. This one number is what
// actually distinguishes ortho (1) / meta (2) / para (3) substitution, and
// it's automatically the same regardless of which way around the ring you
// count or which absolute positions you used -- exactly the invariance a
// real (symmetric) benzene ring has, without needing to separately handle
// rotations and mirror-images as special cases.
function ringGap(a: number, b: number): number {
  const diff = Math.abs(a - b) % 6;
  return Math.min(diff, 6 - diff);
}

function findBuilderMatch(placements: Record<number, string>): BenzeneDerivative | null {
  const entries = Object.entries(placements).map(([pos, sub]) => [Number(pos), sub] as [number, string]);
  const buildable = BENZENE_DERIVATIVES.filter((d) => !d.builderExcluded);
  if (entries.length === 1) {
    const [, subId] = entries[0];
    return buildable.find((d) => d.substituents.length === 1 && d.substituents[0].substituentId === subId) || null;
  }
  if (entries.length === 2) {
    const [[posA, subA], [posB, subB]] = entries;
    const gap = ringGap(posA, posB);
    const givenIds = [subA, subB].sort();
    return buildable.find((d) => {
      if (d.substituents.length !== 2) return false;
      const ids = d.substituents.map((s) => s.substituentId).sort();
      if (ids[0] !== givenIds[0] || ids[1] !== givenIds[1]) return false;
      return ringGap(d.substituents[0].position, d.substituents[1].position) === gap;
    }) || null;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Read-only ring diagram for a specific real compound (Explore mode) -- just
// draws whatever substituents that compound's data says, at its stored
// positions.
// ---------------------------------------------------------------------------
function DerivativeRing({ derivative }: { derivative: BenzeneDerivative }) {
  const pointsAttr = HEX_POINTS.map((p) => `${p.x},${p.y}`).join(' ');
  const bySlot = new Map(derivative.substituents.map((s) => [s.position, s.substituentId]));
  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[220px] mx-auto">
      <polygon points={pointsAttr} fill="none" stroke="currentColor" strokeWidth={3} className="text-slate-900 dark:text-slate-100" />
      {HEX_POINTS.map((p, i) => {
        const subId = bySlot.get(i);
        const sub = subId ? substituentById(subId) : null;
        const dx = p.x - 100; const dy = p.y - 100;
        const len = Math.hypot(dx, dy) || 1;
        const lx = p.x + (dx / len) * 30; const ly = p.y + (dy / len) * 30;
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={4} className="fill-slate-900 dark:fill-slate-100" />
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" className={sub ? 'fill-primary-600 text-[11px] font-bold' : 'fill-slate-400 text-[10px] font-bold'}>
              {sub ? sub.formula : 'H'}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Builder: draggable substituent chip + droppable ring node, mirroring the
// same interaction language as the Lab Bench (shelf -> workbench) so the
// drag gesture feels familiar across Chem Lab.
// ---------------------------------------------------------------------------
function SubstituentChip({ id, formula, name }: { id: string; formula: string; name: string }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: `sub:${id}` });
  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`shrink-0 px-3 py-2 rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-800 text-left cursor-grab active:cursor-grabbing select-none touch-none hover:shadow-[3px_3px_0_var(--color-ink)] transition-all ${isDragging ? 'opacity-30' : ''}`}
      title={name}
    >
      <span className="block text-xs font-bold text-primary-600">{formula}</span>
      <span className="block text-[10px] text-slate-500">{name}</span>
    </button>
  );
}

function DraggedChipPreview({ formula }: { formula: string }) {
  return (
    <div className="px-3 py-2 rounded-xl border-2 border-primary-600 bg-white dark:bg-slate-800 shadow-2xl cursor-grabbing">
      <span className="text-xs font-bold text-primary-600">{formula}</span>
    </div>
  );
}

function RingNode({ index, x, y, placedId, onRemove }: { index: number; x: number; y: number; placedId?: string; onRemove: () => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: `node:${index}` });
  const sub = placedId ? substituentById(placedId) : null;
  const dx = x - 100; const dy = y - 100;
  const len = Math.hypot(dx, dy) || 1;
  const lx = dx / len; const ly = dy / len;
  return (
    <g>
      <circle cx={x} cy={y} r={4} className="fill-slate-900 dark:fill-slate-100" />
      <foreignObject x={x + lx * 38 - 24} y={y + ly * 28 - 14} width={48} height={28}>
        <div
          ref={setNodeRef}
          onClick={sub ? onRemove : undefined}
          className={`w-full h-full rounded-lg border-2 flex items-center justify-center text-[10px] font-bold transition-all ${
            isOver
              ? 'border-primary-600 bg-primary-100 dark:bg-primary-900/30 scale-110'
              : sub
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 cursor-pointer'
              : 'border-dashed border-slate-300 dark:border-slate-700 text-slate-300 dark:text-slate-700'
          }`}
          title={sub ? `${sub.name} -- click to remove` : 'Empty (H)'}
        >
          {sub ? sub.formula : 'H'}
        </div>
      </foreignObject>
    </g>
  );
}

function BenzeneBuilder() {
  const [placements, setPlacements] = useState<Record<number, string>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const match = useMemo(() => findBuilderMatch(placements), [placements]);
  const placedCount = Object.keys(placements).length;

  const handleDragStart = (e: DragStartEvent) => setDraggingId(String(e.active.id).replace('sub:', ''));
  const handleDragEnd = (e: DragEndEvent) => {
    setDraggingId(null);
    const { active, over } = e;
    if (!over) return;
    const subId = String(active.id).replace('sub:', '');
    const nodeIndex = Number(String(over.id).replace('node:', ''));
    setPlacements((prev) => ({ ...prev, [nodeIndex]: subId }));
  };
  const removeAt = (index: number) => {
    setPlacements((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  };
  const clearRing = () => setPlacements({});

  const pointsAttr = HEX_POINTS.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-display text-xl font-semibold flex items-center gap-2"><Hammer className="w-5 h-5 text-primary-600" /> Build a Molecule</h2>
        {placedCount > 0 && (
          <button onClick={clearRing} className="text-xs font-bold text-slate-500 hover:text-red-600 flex items-center gap-1">
            <Eraser className="w-3.5 h-3.5" /> Clear Ring
          </button>
        )}
      </div>
      <p className="text-sm text-slate-500">Drag a group from the shelf onto a ring position. Every H on the ring can be replaced by exactly one group -- build a real compound and it'll reveal itself below.</p>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex flex-wrap gap-2 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-3 border border-slate-200 dark:border-slate-800">
          {BENZENE_SUBSTITUENTS.map((s) => (
            <SubstituentChip key={s.id} id={s.id} formula={s.formula} name={s.name} />
          ))}
        </div>

        <svg viewBox="0 0 200 200" className="w-full max-w-xs mx-auto">
          <polygon points={pointsAttr} fill="none" stroke="currentColor" strokeWidth={3} className="text-slate-900 dark:text-slate-100" />
          {HEX_POINTS.map((p, i) => (
            <RingNode key={i} index={i} x={p.x} y={p.y} placedId={placements[i]} onRemove={() => removeAt(i)} />
          ))}
        </svg>

        <DragOverlay dropAnimation={null}>
          {draggingId ? <DraggedChipPreview formula={substituentById(draggingId)?.formula || ''} /> : null}
        </DragOverlay>
      </DndContext>

      {placedCount > 0 && (
        <div className={`rounded-2xl p-5 text-center space-y-2 border-2 ${match ? 'bg-accent-50 dark:bg-accent-950/20 border-accent-400 dark:border-accent-700' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'}`}>
          {match ? (
            <>
              <p className="flex items-center justify-center gap-2 font-bold text-accent-700 dark:text-accent-400"><PartyPopper className="w-5 h-5" /> That's {match.name}!</p>
              <p className="text-sm font-mono text-slate-600 dark:text-slate-300">{match.molecularFormula}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">{match.description}</p>
            </>
          ) : (
            <p className="text-sm text-slate-500">
              {placedCount === 1 ? 'One group placed -- that alone should already match a real compound.' : "Not a combination in the library yet -- try a different pair of groups, or check their spacing (adjacent/one-apart/opposite)."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Explore: click a real compound, see its ring + full detail panel.
// ---------------------------------------------------------------------------
function ExploreGallery() {
  const [selected, setSelected] = useState<BenzeneDerivative | null>(null);
  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 space-y-4">
      <h2 className="font-display text-xl font-semibold flex items-center gap-2"><Grid3x3 className="w-5 h-5 text-primary-600" /> Explore Real Compounds</h2>
      <p className="text-sm text-slate-500">Every one of these is a genuine, named benzene-ring compound -- tap any of them to see the diagram and the details.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {BENZENE_DERIVATIVES.map((d) => (
          <Tilt3DCard
            key={d.id}
            onClick={() => setSelected(d)}
            className="p-3 rounded-2xl text-left border-2 border-slate-900 dark:border-slate-700 bg-surface-light dark:bg-surface-dark block w-full"
          >
            <p className="font-bold text-xs mb-0.5">{d.name}</p>
            <p className="text-[10px] text-slate-500">{d.molecularFormula}</p>
          </Tilt3DCard>
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
              <DerivativeRing derivative={selected} />
              <h3 className="text-xl font-bold mt-2">{selected.name}</h3>
              <p className="text-sm font-mono text-slate-500">{selected.molecularFormula}</p>
              <span className="inline-block mt-2 px-2.5 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-[10px] font-bold uppercase tracking-wide">{selected.category}</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{selected.description}</p>
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Common Uses</h4>
              <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                {selected.commonUses.map((u, i) => <li key={i}>{u}</li>)}
              </ul>
            </div>
            {selected.safetyNotes && selected.safetyNotes.length > 0 && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl p-3">
                <p className="text-[10px] font-bold text-red-700 dark:text-red-400 uppercase tracking-wide mb-1 flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> Safety</p>
                <ul className="text-xs text-red-700/90 dark:text-red-300/90 space-y-1 list-disc list-inside">
                  {selected.safetyNotes.map((n, i) => <li key={i}>{n}</li>)}
                </ul>
              </div>
            )}
            {selected.funFact && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Fun Fact</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{selected.funFact}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AromaticChemistryPage() {
  const [delocalized, setDelocalized] = useState(false);
  const aromatic = AROMATIC_MODULES[0];

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-6">
      <div className="px-3 py-2 rounded-xl bg-bg-light dark:bg-bg-dark border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
        <Link href="/chem-lab" className="text-sm font-medium text-slate-500 hover:text-primary-600 flex items-center gap-1.5">
          <ChevronLeft className="w-4 h-4" /> Back to Chem Lab
        </Link>
      </div>

      <div>
        <h1 className="font-display text-3xl font-semibold mb-2 flex items-center gap-2"><Atom className="w-7 h-7 text-primary-600" /> Aromatic Chemistry</h1>
        <p className="text-slate-500 text-sm">Build real benzene-ring compounds by dragging groups onto the ring, or explore {BENZENE_DERIVATIVES.length} real ones already identified for you.</p>
      </div>

      <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        The groups below are structural building blocks, not reagents to react -- there's nothing hazardous to simulate here. Real benzene <em>reactions</em> (further down this page) still need genuinely dangerous conditions no school lab lets students run by hand, so those stay theory-only, same as before.
      </div>

      <BenzeneBuilder />
      <ExploreGallery />

      <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6">
        <div>
          <h2 className="font-display text-xl font-semibold mb-2">{aromatic.title}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{aromatic.introduction}</p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-6 space-y-3">
          <Benzene3DScene delocalized={delocalized} />
          <p className="text-center text-[10px] text-slate-400">Drag to rotate -- the ring genuinely stays flat from every angle, exactly like real benzene.</p>
          <div className="flex justify-center">
            <button
              onClick={() => setDelocalized((d) => !d)}
              className="btn-brutal px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" /> {delocalized ? "Show Kekule's Guess (Alternating Bonds)" : 'Show the Real Delocalized Ring'}
            </button>
          </div>
          <p className="text-center text-xs text-slate-500 max-w-md mx-auto">
            {delocalized
              ? 'The dashed circle represents the six electrons spread evenly around the whole ring -- this is how chemists actually draw benzene today.'
              : "Kekule's 1865 guess: three alternating double bonds. A useful shorthand, but not quite how the real molecule behaves -- tap to see why."}
          </p>
        </div>

        <div>
          <h3 className="font-bold text-sm mb-2">The Real Structure</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{aromatic.structureExplanation}</p>
        </div>

        <div>
          <h3 className="font-bold text-sm mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary-600" /> Why the Ring Is So Stable</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{aromatic.whyStable}</p>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 md:p-8 space-y-4">
        <h3 className="font-display text-lg font-semibold flex items-center gap-2"><FlaskConical className="w-5 h-5 text-primary-600" /> Four Classic Named Reactions</h3>
        <p className="text-xs text-slate-500 -mt-2">Shown as outcomes to understand, not steps to try -- this is exactly how the compounds above are actually made.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {aromatic.namedReactions.map((r) => (
            <div key={r.name} className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 p-4 space-y-2">
              <p className="font-bold text-sm text-primary-600">{r.name}</p>
              <p className="text-xs text-slate-500"><span className="font-semibold text-slate-600 dark:text-slate-400">Reagents/Conditions:</span> {r.reagentsAndConditions}</p>
              <p className="text-xs text-slate-500"><span className="font-semibold text-slate-600 dark:text-slate-400">Product:</span> {r.productDescription}</p>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{r.explanation}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 md:p-8 space-y-4">
        <h3 className="font-bold text-sm flex items-center gap-2"><Globe className="w-4 h-4 text-primary-600" /> Where Benzene Actually Shows Up</h3>
        <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
          {aromatic.realWorldOccurrence.map((o, i) => <li key={i}>{o}</li>)}
        </ul>
      </div>

      <div className="bg-red-50 dark:bg-red-950/30 border-2 border-red-300 dark:border-red-800 rounded-2xl p-6 space-y-3">
        <p className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold text-sm uppercase tracking-wide">
          <ShieldAlert className="w-5 h-5" /> Safety Notes -- Read This
        </p>
        <ul className="text-sm text-red-700/90 dark:text-red-300/90 space-y-2 list-disc list-inside">
          {aromatic.safetyNotes.map((n, i) => <li key={i}>{n}</li>)}
        </ul>
      </div>

      <div className="glass-card rounded-3xl p-6 md:p-8">
        <h3 className="font-bold text-sm mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary-600" /> Fun Fact</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{aromatic.funFact}</p>
      </div>
    </div>
  );
}
