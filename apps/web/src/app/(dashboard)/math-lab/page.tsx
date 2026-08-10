'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Calculator, Ruler, BookOpenCheck, Sparkles, Gamepad2, FlaskConical, ArrowRight, Scroll, Landmark, LineChart } from 'lucide-react';
import { MATH_THEOREMS, MATH_FORMULAS } from '@edusheets/content';
import TheoremCorner from '@/components/mathlab/TheoremCorner';
import FormulaReference from '@/components/mathlab/FormulaReference';
import GeometryExplorer from '@/components/mathlab/GeometryExplorer';
import MathGamesArcade from '@/components/mathlab/MathGamesArcade';
import ExperimentPlayground from '@/components/mathlab/ExperimentPlayground';
import VedicMathLab from '@/components/mathlab/VedicMathLab';
import AncientMathExplorer from '@/components/mathlab/AncientMathExplorer';
import GraphingCalculator from '@/components/mathlab/GraphingCalculator';
import SpeakButton from '@/components/labshared/SpeakButton';

type Section = 'games' | 'experiments' | 'theorems' | 'formulas' | 'geometry' | 'vedic' | 'history' | 'grapher';

const SECTIONS: { id: Section; label: string; icon: typeof Calculator }[] = [
  { id: 'games', label: 'Math Games', icon: Gamepad2 },
  { id: 'experiments', label: 'Free Play Experiments', icon: FlaskConical },
  { id: 'grapher', label: 'Graphing Calculator', icon: LineChart },
  { id: 'theorems', label: 'Theorem Corner', icon: BookOpenCheck },
  { id: 'formulas', label: 'Formula Reference', icon: Calculator },
  { id: 'geometry', label: 'Geometry Explorer', icon: Ruler },
  { id: 'vedic', label: 'Vedic Mathematics', icon: Scroll },
  { id: 'history', label: 'Ancient Mathematics', icon: Landmark },
];

// Math Lab -- CBSE/ICSE-aligned, all classes. Phase 1 shipped the Theorem
// Corner, Formula Reference, and Geometry Explorer; Phase 2 added a Math
// Games arcade, a guided Predict -> Explore -> Explain New Experiment flow,
// and its free-play counterpart; Phase 3 adds Vedic Mathematics, an
// Ancient Mathematics explorer (real, license-verified images, same
// discipline as Anatomy Explorer), and a cubic Graphing Calculator for
// deeper open-ended play. All eight sections share the same voice
// narration (SpeakButton) throughout.
export default function MathLabPage() {
  const [section, setSection] = useState<Section>('games');

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      <div>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <h1 className="text-3xl font-bold flex items-center gap-2"><Calculator className="w-7 h-7 text-primary-600" /> Math Lab</h1>
          <SpeakButton text="Welcome to Math Lab! Play quick drill games, run a guided experiment with a real prediction to test, graph any cubic curve, step through real theorem proofs, look up formulas with worked examples, drag points on live geometry constructions, try genuine Vedic mental-math tricks, and meet the real mathematicians behind it all." />
        </div>
        <p className="text-slate-500 text-sm">Real CBSE and ICSE mathematics -- drill games, guided experiments, a graphing calculator, theorem proofs, a formula reference, geometry constructions, Vedic mental-math, and the real history behind it all.</p>
      </div>

      <Link
        href="/math-lab/new"
        className="btn-brutal inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl text-sm w-fit"
      >
        <Sparkles className="w-4 h-4" /> Start a Guided Experiment <ArrowRight className="w-4 h-4" />
      </Link>

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
      {section === 'experiments' && <ExperimentPlayground />}
      {section === 'grapher' && <GraphingCalculator />}
      {section === 'theorems' && <TheoremCorner theorems={MATH_THEOREMS} />}
      {section === 'formulas' && <FormulaReference formulas={MATH_FORMULAS} />}
      {section === 'geometry' && <GeometryExplorer />}
      {section === 'vedic' && <VedicMathLab />}
      {section === 'history' && <AncientMathExplorer />}
    </div>
  );
}
