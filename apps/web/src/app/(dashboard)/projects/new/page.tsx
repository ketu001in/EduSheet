'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import {
  fetchBoards, fetchClasses, fetchSubjects, fetchChapters, fetchTopics,
  Board, ClassLevel, Subject, Chapter, Topic,
} from '@/lib/curriculum';
import { downloadProjectPdf, ProjectSection } from '@/lib/project';
import { Logo } from '@/components/Logo';
import {
  ChevronRight, ChevronLeft, Sparkles, Check, Calculator, BookA, Leaf, Languages,
  FlaskConical, Globe, ScrollText, Printer, AlertTriangle, Loader2,
} from 'lucide-react';

function iconForSubject(name: string) {
  const n = name.toLowerCase();
  if (n.includes('math')) return Calculator;
  if (n.includes('science') && !n.includes('social')) return FlaskConical;
  if (n.includes('evs')) return Leaf;
  if (n.includes('social') || n.includes('history') || n.includes('geography') || n.includes('civics')) return Globe;
  if (n.includes('sanskrit')) return ScrollText;
  if (n.includes('hindi')) return Languages;
  return BookA;
}

const LENGTH_OPTIONS = [
  { id: 'short', label: 'Short', hint: '4-5 sections, ~600 words' },
  { id: 'medium', label: 'Medium', hint: '6-8 sections, ~1200 words' },
  { id: 'long', label: 'Long', hint: '8-10 sections, ~2200 words' },
] as const;

interface GeneratedProjectResult {
  id: string;
  title: string;
  sections: ProjectSection[];
  bibliography: string[];
}

export default function NewProjectPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const [boards, setBoards] = useState<Board[]>([]);
  const [classes, setClasses] = useState<ClassLevel[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedProjectResult | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const boardsRes = await fetchBoards();
        setBoards(boardsRes.data);
        const cbse = boardsRes.data.find((b) => b.code === 'CBSE');
        if (cbse) setSelectedBoardId(cbse.id);
      } catch (err) {
        console.error(err);
        setCatalogError('Could not load boards from the server. Is the API running?');
      }
    })();
  }, []);

  // Alternative-pedagogy boards (Montessori/Reggio Emilia/Steiner-Waldorf)
  // have their own age-stage classes scoped to them, not the shared
  // Class 1-12/LKG/UKG list.
  useEffect(() => {
    if (!selectedBoardId) { setClasses([]); return; }
    fetchClasses(selectedBoardId)
      .then((res) => setClasses(res.data))
      .catch((err) => { console.error(err); setClasses([]); });
  }, [selectedBoardId]);

  useEffect(() => {
    if (!selectedClassId || !selectedBoardId) { setSubjects([]); return; }
    setLoadingSubjects(true);
    fetchSubjects(selectedClassId, selectedBoardId)
      .then((res) => setSubjects(res.data))
      .catch((err) => { console.error(err); setSubjects([]); })
      .finally(() => setLoadingSubjects(false));
  }, [selectedClassId, selectedBoardId]);

  useEffect(() => {
    if (!selectedSubjectId) { setChapters([]); return; }
    setLoadingChapters(true);
    fetchChapters(selectedSubjectId)
      .then((res) => setChapters(res.data))
      .catch((err) => { console.error(err); setChapters([]); })
      .finally(() => setLoadingChapters(false));
  }, [selectedSubjectId]);

  useEffect(() => {
    if (!selectedChapterId) { setTopics([]); return; }
    setLoadingTopics(true);
    fetchTopics(selectedChapterId)
      .then((res) => setTopics(res.data))
      .catch((err) => { console.error(err); setTopics([]); })
      .finally(() => setLoadingTopics(false));
  }, [selectedChapterId]);

  const pickBoard = (b: Board) => {
    setSelectedBoardId(b.id);
    setSelectedClassId(null); setSelectedClass(null);
    setSelectedSubjectId(null); setSelectedSubject(null);
    setSelectedChapterId(null); setSelectedChapter(null);
    setSelectedTopicIds([]); setSelectedTopics([]);
  };

  const pickClass = (cls: ClassLevel) => {
    setSelectedClassId(cls.id);
    setSelectedClass(cls.name);
    setSelectedSubjectId(null); setSelectedSubject(null);
    setSelectedChapterId(null); setSelectedChapter(null);
    setSelectedTopicIds([]); setSelectedTopics([]);
  };

  const pickSubject = (subj: Subject) => {
    setSelectedSubjectId(subj.id);
    setSelectedSubject(subj.name);
    setSelectedChapterId(null); setSelectedChapter(null);
    setSelectedTopicIds([]); setSelectedTopics([]);
  };

  const pickChapter = (chap: Chapter) => {
    setSelectedChapterId(chap.id);
    setSelectedChapter(chap.title);
    setSelectedTopicIds([]); setSelectedTopics([]);
  };

  const toggleTopic = (topic: Topic) => {
    const isSelected = selectedTopicIds.includes(topic.id);
    if (isSelected) {
      setSelectedTopicIds(selectedTopicIds.filter((id) => id !== topic.id));
      setSelectedTopics(selectedTopics.filter((t) => t !== topic.title));
    } else {
      setSelectedTopicIds([...selectedTopicIds, topic.id]);
      setSelectedTopics([...selectedTopics, topic.title]);
    }
  };

  const stepValid = (step: number) => {
    if (step === 1) return !!selectedBoardId;
    if (step === 2) return !!selectedClassId;
    if (step === 3) return !!selectedSubjectId;
    if (step === 4) return !!selectedChapterId;
    return true;
  };

  const effectiveTopics = selectedTopics.length > 0 ? selectedTopics : (selectedChapter ? [selectedChapter] : []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const res = await api.post<{ success: boolean; data: { project: any; sections: ProjectSection[]; bibliography: string[] } }>(
        '/api/projects/generate',
        {
          board: boards.find((b) => b.id === selectedBoardId)?.name,
          classId: selectedClassId,
          className: selectedClass || 'Class 5',
          subjectId: selectedSubjectId,
          subjectName: selectedSubject || 'Science',
          chapterId: selectedChapterId || undefined,
          chapterName: selectedChapter || undefined,
          topicIds: selectedTopicIds,
          topics: effectiveTopics,
          length,
        }
      );

      const { project, sections, bibliography } = res.data;
      setResult({ id: project.id, title: project.title, sections, bibliography });
    } catch (err: any) {
      console.error('Project generation error:', err);
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
      await downloadProjectPdf(result.id);
    } catch (err) {
      console.error('Failed to open PDF:', err);
      setPdfError('The PDF isn\'t ready yet — it finishes shortly after generation. Try again in a few seconds.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const resetAll = () => {
    setCurrentStep(1);
    setSelectedClassId(null); setSelectedClass(null);
    setSelectedSubjectId(null); setSelectedSubject(null);
    setSelectedChapterId(null); setSelectedChapter(null);
    setSelectedTopicIds([]); setSelectedTopics([]);
    setLength('medium');
    setResult(null);
    setGenerationError(null);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 select-none">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold mb-2">Create Project / Assignment</h1>
        <p className="text-slate-500">Generate a written project report — objective, content sections, conclusion, and bibliography — ready to submit.</p>
      </div>

      {catalogError && (
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-2xl text-amber-800 dark:text-amber-300 text-sm font-medium flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" /> {catalogError}
        </div>
      )}

      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 right-0 top-1/2 h-1 bg-slate-200 dark:bg-slate-800 -z-10 -translate-y-1/2"></div>
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 border-slate-900 dark:border-slate-700 ${currentStep >= step ? 'bg-primary-600 text-white shadow-[3px_3px_0_var(--color-ink)]' : 'bg-surface-light dark:bg-surface-dark text-slate-400'}`}>
            {step}
          </div>
        ))}
      </div>

      <div className="glass-card p-6 md:p-8 rounded-3xl min-h-[400px]">
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-bold mb-6">Select Board</h2>
            <div className="grid grid-cols-2 gap-4">
              {boards.length === 0 && !catalogError && (
                <div className="col-span-2 text-sm text-slate-400 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading boards...</div>
              )}
              {boards.map((b) => (
                <button
                  key={b.id}
                  disabled={!b.is_active}
                  onClick={() => pickBoard(b)}
                  className={`p-6 border-2 border-slate-900 dark:border-slate-700 rounded-2xl text-center transition-all ${
                    !b.is_active
                      ? 'bg-surface-light dark:bg-surface-dark opacity-50 cursor-not-allowed'
                      : selectedBoardId === b.id
                      ? 'bg-primary-600 shadow-[4px_4px_0_var(--color-ink)]'
                      : 'bg-surface-light dark:bg-surface-dark hover:shadow-[4px_4px_0_var(--color-ink)]'
                  }`}
                >
                  <span className={`block text-2xl font-bold ${selectedBoardId === b.id ? 'text-white' : ''}`}>{b.code}</span>
                  <span className={`text-sm ${selectedBoardId === b.id ? 'text-primary-50' : 'text-slate-500'}`}>{b.is_active ? b.name : 'Coming Soon'}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-bold mb-2">{classes[0]?.board_id ? 'Select Stage' : 'Select Class'}</h2>
            <p className="text-slate-500 text-sm mb-6">
              {classes[0]?.board_id ? 'Choose the developmental stage for the project.' : 'Choose the grade level for the project.'}
            </p>
            {classes[0]?.board_id ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {classes.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => pickClass(cls)}
                    className={`p-4 rounded-2xl text-left transition-all ${
                      selectedClassId === cls.id
                        ? 'border-2 border-slate-900 bg-primary-600 text-white shadow-[4px_4px_0_var(--color-ink)] font-bold'
                        : 'border-2 border-slate-900 dark:border-slate-700 bg-surface-light dark:bg-surface-dark hover:-translate-y-1 hover:shadow-[4px_4px_0_var(--color-ink)]'
                    }`}
                  >
                    <span className={`block font-bold ${selectedClassId === cls.id ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                      {cls.name}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
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
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-bold mb-2">Select Subject</h2>
            <p className="text-slate-500 text-sm mb-6">Choose the subject for {selectedClass || 'your class'}.</p>
            {loadingSubjects && (
              <div className="text-sm text-slate-400 flex items-center gap-2 py-8 justify-center"><Loader2 className="w-4 h-4 animate-spin" /> Loading subjects...</div>
            )}
            {!loadingSubjects && subjects.length === 0 && (
              <div className="text-sm text-slate-400 py-8 text-center">No subjects are set up yet for this class/board combination.</div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {subjects.map((sub) => {
                const Icon = iconForSubject(sub.name);
                return (
                  <button
                    key={sub.id}
                    onClick={() => pickSubject(sub)}
                    className={`p-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${
                      selectedSubjectId === sub.id
                        ? 'border-2 border-slate-900 bg-primary-600 text-white scale-105 shadow-[4px_4px_0_var(--color-ink)] font-bold'
                        : 'border-2 border-slate-900 dark:border-slate-700 bg-surface-light dark:bg-surface-dark hover:-translate-y-1 hover:shadow-[4px_4px_0_var(--color-ink)]'
                    }`}
                  >
                    <Icon className={`w-8 h-8 ${selectedSubjectId === sub.id ? 'text-white' : 'text-slate-500'}`} />
                    <span className="font-semibold text-center">{sub.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-bold mb-2">Select Chapter</h2>
            <p className="text-slate-500 text-sm mb-6">Choose a chapter from {selectedSubject || 'your subject'}.</p>
            {loadingChapters && (
              <div className="text-sm text-slate-400 flex items-center gap-2 py-8 justify-center"><Loader2 className="w-4 h-4 animate-spin" /> Loading chapters...</div>
            )}
            {!loadingChapters && chapters.length === 0 && (
              <div className="text-sm text-slate-400 py-8 text-center">No chapters are available yet for this subject.</div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {chapters.map((chap) => (
                <button
                  key={chap.id}
                  onClick={() => pickChapter(chap)}
                  className={`p-4 rounded-2xl text-left transition-all flex items-center gap-4 ${
                    selectedChapterId === chap.id
                      ? 'border-2 border-slate-900 bg-primary-600 text-white shadow-[4px_4px_0_var(--color-ink)] font-bold'
                      : 'border-2 border-slate-900 dark:border-slate-700 bg-surface-light dark:bg-surface-dark hover:-translate-y-1 hover:shadow-[4px_4px_0_var(--color-ink)]'
                  }`}
                >
                  <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-bold ${
                    selectedChapterId === chap.id ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {chap.chapter_number}
                  </div>
                  <span className="font-semibold text-sm">{chap.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {!result && (
              <>
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">Select Topics</h2>
                      <p className="text-slate-500 text-sm">Choose specific topics to focus the project on (optional).</p>
                    </div>
                    {topics.length > 0 && (
                      <button
                        onClick={() => {
                          if (selectedTopicIds.length === topics.length) {
                            setSelectedTopicIds([]); setSelectedTopics([]);
                          } else {
                            setSelectedTopicIds(topics.map((t) => t.id));
                            setSelectedTopics(topics.map((t) => t.title));
                          }
                        }}
                        className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                      >
                        {selectedTopicIds.length === topics.length ? 'Deselect All' : 'Select All'}
                      </button>
                    )}
                  </div>
                  {loadingTopics && (
                    <div className="text-sm text-slate-400 flex items-center gap-2 py-4"><Loader2 className="w-4 h-4 animate-spin" /> Loading topics...</div>
                  )}
                  {!loadingTopics && topics.length === 0 && (
                    <div className="text-sm text-slate-400 py-4">No specific topics listed for this chapter &mdash; the AI will cover the chapter as a whole.</div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {topics.map((topic) => {
                      const isSelected = selectedTopicIds.includes(topic.id);
                      return (
                        <label
                          key={topic.id}
                          className={`p-3 rounded-xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-slate-900 bg-primary-50 dark:bg-primary-900/20 font-bold shadow-[3px_3px_0_var(--color-ink)]'
                              : 'border-slate-900 dark:border-slate-700 bg-surface-light dark:bg-surface-dark hover:shadow-[3px_3px_0_var(--color-ink)]'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border ${
                            isSelected ? 'bg-primary-600 border-primary-600 text-white' : 'border-slate-300 dark:border-slate-600'
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <span className="font-medium text-sm">{topic.title}</span>
                          <input type="checkbox" className="hidden" checked={isSelected} onChange={() => toggleTopic(topic)} />
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t-2 border-slate-900 dark:border-slate-800 pt-8">
                  <h2 className="font-display text-2xl font-semibold mb-1">Project Length</h2>
                  <p className="text-slate-500 text-sm mb-6">How in-depth should the report be?</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {LENGTH_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setLength(opt.id)}
                        className={`p-4 rounded-xl border-2 border-slate-900 dark:border-slate-700 text-center transition-all ${
                          length === opt.id
                            ? 'bg-primary-600 text-white font-bold shadow-[3px_3px_0_var(--color-ink)]'
                            : 'bg-surface-light dark:bg-surface-dark hover:shadow-[3px_3px_0_var(--color-ink)]'
                        }`}
                      >
                        <span className="block text-sm font-bold">{opt.label}</span>
                        <span className={`block text-xs mt-1 ${length === opt.id ? 'text-primary-100' : 'text-slate-500'}`}>{opt.hint}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {!isGenerating && !result && (
              <div className="flex flex-col items-center justify-center py-8 space-y-6 text-center border-t-2 border-slate-900 dark:border-slate-800 pt-8">
                <p className="text-slate-500 max-w-md text-sm">
                  {selectedClass || 'Class'} • {selectedSubject} • {selectedChapter}
                </p>
                {generationError === 'AI_KEY_REQUIRED' && (
                  <div className="w-full max-w-md p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl text-amber-800 dark:text-amber-300 text-sm font-medium space-y-3">
                    <p className="flex items-center gap-3"><AlertTriangle className="w-5 h-5 shrink-0" /> You need an AI key to generate projects.</p>
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
                  className="btn-brutal px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-full font-display font-medium text-lg flex items-center gap-3"
                >
                  <Sparkles className="w-6 h-6" /> Generate Project Report
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
                  <h3 className="font-display text-2xl font-semibold mb-2">Writing Your Project Report...</h3>
                  <p className="text-primary-600 dark:text-primary-400 font-medium animate-pulse">Asking your AI provider to draft the report...</p>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                <div className="p-6 bg-accent-50 dark:bg-accent-950/30 border-2 border-slate-900 dark:border-accent-800 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-accent-500 text-white rounded-xl border-2 border-slate-900">
                      <Check className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-accent-900 dark:text-accent-200">Project Generated & Saved! 🎉</h3>
                      <p className="text-sm text-accent-700 dark:text-accent-400">Your AI-drafted project report is ready to print & download.</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <button
                      onClick={handleDownloadPdf}
                      disabled={downloadingPdf}
                      className="btn-brutal px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {downloadingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />} Download PDF
                    </button>
                    <button
                      onClick={resetAll}
                      className="px-4 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-700 rounded-xl font-medium text-sm hover:bg-secondary-50 dark:hover:bg-slate-700"
                    >
                      Create Another
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
                    <h1 className="text-2xl font-bold uppercase tracking-wide">{result.title}</h1>
                    <p className="text-sm font-medium text-slate-600">{selectedSubject} • Chapter: {selectedChapter}</p>
                    <div className="flex justify-between items-center text-xs mt-4 pt-2 border-t border-slate-200">
                      <span>Name: ________________________</span>
                      <span>Class: {selectedClass}</span>
                    </div>
                  </div>

                  <div className="space-y-6 text-sm">
                    {result.sections.map((sec, idx) => (
                      <div key={idx} className="space-y-2">
                        <h4 className="font-bold text-base">{sec.heading}</h4>
                        <p className="text-justify leading-relaxed">{sec.content}</p>
                      </div>
                    ))}
                    {result.bibliography.length > 0 && (
                      <div className="space-y-2 border-t border-slate-200 pt-4">
                        <h4 className="font-bold text-base">Bibliography</h4>
                        {result.bibliography.map((b, idx) => (
                          <p key={idx}>{idx + 1}. {b}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
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
          {currentStep < 5 && (
            <button
              onClick={() => setCurrentStep((s) => Math.min(5, s + 1))}
              disabled={!stepValid(currentStep)}
              className="btn-brutal px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold disabled:opacity-50 flex items-center gap-2"
            >
              Next <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {!result && currentStep === 5 && (
        <div className="text-center mt-2">
          <Link href="/projects" className="text-xs text-slate-400 hover:text-primary-600">View saved projects</Link>
        </div>
      )}
    </div>
  );
}
