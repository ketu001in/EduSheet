'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { X, ChevronDown } from 'lucide-react';
import type { ComponentSpec } from '@edusheets/content';
import SpeakButton from '@/components/labshared/SpeakButton';
import { formatOhms, formatFarads } from '@/lib/componentFormat';

const ComponentPreview3DScene = dynamic(() => import('./ComponentPreview3DScene'), {
  ssr: false,
  loading: () => <div className="w-full h-[200px] rounded-2xl bg-slate-50 dark:bg-slate-900/40 animate-pulse" />,
});

// A dedicated component-detail popup for Electronics Lab -- deliberately
// its own component rather than a change to the shared LabHotspot
// EquipmentModal (reused unmodified by every other lab this session);
// this one additionally carries a real 3D preview of the exact part
// clicked, matching the "click a specific resistor value, see that exact
// part" ask directly.
export default function ElectronicsComponentModal({ component, onClose }: { component: ComponentSpec; onClose: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const specLine = component.electrical
    ? [
        component.electrical.resistanceOhms != null && formatOhms(component.electrical.resistanceOhms),
        component.electrical.capacitanceFarads != null && formatFarads(component.electrical.capacitanceFarads),
        component.electrical.forwardVoltage != null && `Vf ≈ ${component.electrical.forwardVoltage}V`,
        component.electrical.voltage != null && `${component.electrical.voltage}V`,
      ].filter(Boolean).join(' · ')
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-7 space-y-3">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 z-10">
          <X className="w-5 h-5" />
        </button>

        <ComponentPreview3DScene spec={component} />

        <h3 className="text-lg font-bold pr-8">{component.name}</h3>
        {specLine && <p className="text-sm font-mono font-bold text-primary-600">{specLine}</p>}
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{component.description}</p>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setExpanded((e) => !e)}
            className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            {expanded ? 'Hide Deep Dive' : 'Deep Dive'} <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
          <SpeakButton text={`${component.name}. ${component.description}${expanded ? ' ' + component.deepDive : ''}`} />
        </div>
        {expanded && (
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">{component.deepDive}</p>
        )}
      </div>
    </div>
  );
}
