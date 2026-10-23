'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { fetchBoards, fetchClasses, Board, ClassLevel } from '@/lib/curriculum';
import {
  generateTechProject, downloadTechProjectPdf, techProjectToMarkdown, CATEGORY_LABEL,
  GeneratedTechProjectResult, TechProjectCategory,
} from '@/lib/techProject';
import { downloadMarkdownFile } from '@/lib/studyMaterial';
import { GRADE_BANDS, gradeBandForClass, TECH_PROJECT_IDEAS, TechProjectIdea } from '@/lib/techProjectIdeas';
import { Logo } from '@/components/Logo';
import {
  ChevronRight, ChevronLeft, Sparkles, Check, Bot, Brain, Code2, Printer, AlertTriangle,
  Loader2, FileDown, Wrench, ShieldAlert, PlayCircle, ExternalLink, PenLine,
} from 'lucide-react';

const CATEGORY_ICON: Record<TechProjectCategory, typeof Bot> = { robotics: Bot, ai: Brain, coding: Code2 };
const CATEGORY_HOOK: Record<TechProjectCategory, string> = {
  robotics: 'Sensors, motors, and circuits -- simulated first, hardware optional.',
  ai: 'Train real, working AI models with free browser tools.',
  coding: 'Games, apps, and scripts in Scratch, Python, and more.',
};

// Tech Lab is deliberately CBSE/ICSE-only for now -- the curated idea gallery
// is banded by numeric grade (Class 1-12), which doesn't map onto the
// alternative-pedagogy boards' age-stage classes. See lib/techProjectIdeas.ts.
function isNumericGradeBoard(code: string) {
  return code === 'CBSE' || code === 'ICSE';
}

export default function NewTechProjectPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto py-24 flex items-center justify-center gap-2 text-slate-400">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading...
      </div>
    }>
      <NewTechProjectPageContent />
    </Suspense>
  );
}

function NewTechProjectPageContent() {
  const searchParams = useSearchParams();

  const [currentStep, setCurrentStep] = useState(1);

  const [boards, setBoards] = useState<Board[]>([]);
  const [classes, setClasses] = useState<ClassLevel[]>([]);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [selectedBoardCode, setSelectedBoardCode] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedGradeNumber, setSelectedGradeNumber] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<TechProjectCategory | null>(null);

  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [ideaPrompt, setIdeaPrompt] = useState('');
  const [customMode, setCustomMode] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [result, setResult] = useState<{ id: string; generated: GeneratedTechProjectResult } | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const boardsRes = await fetchBoards();
        const usable = boardsRes.data.filter((b) => isNumericGradeBoard(b.code));
        setBoards(usable);
        const cbse = usable.find((b) => b.code === 'CBSE');
        if (cbse) { setSelectedBoardId(cbse.id); setSelectedBoardCode(cbse.code); }
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

  const pickBoard = (b: Board) => {
    setSelectedBoardId(b.id);
    setSelectedBoardCode(b.code);
    setSelectedClassId(null); setSelectedClass(null); setSelectedGradeNumber(null);
    setSelectedCategory(null); setSelectedIdeaId(null); setIdeaPrompt(''); setCustomMode(false);
  };

  const pickClass = (cls: ClassLevel) => {
    setSelectedClassId(cls.id);
    setSelectedClass(cls.name);
    setSelectedGradeNumber(cls.grade_number);
    setSelectedCategory(null); setSelectedIdeaId(null); setIdeaPrompt(''); setCustomMode(false);
  };

  const pickCategory = (cat: TechProjectCategory) => {
    setSelectedCategory(cat);
    setSelectedIdeaId(null); setIdeaPrompt(''); setCustomMode(false);
  };

  const pickIdea = (idea: TechProjectIdea) => {
    setSelectedIdeaId(idea.id);
    setIdeaPrompt(idea.prompt);
    setCustomMode(false);
  };

  const gradeBand = selectedGradeNumber != null ? gradeBandForClass(selectedGradeNumber) : null;
  const ideas = gradeBand && selectedCategory ? TECH_PROJECT_IDEAS[gradeBand.id]?.[selectedCategory] || [] : [];

  const stepValid = (step: number) => {
    if (step === 1) return !!selectedBoardId;
    if (step === 2) return !!selectedClassId;
    if (step === 3) return !!selectedCategory;
    return true;
  };

  const handleGenerate = async () => {
    if (!selectedClassId || !selectedCategory || !ideaPrompt.trim()) return;
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const res = await generateTechProject({
        boardId: selectedBoardId || undefined,
        board: boards.find((b) => b.id === selectedBoardId)?.name,
        classId: selectedClassId,
        className: selectedClass || 'Class 5',
        category: selectedCategory,
        ideaPrompt,
      });
      setResult({ id: res.data.project.id, generated: res.data.generated });
    } catch (err: any) {
      console.error('Tech project generation error:', err);
      setGenerationError(err.message || 'Error generating project. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!result) return;
    setPdfError(null);
    setDownloadingPdf(true);
    try {
      await downloadTechProjectPdf(result.id);
    } catch (err) {
      console.error('Failed to open PDF:', err);
      setPdfError('The PDF isn\'t ready yet — it finishes shortly after generation. Try again in a few seconds.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadMarkdown = () => {
    if (!result) return;
    downloadMarkdownFile(
      `${result.generated.title.replace(/[^a-z0-9]+/gi, '-')}.md`,
      techProjectToMarkdown(result.generated)
    );
  };

  const resetAll = () => {
    setCurrentStep(3);
    setSelectedCategory(null); setSelectedIdeaId(null); setIdeaPrompt(''); setCustomMode(false);
    setResult(null);
    setGenerationError(null);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 select-none">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold mb-2">Tech Lab: New Build</h1>
        <p className="text-slate-500">Generate a detailed Robotics, AI, or Coding project -- purpose, materials, step-by-step build, free simulation links, and code.</p>
      </div>

      {catalogError && (
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-2xl text-amber-800 dark:text-amber-300 text-sm font-medium flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" /> {catalogError}
        </div>
      )}

      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 right-0 top-1/2 h-1 bg-slate-200 dark:bg-slate-800 -z-10 -translate-y-1/2"></div>
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 border-slate-900 dark:border-slate-700 ${currentStep >= step ? 'bg-primary-600 text-white shadow-[3px_3px_0_var(--color-ink)]' : 'bg-surface-light dark:bg-surface-dark text-slate-400'}`}>
            {step}
          </div>
        ))}
      </div>

      <div className="glass-card p-6 md:p-8 rounded-3xl min-h-[400px]">
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="font-display text-2xl font-semibold mb-2">Select Board</h2>
            <p className="text-slate-500 text-sm mb-6">Tech Lab currently covers CBSE and ICSE, Class 1-12.</p>
            <div className="grid grid-cols-2 gap-4">
              {boards.length === 0 && !catalogError && (
                <div className="col-span-2 text-sm text-slate-400 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading boards...</div>
              )}
              {boards.map((b) => (
                <button
                  key={b.id}
                  onClick={() => pickBoard(b)}
                  className={`p-6 border-2 border-slate-900 dark:border-slate-700 rounded-2xl text-center transition-all ${
                    selectedBoardId === b.id
                      ? 'bg-primary-600 shadow-[4px_4px_0_var(--color-ink)]'
                      : 'bg-surface-light dark:bg-surface-dark hover:shadow-[4px_4px_0_var(--color-ink)]'
                  }`}
                >
                  <span className={`block font-display text-2xl font-semibold ${selectedBoardId === b.id ? 'text-white' : ''}`}>{b.code}</span>
                  <span className={`text-sm ${selectedBoardId === b.id ? 'text-primary-50' : 'text-slate-500'}`}>{b.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="font-display text-2xl font-semibold mb-2">Select Class</h2>
            <p className="text-slate-500 text-sm mb-6">Choose the grade level for this build.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {classes.map((cls) => (
                <button
                  key={cls.id}
                  onClick={() => pickClass(cls)}
                  className={`p-4 rounded-2xl text-center transition-all ${
                    selectedClassId === cls.id
                      ? 'border-2 border-slate-900 bg-primary-600 text-white scale-105 shadow-[4px_4px_0_var(--color-ink)] font-bold'
                      : 'border-2 border-slate-900 dark:border-slate-700 bg-surface-light dark:bg-surface-dark hover:-translate-y-1 hover:shadow-[4px_4px_0_var(--color-ink)]'
                  }`}
                >
                  <span className={`block font-bold ${selectedClassId === cls.id ? 'text-white text-xl' : 'text-slate-700 dark:text-slate-300'}`}>
                    {cls.grade_number > 0 ? cls.grade_number : cls.name}
                  </span>
                  {cls.grade_number > 0 && <span className={`text-xs block ${selectedClassId === cls.id ? 'text-primary-100' : 'text-slate-500'}`}>Class</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="font-display text-2xl font-semibold mb-2">Choose a Category</h2>
            <p className="text-slate-500 text-sm mb-6">What kind of build for {selectedClass || 'your class'}?</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(['robotics', 'ai', 'coding'] as TechProjectCategory[]).map((cat) => {
                const Icon = CATEGORY_ICON[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => pickCategory(cat)}
                    className={`p-6 rounded-2xl flex flex-col items-center text-center gap-3 transition-all ${
                      selectedCategory === cat
                        ? 'border-2 border-slate-900 bg-primary-600 text-white scale-105 shadow-[4px_4px_0_var(--color-ink)] font-bold'
                        : 'border-2 border-slate-900 dark:border-slate-700 bg-surface-light dark:bg-surface-dark hover:-translate-y-1 hover:shadow-[4px_4px_0_var(--color-ink)]'
                    }`}
                  >
                    <Icon className={`w-10 h-10 ${selectedCategory === cat ? 'text-white' : 'text-slate-500'}`} />
                    <span className="font-semibold">{CATEGORY_LABEL[cat]}</span>
                    <span className={`text-xs ${selectedCategory === cat ? 'text-primary-100' : 'text-slate-500'}`}>{CATEGORY_HOOK[cat]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {!result && (
              <div>
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h2 className="font-display text-2xl font-semibold mb-1">Pick a Project Idea</h2>
                    <p className="text-slate-500 text-sm">Curated, researched ideas for {gradeBand?.label || 'your class'} • {selectedCategory && CATEGORY_LABEL[selectedCategory]}.</p>
                  </div>
                  <button
                    onClick={() => { setCustomMode(true); setSelectedIdeaId(null); }}
                    className={`shrink-0 text-sm font-semibold flex items-center gap-1.5 ${customMode ? 'text-primary-600' : 'text-slate-500 hover:text-primary-600'}`}
                  >
                    <PenLine className="w-4 h-4" /> Describe your own
                  </button>
                </div>

                {!customMode && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {ideas.map((idea) => (
                      <button
                        key={idea.id}
                        onClick={() => pickIdea(idea)}
                        className={`p-4 rounded-2xl text-left transition-all ${
                          selectedIdeaId === idea.id
                            ? 'border-2 border-slate-900 bg-primary-50 dark:bg-primary-900/20 shadow-[3px_3px_0_var(--color-ink)] font-bold'
                            : 'border-2 border-slate-900 dark:border-slate-700 bg-surface-light dark:bg-surface-dark hover:-translate-y-1 hover:shadow-[3px_3px_0_var(--color-ink)]'
                        }`}
                      >
                        <span className="block font-semibold text-sm mb-1">{idea.title}</span>
                        <span className="block text-xs text-slate-500">{idea.hook}</span>
                      </button>
                    ))}
                    {ideas.length === 0 && (
                      <div className="col-span-2 text-sm text-slate-400 py-4 text-center">No curated ideas for this combination yet -- describe your own instead.</div>
                    )}
                  </div>
                )}

                {customMode && (
                  <div className="space-y-2">
                    <textarea
                      value={ideaPrompt}
                      onChange={(e) => { setIdeaPrompt(e.target.value); setSelectedIdeaId(null); }}
                      placeholder={`Describe the ${selectedCategory ? CATEGORY_LABEL[selectedCategory].toLowerCase() : ''} project you want to build, e.g. "A weather station that logs temperature and warns if it gets too hot"`}
                      rows={4}
                      className="w-full p-4 rounded-2xl border-2 border-slate-900 dark:border-slate-700 bg-surface-light dark:bg-surface-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                )}
              </div>
            )}

            {!isGenerating && !result && (
              <div className="flex flex-col items-center justify-center py-8 space-y-6 text-center border-t-2 border-slate-900 dark:border-slate-800 pt-8">
                <p className="text-slate-500 max-w-md text-sm">
                  {selectedClass || 'Class'} • {selectedCategory && CATEGORY_LABEL[selectedCategory]}{ideaPrompt ? ` • ${ideaPrompt.slice(0, 60)}${ideaPrompt.length > 60 ? '...' : ''}` : ''}
                </p>
                {generationError === 'AI_KEY_REQUIRED' && (
                  <div className="w-full max-w-md p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl text-amber-800 dark:text-amber-300 text-sm font-medium space-y-3">
                    <p className="flex items-center gap-3"><AlertTriangle className="w-5 h-5 shrink-0" /> You need an AI key to generate a Tech Lab project.</p>
                    <Link href="/profile#ai-provider" className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-xs">
                      Set up your key
                    </Link>
                  </div>
                )}
                {generationError && generationError !== 'AI_KEY_REQUIRED' && (
                  <div className="w-full max-w-md p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl text-red-700 dark:text-red-300 text-sm font-medium flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 shrink-0" /> {generationError}
                  </div>
                )}
                <button
                  onClick={handleGenerate}
                  disabled={!ideaPrompt.trim()}
                  className="btn-brutal px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-full font-display font-medium text-lg flex items-center gap-3 disabled:opacity-50"
                >
                  <Sparkles className="w-6 h-6" /> Build This Project
                </button>
              </div>
            )}

            {isGenerating && (
              <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin"></div>
                  <Sparkles className="w-10 h-10 text-primary-600 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-semibold mb-2">Designing Your Build...</h3>
                  <p className="text-primary-600 dark:text-primary-400 font-medium animate-pulse">Working out materials, steps, code, and simulation links...</p>
                </div>
              </div>
            )}

            {result && <TechProjectResultView result={result} selectedClass={selectedClass} selectedCategory={selectedCategory}
              downloadingPdf={downloadingPdf} pdfError={pdfError}
              onDownloadPdf={handleDownloadPdf} onDownloadMarkdown={handleDownloadMarkdown} onReset={resetAll} />}
          </div>
        )}
      </div>

      {!result && (
        <div className="flex justify-between mt-8 print:hidden">
          <button
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            disabled={currentStep === 1 || isGenerating}
            className="btn-brutal px-6 py-3 bg-white dark:bg-slate-800 rounded-xl font-medium disabled:opacity-50 flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" /> Back
          </button>
          {currentStep < 4 && (
            <button
              onClick={() => setCurrentStep((s) => Math.min(4, s + 1))}
              disabled={!stepValid(currentStep)}
              className="btn-brutal px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold disabled:opacity-50 flex items-center gap-2"
            >
              Next <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {!result && currentStep === 4 && (
        <div className="text-center mt-2">
          <Link href="/tech-lab" className="text-xs text-slate-400 hover:text-primary-600">View saved Tech Lab projects</Link>
        </div>
      )}
    </div>
  );
}

function TechProjectResultView({
  result, selectedClass, selectedCategory, downloadingPdf, pdfError, onDownloadPdf, onDownloadMarkdown, onReset,
}: {
  result: { id: string; generated: GeneratedTechProjectResult };
  selectedClass: string | null;
  selectedCategory: TechProjectCategory | null;
  downloadingPdf: boolean;
  pdfError: string | null;
  onDownloadPdf: () => void;
  onDownloadMarkdown: () => void;
  onReset: () => void;
}) {
  const g = result.generated;
  return (
    <div className="space-y-6">
      <div className="p-6 bg-accent-50 dark:bg-accent-950/30 border-2 border-slate-900 dark:border-accent-800 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent-500 text-white rounded-xl border-2 border-slate-900">
            <Check className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-accent-900 dark:text-accent-200">Project Built & Saved! 🎉</h3>
            <p className="text-sm text-accent-700 dark:text-accent-400">Ready to print, follow, and try in simulation.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <button
            onClick={onDownloadPdf}
            disabled={downloadingPdf}
            className="btn-brutal px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {downloadingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />} PDF
          </button>
          <button
            onClick={onDownloadMarkdown}
            className="btn-brutal px-5 py-2.5 bg-white dark:bg-slate-800 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <FileDown className="w-4 h-4" /> .md
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-700 rounded-xl font-medium text-sm hover:bg-secondary-50 dark:hover:bg-slate-700"
          >
            Build Another
          </button>
        </div>
        {pdfError && <p className="w-full text-xs text-red-600 dark:text-red-400 font-medium">{pdfError}</p>}
      </div>

      <div className="bg-white text-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 print:shadow-none print:border-none print:p-0">
        <div className="flex justify-end items-center gap-1.5 mb-3">
          <Logo size={16} />
          <span className="text-[10px] font-bold text-slate-400 tracking-wide">BOSKET&apos;S EDUSHEET</span>
        </div>
        <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center">
          <h1 className="font-display text-2xl font-semibold uppercase tracking-wide">{g.title}</h1>
          <p className="text-sm font-medium text-slate-600">{selectedClass} • {selectedCategory && CATEGORY_LABEL[selectedCategory]}</p>
        </div>

        <div className="space-y-8 text-sm">
          <div>
            <h4 className="font-bold text-base mb-2">Purpose &amp; Core Idea</h4>
            <p className="text-justify leading-relaxed">{g.purpose}</p>
          </div>

          <div>
            <h4 className="font-bold text-base mb-2">What You&apos;ll Need</h4>
            <ul className="space-y-1.5">
              {g.materials.map((m, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border border-slate-400 rounded-sm shrink-0" /> {m}
                </li>
              ))}
            </ul>
          </div>

          {g.hardwareUpgrade?.available && g.hardwareUpgrade.items.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-[10px] font-bold text-blue-800 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" /> Optional Hardware Upgrade -- not required
              </p>
              <ul className="space-y-1.5">
                {g.hardwareUpgrade.items.map((it, i) => (
                  <li key={i}>
                    <span className="font-semibold">{it.name}</span>{it.approxCostINR ? ` (~${it.approxCostINR})` : ''} — {it.purpose}
                  </li>
                ))}
              </ul>
              {g.hardwareUpgrade.note && <p className="text-xs text-slate-600 mt-2">{g.hardwareUpgrade.note}</p>}
            </div>
          )}

          <div>
            <h4 className="font-bold text-base mb-3">Step-by-Step Build</h4>
            <ol className="space-y-5">
              {g.steps.map((s) => (
                <li key={s.number} className="flex gap-3">
                  <span className="w-7 h-7 rounded-full bg-primary-600 border border-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">{s.number}</span>
                  <div className="pt-0.5 flex-1">
                    <p className="font-semibold mb-1">{s.title}</p>
                    <p className="leading-relaxed">{s.instruction}</p>
                    {s.imageUrl && (
                      <div className="mt-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.imageUrl} alt={s.title} className="max-w-xs rounded-lg border border-slate-200" />
                        <p className="text-[10px] text-amber-700 italic mt-1 max-w-xs">
                          AI-generated illustration — verify against the written steps before wiring or connecting anything.
                        </p>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {g.simulationGuide && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <PlayCircle className="w-3.5 h-3.5" /> Try It in Simulation
              </p>
              <p className="font-semibold">{g.simulationGuide.tool}</p>
              <a href={g.simulationGuide.toolUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline text-xs flex items-center gap-1 mt-0.5">
                {g.simulationGuide.toolUrl} <ExternalLink className="w-3 h-3" />
              </a>
              <p className="mt-2 leading-relaxed">{g.simulationGuide.instructions}</p>
            </div>
          )}

          {g.codeSnippet && (
            <div>
              <h4 className="font-bold text-base mb-2">Code {g.codeLanguage ? `(${g.codeLanguage})` : ''}</h4>
              <pre className="bg-slate-900 text-slate-100 rounded-xl p-4 text-xs overflow-x-auto"><code>{g.codeSnippet}</code></pre>
            </div>
          )}

          {g.troubleshooting.length > 0 && (
            <div>
              <h4 className="font-bold text-base mb-2">Troubleshooting</h4>
              <ul className="space-y-2">
                {g.troubleshooting.map((t, i) => (
                  <li key={i}>
                    <span className="font-semibold">{t.issue}</span> — <span className="text-slate-600">{t.fix}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {g.safetyNotes.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-[10px] font-bold text-red-800 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" /> Safety Notes
              </p>
              <ul className="space-y-1 list-disc list-inside">
                {g.safetyNotes.map((n, i) => <li key={i}>{n}</li>)}
              </ul>
            </div>
          )}

          {g.extensions.length > 0 && (
            <div>
              <h4 className="font-bold text-base mb-2">Go Further</h4>
              <ul className="space-y-1.5 list-disc list-inside">
                {g.extensions.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
