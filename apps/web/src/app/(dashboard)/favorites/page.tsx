'use client';
import { useState, useEffect } from 'react';
import { Heart, Sparkles, BookOpen, Eye, Printer, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useWorksheetStore, SavedWorksheet } from '@/store/useWorksheetStore';
import { fetchWorksheetDetail, downloadWorksheetPdf, downloadAnswerKeyPdf } from '@/lib/worksheet';
import { Logo } from '@/components/Logo';

export default function FavoritesPage() {
  const { worksheets, toggleFavorite, fetchWorksheets, isLoading, hasLoaded } = useWorksheetStore();
  const [selectedWorksheet, setSelectedWorksheet] = useState<SavedWorksheet | null>(null);
  const [loadingWorksheetId, setLoadingWorksheetId] = useState<string | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState<'worksheet' | 'answer-key' | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const handleDownloadPdf = async (worksheetId: string, kind: 'worksheet' | 'answer-key') => {
    setPdfError(null);
    setDownloadingPdf(kind);
    try {
      if (kind === 'worksheet') await downloadWorksheetPdf(worksheetId);
      else await downloadAnswerKeyPdf(worksheetId);
    } catch (err: any) {
      console.error('Failed to open PDF:', err);
      setPdfError('The PDF isn\'t ready yet — try again in a few seconds.');
    } finally {
      setDownloadingPdf(null);
    }
  };

  useEffect(() => {
    if (!hasLoaded) fetchWorksheets();
  }, [hasLoaded, fetchWorksheets]);

  const favoriteWorksheets = worksheets.filter((w) => w.isFavorite);

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

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Favorites</h1>
        <p className="text-slate-500 text-sm">Your saved worksheets and bookmarked practice papers for quick access.</p>
      </div>

      {isLoading && !hasLoaded ? (
        <div className="glass-card p-12 rounded-3xl text-center flex items-center justify-center gap-2 text-slate-400 my-8">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading your favorites...
        </div>
      ) : favoriteWorksheets.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center max-w-md mx-auto space-y-4 my-12">
          <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 fill-current" />
          </div>
          <h3 className="text-lg font-bold">No Favorites Saved Yet</h3>
          <p className="text-sm text-slate-500">
            Click the heart icon on any generated worksheet to bookmark it here for quick revision.
          </p>
          <Link href="/worksheets" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform text-sm">
            <BookOpen className="w-4 h-4" /> Browse My Worksheets
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteWorksheets.map((ws) => (
            <div key={ws.id} className="glass-card rounded-2xl p-5 hover:border-rose-500/50 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2.5 py-1 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-lg text-xs font-bold">
                    {ws.subject}
                  </span>
                  <button 
                    onClick={() => toggleFavorite(ws.id)}
                    className="p-1.5 rounded-lg text-rose-500 bg-rose-50 dark:bg-rose-950/40 transition-colors"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>
                <h3 className="font-bold text-base mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                  {ws.title || `${ws.chapter} Practice`}
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  {ws.class} • {ws.questionCount} Questions • {ws.difficulty}
                </p>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => openWorksheet(ws)}
                  disabled={loadingWorksheetId === ws.id}
                  className="flex-1 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl text-xs font-bold hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {loadingWorksheetId === ws.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />} View & Print
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
                  className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg disabled:opacity-50"
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
            {pdfError && <p className="text-xs text-red-600 font-medium">{pdfError}</p>}

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
                      {q.options && (
                        <div className="grid grid-cols-2 gap-1 pl-4 text-xs">
                          {q.options.map((opt, oIdx) => <span key={oIdx}>{opt}</span>)}
                        </div>
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
                      <p key={qIdx}>
                        <strong>Q{q.number || qIdx + 1}:</strong> {q.answer}
                        {q.explanation && <span className="text-slate-600"> — {q.explanation}</span>}
                      </p>
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
