'use client';
import { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { MATH_EXPERIMENTS } from '@edusheets/content';
import MathStage from './MathStage';
import SpeakButton from '@/components/labshared/SpeakButton';

// Free-play version of the Guided Experiments -- every curated experiment's
// interactive stage, sliders exposed directly with no predict/observe
// script, no persistence. Same stateless-sandbox precedent as every other
// lab's Free Play/Playground page, just embedded as a hub tab here instead
// of a separate route since Math Lab's hub is already tab-based.
export default function ExperimentPlayground() {
  const [experimentId, setExperimentId] = useState(MATH_EXPERIMENTS[0].id);
  const experiment = MATH_EXPERIMENTS.find((e) => e.id === experimentId) || MATH_EXPERIMENTS[0];
  const [params, setParams] = useState<Record<string, number>>(experiment.defaultParams);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    setParams(experiment.defaultParams);
    setResetKey((k) => k + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experimentId]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl w-fit">
        {MATH_EXPERIMENTS.map((exp) => (
          <button
            key={exp.id}
            onClick={() => setExperimentId(exp.id)}
            className={`px-3.5 py-2 rounded-lg text-sm font-bold transition-all ${experimentId === exp.id ? 'bg-white dark:bg-slate-900 shadow-sm text-primary-600' : 'text-slate-500'}`}
          >
            {exp.title}
          </button>
        ))}
      </div>

      <MathStage simType={experiment.simType} params={params} resetKey={resetKey} />

      <div className="glass-card rounded-2xl p-4 flex flex-wrap items-center gap-3 justify-between">
        <button onClick={() => setResetKey((k) => k + 1)} className="p-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 hover:border-primary-400">
          <RotateCcw className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <p className="text-xs text-slate-400 max-w-xs text-right">{experiment.keyIdea}</p>
          <SpeakButton text={experiment.keyIdea} />
        </div>
      </div>

      {experiment.paramConfig.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {experiment.paramConfig.map((pc) => (
            <div key={pc.key} className="text-xs font-bold text-slate-500 space-y-1.5">
              <span className="block">{pc.label} ({params[pc.key] ?? experiment.defaultParams[pc.key]}{pc.unit})</span>
              <input
                type="range"
                min={pc.min}
                max={pc.max}
                step={pc.step}
                value={params[pc.key] ?? experiment.defaultParams[pc.key]}
                onChange={(e) => setParams((prev) => ({ ...prev, [pc.key]: parseFloat(e.target.value) }))}
                className="w-full accent-primary-600"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
