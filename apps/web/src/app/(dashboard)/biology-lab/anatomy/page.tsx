'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Microscope } from 'lucide-react';
import { ANATOMY_MODELS } from '@edusheets/content';
import AnatomyExplorer from '@/components/biologylab/AnatomyExplorer';
import SpeakButton from '@/components/labshared/SpeakButton';

export default function AnatomyExplorerPage() {
  const [modelId, setModelId] = useState(ANATOMY_MODELS[0].id);
  const model = ANATOMY_MODELS.find((m) => m.id === modelId) || ANATOMY_MODELS[0];

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-6">
      <div className="sticky top-0 z-30 isolate px-3 py-2 rounded-xl bg-bg-light dark:bg-bg-dark border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
        <Link href="/biology-lab" className="text-sm font-medium text-slate-500 hover:text-primary-600 flex items-center gap-1.5">
          <ChevronLeft className="w-4 h-4" /> Back to Biology Lab
        </Link>
      </div>

      <div>
        <h1 className="font-display text-3xl font-semibold mb-2 flex items-center gap-2"><Microscope className="w-7 h-7 text-primary-600" /> Anatomy Explorer</h1>
        <p className="text-slate-500 text-sm">Real anatomical diagrams, not cartoons -- click any part to learn exactly what it does.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {ANATOMY_MODELS.map((m) => (
          <button
            key={m.id}
            onClick={() => setModelId(m.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
              modelId === m.id ? 'border-slate-900 bg-primary-600 text-white shadow-[3px_3px_0_var(--color-ink)]' : 'border-slate-900 dark:border-slate-700 bg-surface-light dark:bg-surface-dark hover:shadow-[3px_3px_0_var(--color-ink)]'
            }`}
          >
            {m.name}
          </button>
        ))}
      </div>

      <div className="flex items-start justify-between gap-3 flex-wrap">
        <p className="text-sm text-slate-500 leading-relaxed flex-1 min-w-[200px]">{model.intro}</p>
        <SpeakButton text={`${model.name}. ${model.intro}`} />
      </div>

      <AnatomyExplorer key={model.id} model={model} />
    </div>
  );
}
