'use client';
import { ReactionVisualState } from '@edusheets/content';

// Small, fixed color palette mapped from the reaction's free-text color
// names (e.g. "pale blue", "reddish-brown") to real CSS colors -- keeps the
// visual deterministic without hardcoding a color per experiment.
const COLOR_MAP: Record<string, string> = {
  purple: '#8b5cf6', pink: '#f472b6', 'pink/red': '#f472b6', red: '#ef4444',
  'blue/green': '#22c55e', green: '#22c55e', blue: '#3b82f6', 'pale blue': '#93c5fd',
  'pale green': '#86efac', colorless: '#e2e8f0', 'faint permanent pink': '#f9a8d4',
  'orange-brown': '#c2703d', 'dark blue-black': '#1e293b', 'reddish-brown': '#b45309',
  white: '#f8fafc', 'white, curdy': '#f1f5f9', 'brick-red': '#c2410c', lilac: '#c4b5fd',
  'blue-green': '#14b8a6', 'strong yellow': '#eab308', 'dark blue': '#1e293b',
};

function resolveColor(name?: string): string | null {
  if (!name) return null;
  return COLOR_MAP[name.toLowerCase().trim()] || null;
}

interface ReactionStageProps {
  reaction?: ReactionVisualState;
  idle?: boolean;
  // A compact rendering for "Your Bench" thumbnails -- same visual language,
  // smaller footprint, no floating description caption (the bench card
  // supplies its own label/caption around it).
  compact?: boolean;
  // A "settled" reaction (from an earlier, already-completed step) keeps
  // its resulting color/precipitate visible but stops the bubbling/fizzing
  // animation -- a real reaction doesn't keep bubbling forever, and a
  // frozen-but-still-colored vessel reads as "done", not "broken".
  settled?: boolean;
}

export function ReactionStage({ reaction, idle, compact, settled }: ReactionStageProps) {
  const liquidColor = reaction?.colorChange ? resolveColor(reaction.colorChange.to) : '#cbd5e1';
  const flameColor = reaction?.flameColor ? resolveColor(reaction.flameColor) || '#f97316' : null;
  const animate = !idle && !settled;

  const stageHeight = compact ? 'h-24' : 'h-56';
  const vesselSize = compact ? 'w-14 h-16 border-2' : 'w-32 h-40 border-4';
  const showEscapingGas = (reaction?.gasBubbles || reaction?.smoke) && animate;
  const wisps = compact
    ? [{ left: '35%', delay: '0s', drift: '4px', size: 10 }, { left: '60%', delay: '0.7s', drift: '-4px', size: 8 }]
    : [
        { left: '30%', delay: '0s', drift: '10px', size: 22 },
        { left: '50%', delay: '0.6s', drift: '-6px', size: 26 },
        { left: '68%', delay: '1.2s', drift: '12px', size: 18 },
      ];

  return (
    <div className={`relative w-full ${stageHeight} flex items-end justify-center`}>
      {/* Gas escaping out of the mouth of the vessel -- rendered as a
          sibling, not inside the vessel's overflow-hidden div, so the
          wisps are actually free to drift up into the open air above it. */}
      {showEscapingGas && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-full pointer-events-none" style={{ height: 0 }}>
          {wisps.map((w, i) => (
            <span
              key={i}
              className="chem-gas-wisp absolute rounded-full bg-slate-300/70 dark:bg-slate-400/50 blur-[2px]"
              style={{
                left: w.left, bottom: 0, width: w.size, height: w.size,
                animationDelay: w.delay,
                ['--chem-gas-drift' as string]: w.drift,
              }}
            />
          ))}
        </div>
      )}

      {/* The vessel */}
      <div className={`relative ${vesselSize} border-slate-900 dark:border-slate-200 border-t-0 rounded-b-2xl overflow-hidden bg-white/40 dark:bg-slate-900/40 ${reaction?.gasBubbles && animate ? 'chem-fizzing' : ''}`}>
        <div
          className="absolute bottom-0 left-0 right-0 transition-all duration-700 ease-out"
          style={{ height: idle ? '35%' : '55%', backgroundColor: liquidColor || '#cbd5e1', opacity: 0.85 }}
        />
        {reaction?.gasBubbles && animate && (
          <>
            <span className="chem-bubble absolute bottom-4 left-6 w-2 h-2 rounded-full bg-white/80" style={{ animationDelay: '0s' }} />
            <span className="chem-bubble absolute bottom-4 left-14 w-2.5 h-2.5 rounded-full bg-white/80" style={{ animationDelay: '0.4s' }} />
            <span className="chem-bubble absolute bottom-4 left-20 w-1.5 h-1.5 rounded-full bg-white/80" style={{ animationDelay: '0.8s' }} />
          </>
        )}
        {reaction?.precipitate && !idle && (
          <>
            <span className={`absolute bottom-10 left-8 w-1.5 h-1.5 rounded-full ${animate ? 'chem-precipitate' : ''}`} style={{ backgroundColor: resolveColor(reaction.precipitate.color) || '#94a3b8', animationDelay: '0s', opacity: settled ? 0.9 : undefined }} />
            <span className={`absolute bottom-10 left-16 w-1.5 h-1.5 rounded-full ${animate ? 'chem-precipitate' : ''}`} style={{ backgroundColor: resolveColor(reaction.precipitate.color) || '#94a3b8', animationDelay: '0.3s', opacity: settled ? 0.9 : undefined }} />
            <span className={`absolute bottom-10 left-12 w-2 h-2 rounded-full ${animate ? 'chem-precipitate' : ''}`} style={{ backgroundColor: resolveColor(reaction.precipitate.color) || '#94a3b8', animationDelay: '0.6s', opacity: settled ? 0.9 : undefined }} />
          </>
        )}
      </div>

      {/* Optional flame under the vessel */}
      {flameColor && !idle && (
        <div className={`${animate ? 'chem-flame' : ''} absolute bottom-0 w-6 h-10 rounded-t-full origin-bottom`} style={{ backgroundColor: flameColor, filter: 'blur(1px)' }} />
      )}

      {!compact && reaction?.description && !idle && (
        <div className="absolute -bottom-2 translate-y-full mt-2 max-w-xs text-center text-xs font-medium text-slate-600 dark:text-slate-300 bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 shadow-sm">
          {reaction.description}
        </div>
      )}
    </div>
  );
}
