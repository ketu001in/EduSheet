'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, Sparkles, Play, Pause, RotateCcw, ArrowRight, PartyPopper,
  Loader2, CheckCircle2, XCircle, Printer, AlertTriangle, Calculator, Ruler, Sigma, BarChart3,
} from 'lucide-react';
import { MATH_EXPERIMENTS, MathExperiment, MathBranch, mathGradeBandForClass } from '@edusheets/content';
import MathStage from '@/components/mathlab/MathStage';
import SpeakButton from '@/components/labshared/SpeakButton';
import { submitMathAttempt, downloadMathAttemptPdf } from '@/lib/mathLab';
import { fetchBoards, fetchClasses, Board, ClassLevel } from '@/lib/curriculum';

type Phase = 'pick' | 'predict' | 'simulate' | 'observe' | 'explain' | 'done';

const BRANCH_ICON: Partial<Record<MathBranch, typeof Calculator>> = {
  'number-systems': Sigma,
  algebra: Calculator,
  geometry: Ruler,
  mensuration: Ruler,
  trigonometry: Ruler,
  'statistics-probability': BarChart3,
  calculus: Sigma,
};

const BRANCH_LABEL: Partial<Record<MathBranch, string>> = {
  'number-systems': 'Number Systems',
  algebra: 'Algebra',
  geometry: 'Geometry',
  mensuration: 'Mensuration',
  trigonometry: 'Trigonometry',
  'statistics-probability': 'Statistics & Probability',
  calculus: 'Calculus',
};

function isNumericGradeBoard(code: string) {
  return code === 'CBSE' || code === 'ICSE';
}

function BackBar() {
  return (
    <div className="sticky top-0 z-30 isolate px-3 py-2 rounded-xl bg-bg-light dark:bg-bg-dark border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
      <Link href="/math-lab" className="text-sm font-medium text-slate-500 hover:text-primary-600 flex items-center gap-1.5">
        <ChevronLeft className="w-4 h-4" /> Back to Math Lab
      </Link>
    </div>
  );
}

export default function NewMathExperimentPage() {
  const [phase, setPhase] = useState<Phase>('pick');
  const [experiment, setExperiment] = useState<MathExperiment | null>(null);
  const [params, setParams] = useState<Record<string, number>>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const [predictIndex, setPredictIndex] = useState<number | null>(null);
  const [observations, setObservations] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);

  const [boards, setBoards] = useState<Board[]>([]);
  const [classes, setClasses] = useState<ClassLevel[]>([]);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedClassName, setSelectedClassName] = useState<string | null>(null);
  const [selectedGradeNumber, setSelectedGradeNumber] = useState<number | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<MathBranch | null>(null);

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
    setSelectedBranch(null);
  };

  const gradeBand = selectedGradeNumber != null ? mathGradeBandForClass(selectedGradeNumber) : null;
  const experimentsForBand = gradeBand ? MATH_EXPERIMENTS.filter((e) => e.gradeBand === gradeBand.id) : [];
  const branchesInBand = Array.from(new Set(experimentsForBand.map((e) => e.branch)));
  const experimentsToShow = selectedBranch ? experimentsForBand.filter((e) => e.branch === selectedBranch) : experimentsForBand;

  const pickExperiment = (exp: MathExperiment) => {
    setExperiment(exp);
    setParams({ ...exp.defaultParams });
    setStepIndex(0);
    setPredictIndex(null);
    setObservations({});
    setPhase('predict');
  };

  const startSimulating = () => {
    setPhase('simulate');
    setResetKey((k) => k + 1);
  };

  const nextStep = () => {
    if (!experiment) return;
    const next = stepIndex + 1;
    if (next >= experiment.steps.length) {
      setPhase('observe');
      return;
    }
    const step = experiment.steps[next];
    if (step.paramChanges) setParams((prev) => ({ ...prev, ...step.paramChanges }));
    setStepIndex(next);
    setResetKey((k) => k + 1);
  };

  const resetSim = () => setResetKey((k) => k + 1);

  const handleSubmit = async () => {
    if (!experiment || predictIndex === null) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await submitMathAttempt({
        experimentId: experiment.id,
        experimentTitle: experiment.title,
        boardId: selectedBoardId || undefined,
        classId: selectedClassId || undefined,
        className: selectedClassName || undefined,
        predictAnswerIndex: predictIndex,
        predictCorrect: predictIndex === experiment.correctPredictIndex,
        observations,
        finalParams: params,
      });
      setAttemptId(res.data.attempt.id);
      setPhase('done');
    } catch (err) {
      console.error(err);
      setSubmitError('Could not save this attempt. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const currentStep = experiment?.steps[stepIndex];

  return (
    <div className={`${phase === 'pick' ? 'max-w-5xl' : 'max-w-3xl'} mx-auto pb-16 space-y-6`}>
      <BackBar />

      {phase === 'pick' && (
        <div className="space-y-6 select-none">
          <div>
            <h1 className="font-display text-3xl font-semibold mb-2 flex items-center gap-2"><Sparkles className="w-7 h-7 text-primary-600" /> New Math Experiment</h1>
            <p className="text-slate-500 text-sm">Pick your board and class to see hands-on experiments matched to your level.</p>
          </div>

          {catalogError && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-2xl text-amber-800 dark:text-amber-300 text-sm font-medium flex items-center gap-3">
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
                    onClick={() => { setSelectedBoardId(b.id); setSelectedClassId(null); setSelectedGradeNumber(null); setSelectedBranch(null); }}
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
                <p className="text-sm text-slate-500 mb-4">Hands-on experiments curated for {gradeBand.label}.</p>

                {branchesInBand.length > 1 && (
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <button
                      onClick={() => setSelectedBranch(null)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${
                        selectedBranch === null ? 'border-slate-900 bg-primary-600 text-white shadow-[3px_3px_0_var(--color-ink)]' : 'border-slate-900 dark:border-slate-700 bg-surface-light dark:bg-surface-dark hover:shadow-[3px_3px_0_var(--color-ink)]'
                      }`}
                    >
                      All ({experimentsForBand.length})
                    </button>
                    {branchesInBand.map((branch) => (
                      <button
                        key={branch}
                        onClick={() => setSelectedBranch(branch)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${
                          selectedBranch === branch ? 'border-slate-900 bg-primary-600 text-white shadow-[3px_3px_0_var(--color-ink)]' : 'border-slate-900 dark:border-slate-700 bg-surface-light dark:bg-surface-dark hover:shadow-[3px_3px_0_var(--color-ink)]'
                        }`}
                      >
                        {BRANCH_LABEL[branch] || branch} ({experimentsForBand.filter((e) => e.branch === branch).length})
                      </button>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {experimentsToShow.map((exp) => {
                    const Icon = BRANCH_ICON[exp.branch] || Calculator;
                    return (
                      <button
                        key={exp.id}
                        onClick={() => pickExperiment(exp)}
                        className="p-4 rounded-2xl text-left border-2 border-slate-900 dark:border-slate-700 bg-surface-light dark:bg-surface-dark hover:-translate-y-1 hover:shadow-[4px_4px_0_var(--color-ink)] transition-all"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-4 h-4 text-primary-600" />
                          <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wide">{BRANCH_LABEL[exp.branch] || exp.branch}</span>
                        </div>
                        <p className="font-bold text-sm mb-1">{exp.title}</p>
                        <p className="text-xs text-slate-500 line-clamp-2">{exp.purpose}</p>
                      </button>
                    );
                  })}
                  {experimentsToShow.length === 0 && (
                    <div className="col-span-2 text-sm text-slate-400 py-8 text-center">No hands-on experiments curated for this class yet -- more are being added regularly.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {experiment && phase === 'predict' && (
        <div className="glass-card rounded-3xl p-6 md:p-8 space-y-5">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <h2 className="font-display text-xl font-semibold">{experiment.title}</h2>
            <SpeakButton text={`Today we're exploring ${experiment.title}. ${experiment.purpose} Before we start -- ${experiment.predictPrompt}`} />
          </div>
          <p className="text-sm text-slate-500">{experiment.purpose}</p>
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 space-y-3">
            <p className="font-bold text-sm flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-primary-600" /> Predict First</p>
            <p className="text-sm">{experiment.predictPrompt}</p>
            <div className="space-y-2">
              {experiment.predictOptions.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setPredictIndex(i)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl border-2 text-sm transition-all ${predictIndex === i ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 font-bold' : 'border-slate-200 dark:border-slate-800 hover:border-primary-300'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={startSimulating}
            disabled={predictIndex === null}
            className="btn-brutal w-full py-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-40 text-white font-bold rounded-xl flex items-center justify-center gap-2"
          >
            Start Exploring <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {experiment && phase === 'simulate' && currentStep && (
        <div className="space-y-4">
          <div className="glass-card rounded-3xl p-5 space-y-3">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <p className="text-xs font-bold text-primary-600 uppercase tracking-wide">Step {currentStep.number} of {experiment.steps.length}</p>
              <SpeakButton text={`Step ${currentStep.number}. ${currentStep.instruction}${currentStep.hint ? ' Here\'s a hint: ' + currentStep.hint : ''}`} />
            </div>
            <p className="font-medium">{currentStep.instruction}</p>
            {currentStep.hint && <p className="text-xs text-slate-400">Hint: {currentStep.hint}</p>}
          </div>

          <MathStage simType={experiment.simType} params={params} resetKey={resetKey} />

          <div className="glass-card rounded-2xl p-4 flex flex-wrap items-center gap-3 justify-between">
            <button onClick={resetSim} className="p-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 hover:border-primary-400">
              <RotateCcw className="w-4 h-4" />
            </button>
            <p className="text-xs text-slate-400 max-w-xs text-right">{experiment.keyIdea}</p>
          </div>

          {experiment.paramConfig.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

          <button onClick={nextStep} className="btn-brutal w-full py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
            {stepIndex + 1 >= experiment.steps.length ? 'Continue to Observations' : 'Next Step'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {experiment && phase === 'observe' && (
        <div className="glass-card rounded-3xl p-6 md:p-8 space-y-5">
          <h2 className="font-display text-xl font-semibold">Your Observations</h2>
          {experiment.observationPrompts.map((prompt, i) => (
            <div key={i} className="space-y-1.5">
              <p className="text-sm font-bold">{prompt}</p>
              <textarea
                value={observations[String(i)] || ''}
                onChange={(e) => setObservations((prev) => ({ ...prev, [String(i)]: e.target.value }))}
                rows={2}
                className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-transparent p-3 text-sm focus:border-primary-500 outline-none"
                placeholder="Write what you noticed..."
              />
            </div>
          ))}
          <button onClick={() => setPhase('explain')} className="btn-brutal w-full py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {experiment && phase === 'explain' && (
        <div className="glass-card rounded-3xl p-6 md:p-8 space-y-5">
          <div className={`rounded-2xl p-4 flex items-center gap-3 ${predictIndex === experiment.correctPredictIndex ? 'bg-accent-50 dark:bg-accent-950/20' : 'bg-amber-50 dark:bg-amber-950/20'}`}>
            {predictIndex === experiment.correctPredictIndex ? <CheckCircle2 className="w-6 h-6 text-accent-600 shrink-0" /> : <XCircle className="w-6 h-6 text-amber-600 shrink-0" />}
            <p className="text-sm font-medium flex-1">
              {predictIndex === experiment.correctPredictIndex ? 'Your prediction was correct!' : `Not quite -- the correct answer was "${experiment.predictOptions[experiment.correctPredictIndex]}".`}
            </p>
            <SpeakButton
              label="Listen to All"
              text={[
                predictIndex === experiment.correctPredictIndex ? 'Your prediction was correct! Nicely done.' : `Not quite. The correct answer was "${experiment.predictOptions[experiment.correctPredictIndex]}".`,
                `Here's why. ${experiment.explanation}`,
                `You'll actually see this show up in real life: ${experiment.realWorldApplications.join('. ')}`,
                experiment.realLifeNote,
              ].join(' ')}
            />
          </div>
          <div>
            <h3 className="font-bold text-sm mb-1.5">Why?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{experiment.explanation}</p>
          </div>
          <div>
            <h3 className="font-bold text-sm mb-1.5">Real-World Applications</h3>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
              {experiment.realWorldApplications.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/20 rounded-2xl p-4">
            <p className="text-sm">{experiment.realLifeNote}</p>
          </div>
          <div>
            <h3 className="font-bold text-sm mb-1.5">Go Further</h3>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
              {experiment.extensions.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </div>
          {submitError && <p className="text-xs text-red-600 font-medium">{submitError}</p>}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-brutal w-full py-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <PartyPopper className="w-4 h-4" />} Save Lab Report
          </button>
        </div>
      )}

      {experiment && phase === 'done' && (
        <div className="glass-card rounded-3xl p-8 text-center space-y-4">
          <PartyPopper className="w-10 h-10 text-primary-600 mx-auto" />
          <h2 className="font-display text-xl font-semibold">Lab Report Saved!</h2>
          <p className="text-sm text-slate-500">Your {experiment.title} attempt is saved to Math Lab.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {attemptId && (
              <button
                onClick={() => downloadMathAttemptPdf(attemptId)}
                className="btn-brutal px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl text-sm flex items-center gap-2"
              >
                <Printer className="w-4 h-4" /> Download PDF
              </button>
            )}
            <Link href="/math-lab" className="btn-brutal px-5 py-2.5 border-2 border-slate-200 dark:border-slate-800 font-bold rounded-xl text-sm">
              Back to Math Lab
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
