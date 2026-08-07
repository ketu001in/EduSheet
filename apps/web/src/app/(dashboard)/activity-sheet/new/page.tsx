'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import {
  fetchBoards, fetchClasses, fetchSubjects, fetchChapters, fetchTopics,
  Board, ClassLevel, Subject, Chapter, Topic,
} from '@/lib/curriculum';
import { downloadActivitySheetPdf, activitySheetToMarkdown } from '@/lib/activitySheet';
import { downloadMarkdownFile } from '@/lib/studyMaterial';
import { Logo } from '@/components/Logo';
import RoleGate from '@/components/RoleGate';
import {
  ChevronRight, ChevronLeft, Sparkles, Check, Calculator, BookA, Leaf, Languages,
  FlaskConical, Globe, ScrollText, Printer, AlertTriangle, Loader2, FileDown,
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

interface GeneratedActivitySheetResult {
  id: string;
  title: string;
  materials: string[];
  steps: string[];
  reflectionQuestions: string[];
  facilitationNotes: string;
}

export default function NewActivitySheetPage() {
  return (
    <RoleGate allow={['teacher', 'parent']}>
      <Suspense fallback={
        <div className="max-w-4xl mx-auto py-24 flex items-center justify-center gap-2 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading...
        </div>
      }>
        <NewActivitySheetPageContent />
      </Suspense>
    </RoleGate>
  );
}

function NewActivitySheetPageContent() {
  const searchParams = useSearchParams();

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

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedActivitySheetResult | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Prefill shortcut from the Study Material screen's "Generate Activity
  // Sheet" button -- if class/subject/chapter arrive via query params, skip
  // straight to the final step instead of re-walking the picker. The caller
  // resolves boardId from the subject's own board_id (subjects, unlike
  // classes, always belong to exactly one board -- CBSE Class 5 has "EVS",
  // ICSE Class 5 has "Science" instead, as entirely different subject rows,
  // so getting the board wrong means the subject/chapter lookup below will
  // never match). boardId falls back to CBSE only for a genuinely fresh
  // visit with no prefill params at all.
  const prefillApplied = !!(searchParams.get('classId') && searchParams.get('subjectId') && searchParams.get('chapterId'));

  useEffect(() => {
    (async () => {
      try {
        const boardsRes = await fetchBoards();
        setBoards(boardsRes.data);
        const boardIdParam = searchParams.get('boardId');
        if (boardIdParam) {
          setSelectedBoardId(boardIdParam);
        } else {
          const cbse = boardsRes.data.find((b) => b.code === 'CBSE');
          if (cbse) setSelectedBoardId(cbse.id);
        }
      } catch (err) {
        console.error(err);
        setCatalogError('Could not load boards from the server. Is the API running?');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedBoardId) { setClasses([]); return; }
    fetchClasses(selectedBoardId)
      .then((res) => {
        setClasses(res.data);
        if (prefillApplied) {
          const classId = searchParams.get('classId')!;
          const cls = res.data.find((c) => c.id === classId);
          if (cls) { setSelectedClassId(cls.id); setSelectedClass(cls.name); }
        }
      })
      .catch((err) => { console.error(err); setClasses([]); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBoardId]);

  useEffect(() => {
    if (!selectedClassId || !selectedBoardId) { setSubjects([]); return; }
    setLoadingSubjects(true);
    fetchSubjects(selectedClassId, selectedBoardId)
      .then((res) => {
        setSubjects(res.data);
        if (prefillApplied) {
          const subjectId = searchParams.get('subjectId')!;
          const subj = res.data.find((s) => s.id === subjectId);
          if (subj) { setSelectedSubjectId(subj.id); setSelectedSubject(subj.name); }
        }
      })
      .catch((err) => { console.error(err); setSubjects([]); })
      .finally(() => setLoadingSubjects(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClassId, selectedBoardId]);

  useEffect(() => {
    if (!selectedSubjectId) { setChapters([]); return; }
    setLoadingChapters(true);
    fetchChapters(selectedSubjectId)
      .then((res) => {
        setChapters(res.data);
        if (prefillApplied) {
          const chapterId = searchParams.get('chapterId')!;
          const chap = res.data.find((c) => c.id === chapterId);
          if (chap) {
            setSelectedChapterId(chap.id);
            setSelectedChapter(chap.title);
            const topicIdsParam = searchParams.get('topicIds');
            const topicsParam = searchParams.get('topics');
            if (topicIdsParam && topicsParam) {
              setSelectedTopicIds(topicIdsParam.split('|').filter(Boolean));
              setSelectedTopics(topicsParam.split('|').filter(Boolean));
            }
            setCurrentStep(5);
          }
        }
      })
      .catch((err) => { console.error(err); setChapters([]); })
      .finally(() => setLoadingChapters(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const res = await api.post<{ success: boolean; data: { activitySheet: any; materials: string[]; steps: string[]; reflectionQuestions: string[]; facilitationNotes: string } }>(
        '/api/activity-sheets/generate',
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
        }
      );

      const { activitySheet, materials, steps, reflectionQuestions, facilitationNotes } = res.data;
      setResult({ id: activitySheet.id, title: activitySheet.title, materials, steps, reflectionQuestions, facilitationNotes });
    } catch (err: any) {
      console.error('Activity sheet generation error:', err);
      setGenerationError(err.message || 'Error generating activity sheet. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!result) return;
    setPdfError(null);
    setDownloadingPdf(true);
    try {
      await downloadActivitySheetPdf(result.id);
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
      `${result.title.replace(/[^a-z0-9]+/gi, '-')}.md`,
      activitySheetToMarkdown(result.title, result.materials, result.steps, result.reflectionQuestions, result.facilitationNotes)
    );
  };

  const resetAll = () => {
    setCurrentStep(1);
    setSelectedClassId(null); setSelectedClass(null);
    setSelectedSubjectId(null); setSelectedSubject(null);
    setSelectedChapterId(null); setSelectedChapter(null);
    setSelectedTopicIds([]); setSelectedTopics([]);
    setResult(null);
    setGenerationError(null);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 select-none">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold mb-2">Create Activity Sheet</h1>
        <p className="text-slate-500">Generate a hands-on activity for your student -- materials, step-by-step instructions, and reflection questions -- plus a short guide for you.</p>
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
            <h2 className="font-display text-2xl font-semibold mb-6">Select Board</h2>
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
                  <span className={`block font-display text-2xl font-semibold ${selectedBoardId === b.id ? 'text-white' : ''}`}>{b.code}</span>
                  <span className={`text-sm ${selectedBoardId === b.id ? 'text-primary-50' : 'text-slate-500'}`}>{b.is_active ? b.name : 'Coming Soon'}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="font-display text-2xl font-semibold mb-2">{classes[0]?.board_id ? 'Select Stage' : 'Select Class'}</h2>
            <p className="text-slate-500 text-sm mb-6">
              {classes[0]?.board_id ? 'Choose the developmental stage for this activity.' : 'Choose the grade level for this activity.'}
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
            <h2 className="font-display text-2xl font-semibold mb-2">Select Subject</h2>
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
            <h2 className="font-display text-2xl font-semibold mb-2">Select Chapter</h2>
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
              <div>
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h2 className="font-display text-2xl font-semibold mb-1">Select Topics</h2>
                    <p className="text-slate-500 text-sm">Choose specific topics to focus the activity on (optional).</p>
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
            )}

            {!isGenerating && !result && (
              <div className="flex flex-col items-center justify-center py-8 space-y-6 text-center border-t-2 border-slate-900 dark:border-slate-800 pt-8">
                <p className="text-slate-500 max-w-md text-sm">
                  {selectedClass || 'Class'} • {selectedSubject} • {selectedChapter}
                </p>
                {generationError === 'AI_KEY_REQUIRED' && (
                  <div className="w-full max-w-md p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl text-amber-800 dark:text-amber-300 text-sm font-medium space-y-3">
                    <p className="flex items-center gap-3"><AlertTriangle className="w-5 h-5 shrink-0" /> You need an AI key to generate an activity sheet.</p>
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
                  <Sparkles className="w-6 h-6" /> Generate Activity Sheet
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
                  <h3 className="font-display text-2xl font-semibold mb-2">Designing Your Activity...</h3>
                  <p className="text-primary-600 dark:text-primary-400 font-medium animate-pulse">Working out materials, steps, and reflection questions...</p>
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
                      <h3 className="font-display text-lg font-semibold text-accent-900 dark:text-accent-200">Activity Sheet Generated & Saved! 🎉</h3>
                      <p className="text-sm text-accent-700 dark:text-accent-400">Ready to print and hand to your student.</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <button
                      onClick={handleDownloadPdf}
                      disabled={downloadingPdf}
                      className="btn-brutal px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {downloadingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />} PDF
                    </button>
                    <button
                      onClick={handleDownloadMarkdown}
                      className="btn-brutal px-5 py-2.5 bg-white dark:bg-slate-800 rounded-xl font-bold flex items-center justify-center gap-2"
                    >
                      <FileDown className="w-4 h-4" /> .md
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
                    <h1 className="font-display text-2xl font-semibold uppercase tracking-wide">{result.title}</h1>
                    <p className="text-sm font-medium text-slate-600">{selectedSubject} • Chapter: {selectedChapter}</p>
                  </div>

                  <div className="space-y-6 text-sm">
                    <div>
                      <h4 className="font-bold text-base mb-2">What You&apos;ll Need</h4>
                      <ul className="space-y-1.5">
                        {result.materials.map((m, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 border border-slate-400 rounded-sm shrink-0" /> {m}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-base mb-2">What To Do</h4>
                      <ol className="space-y-2">
                        {result.steps.map((s, i) => (
                          <li key={i} className="flex gap-3">
                            <span className="w-6 h-6 rounded-full bg-primary-600 border border-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                            <span className="pt-0.5">{s}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    {result.reflectionQuestions.length > 0 && (
                      <div>
                        <h4 className="font-bold text-base mb-2">Think About It</h4>
                        <ul className="space-y-1.5 list-disc list-inside">
                          {result.reflectionQuestions.map((q, i) => <li key={i}>{q}</li>)}
                        </ul>
                      </div>
                    )}
                    {result.facilitationNotes && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wide mb-1.5">For the Grown-Up Running This Activity</p>
                        <p className="text-justify leading-relaxed">{result.facilitationNotes}</p>
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
          <Link href="/activity-sheet" className="text-xs text-slate-400 hover:text-primary-600">View saved activity sheets</Link>
        </div>
      )}
    </div>
  );
}
