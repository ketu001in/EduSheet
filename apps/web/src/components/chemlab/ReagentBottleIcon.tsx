'use client';
import { ReagentState } from '@/lib/reagentVisuals';

// A small, cheap SVG preview (not a WebGL canvas) for Reagents Studio's
// grid cards -- real 3D only mounts in the detail modal, one at a time,
// same discipline as Equipment Studio. This is purely a lightweight,
// per-reagent-accurate visual stand-in for the grid.
export default function ReagentBottleIcon({ color, state }: { color: string; state: ReagentState }) {
  return (
    <svg viewBox="0 0 48 48" className="w-10 h-10">
      {state === 'liquid' && (
        <>
          <path d="M18 6h12v8l4 6v22a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2V20l4-6z" fill="none" stroke="#94a3b8" strokeWidth="2" />
          <path d={`M14 26h20v16a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2z`} fill={color} opacity={0.8} />
        </>
      )}
      {(state === 'solid' || state === 'crystal') && (
        <>
          <circle cx={24} cy={38} r={4} fill={color} />
          <circle cx={16} cy={36} r={3} fill={color} opacity={0.85} />
          <circle cx={32} cy={35} r={3.5} fill={color} opacity={0.85} />
          <circle cx={24} cy={30} r={3} fill={color} opacity={0.7} />
        </>
      )}
      {state === 'metal' && (
        <rect x={21} y={8} width={6} height={32} rx={1.5} fill={color} stroke="#64748b" strokeWidth="1" />
      )}
      {state === 'flame' && (
        <>
          <rect x={22} y={26} width={4} height={12} fill="#78716c" />
          <path d="M24 10c4 6 7 10 7 15a7 7 0 1 1-14 0c0-5 3-9 7-15z" fill={color} opacity={0.85} />
        </>
      )}
    </svg>
  );
}
