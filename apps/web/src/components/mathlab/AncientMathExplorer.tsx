'use client';
import { useState } from 'react';
import { ChevronDown, Info } from 'lucide-react';
import { MATH_HISTORY_FIGURES } from '@edusheets/content';
import SpeakButton from '@/components/labshared/SpeakButton';
import { useContent } from '@/lib/useContent';

// Mirrors Biology Lab's Anatomy Explorer format: real, license-verified
// images with click-to-explore content and voice narration. Differs in one
// deliberate way -- these are PORTRAITS of people, not labeled diagrams, so
// there's no anatomical hotspot to place. Instead, each figure's real
// achievements are clickable cards next to the image, with the same
// click-to-expand-and-hear pattern. See mathHistoryFigures.ts's header for
// why an explicit honesty note about each image's real vs. tribute status
// is shown for every figure.
export default function AncientMathExplorer() {
  // CMS Phase 2: merges in any admin edits from /admin/content live -- see
  // lib/useContent.ts. An admin can edit any figure's text/achievements,
  // or point imageSrc at a different hosted image URL; there's no upload
  // UI here, so a genuinely new image still needs the same real,
  // license-verified sourcing process as the ones already in this file.
  const figures = useContent('math-history-figure', MATH_HISTORY_FIGURES);
  const [figureId, setFigureId] = useState(MATH_HISTORY_FIGURES[0].id);
  const figure = figures.find((f) => f.id === figureId) || figures[0];
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const changeFigure = (id: string) => {
    setFigureId(id);
    setExpandedId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl w-fit">
        {figures.map((f) => (
          <button
            key={f.id}
            onClick={() => changeFigure(f.id)}
            className={`px-3.5 py-2 rounded-lg text-sm font-bold transition-all ${figureId === f.id ? 'bg-white dark:bg-slate-900 shadow-sm text-primary-600' : 'text-slate-500'}`}
          >
            {f.name}
          </button>
        ))}
      </div>

      <div className="glass-card rounded-3xl p-4 md:p-6 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5">
        <div className="space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={figure.imageSrc} alt={figure.imageAlt} className="w-full h-auto rounded-2xl border-2 border-slate-900 dark:border-slate-700" />
          <p className="text-center font-display text-sm font-semibold">{figure.name}</p>
          <p className="text-center text-xs text-slate-400">{figure.years}</p>
        </div>
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-1 min-w-[200px]">{figure.intro}</p>
            <SpeakButton text={`${figure.name}, ${figure.years}. ${figure.intro}`} />
          </div>
          <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-950/20 rounded-xl p-3">
            <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 dark:text-slate-300">{figure.imageNote}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-display text-lg font-semibold">Real Achievements</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {figure.achievements.map((a) => (
            <div
              key={a.id}
              className={`rounded-2xl border-2 p-4 transition-all ${expandedId === a.id ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-200 dark:border-slate-800'}`}
            >
              <p className="font-bold text-sm mb-1">{a.title}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{a.summary}</p>
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setExpandedId((e) => (e === a.id ? null : a.id))}
                  className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  {expandedId === a.id ? 'Hide Deep Dive' : 'Deep Dive'} <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedId === a.id ? 'rotate-180' : ''}`} />
                </button>
                <SpeakButton text={`${a.title}. ${a.summary}${expandedId === a.id ? ' ' + a.deepDive : ''}`} />
              </div>
              {expandedId === a.id && (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-white/60 dark:bg-slate-800/40 rounded-xl p-3">{a.deepDive}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-[10px] text-slate-400">
        Image: {figure.credit.author} &middot; {figure.credit.license} &middot;{' '}
        <a href={figure.credit.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary-600">Source</a>
      </p>
    </div>
  );
}
