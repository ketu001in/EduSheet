'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchBoards, fetchClasses, Board, ClassLevel } from '@/lib/curriculum';
import { submitChemAttempt, downloadChemAttemptPdf } from '@/lib/chemLab';
import {
  CHEMISTRY_EXPERIMENTS, chemGradeBandForClass, ChemistryExperiment, ChemExperimentCategory,
} from '@edusheets/content';
import { LabBench } from '@/components/chemlab/LabBench';
import {
  Loader2, AlertTriangle, FlaskConical, Beaker, TestTube, Zap, Search, Printer,
  Check, ChevronLeft,
} from 'lucide-react';

const CATEGORY_LABEL: Record<ChemExperimentCategory, string> = {
  'physical-change': 'Physical Change',
  'chemical-reaction': 'Chemical Reaction',
  'acid-base': 'Acid & Base',
  'gas-test': 'Gas Test',
  electrochemistry: 'Electrochemistry',
  organic: 'Organic Chemistry',
  analysis: 'Analysis',
};

const CATEGORY_ICON: Record<ChemExperimentCategory, typeof Beaker> = {
  'physical-change': Beaker,
  'chemical-reaction': FlaskConical,
  'acid-base': TestTube,
  'gas-test': Zap,
  electrochemistry: Zap,
  organic: FlaskConical,
  analysis: Search,
};

function isNumericGradeBoard(code: string) {
  return code === 'CBSE' || code === 'ICSE';
}

// Sticky so it stays reachable even deep into a long, scrolled-down
// experiment (shelf + workbench + bench + log can add up to a tall page) --
// previously this link only existed on the results screen, so there was no
// way back to the Chem Lab hub at all while an experiment was in progress.
function BackToChemLabBar() {
  return (
    <div className="sticky top-0 z-30 isolate px-3 py-2 mb-6 rounded-xl bg-bg-light dark:bg-bg-dark border border-slate-200 dark:border-slate-800 shadow-sm">
      <Link href="/chem-lab" className="text-sm font-medium text-slate-500 hover:text-primary-600 flex items-center gap-1.5 w-fit">
        <ChevronLeft className="w-4 h-4" /> Back to Chem Lab
      </Link>
    </div>
  );
}

export default function NewChemExperimentPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [classes, setClasses] = useState<ClassLevel[]>([]);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedClassName, setSelectedClassName] = useState<string | null>(null);
  const [selectedGradeNumber, setSelectedGradeNumber] = useState<number | null>(null);
  const [selectedExperiment, setSelectedExperiment] = useState<ChemistryExperiment | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<{ id: string } | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const boardsRes = await fetchBoards();
        const usable = boardsRes.data.filter((b) => isNumericGradeBoard(b.code));
        setBoards(usable);
        const cbse = usable.find((b) => b.code === 'CBSE');
        if (cbse) setSelectedBoardId(cbse.id);
      } catch (err) {
        console.error(err);
        setCatalogError('Could not load boards from the server. Is the API running?');
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedBoardId) { setClasses([]); return; }
    fetchClasses(selectedBoardId)
      .then((res) => setClasses(res.data))
      .catch((err) => { console.error(err); setClasses([]); });
  }, [selectedBoardId]);

  const pickClass = (cls: ClassLevel) => {
    setSelectedClassId(cls.id);
    setSelectedClassName(cls.name);
    setSelectedGradeNumber(cls.grade_number);
    setSelectedExperiment(null);
    setResult(null);
  };

  const gradeBand = selectedGradeNumber != null ? chemGradeBandForClass(selectedGradeNumber) : null;
  const experiments = gradeBand ? CHEMISTRY_EXPERIMENTS.filter((e) => e.gradeBand === gradeBand.id) : [];

  const handleComplete = async (data: { predictAnswerIndex: number; predictCorrect: boolean; observations: Record<string, string> }) => {
    if (!selectedExperiment) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await submitChemAttempt({
        experimentId: selectedExperiment.id,
        experimentTitle: selectedExperiment.title,
        boardId: selectedBoardId || undefined,
        classId: selectedClassId || undefined,
        className: selectedClassName || undefined,
        predictAnswerIndex: data.predictAnswerIndex,
        predictCorrect: data.predictCorrect,
        observations: data.observations,
      });
      setResult({ id: res.data.attempt.id });
    } catch (err: any) {
      console.error('Failed to save Chem Lab attempt:', err);
      setSubmitError(err.message || 'Could not save your lab report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!result) return;
    setDownloadingPdf(true);
    try {
      await downloadChemAttemptPdf(result.id);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto pb-16">
        <BackToChemLabBar />
        <div className="text-center space-y-6 pt-8">
          <div className="w-16 h-16 bg-accent-100 dark:bg-accent-900/30 text-accent-600 rounded-2xl flex items-center justify-center mx-auto">
            <Check className="w-8 h-8" />
          </div>
          <h1 className="font-display text-2xl font-semibold">Lab Report Saved! 🎉</h1>
          <p className="text-slate-500">Your observations and prediction have been saved to your Chem Lab notebook.</p>
          <div className="flex justify-center gap-3">
            <button onClick={handleDownloadPdf} disabled={downloadingPdf} className="btn-brutal px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold flex items-center gap-2 disabled:opacity-50">
              {downloadingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />} Download PDF
            </button>
            <button
              onClick={() => { setSelectedExperiment(null); setResult(null); }}
              className="px-5 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-700 rounded-xl font-bold text-sm"
            >
              Try Another Experiment
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedExperiment) {
    return (
      <div className="max-w-3xl mx-auto pb-20">
        <BackToChemLabBar />
        <button onClick={() => setSelectedExperiment(null)} className="mb-6 text-sm text-slate-500 hover:text-primary-600 flex items-center gap-1.5">
          <ChevronLeft className="w-4 h-4" /> Choose a different experiment
        </button>
        <div className="mb-6">
          <h1 className="font-display text-2xl font-semibold">{selectedExperiment.title}</h1>
          <p className="text-slate-500 text-sm mt-1">{selectedClassName} • {CATEGORY_LABEL[selectedExperiment.category]}</p>
        </div>
        {submitError && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl text-red-700 dark:text-red-300 text-sm font-medium flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" /> {submitError}
          </div>
        )}
        <LabBench experiment={selectedExperiment} onComplete={handleComplete} submitting={submitting} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20 select-none">
      <BackToChemLabBar />
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold mb-2">New Experiment</h1>
        <p className="text-slate-500">Pick your board and class to see experiments matched to your level.</p>
      </div>

      {catalogError && (
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-2xl text-amber-800 dark:text-amber-300 text-sm font-medium flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" /> {catalogError}
        </div>
      )}

      <div className="glass-card p-6 md:p-8 rounded-3xl space-y-8">
        <div>
          <h2 className="font-display text-xl font-semibold mb-4">1. Select Board</h2>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            {boards.map((b) => (
              <button
                key={b.id}
                onClick={() => { setSelectedBoardId(b.id); setSelectedClassId(null); setSelectedGradeNumber(null); setSelectedExperiment(null); }}
                className={`p-4 border-2 border-slate-900 dark:border-slate-700 rounded-2xl text-center transition-all ${
                  selectedBoardId === b.id ? 'bg-primary-600 text-white shadow-[4px_4px_0_var(--color-ink)]' : 'bg-surface-light dark:bg-surface-dark hover:shadow-[4px_4px_0_var(--color-ink)]'
                }`}
              >
                <span className="block font-display text-xl font-semibold">{b.code}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold mb-4">2. Select Class</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {classes.map((cls) => (
              <button
                key={cls.id}
                onClick={() => pickClass(cls)}
                className={`p-3 rounded-xl text-center transition-all border-2 ${
                  selectedClassId === cls.id
                    ? 'border-slate-900 bg-primary-600 text-white shadow-[3px_3px_0_var(--color-ink)] font-bold'
                    : 'border-slate-900 dark:border-slate-700 bg-surface-light dark:bg-surface-dark hover:shadow-[3px_3px_0_var(--color-ink)]'
                }`}
              >
                <span className="font-bold">{cls.grade_number}</span>
              </button>
            ))}
          </div>
        </div>

        {gradeBand && (
          <div>
            <h2 className="font-display text-xl font-semibold mb-1">3. Choose an Experiment</h2>
            <p className="text-sm text-slate-500 mb-4">Curated for {gradeBand.label}.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {experiments.map((exp) => {
                const Icon = CATEGORY_ICON[exp.category];
                return (
                  <button
                    key={exp.id}
                    onClick={() => setSelectedExperiment(exp)}
                    className="p-4 rounded-2xl text-left border-2 border-slate-900 dark:border-slate-700 bg-surface-light dark:bg-surface-dark hover:-translate-y-1 hover:shadow-[4px_4px_0_var(--color-ink)] transition-all"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 text-primary-600" />
                      <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wide">{CATEGORY_LABEL[exp.category]}</span>
                    </div>
                    <p className="font-bold text-sm mb-1">{exp.title}</p>
                    <p className="text-xs text-slate-500 line-clamp-2">{exp.purpose}</p>
                  </button>
                );
              })}
              {experiments.length === 0 && (
                <div className="col-span-2 text-sm text-slate-400 py-8 text-center">No experiments curated for this class yet.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
