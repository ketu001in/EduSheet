'use client';
import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

// Shared across every interactive lab's SVG stage (Physics, Biology, ...):
// a clickable/hoverable apparatus piece, its inline hover tooltip, and the
// centered "click for details, tap Deep Dive for more" popup. Originally
// lived only in PhysicsStage.tsx; extracted here once Biology Lab needed
// the exact same pattern, so a fix or style tweak only has to happen once.

// ---------------------------------------------------------------------------
// Equipment hotspot -- hover shows an inline SVG tooltip; click opens the
// full popup.
// ---------------------------------------------------------------------------
export function Hotspot({
  x, y, hovered, onEnter, onLeave, onClick, children,
}: {
  x: number; y: number; hovered: boolean; onEnter: () => void; onLeave: () => void; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <g
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      className={hovered ? 'physics-hotspot-glow' : undefined}
    >
      {children}
    </g>
  );
}

export function HoverLabel({ x, y, text }: { x: number; y: number; text: string }) {
  const width = Math.max(60, text.length * 6.4 + 16);
  return (
    <g transform={`translate(${x - width / 2}, ${y})`} pointerEvents="none">
      <rect width={width} height={22} rx={11} className="fill-slate-900 dark:fill-slate-100" opacity={0.92} />
      <text x={width / 2} y={15} textAnchor="middle" fontSize={11} fontWeight={700} className="fill-white dark:fill-slate-900">{text}</text>
    </g>
  );
}

// ---------------------------------------------------------------------------
// Equipment detail popup -- centered modal, matches the Periodic Table /
// Atomic Chemistry convention, with a Deep Dive expand toggle. Generic over
// any equipment shape with {id, name, description, deepDive} -- each lab
// passes its own curated equipment list.
// ---------------------------------------------------------------------------
export interface LabEquipmentLike {
  id: string;
  name: string;
  description: string;
  deepDive: string;
}

export function EquipmentModal({ equipmentId, equipment, onClose }: { equipmentId: string; equipment: LabEquipmentLike[]; onClose: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const eq = equipment.find((e) => e.id === equipmentId);
  if (!eq) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-7 space-y-3">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-bold pr-8">{eq.name}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{eq.description}</p>
        <button
          onClick={() => setExpanded((e) => !e)}
          className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
        >
          {expanded ? 'Hide Deep Dive' : 'Deep Dive'} <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
        {expanded && (
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">{eq.deepDive}</p>
        )}
      </div>
    </div>
  );
}
