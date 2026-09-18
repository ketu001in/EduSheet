'use client';
import { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { CHEM_PHYSICAL_EXPERIMENTS } from '@edusheets/content';
import ChemPhysicalStage from './ChemPhysicalStage';
import SpeakButton from '@/components/labshared/SpeakButton';
import { useContent } from '@/lib/useContent';

// Physical Chemistry Lab -- a free-play sandbox of the six Physical
// Chemistry Calculators (see chemPhysicalTypes.ts's header for why these
// are parameterized tools, not drag-reagent experiments). Same stateless-
// sandbox precedent as every other lab's Free Play page: no predict/
// observe script, no persistence, every slider live.
export default function PhysicalChemLab() {
  // CMS Phase 2: merges in any admin edits from /admin/content live.
  const experiments = useContent('chem-physical-experiment', CHEM_PHYSICAL_EXPERIMENTS);
  const [experimentId, setExperimentId] = useState(CHEM_PHYSICAL_EXPERIMENTS[0].id);
  const experiment = experiments.find((e) => e.id === experimentId) || experiments[0];
  const [params, setParams] = useState<Record<string, number>>(experiment.defaultParams);

  const selectExperiment = (id: string) => {
    setExperimentId(id);
    const exp = experiments.find((e) => e.id === id);
    if (exp) setParams(exp.defaultParams);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl w-fit">
        {experiments.map((exp) => (
          <button
            key={exp.id}
            onClick={() => selectExperiment(exp.id)}
            className={`px-3.5 py-2 rounded-lg text-sm font-bold transition-all ${experimentId === exp.id ? 'bg-white dark:bg-slate-900 shadow-sm text-primary-600' : 'text-slate-500'}`}
          >
            {exp.title}
          </button>
        ))}
      </div>

      <div className="flex items-start justify-between gap-3 flex-wrap">
        <p className="text-sm text-slate-500 flex-1 min-w-[200px]">{experiment.purpose}</p>
        <SpeakButton text={`${experiment.title}. ${experiment.purpose}`} />
      </div>

      <ChemPhysicalStage simType={experiment.simType} params={params} />

      {experiment.paramConfig.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {experiment.paramConfig.map((pc) => (
            <div key={pc.key} className="text-xs font-bold text-slate-500 space-y-1.5">
              <span className="block">{pc.label}{!pc.choices && ` (${params[pc.key] ?? experiment.defaultParams[pc.key]}${pc.unit})`}</span>
              {pc.choices ? (
                <div className="flex flex-wrap gap-1.5">
                  {pc.choices.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setParams((prev) => ({ ...prev, [pc.key]: c.value }))}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] border-2 transition-all ${(params[pc.key] ?? experiment.defaultParams[pc.key]) === c.value ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'border-slate-200 dark:border-slate-800'}`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  type="range"
                  min={pc.min}
                  max={pc.max}
                  step={pc.step}
                  value={params[pc.key] ?? experiment.defaultParams[pc.key]}
                  onChange={(e) => setParams((prev) => ({ ...prev, [pc.key]: parseFloat(e.target.value) }))}
                  className="w-full accent-primary-600"
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="glass-card rounded-2xl p-5 flex items-start gap-3 bg-amber-50/50 dark:bg-amber-950/10">
        <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="flex-1 space-y-1">
          <p className="text-sm text-slate-600 dark:text-slate-300"><span className="font-bold">Key Idea:</span> {experiment.keyIdea}</p>
          <p className="text-xs text-slate-500">{experiment.realLifeNote}</p>
        </div>
        <SpeakButton text={`${experiment.keyIdea} ${experiment.realLifeNote}`} />
      </div>
    </div>
  );
}
