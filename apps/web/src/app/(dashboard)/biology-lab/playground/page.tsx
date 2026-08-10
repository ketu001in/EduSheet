'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Leaf, Play, Pause, RotateCcw, Lightbulb } from 'lucide-react';
import { BIOLOGY_EXPERIMENTS, ANATOMY_MODELS } from '@edusheets/content';
import BiologyStage from '@/components/biologylab/BiologyStage';
import AnatomyExplorer from '@/components/biologylab/AnatomyExplorer';
import SpeakButton from '@/components/labshared/SpeakButton';

// Each tab targets one specific curated experiment as the free-play
// scenario for that interaction type -- 'explorer' experiments have no
// tunable params (they're diagrams), so each of the three diagrams gets
// its own tab rather than trying to force them under one generic label.
const TABS = [
  { id: 'exp-onion-cell', label: 'Microscope' },
  { id: 'exp-starch-test', label: 'Starch Test' },
  { id: 'exp-fat-test', label: 'Fat Test' },
  { id: 'exp-protein-test', label: 'Protein Test' },
  { id: 'exp-sugar-test', label: 'Sugar Test' },
  { id: 'exp-osmosis-potato', label: 'Osmosis' },
  { id: 'exp-punnett-square', label: 'Genetics' },
  { id: 'exp-plant-cell', label: 'Plant Cell' },
  { id: 'exp-digestive-system', label: 'Digestive System' },
  { id: 'exp-food-chain', label: 'Food Chain' },
];

const RULE_CALLOUTS: Record<string, string[]> = {
  'exp-onion-cell': [
    "A microscope only shows a sharp image at one precise focus distance -- too close or too far and it blurs.",
    'Switching to a higher magnification shows fewer cells, but each one bigger and more detailed.',
    'Every living thing is made of cells -- some organisms are just a single cell, others (like you) are trillions.',
  ],
  'exp-starch-test': [
    'Iodine turns blue-black specifically because it fits inside the coiled shape of a starch molecule.',
    'Try every food sample -- can you find a pattern in which ones contain starch?',
    'This exact test is used to prove leaves only make starch in sunlight, not in the dark.',
  ],
  'exp-fat-test': [
    'A grease spot stays translucent and never dries up -- that\'s what makes it different from a plain water mark.',
    'Fats are non-polar, which is exactly why they resist evaporating the way water does.',
    'Nutrition labels list fat content in grams because of tests just like this one.',
  ],
  'exp-protein-test': [
    "Biuret reagent turns violet because it binds to peptide bonds -- the links between amino acids in a protein.",
    'Starchy or fatty foods have no peptide bonds at all, so they never react with this test.',
    'Doctors use a version of this exact test to check for protein leaking into urine.',
  ],
  'exp-sugar-test': [
    "Benedict's solution needs HEAT to react -- that's why a water bath is part of this test.",
    'Starch is a carbohydrate too, but it can\'t act as a reducing sugar the way glucose can.',
    'Riper fruit turns this test brick-red faster, since ripening converts starch into free sugar.',
  ],
  'exp-osmosis-potato': [
    'Water always moves from LOWER solute concentration to HIGHER -- try to predict shrink vs swell before you look.',
    'This is exactly why salting food preserves it -- it pulls water out of any bacteria present.',
    'At the exact same concentration as the potato\'s own cells, nothing happens at all -- try to find that point.',
  ],
  'exp-punnett-square': [
    'A dominant allele (T) hides a recessive one (t) whenever at least one T is present.',
    'Try every genotype combination -- can you find one that guarantees ALL offspring are short?',
    'Mendel worked all of this out by hand in the 1860s, decades before anyone knew DNA existed.',
  ],
  'exp-plant-cell': [
    'Plant cells have three things animal cells never have: a cell wall, a big vacuole, and chloroplasts.',
    'Chloroplasts reflect green light back to your eyes -- that reflected light is literally why plants look green.',
    'A plant wilts when its vacuoles lose water pressure against the cell wall -- water it and watch it recover.',
  ],
  'exp-digestive-system': [
    'Most digestion and nutrient absorption happens in the small intestine, not the stomach.',
    "The small intestine's absorbing surface, unfolded, would be roughly the size of a tennis court.",
    'The liver and pancreas aren\'t part of the tube food travels through, but both feed enzymes into it.',
  ],
  'exp-food-chain': [
    'Only about 10% of energy passes from one level of a food chain to the next -- the rest is lost as heat.',
    'That 10% rule is exactly why apex predators like eagles are naturally much rarer than the prey below them.',
    'Decomposers turn the food chain into a cycle -- without them, nutrients would stay locked in dead bodies forever.',
  ],
};

type Mode = 'experiments' | 'anatomy';

export default function BiologyPlaygroundPage() {
  const [mode, setMode] = useState<Mode>('experiments');
  const [experimentId, setExperimentId] = useState(TABS[0].id);
  const experiment = BIOLOGY_EXPERIMENTS.find((e) => e.id === experimentId) || BIOLOGY_EXPERIMENTS[0];
  const [params, setParams] = useState<Record<string, number>>(experiment.defaultParams);
  const [running, setRunning] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [calloutIndex, setCalloutIndex] = useState(0);
  const [anatomyModelId, setAnatomyModelId] = useState(ANATOMY_MODELS[0].id);
  const anatomyModel = ANATOMY_MODELS.find((m) => m.id === anatomyModelId) || ANATOMY_MODELS[0];

  useEffect(() => {
    setParams(experiment.defaultParams);
    setResetKey((k) => k + 1);
    setRunning(true);
    setCalloutIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experimentId]);

  useEffect(() => {
    const callouts = RULE_CALLOUTS[experimentId] || [];
    if (callouts.length === 0) return;
    const id = setInterval(() => setCalloutIndex((i) => (i + 1) % callouts.length), 7000);
    return () => clearInterval(id);
  }, [experimentId]);

  const callouts = RULE_CALLOUTS[experimentId] || [];

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-6">
      <div className="sticky top-0 z-30 isolate px-3 py-2 rounded-xl bg-bg-light dark:bg-bg-dark border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
        <Link href="/biology-lab" className="text-sm font-medium text-slate-500 hover:text-primary-600 flex items-center gap-1.5">
          <ChevronLeft className="w-4 h-4" /> Back to Biology Lab
        </Link>
      </div>

      <div>
        <h1 className="font-display text-3xl font-semibold mb-2 flex items-center gap-2"><Leaf className="w-7 h-7 text-primary-600" /> Free Play Sandbox</h1>
        <p className="text-slate-500 text-sm">No script, no grading -- explore every biology tool and model at your own pace.</p>
      </div>

      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl w-fit">
        <button onClick={() => setMode('experiments')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'experiments' ? 'bg-white dark:bg-slate-900 shadow-sm' : 'text-slate-500'}`}>Experiments</button>
        <button onClick={() => setMode('anatomy')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'anatomy' ? 'bg-white dark:bg-slate-900 shadow-sm' : 'text-slate-500'}`}>Anatomy Models</button>
      </div>

      {mode === 'experiments' && (
        <>
          <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl w-fit">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setExperimentId(tab.id)}
                className={`px-3.5 py-2 rounded-lg text-sm font-bold transition-all ${experimentId === tab.id ? 'bg-white dark:bg-slate-900 shadow-sm text-primary-600' : 'text-slate-500'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <BiologyStage
            simType={experiment.simType}
            params={params}
            running={running}
            resetKey={resetKey}
            apparatusIds={experiment.apparatusIds}
            experiment={experiment}
          />

          {experiment.paramConfig.length > 0 && (
            <div className="glass-card rounded-2xl p-4 flex flex-wrap items-center gap-3 justify-between">
              <div className="flex items-center gap-2">
                <button onClick={() => setRunning((r) => !r)} className="p-2.5 rounded-xl bg-primary-600 text-white hover:bg-primary-500">
                  {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button onClick={() => setResetKey((k) => k + 1)} className="p-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 hover:border-primary-400">
                  <RotateCcw className="w-4 h-4" />
                </button>
                <SpeakButton text={experiment.keyIdea} />
              </div>
              <p className="text-xs text-slate-400 max-w-xs text-right">{experiment.keyIdea}</p>
            </div>
          )}

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

          {callouts.length > 0 && (
            <div className="glass-card rounded-2xl p-5 flex items-start gap-3 bg-amber-50/50 dark:bg-amber-950/10">
              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-600 dark:text-slate-300 flex-1">{callouts[calloutIndex]}</p>
              <SpeakButton text={callouts[calloutIndex]} />
            </div>
          )}
        </>
      )}

      {mode === 'anatomy' && (
        <>
          <div className="flex flex-wrap gap-2">
            {ANATOMY_MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => setAnatomyModelId(m.id)}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                  anatomyModelId === m.id ? 'border-slate-900 bg-primary-600 text-white shadow-[3px_3px_0_var(--color-ink)]' : 'border-slate-900 dark:border-slate-700 bg-surface-light dark:bg-surface-dark hover:shadow-[3px_3px_0_var(--color-ink)]'
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <p className="text-sm text-slate-500 leading-relaxed flex-1 min-w-[200px]">{anatomyModel.intro}</p>
            <SpeakButton text={`${anatomyModel.name}. ${anatomyModel.intro}`} />
          </div>
          <AnatomyExplorer key={anatomyModel.id} model={anatomyModel} />
        </>
      )}
    </div>
  );
}
