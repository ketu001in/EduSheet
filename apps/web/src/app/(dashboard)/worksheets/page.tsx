'use client';
import { useState, useEffect } from 'react';
import { Search, Trash2, Heart, Eye, Printer, X, Sparkles, BookOpen, Loader2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useWorksheetStore, SavedWorksheet } from '@/store/useWorksheetStore';
import { fetchWorksheetDetail, downloadWorksheetPdf, downloadAnswerKeyPdf, regenerateWorksheetPdf } from '@/lib/worksheet';
import { Logo } from '@/components/Logo';
import { DiagramPreview, ColoringSheetPreview, TracingPreview, MatchPreview } from '@/components/DiagramPreview';

export default function WorksheetsPage() {
  const { worksheets, searchQuery, setSearchQuery, toggleFavorite, deleteWorksheet, fetchWorksheets, isLoading, hasLoaded } = useWorksheetStore();
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('All');
  const [selectedWorksheet, setSelectedWorksheet] = useState<SavedWorksheet | null>(null);
  const [loadingWorksheetId, setLoadingWorksheetId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState<'worksheet' | 'answer-key' | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [regeneratingPdf, setRegeneratingPdf] = useState(false);

  const handleDownloadPdf = async (worksheetId: string, kind: 'worksheet' | 'answer-key') => {
    setPdfError(null);
    setDownloadingPdf(kind);
    try {
      if (kind === 'worksheet') await downloadWorksheetPdf(worksheetId);
      else await downloadAnswerKeyPdf(worksheetId);
    } catch (err: any) {
      console.error('Failed to open PDF:', err);
      setPdfError('The PDF isn\'t ready yet — it may have failed to generate. Try regenerating it below.');
    } finally {
      setDownloadingPdf(null);
    }
  };

  const handleRegeneratePdf = async (worksheetId: string) => {
    setPdfError(null);
    setRegeneratingPdf(true);
    try {
      await regenerateWorksheetPdf(worksheetId);
      setPdfError(null);
    } catch (err) {
      console.error('Failed to regenerate PDF:', err);
      setPdfError('Regeneration failed. Please try again in a moment.');
    } finally {
      setRegeneratingPdf(false);
    }
  };

  useEffect(() => {
    if (!hasLoaded) fetchWorksheets();
  }, [hasLoaded, fetchWorksheets]);

  const subjects = ['All', 'Mathematics', 'Science', 'English', 'Social Science', 'Hindi', 'EVS', 'General Knowledge', 'Numbers', 'Rhymes & Stories'];

  const filteredWorksheets = worksheets.filter((ws) => {
    const matchesSearch =
      !searchQuery ||
      ws.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ws.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ws.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubject = selectedSubjectFilter === 'All' || ws.subject === selectedSubjectFilter;

    return matchesSearch && matchesSubject;
  });

  const openWorksheet = async (ws: SavedWorksheet) => {
    if (ws.sections) { setSelectedWorksheet(ws); return; }
    setLoadingWorksheetId(ws.id);
    try {
      const detail = await fetchWorksheetDetail(ws.id);
      setSelectedWorksheet({ ...ws, ...detail });
    } catch (err) {
      console.error('Failed to load worksheet:', err);
    } finally {
      setLoadingWorksheetId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this worksheet?')) return;
    setDeletingId(id);
    try {
      await deleteWorksheet(id);
    } catch (err) {
      console.error('Failed to delete worksheet:', err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Worksheets</h1>
          <p className="text-slate-500 text-sm">Manage, view, and print your AI-generated practice papers.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/worksheets/custom"
            className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm flex items-center gap-2 hover:border-primary-300 transition-colors"
          >
            <Sparkles className="w-4 h-4" /> Custom Worksheet
          </Link>
          <Link
            href="/generate"
            className="btn-brutal px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-sm shadow-primary-500/20 flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <Sparkles className="w-4 h-4" /> Create New Worksheet
          </Link>
        </div>
      </div>

      {/* Search & Subject Filters */}
      <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, subject, chapter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-transparent focus:border-primary-500/50 outline-none text-sm"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubjectFilter(sub)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedSubjectFilter === sub
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading && !hasLoaded ? (
        <div className="glass-card p-12 rounded-3xl text-center flex items-center justify-center gap-2 text-slate-400 my-8">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading your worksheets...
        </div>
      ) : filteredWorksheets.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center max-w-md mx-auto space-y-4 my-8">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-2xl flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold">No Worksheets Found</h3>
          <p className="text-sm text-slate-500">
            {searchQuery || selectedSubjectFilter !== 'All'
              ? 'Try clearing your search query or filter.'
              : 'You have not generated any worksheets yet.'}
          </p>
          <Link href="/generate" className="inline-flex items-center gap-2 btn-brutal px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl text-sm">
            <Sparkles className="w-4 h-4" /> Generate Worksheet
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorksheets.map((ws) => (
            <div key={ws.id} className="glass-card rounded-2xl overflow-hidden group flex flex-col justify-between hover:border-primary-500/50 transition-all">
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="px-2.5 py-1 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-lg text-xs font-bold">
                    {ws.subject}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleFavorite(ws.id)}
                      className={`p-1.5 rounded-lg transition-colors ${ws.isFavorite ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                    >
                      <Heart className={`w-4 h-4 ${ws.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleDelete(ws.id)}
                      disabled={deletingId === ws.id}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete Worksheet"
                    >
                      {deletingId === ws.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-lg leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                  {ws.title || `${ws.chapter} Practice`}
                </h3>
                <p className="text-xs text-slate-400">
                  {ws.class} • {ws.board} • {ws.questionCount} Questions
                </p>
                <p className="text-xs font-medium text-slate-500 line-clamp-1">
                  Chapter: {ws.chapter}
                </p>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => openWorksheet(ws)}
                  disabled={loadingWorksheetId === ws.id}
                  className="w-full py-2.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors disabled:opacity-50"
                >
                  {loadingWorksheetId === ws.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />} View & Print PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Viewer */}
      {selectedWorksheet && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative space-y-6">
            <button
              onClick={() => setSelectedWorksheet(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex justify-between items-center pr-8 border-b pb-4 border-slate-200 dark:border-slate-800">
              <div>
                <span className="px-2.5 py-1 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-lg text-xs font-bold uppercase">
                  {selectedWorksheet.subject} • {selectedWorksheet.class}
                </span>
                <h2 className="text-xl font-bold mt-2">{selectedWorksheet.chapter}</h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownloadPdf(selectedWorksheet.id, 'worksheet')}
                  disabled={downloadingPdf !== null}
                  className="btn-brutal px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50"
                >
                  {downloadingPdf === 'worksheet' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />} PDF
                </button>
                <button
                  onClick={() => handleDownloadPdf(selectedWorksheet.id, 'answer-key')}
                  disabled={downloadingPdf !== null}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold flex items-center gap-2 shadow disabled:opacity-50"
                >
                  {downloadingPdf === 'answer-key' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />} Answer Key
                </button>
              </div>
            </div>
            {pdfError && (
              <div className="flex items-center justify-between gap-3 bg-red-50 dark:bg-red-950/30 rounded-xl px-4 py-2.5">
                <p className="text-xs text-red-600 font-medium">{pdfError}</p>
                <button
                  onClick={() => handleRegeneratePdf(selectedWorksheet.id)}
                  disabled={regeneratingPdf}
                  className="shrink-0 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
                >
                  {regeneratingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />} Regenerate PDF
                </button>
              </div>
            )}

            {/* Printable Content */}
            <div className="bg-white text-slate-900 p-6 rounded-2xl border border-slate-200 space-y-6 text-left">
              <div className="flex justify-end items-center gap-1.5">
                <Logo size={16} />
                <span className="text-[10px] font-bold text-slate-400 tracking-wide">BOSKET&apos;S EDUSHEET</span>
              </div>
              <div className="text-center border-b pb-4 border-slate-900 -mt-2">
                <h1 className="text-2xl font-bold uppercase">{selectedWorksheet.subject} WORKSHEET</h1>
                <p className="text-sm font-semibold text-slate-600">Chapter: {selectedWorksheet.chapter} • Grade: {selectedWorksheet.class}</p>
              </div>

              {(selectedWorksheet.sections || []).map((sec, idx) => (
                <div key={idx} className="space-y-3">
                  <h4 className="font-bold underline text-sm">{sec.sectionTitle}</h4>
                  {sec.questions.map((q, qIdx) => (
                    <div key={qIdx} className="space-y-1 text-sm">
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
                        q.options && (
                          <div className="grid grid-cols-2 gap-1 pl-4 text-xs">
                            {q.options.map((opt, oIdx) => <span key={oIdx}>{opt}</span>)}
                          </div>
                        )
                      )}
                    </div>
                  ))}
                </div>
              ))}

              <div className="border-t-2 border-slate-900 pt-4 mt-8">
                <h3 className="font-bold text-center underline text-sm mb-3">ANSWER KEY & SOLUTIONS</h3>
                <div className="space-y-2 text-xs">
                  {(selectedWorksheet.sections || []).map((sec) =>
                    sec.questions.map((q, qIdx) => (
                      <div key={qIdx}>
                        <p>
                          <strong>Q{q.number || qIdx + 1}:</strong> {q.answer}
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
  );
}
