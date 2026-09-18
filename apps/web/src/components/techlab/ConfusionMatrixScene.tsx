'use client';
import { useMemo, useState } from 'react';
import { SCORED_EMAILS, confusionCountsAtThreshold, classificationMetrics } from '@/lib/aiExperimentsEngine';

// Deliberately tabular/2D -- a confusion matrix IS a table, and 20 scored
// emails ARE a list. This is the honest medium for evaluation metrics;
// forcing it into a 3D scene would decorate real numbers, not clarify them.
export default function ConfusionMatrixScene() {
  const [threshold, setThreshold] = useState(0.5);
  const counts = useMemo(() => confusionCountsAtThreshold(SCORED_EMAILS, threshold), [threshold]);
  const metrics = useMemo(() => classificationMetrics(counts), [counts]);

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-slate-500 space-y-1 max-w-sm mx-auto">
        <span>Spam Decision Threshold ({threshold.toFixed(2)})</span>
        <input type="range" min={0} max={1} step={0.01} value={threshold} onChange={(e) => setThreshold(parseFloat(e.target.value))} className="w-full accent-primary-600" />
      </label>

      <div className="flex flex-wrap gap-1 justify-center max-w-lg mx-auto">
        {SCORED_EMAILS.map((email) => {
          const predictedSpam = email.spamScore >= threshold;
          const correct = predictedSpam === email.actuallySpam;
          return (
            <div
              key={email.id}
              title={`score ${email.spamScore.toFixed(2)} -- actually ${email.actuallySpam ? 'spam' : 'not spam'} -- predicted ${predictedSpam ? 'spam' : 'not spam'}`}
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-[9px] font-black border-2 ${correct ? 'border-transparent' : 'border-red-400'} ${predictedSpam ? 'bg-red-100 text-red-700 dark:bg-red-900/30' : 'bg-slate-100 text-slate-600 dark:bg-slate-800'}`}
            >
              {email.spamScore.toFixed(1)}
            </div>
          );
        })}
      </div>
      <p className="text-center text-[10px] text-slate-400">Each box = one email&apos;s real spam score &middot; red = predicted spam &middot; red outline = a wrong prediction at this threshold</p>

      <div className="grid grid-cols-2 gap-1.5 max-w-xs mx-auto text-center text-xs">
        <ConfusionCell label="True Positive" value={counts.tp} color="bg-accent-50 dark:bg-accent-900/20 text-accent-700" />
        <ConfusionCell label="False Positive" value={counts.fp} color="bg-red-50 dark:bg-red-900/20 text-red-700" />
        <ConfusionCell label="False Negative" value={counts.fn} color="bg-red-50 dark:bg-red-900/20 text-red-700" />
        <ConfusionCell label="True Negative" value={counts.tn} color="bg-accent-50 dark:bg-accent-900/20 text-accent-700" />
      </div>

      <div className="grid grid-cols-4 gap-1.5 max-w-lg mx-auto text-center text-xs">
        <MetricCell label="Precision" value={metrics.precision} />
        <MetricCell label="Recall" value={metrics.recall} />
        <MetricCell label="F1 Score" value={metrics.f1} highlight />
        <MetricCell label="Accuracy" value={metrics.accuracy} />
      </div>
    </div>
  );
}

function ConfusionCell({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`rounded-lg p-2 ${color}`}>
      <p className="text-[10px] font-bold opacity-80">{label}</p>
      <p className="font-black text-base">{value}</p>
    </div>
  );
}

function MetricCell({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`rounded-lg p-2 ${highlight ? 'bg-primary-50 dark:bg-primary-900/20' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
      <p className="text-[10px] font-bold text-slate-400">{label}</p>
      <p className={`font-black text-base ${highlight ? 'text-primary-700 dark:text-primary-300' : ''}`}>{(value * 100).toFixed(0)}%</p>
    </div>
  );
}
