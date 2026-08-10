'use client';
import { useRef, useState } from 'react';
import { ChevronDown, RotateCcw } from 'lucide-react';
import { AnatomyModel, AnatomyHotspot } from '@edusheets/content';
import { speak, isSpeechSupported } from '@/lib/speech';
import SpeakButton from '@/components/labshared/SpeakButton';

const ROTATE_X_LIMIT = 65; // up/down tilt stays bounded -- a full vertical
// flip is disorienting rather than useful. Left/right (Y) is intentionally
// UNCLAMPED below -- that's the actual 360° spin axis.
const DRAG_SENSITIVITY = 0.5;

// Note: the real images are flat 2D reference plates, not volumetric 3D
// scans -- there's no separate "back" texture. Spinning past 90° on the Y
// axis shows the plate edge-on and then mirrored, exactly like flipping a
// real photograph over -- a true, physical 3D behavior, just not a
// different rendered view of the organ's back side (that would need real
// 3D model assets). The spin itself is genuinely continuous and full 360°.

// Real anatomical reference images (see each model's `credit` in
// anatomyModels.ts) with clickable, percentage-positioned hotspots on top --
// clicking one highlights and scrolls to its full explanation in the
// always-visible detail list below, and (if supported) narrates it aloud.
// Distinct from BiologyStage's simType:'explorer' diagrams (hand-drawn,
// used inside the guided predict/observe experiment flow) -- this is a
// separate, deeper "browse and learn" section built around real images.
export default function AnatomyExplorer({ model }: { model: AnatomyModel }) {
  const [levelId, setLevelId] = useState(model.levels[0].id);
  const level = model.levels.find((l) => l.id === levelId) || model.levels[0];
  const [activeId, setActiveId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; rotX: number; rotY: number } | null>(null);
  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

  const onTiltStart = (e: React.PointerEvent) => {
    dragStart.current = { x: e.clientX, y: e.clientY, rotX: rotation.x, rotY: rotation.y };
    setDragging(true);
  };
  const onTiltMove = (e: React.PointerEvent) => {
    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setRotation({
      y: dragStart.current.rotY + dx * DRAG_SENSITIVITY, // unclamped -- a full, continuous 360° spin
      x: clamp(dragStart.current.rotX - dy * DRAG_SENSITIVITY, -ROTATE_X_LIMIT, ROTATE_X_LIMIT),
    });
  };
  const onTiltEnd = () => {
    dragStart.current = null;
    setDragging(false);
    // Deliberately no spring-back here -- snapping to flat on release would
    // undo the very spin the user just did. Wherever they leave it is where
    // it stays; "Reset View" below returns it to flat on demand.
  };
  const resetView = () => setRotation({ x: 0, y: 0 });

  const selectHotspot = (h: AnatomyHotspot) => {
    setActiveId(h.id);
    if (isSpeechSupported()) speak(`${h.label}. ${h.info}`);
    document.getElementById(`anatomy-detail-${model.id}-${h.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const changeLevel = (id: string) => {
    setLevelId(id);
    setActiveId(null);
  };

  return (
    <div className="space-y-6">
      {model.levels.length > 1 && (
        <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl w-fit">
          {model.levels.map((l) => (
            <button
              key={l.id}
              onClick={() => changeLevel(l.id)}
              className={`px-3.5 py-2 rounded-lg text-sm font-bold transition-all ${levelId === l.id ? 'bg-white dark:bg-slate-900 shadow-sm text-primary-600' : 'text-slate-500'}`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}

      <div className="glass-card rounded-3xl p-4 md:p-6">
        <div className="relative w-full max-w-xl mx-auto" style={{ perspective: '1200px' }}>
          <div
            onPointerDown={onTiltStart}
            onPointerMove={onTiltMove}
            onPointerUp={onTiltEnd}
            onPointerCancel={onTiltEnd}
            onPointerLeave={dragging ? onTiltEnd : undefined}
            className={`relative touch-none ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              transformStyle: 'preserve-3d',
              transition: dragging ? 'none' : 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          >
            {/* Real reference image -- plain <img> rather than next/image since
                hotspots need to be positioned as a simple percentage of its
                rendered box, which next/image's fixed-aspect wrapper fights. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={level.imageSrc} alt={level.imageAlt} className="w-full h-auto rounded-xl select-none" draggable={false} />
            {level.hotspots.map((h) => (
              <button
                key={h.id}
                onClick={() => selectHotspot(h)}
                style={{ left: `${h.xPct}%`, top: `${h.yPct}%` }}
                title={h.label}
                aria-label={h.label}
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center transition-all hover:scale-125 ${
                  activeId === h.id
                    ? 'bg-primary-600 border-white scale-125 physics-hotspot-glow'
                    : 'bg-white/90 dark:bg-slate-900/85 border-slate-900 dark:border-slate-300 text-primary-600'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${activeId === h.id ? 'bg-white' : 'bg-current'}`} />
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 mt-3">
          <p className="text-center text-[11px] text-slate-400">
            Drag (or press &amp; hold on touch) to spin the model a full 360° &middot; click a marker for details
          </p>
          {(rotation.x !== 0 || rotation.y % 360 !== 0) && (
            <button
              onClick={resetView}
              className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-primary-600 hover:text-primary-700"
            >
              <RotateCcw className="w-3 h-3" /> Reset View
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-display text-lg font-semibold">Every Part, Explained</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {level.hotspots.map((h) => (
            <div
              key={h.id}
              id={`anatomy-detail-${model.id}-${h.id}`}
              className={`rounded-2xl border-2 p-4 transition-all scroll-mt-24 ${activeId === h.id ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-200 dark:border-slate-800'}`}
            >
              <button onClick={() => selectHotspot(h)} className="font-bold text-sm mb-1 hover:text-primary-600 transition-colors text-left">{h.label}</button>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{h.info}</p>
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setExpandedId((e) => (e === h.id ? null : h.id))}
                  className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  {expandedId === h.id ? 'Hide Deep Dive' : 'Deep Dive'} <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedId === h.id ? 'rotate-180' : ''}`} />
                </button>
                <SpeakButton text={`${h.label}. ${h.info}${expandedId === h.id ? ' ' + h.deepDive : ''}`} />
              </div>
              {expandedId === h.id && (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-white/60 dark:bg-slate-800/40 rounded-xl p-3">{h.deepDive}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-[10px] text-slate-400">
        Image: {model.credit.author} &middot; {model.credit.license} &middot;{' '}
        <a href={model.credit.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary-600">Source</a>
      </p>
    </div>
  );
}
