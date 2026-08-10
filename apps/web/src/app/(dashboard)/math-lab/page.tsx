'use client';
import { useState } from 'react';
import { Calculator, Ruler, BookOpenCheck, Sparkles, Gamepad2 } from 'lucide-react';
import { MATH_THEOREMS, MATH_FORMULAS } from '@edusheets/content';
import TheoremCorner from '@/components/mathlab/TheoremCorner';
import FormulaReference from '@/components/mathlab/FormulaReference';
import GeometryExplorer from '@/components/mathlab/GeometryExplorer';
import MathGamesArcade from '@/components/mathlab/MathGamesArcade';
import SpeakButton from '@/components/labshared/SpeakButton';

type Section = 'games' | 'theorems' | 'formulas' | 'geometry';

const SECTIONS: { id: Section; label: string; icon: typeof Calculator }[] = [
  { id: 'games', label: 'Math Games', icon: Gamepad2 },
  { id: 'theorems', label: 'Theorem Corner', icon: BookOpenCheck },
  { id: 'formulas', label: 'Formula Reference', icon: Calculator },
  { id: 'geometry', label: 'Geometry Explorer', icon: Ruler },
];

// Math Lab -- CBSE/ICSE-aligned, all classes. Phase 1 shipped the Theorem
// Corner, Formula Reference, and Geometry Explorer; Phase 2 adds a Math
// Games arcade for the younger grades. Guided predict/observe Experiments,
// Vedic Mathematics, and an Ancient Mathematics explorer (mirroring Anatomy
// Explorer's real-image format) are clearly-flagged next passes -- see the
// note below rather than silently missing, same discipline as every other
// lab's phased rollout.
export default function MathLabPage() {
  const [section, setSection] = useState<Section>('games');

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      <div>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <h1 className="text-3xl font-bold flex items-center gap-2"><Calculator className="w-7 h-7 text-primary-600" /> Math Lab</h1>
          <SpeakButton text="Welcome to Math Lab! Play quick drill games, step through real theorem proofs, look up formulas with worked examples, and drag points on live geometry constructions to see the rules prove themselves." />
        </div>
        <p className="text-slate-500 text-sm">Real CBSE and ICSE mathematics -- drill games for younger grades, step-by-step theorem proofs, a quick-lookup formula reference, and drag-to-prove geometry constructions.</p>
      </div>

      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl w-fit">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${section === s.id ? 'bg-white dark:bg-slate-900 shadow-sm text-primary-600' : 'text-slate-500'}`}
            >
              <Icon className="w-4 h-4" /> {s.label}
            </button>
          );
        })}
      </div>

      {section === 'games' && <MathGamesArcade />}
      {section === 'theorems' && <TheoremCorner theorems={MATH_THEOREMS} />}
      {section === 'formulas' && <FormulaReference formulas={MATH_FORMULAS} />}
      {section === 'geometry' && <GeometryExplorer />}

      <div className="glass-card rounded-2xl p-5 flex items-start gap-3 bg-amber-50/50 dark:bg-amber-950/10">
        <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-slate-600 dark:text-slate-300">
          More is on the way: a guided Predict &rarr; Explore &rarr; Explain experiment flow across every grade band, a Vedic Mathematics section with genuine mental-math sutras, and an Ancient Mathematics explorer with real portraits of Aryabhata, Brahmagupta, Bhaskara II, and Ramanujan.
        </p>
      </div>
    </div>
  );
}
