'use client';
import { useRef, useState } from 'react';
import { ChevronDown, RotateCcw, ListOrdered, Lightbulb, Stethoscope, HeartPulse, GraduationCap } from 'lucide-react';
import { AnatomyModel, AnatomyHotspot } from '@edusheets/content';
import { speak, isSpeechSupported } from '@/lib/speech';
import SpeakButton from '@/components/labshared/SpeakButton';

const ROTATE_X_LIMIT = 35; // up/down tilt stays modest -- keeps the plate
// readable and avoids the distorted, page-curl look extreme angles cause.
const DRAG_SENSITIVITY = 0.5;

// Note: the real images are flat 2D reference plates, not volumetric 3D
// scans -- there's no separate "back" texture. While held, the plate can
// spin all the way around (unclamped Y axis) -- past 90° it turns edge-on
// and `backfaceVisibility: hidden` below fades it out rather than showing
// a mirrored, backwards-labeled version, which read as broken rather than
// "cool". Releasing always eases it back to flat, like letting go of a
// spinning card -- it doesn't stay stuck at some odd in-between angle.
// A different rendered view of the organ's actual back would need real 3D
// model assets, which is a separate, larger undertaking.

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
  const credit = level.credit || model.credit;
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
    setRotation({ x: 0, y: 0 }); // eases back to flat once you let go
  };

  const selectHotspot = (h: AnatomyHotspot) => {
    setActiveId(h.id);
    if (isSpeechSupported()) speak(`This is the ${h.label}. ${h.info}`);
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
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transition: dragging ? 'none' : 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            {/* Real reference image -- plain <img> rather than next/image since
                hotspots need to be positioned as a simple percentage of its
                rendered box, which next/image's fixed-aspect wrapper fights. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={level.imageSrc} alt={level.imageAlt} className="w-full h-auto rounded-xl select-none bg-white" draggable={false} />
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
        <p className="text-center text-[11px] text-slate-400 mt-3 flex items-center justify-center gap-1.5">
          <RotateCcw className="w-3 h-3" /> Hold and drag to spin the model &middot; let go and it settles back &middot; click a marker for details
        </p>
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
                <SpeakButton text={`This is the ${h.label}. ${h.info}${expandedId === h.id ? ' ' + h.deepDive : ''}`} />
              </div>
              {expandedId === h.id && (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-white/60 dark:bg-slate-800/40 rounded-xl p-3">{h.deepDive}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {model.guide && <AnatomyGuidePanel model={model} />}

      <p className="text-center text-[10px] text-slate-400">
        Image: {credit.author} &middot; {credit.license} &middot;{' '}
        <a href={credit.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary-600">Source</a>
      </p>
    </div>
  );
}

// The whole-system story below the per-part cards: how the parts work
// together, surprising facts, what goes wrong, and how to look after it.
function AnatomyGuidePanel({ model }: { model: AnatomyModel }) {
  const guide = model.guide!;
  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg font-semibold">How {model.name.replace(/^The /, 'the ')} Works</h3>

      <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 p-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h4 className="font-bold text-sm flex items-center gap-2"><ListOrdered className="w-4 h-4 text-primary-600" /> Step by Step</h4>
          <SpeakButton text={guide.howItWorks.map((s, i) => `Step ${i + 1}. ${s}`).join(' ')} />
        </div>
        <ol className="space-y-2">
          {guide.howItWorks.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <span className="shrink-0 w-6 h-6 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 p-4">
          <h4 className="font-bold text-sm flex items-center gap-2 mb-2"><Lightbulb className="w-4 h-4 text-amber-500" /> Did You Know?</h4>
          <ul className="space-y-2 list-disc pl-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {guide.didYouKnow.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </div>
        <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 p-4">
          <h4 className="font-bold text-sm flex items-center gap-2 mb-2"><HeartPulse className="w-4 h-4 text-emerald-600" /> Keep It Healthy</h4>
          <ul className="space-y-2 list-disc pl-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {guide.keepHealthy.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 p-4">
        <h4 className="font-bold text-sm flex items-center gap-2 mb-3"><Stethoscope className="w-4 h-4 text-rose-500" /> When Things Go Wrong</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
          {guide.conditions.map((c) => (
            <div key={c.name} className="text-sm leading-relaxed">
              <p className="font-bold">{c.name}</p>
              <p className="text-slate-600 dark:text-slate-300">{c.info}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl p-4 bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-600/30 flex gap-3">
        <GraduationCap className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
        <div className="text-sm leading-relaxed">
          <p className="font-bold mb-0.5">Exam Tip</p>
          <p className="text-slate-600 dark:text-slate-300">{guide.examTip}</p>
        </div>
      </div>
    </div>
  );
}
