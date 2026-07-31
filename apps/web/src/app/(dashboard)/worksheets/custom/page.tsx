'use client';
import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useWorksheetStore, SavedWorksheet } from '@/store/useWorksheetStore';
import { QUESTION_TYPE_OPTIONS, SavedSection, downloadWorksheetPdf, downloadAnswerKeyPdf } from '@/lib/worksheet';
import { Logo } from '@/components/Logo';
import { DiagramPreview, ColoringSheetPreview, TracingPreview, MatchPreview } from '@/components/DiagramPreview';
import { Sparkles, Check, Printer, Heart, AlertTriangle, Loader2 } from 'lucide-react';

const DIFFICULTY_OPTIONS = [
  { id: 'easy', label: 'Easy', emoji: '😊' },
  { id: 'medium', label: 'Medium', emoji: '🤔' },
  { id: 'hard', label: 'Challenging', emoji: '🤯' },
  { id: 'mixed', label: 'Mixed', emoji: '🎲' },
] as const;

export default function CustomWorksheetPage() {
  const { addWorksheet, toggleFavorite } = useWorksheetStore();

  const [title, setTitle] = useState('');
  const [className, setClassName] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [topic, setTopic] = useState('');
  const [requirement, setRequirement] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('mixed');
  const [questionCount, setQuestionCount] = useState(10);
  const [questionTypes, setQuestionTypes] = useState<string[]>(['mcq', 'short_answer']);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generatedWorksheet, setGeneratedWorksheet] = useState<SavedWorksheet | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState<'worksheet' | 'answer-key' | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const isValid = className.trim() && subjectName.trim() && topic.trim() && questionTypes.length > 0;

  const toggleQuestionType = (key: string) => {
    if (questionTypes.includes(key)) {
      if (questionTypes.length === 1) return;
      setQuestionTypes(questionTypes.filter((t) => t !== key));
    } else {
      setQuestionTypes([...questionTypes, key]);
    }
  };

  const handleGenerate = async () => {
    if (!isValid) return;
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const res = await api.post<{ success: boolean; data: { worksheet: any; sections: SavedSection[] } }>(
        '/api/worksheets/generate-custom',
        {
          title: title.trim() || undefined,
          className: className.trim(),
          subjectName: subjectName.trim(),
          topic: topic.trim(),
          requirement: requirement.trim() || undefined,
          difficulty,
          questionCount,
          questionTypes,
        }
      );

      const { worksheet, sections } = res.data;
      const saved: SavedWorksheet = {
        id: worksheet.id,
        title: worksheet.title,
        board: 'General',
        class: className.trim(),
        subject: subjectName.trim(),
        chapter: topic.trim(),
        topics: [topic.trim()],
        difficulty,
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
      console.error('Custom worksheet generation error:', err);
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

  const resetAll = () => {
    setTitle('');
    setClassName('');
    setSubjectName('');
    setTopic('');
    setRequirement('');
    setDifficulty('mixed');
    setQuestionCount(10);
    setQuestionTypes(['mcq', 'short_answer']);
    setGeneratedWorksheet(null);
    setGenerationError(null);
  };

  return (
    <div className="max-w-3xl mx-auto pb-20 select-none">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Custom Worksheet</h1>
        <p className="text-slate-500">Generate a worksheet with an answer key for any board, class, or subject — just describe what you need.</p>
      </div>

      <div className="glass-card p-6 md:p-8 rounded-3xl space-y-6">
        {!generatedWorksheet && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Class / Standard</label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="e.g. Class 6, Grade 9, Year 11"
                  className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-transparent focus:border-primary-500/50 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="e.g. Physics, Geography"
                  className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-transparent focus:border-primary-500/50 outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Newton's Laws of Motion"
                className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-transparent focus:border-primary-500/50 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Requirement / Prompt <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                placeholder="Describe exactly what you want — e.g. focus on numericals, include diagram-based questions, avoid MCQs with negative marking..."
                rows={4}
                className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-transparent focus:border-primary-500/50 outline-none text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Title <span className="text-slate-400 font-normal">(optional)</span></label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Leave blank to auto-generate a title"
                className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-transparent focus:border-primary-500/50 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Difficulty Level</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {DIFFICULTY_OPTIONS.map((diff) => (
                  <button
                    key={diff.id}
                    onClick={() => setDifficulty(diff.id)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      difficulty === diff.id
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
                    onClick={() => setQuestionCount(count)}
                    className={`px-5 py-2.5 rounded-xl border font-bold text-sm transition-all ${
                      questionCount === count
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
                  const isSelected = questionTypes.includes(qt.key);
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
          </>
        )}

        {!isGenerating && !generatedWorksheet && (
          <div className="flex flex-col items-center justify-center py-4 space-y-6 text-center border-t border-slate-200 dark:border-slate-800 pt-8">
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
              disabled={!isValid}
              className="px-8 py-4 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-primary-500/25 flex items-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
            >
              <Sparkles className="w-6 h-6" /> Generate Worksheet
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
              <h3 className="text-2xl font-bold mb-2">Creating Your Worksheet...</h3>
              <p className="text-primary-600 dark:text-primary-400 font-medium animate-pulse">Asking your AI provider to craft custom questions...</p>
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
                  onClick={resetAll}
                  className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
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
                <h1 className="text-2xl font-bold uppercase tracking-wide">{generatedWorksheet.subject} WORKSHEET</h1>
                <p className="text-sm font-medium text-slate-600">Topic: {generatedWorksheet.chapter}</p>
                <div className="flex justify-between items-center text-xs mt-4 pt-2 border-t border-slate-200">
                  <span>Name: ________________________</span>
                  <span>Class: {generatedWorksheet.class}</span>
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

      {!generatedWorksheet && (
        <div className="text-center mt-6">
          <Link href="/worksheets" className="text-xs text-slate-400 hover:text-primary-600">View saved worksheets</Link>
        </div>
      )}
    </div>
  );
}
