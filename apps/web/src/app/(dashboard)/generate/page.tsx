'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWizardStore } from '@/store/useWizardStore';
import { useWorksheetStore, SavedWorksheet } from '@/store/useWorksheetStore';
import { api } from '@/lib/api';
import {
  fetchBoards, fetchClasses, fetchSubjects, fetchChapters, fetchTopics,
  Board, ClassLevel, Subject, Chapter, Topic,
} from '@/lib/curriculum';
import { QUESTION_TYPE_OPTIONS, SavedSection, downloadWorksheetPdf, downloadAnswerKeyPdf } from '@/lib/worksheet';
import { Logo } from '@/components/Logo';
import { DiagramPreview, ColoringSheetPreview, TracingPreview, MatchPreview } from '@/components/DiagramPreview';
import {
  ChevronRight, ChevronLeft, Sparkles, Check, Calculator, BookA, Leaf, Languages,
  FlaskConical, Globe, ScrollText, Printer, Heart, AlertTriangle, Loader2,
} from 'lucide-react';

function iconForSubject(name: string) {
  const n = name.toLowerCase();
  if (n.includes('math')) return Calculator;
  if (n.includes('science') && !n.includes('social')) return FlaskConical;
  if (n.includes('evs')) return Leaf;
  if (n.includes('social')) return Globe;
  if (n.includes('sanskrit')) return ScrollText;
  if (n.includes('hindi')) return Languages;
  return BookA;
}

export default function GeneratePage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState('Consulting CBSE Standards...');
  const [generatedWorksheet, setGeneratedWorksheet] = useState<SavedWorksheet | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState<'worksheet' | 'answer-key' | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const [boards, setBoards] = useState<Board[]>([]);
  const [classes, setClasses] = useState<ClassLevel[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  const { addWorksheet, toggleFavorite } = useWorksheetStore();
  const {
    currentStep, selectedBoardId, selectedBoard, selectedClassId, selectedClass,
    selectedSubjectId, selectedSubject, selectedChapterId, selectedChapter,
    selectedTopicIds, selectedTopics, worksheetSettings,
    setField, setSettings, nextStep, prevStep, reset,
  } = useWizardStore();

  // Load boards + classes once.
  useEffect(() => {
    (async () => {
      try {
        const [boardsRes, classesRes] = await Promise.all([fetchBoards(), fetchClasses()]);
        setBoards(boardsRes.data);
        setClasses(classesRes.data);
        const cbse = boardsRes.data.find((b) => b.code === 'CBSE');
        if (cbse && !selectedBoardId) {
          setField('selectedBoardId', cbse.id);
          setField('selectedBoard', cbse.name);
        }
      } catch (err) {
        console.error(err);
        setCatalogError('Could not load boards/classes from the server. Is the API running?');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load subjects whenever class or board changes.
  useEffect(() => {
    if (!selectedClassId || !selectedBoardId) { setSubjects([]); return; }
    setLoadingSubjects(true);
    fetchSubjects(selectedClassId, selectedBoardId)
      .then((res) => setSubjects(res.data))
      .catch((err) => { console.error(err); setSubjects([]); })
      .finally(() => setLoadingSubjects(false));
  }, [selectedClassId, selectedBoardId]);

  // Load chapters whenever subject changes.
  useEffect(() => {
    if (!selectedSubjectId) { setChapters([]); return; }
    setLoadingChapters(true);
    fetchChapters(selectedSubjectId)
      .then((res) => setChapters(res.data))
      .catch((err) => { console.error(err); setChapters([]); })
      .finally(() => setLoadingChapters(false));
  }, [selectedSubjectId]);

  // Load topics whenever chapter changes.
  useEffect(() => {
    if (!selectedChapterId) { setTopics([]); return; }
    setLoadingTopics(true);
    fetchTopics(selectedChapterId)
      .then((res) => setTopics(res.data))
      .catch((err) => { console.error(err); setTopics([]); })
      .finally(() => setLoadingTopics(false));
  }, [selectedChapterId]);

  const pickClass = (cls: ClassLevel) => {
    setField('selectedClassId', cls.id);
    setField('selectedClass', cls.name);
    setField('selectedSubjectId', null);
    setField('selectedSubject', null);
    setField('selectedChapterId', null);
    setField('selectedChapter', null);
    setField('selectedTopicIds', []);
    setField('selectedTopics', []);
  };

  const pickSubject = (subj: Subject) => {
    setField('selectedSubjectId', subj.id);
    setField('selectedSubject', subj.name);
    setField('selectedChapterId', null);
    setField('selectedChapter', null);
    setField('selectedTopicIds', []);
    setField('selectedTopics', []);
  };

  const pickChapter = (chap: Chapter) => {
    setField('selectedChapterId', chap.id);
    setField('selectedChapter', chap.title);
    setField('selectedTopicIds', []);
    setField('selectedTopics', []);
  };

  const toggleTopic = (topic: Topic) => {
    const isSelected = selectedTopicIds.includes(topic.id);
    if (isSelected) {
      setField('selectedTopicIds', selectedTopicIds.filter((id) => id !== topic.id));
      setField('selectedTopics', selectedTopics.filter((t) => t !== topic.title));
    } else {
      setField('selectedTopicIds', [...selectedTopicIds, topic.id]);
      setField('selectedTopics', [...selectedTopics, topic.title]);
    }
  };

  const toggleQuestionType = (key: string) => {
    const current = worksheetSettings.questionTypes;
    if (current.includes(key)) {
      if (current.length === 1) return; // keep at least one selected
      setSettings({ questionTypes: current.filter((t) => t !== key) });
    } else {
      setSettings({ questionTypes: [...current, key] });
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    setGenerationStatus('Asking your AI provider to craft custom questions...');

    try {
      const res = await api.post<{ success: boolean; data: { worksheet: any; sections: SavedSection[] } }>(
        '/api/worksheets/generate',
        {
          board: selectedBoard || 'CBSE',
          classId: selectedClassId,
          className: selectedClass || 'Class 5',
          subjectId: selectedSubjectId,
          subjectName: selectedSubject || 'Mathematics',
          chapterId: selectedChapterId || undefined,
          chapterName: selectedChapter || undefined,
          topicIds: selectedTopicIds,
          topics: selectedTopics,
          difficulty: worksheetSettings.difficulty,
          questionCount: worksheetSettings.questionCount,
          questionTypes: worksheetSettings.questionTypes,
        }
      );

      const { worksheet, sections } = res.data;
      const saved: SavedWorksheet = {
        id: worksheet.id,
        title: worksheet.title,
        board: selectedBoard || 'CBSE',
        class: selectedClass || '',
        subject: selectedSubject || '',
        chapter: selectedChapter || '',
        topics: selectedTopics,
        difficulty: worksheetSettings.difficulty,
        questionCount: worksheet.question_count,
        totalMarks: worksheet.total_marks,
        timeLimitMinutes: worksheet.time_limit_minutes || undefined,
        sections,
        createdAt: worksheet.created_at,
        isFavorite: false,
      };

      addWorksheet(saved);
      setGeneratedWorksheet(saved);
    } catch (err: any) {
      console.error('Generation Error:', err);
      setGenerationError(err.message || 'Error generating worksheet. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPdf = async (worksheetId: string, kind: 'worksheet' | 'answer-key') => {
    setPdfError(null);
    setDownloadingPdf(kind);
    try {
      if (kind === 'worksheet') await downloadWorksheetPdf(worksheetId);
      else await downloadAnswerKeyPdf(worksheetId);
    } catch (err: any) {
      console.error('Failed to open PDF:', err);
      setPdfError('The PDF isn\'t ready yet — it finishes shortly after generation. Try again in a few seconds.');
    } finally {
      setDownloadingPdf(null);
    }
  };

  const stepValid = (step: number) => {
    if (step === 1) return !!selectedBoardId;
    if (step === 2) return !!selectedClassId;
    if (step === 3) return !!selectedSubjectId;
    if (step === 4) return !!selectedChapterId;
    return true;
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 select-none">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Worksheet</h1>
        <p className="text-slate-500">Design a custom learning experience in seconds using your own AI key.</p>
      </div>

      {catalogError && (
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-2xl text-amber-800 dark:text-amber-300 text-sm font-medium flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" /> {catalogError}
        </div>
      )}

      {/* Stepper */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 right-0 top-1/2 h-1 bg-slate-200 dark:bg-slate-800 -z-10 -translate-y-1/2"></div>
        {[1, 2, 3, 4, 5, 6].map((step) => (
          <div key={step} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${currentStep >= step ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'bg-surface-light dark:bg-surface-dark border-2 border-slate-200 dark:border-slate-800 text-slate-400'}`}>
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
                  onClick={() => { setField('selectedBoardId', b.id); setField('selectedBoard', b.name); }}
                  className={`p-6 border-2 rounded-2xl text-center transition-all shadow-md ${
                    !b.is_active
                      ? 'border-slate-200 dark:border-slate-800 bg-surface-light dark:bg-surface-dark opacity-50 cursor-not-allowed'
                      : selectedBoardId === b.id
                      ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/40'
                      : 'border-slate-200 dark:border-slate-800 bg-surface-light dark:bg-surface-dark hover:border-primary-300'
                  }`}
                >
                  <span className={`block text-2xl font-bold ${selectedBoardId === b.id ? 'text-primary-700 dark:text-primary-300' : ''}`}>{b.code}</span>
                  <span className={`text-sm ${selectedBoardId === b.id ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500'}`}>{b.is_active ? b.name : 'Coming Soon'}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-bold mb-2">Select Class</h2>
            <p className="text-slate-500 text-sm mb-6">Choose the grade level for the worksheet.</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {classes.map((cls) => (
                <button
                  key={cls.id}
                  onClick={() => pickClass(cls)}
                  className={`p-4 rounded-2xl text-center transition-all ${
                    selectedClassId === cls.id
                      ? 'border-2 border-primary-500 bg-primary-50/50 dark:bg-primary-900/20 scale-105 shadow-md font-bold'
                      : 'border border-slate-200 dark:border-slate-800 bg-surface-light dark:bg-surface-dark hover:-translate-y-1 hover:border-primary-300'
                  }`}
                >
                  <span className={`block font-bold ${selectedClassId === cls.id ? 'text-primary-600 dark:text-primary-400 text-xl' : 'text-slate-700 dark:text-slate-300'}`}>
                    {cls.grade_number > 0 ? cls.grade_number : cls.name}
                  </span>
                  {cls.grade_number > 0 && <span className="text-xs text-slate-500 block">Class</span>}
                </button>
              ))}
            </div>
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
                        ? 'border-2 border-primary-500 bg-primary-50/50 dark:bg-primary-900/20 scale-105 shadow-md font-bold'
                        : 'border border-slate-200 dark:border-slate-800 bg-surface-light dark:bg-surface-dark hover:-translate-y-1 hover:border-primary-300'
                    }`}
                  >
                    <Icon className={`w-8 h-8 ${selectedSubjectId === sub.id ? 'text-primary-500' : 'text-slate-500'}`} />
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
                      ? 'border-2 border-primary-500 bg-primary-50/50 dark:bg-primary-900/20 shadow-md font-bold'
                      : 'border border-slate-200 dark:border-slate-800 bg-surface-light dark:bg-surface-dark hover:-translate-y-1 hover:border-primary-300'
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
            <div>
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Select Topics</h2>
                  <p className="text-slate-500 text-sm">Choose specific topics to include (optional).</p>
                </div>
                {topics.length > 0 && (
                  <button
                    onClick={() => {
                      if (selectedTopicIds.length === topics.length) {
                        setField('selectedTopicIds', []);
                        setField('selectedTopics', []);
                      } else {
                        setField('selectedTopicIds', topics.map((t) => t.id));
                        setField('selectedTopics', topics.map((t) => t.title));
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
                      className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20 font-bold'
                          : 'border-slate-200 dark:border-slate-800 bg-surface-light dark:bg-surface-dark hover:border-primary-300'
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

            <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
              <h2 className="text-2xl font-bold mb-1">Worksheet Settings</h2>
              <p className="text-slate-500 text-sm mb-6">Customize difficulty, question types, and format.</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3">Difficulty Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'easy', label: 'Easy', emoji: '😊' },
                      { id: 'medium', label: 'Medium', emoji: '🤔' },
                      { id: 'hard', label: 'Challenging', emoji: '🤯' },
                    ].map((diff) => (
                      <button
                        key={diff.id}
                        onClick={() => setSettings({ difficulty: diff.id as any })}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          worksheetSettings.difficulty === diff.id
                            ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20 font-bold shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-surface-light dark:bg-surface-dark hover:border-primary-300'
                        }`}
                      >
                        <span className="block text-xl mb-1">{diff.emoji}</span>
                        <span className="font-medium text-sm capitalize">{diff.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Number of Questions</label>
                  <div className="flex flex-wrap gap-3">
                    {[5, 10, 15, 20, 30].map((count) => (
                      <button
                        key={count}
                        onClick={() => setSettings({ questionCount: count })}
                        className={`px-5 py-2.5 rounded-xl border font-bold text-sm transition-all ${
                          worksheetSettings.questionCount === count
                            ? 'border-primary-600 bg-primary-600 text-white shadow-md'
                            : 'border-slate-200 dark:border-slate-800 bg-surface-light dark:bg-surface-dark hover:border-primary-300'
                        }`}
                      >
                        {count} Questions
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Question Types <span className="text-slate-400 font-normal">(select at least one)</span></label>
                  <div className="flex flex-wrap gap-2">
                    {QUESTION_TYPE_OPTIONS.map((qt) => {
                      const isSelected = worksheetSettings.questionTypes.includes(qt.key);
                      return (
                        <button
                          key={qt.key}
                          onClick={() => toggleQuestionType(qt.key)}
                          className={`px-4 py-2 rounded-full border text-xs font-bold transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? 'border-primary-500 bg-primary-600 text-white shadow-sm'
                              : 'border-slate-200 dark:border-slate-800 bg-surface-light dark:bg-surface-dark text-slate-600 dark:text-slate-300 hover:border-primary-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />} {qt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={worksheetSettings.includeExplanations}
                      onChange={(e) => setSettings({ includeExplanations: e.target.checked })}
                      className="rounded text-primary-600"
                    />
                    Include explanations with the answer key
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={worksheetSettings.includeHints}
                      onChange={(e) => setSettings({ includeHints: e.target.checked })}
                      className="rounded text-primary-600"
                    />
                    Include hints for harder questions
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {!isGenerating && !generatedWorksheet && (
              <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center">
                <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center animate-bounce">
                  <Sparkles className="w-10 h-10 text-primary-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Ready to Generate!</h3>
                  <p className="text-slate-500 max-w-md">
                    {selectedClass || 'Class 5'} • {selectedSubject || 'Mathematics'} • {selectedChapter || 'Shapes and Space'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {worksheetSettings.questionCount} Questions • {worksheetSettings.difficulty} Difficulty
                  </p>
                </div>
                {generationError === 'AI_KEY_REQUIRED' && (
                  <div className="w-full max-w-md p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl text-amber-800 dark:text-amber-300 text-sm font-medium space-y-3">
                    <p className="flex items-center gap-3"><AlertTriangle className="w-5 h-5 shrink-0" /> You need an AI key to generate worksheets.</p>
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
                  className="px-8 py-4 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-primary-500/25 flex items-center gap-3"
                >
                  <Sparkles className="w-6 h-6" /> Generate Magic Worksheet
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
                  <h3 className="text-2xl font-bold mb-2">Creating Your Magic Worksheet...</h3>
                  <p className="text-primary-600 dark:text-primary-400 font-medium animate-pulse">{generationStatus}</p>
                </div>
              </div>
            )}

            {generatedWorksheet && (
              <div className="space-y-6">
                <div className="p-6 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-500 text-white rounded-xl">
                      <Check className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-green-900 dark:text-green-200">Worksheet Generated & Saved to History! 🎉</h3>
                      <p className="text-sm text-green-700 dark:text-green-400">Your AI-curated worksheet with answer key is ready to print & download.</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <button
                      onClick={() => toggleFavorite(generatedWorksheet.id)}
                      className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 border ${
                        generatedWorksheet.isFavorite
                          ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900'
                          : 'bg-white border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${generatedWorksheet.isFavorite ? 'fill-current' : ''}`} /> Favorite
                    </button>
                    <button
                      onClick={() => handleDownloadPdf(generatedWorksheet.id, 'worksheet')}
                      disabled={downloadingPdf !== null}
                      className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-105 disabled:opacity-50"
                    >
                      {downloadingPdf === 'worksheet' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />} Download PDF
                    </button>
                    <button
                      onClick={() => handleDownloadPdf(generatedWorksheet.id, 'answer-key')}
                      disabled={downloadingPdf !== null}
                      className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-sm shadow flex items-center justify-center gap-2 transition-transform hover:scale-105 disabled:opacity-50"
                    >
                      {downloadingPdf === 'answer-key' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />} Answer Key PDF
                    </button>
                    <button
                      onClick={() => { setGeneratedWorksheet(null); setGenerationError(null); reset(); }}
                      className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      Create Another
                    </button>
                  </div>
                  {pdfError && <p className="w-full text-xs text-red-600 dark:text-red-400 font-medium">{pdfError}</p>}
                </div>

                {/* Printable Worksheet Render */}
                <div className="bg-white text-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 print:shadow-none print:border-none print:p-0">
                  <div className="flex justify-end items-center gap-1.5 mb-3">
                    <Logo size={16} />
                    <span className="text-[10px] font-bold text-slate-400 tracking-wide">BOSKET&apos;S EDUSHEET</span>
                  </div>
                  <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center">
                    <div className="flex justify-between items-center text-xs font-semibold mb-2">
                      <span>Board: {generatedWorksheet.board}</span>
                      <span>Grade: {generatedWorksheet.class}</span>
                    </div>
                    <h1 className="text-2xl font-bold uppercase tracking-wide">{generatedWorksheet.subject} WORKSHEET</h1>
                    <p className="text-sm font-medium text-slate-600">Chapter: {generatedWorksheet.chapter} • Topic: {generatedWorksheet.topics?.join(', ') || 'General'}</p>
                    <div className="flex justify-between items-center text-xs mt-4 pt-2 border-t border-slate-200">
                      <span>Name: ________________________</span>
                      <span>Date: ____________</span>
                      <span>Max Marks: {generatedWorksheet.totalMarks || 25}</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {generatedWorksheet.sections?.map((sec, secIdx) => (
                      <div key={secIdx} className="space-y-3">
                        <h4 className="font-bold text-sm underline">{sec.sectionTitle}</h4>
                        {sec.questions?.map((q, qIdx) => (
                          <div key={qIdx} className="space-y-1.5 text-sm">
                            <p className="font-medium">{q.number || qIdx + 1}. {q.question}</p>
                            {q.type === 'coloring_sheet' ? (
                              <ColoringSheetPreview diagram={q.diagram} />
                            ) : q.type === 'tracing' ? (
                              <TracingPreview content={q.diagram?.traceContent} />
                            ) : q.type === 'match_following' ? (
                              <MatchPreview options={q.options} answer={q.answer} matchImageUrls={q.diagram?.matchImageUrls} showLabels={false} />
                            ) : q.diagram ? (
                              <DiagramPreview diagram={q.diagram} showLabels={false} />
                            ) : (
                              <>
                                {q.options && q.options.length > 0 && (
                                  <div className="grid grid-cols-2 gap-2 text-xs pl-4">
                                    {q.options.map((opt, optIdx) => (
                                      <span key={optIdx}>{opt}</span>
                                    ))}
                                  </div>
                                )}
                                {(!q.options || q.options.length === 0) && (
                                  <div className="h-16 border-b border-dashed border-slate-300 mt-2"></div>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}

                    <div className="border-t-2 border-slate-900 pt-6 mt-12 print:page-break-before">
                      <h3 className="font-bold text-base text-center underline mb-4">ANSWER KEY & SOLUTIONS</h3>
                      <div className="space-y-2 text-xs">
                        {generatedWorksheet.sections?.map((sec) =>
                          sec.questions?.map((q, qIdx) => (
                            <div key={qIdx}>
                              <p>
                                <strong>Q{q.number || qIdx + 1} Answer:</strong> {q.answer}
                                {q.explanation && <span className="text-slate-600"> — {q.explanation}</span>}
                              </p>
                              {q.type === 'coloring_sheet' ? (
                                <ColoringSheetPreview diagram={q.diagram} />
                              ) : q.type === 'tracing' ? (
                                <TracingPreview content={q.diagram?.traceContent} />
                              ) : q.type === 'match_following' ? (
                                <MatchPreview options={q.options} answer={q.answer} matchImageUrls={q.diagram?.matchImageUrls} showLabels={true} />
                              ) : (
                                q.diagram && <DiagramPreview diagram={q.diagram} showLabels={true} />
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8 print:hidden">
        <button onClick={prevStep} disabled={currentStep === 1 || isGenerating} className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium disabled:opacity-50 flex items-center gap-2">
          <ChevronLeft className="w-5 h-5" /> Back
        </button>
        {currentStep < 6 && (
          <button
            onClick={nextStep}
            disabled={!stepValid(currentStep)}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
