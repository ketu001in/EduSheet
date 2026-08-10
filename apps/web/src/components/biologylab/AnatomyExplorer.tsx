'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnatomyModel, AnatomyHotspot } from '@edusheets/content';
import { speak, isSpeechSupported } from '@/lib/speech';

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
        <div className="relative w-full max-w-xl mx-auto">
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
        <p className="text-center text-[11px] text-slate-400 mt-3">Click any marker on the image for details</p>
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
              <button
                onClick={() => setExpandedId((e) => (e === h.id ? null : h.id))}
                className="mt-2 text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                {expandedId === h.id ? 'Hide Deep Dive' : 'Deep Dive'} <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedId === h.id ? 'rotate-180' : ''}`} />
              </button>
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
