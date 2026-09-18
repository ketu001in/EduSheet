'use client';
import { useMemo, useState } from 'react';
import { sentimentScore } from '@/lib/aiExperimentsEngine';

// Deliberately plain text with word-level highlighting, not a 3D scene --
// the point of a bag-of-words classifier IS that it looks at words one at
// a time; highlighting the actual words it counted is the honest, direct
// visualization, not a decoration needing a spatial upgrade.
const EXAMPLES = [
  'This movie was great and amazing',
  'The food was terrible and boring',
  'The cat sat on the mat',
  'I love this but the ending was disappointing',
];

export default function SentimentClassifierScene() {
  const [text, setText] = useState(EXAMPLES[0]);
  const result = useMemo(() => sentimentScore(text), [text]);

  const words = text.split(/(\s+)/);
  const lowerPositive = new Set(result.positiveWords);
  const lowerNegative = new Set(result.negativeWords);

  const verdict = result.score > 0 ? 'Positive' : result.score < 0 ? 'Negative' : 'Neutral (no signal)';
  const verdictColor = result.score > 0 ? 'text-accent-600' : result.score < 0 ? 'text-red-600' : 'text-slate-500';

  return (
    <div className="space-y-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        className="w-full max-w-md mx-auto block rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-sm font-medium"
        placeholder="Type any sentence..."
      />

      <div className="flex flex-wrap gap-1 justify-center max-w-md mx-auto">
        {EXAMPLES.map((ex) => (
          <button key={ex} onClick={() => setText(ex)} className="px-2.5 py-1 rounded-full border-2 border-slate-200 dark:border-slate-800 text-[10px] font-bold hover:border-primary-400">{ex}</button>
        ))}
      </div>

      <div className="max-w-md mx-auto text-center leading-relaxed p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 text-sm">
        {words.map((w, i) => {
          const clean = w.toLowerCase().replace(/[^a-z]/g, '');
          const isPos = lowerPositive.has(clean);
          const isNeg = lowerNegative.has(clean);
          return (
            <span key={i} className={isPos ? 'bg-accent-200 dark:bg-accent-800/60 font-bold rounded px-0.5' : isNeg ? 'bg-red-200 dark:bg-red-800/60 font-bold rounded px-0.5' : ''}>{w}</span>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-1.5 max-w-sm mx-auto text-center text-xs">
        <div className="rounded-lg p-1.5 bg-accent-50 dark:bg-accent-900/20"><p className="text-[10px] font-bold text-slate-400">Positive Words</p><p className="font-black text-accent-600">{result.positiveWords.length}</p></div>
        <div className="rounded-lg p-1.5 bg-red-50 dark:bg-red-900/20"><p className="text-[10px] font-bold text-slate-400">Negative Words</p><p className="font-black text-red-600">{result.negativeWords.length}</p></div>
        <div className="rounded-lg p-1.5 bg-slate-50 dark:bg-slate-800/50"><p className="text-[10px] font-bold text-slate-400">Score</p><p className="font-black">{result.score > 0 ? '+' : ''}{result.score}</p></div>
      </div>
      <p className={`text-center text-sm font-bold ${verdictColor}`}>{verdict}</p>
      <p className="text-center text-xs text-slate-500 max-w-sm mx-auto">Try sarcasm or negation ("not good at all") -- a real bag-of-words model has no idea "not" flips the meaning. That real limitation is exactly why harder cases need a trained model instead.</p>
    </div>
  );
}
