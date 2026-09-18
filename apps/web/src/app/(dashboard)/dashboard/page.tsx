'use client';
import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, BookOpen, Clock, Zap, Heart, Printer, Eye, X, Loader2, FileStack } from 'lucide-react';
import Link from 'next/link';
import { useWorksheetStore, SavedWorksheet } from '@/store/useWorksheetStore';
import { fetchWorksheetDetail, downloadWorksheetPdf, downloadAnswerKeyPdf } from '@/lib/worksheet';
import { Logo } from '@/components/Logo';
import { AiKeyBanner } from '@/components/AiKeyBanner';

export default function Dashboard() {
  const { worksheets, userProfile, toggleFavorite, fetchWorksheets, isLoading, hasLoaded } = useWorksheetStore();
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

  const totalQuestions = worksheets.reduce((acc, w) => acc + (w.questionCount || 0), 0);
  const totalFavorites = worksheets.filter((w) => w.isFavorite).length;

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
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-primary-600 border-[3px] border-slate-900 p-8 text-white">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-secondary-500 border-[3px] border-slate-900 rounded-[32px] rotate-12 opacity-90" aria-hidden="true"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-primary-700 text-xs font-bold mb-3 border-2 border-slate-900">
              <Sparkles className="w-3.5 h-3.5 text-secondary-500" /> CBSE Curriculum Ready
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-semibold mb-2 tracking-tight">
              Welcome back, {userProfile?.name || 'Student'}! 👋
            </h1>
            <p className="text-primary-50 max-w-xl text-sm md:text-base">
              Ready to master new topics? Generate custom CBSE worksheets powered by your own AI key in seconds.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/generate"
              className="btn-brutal inline-flex items-center justify-center gap-2.5 bg-white text-primary-700 px-6 py-3.5 rounded-2xl font-display font-medium"
            >
              <Sparkles className="w-5 h-5 text-primary-600" /> Quick Generate
            </Link>
            <Link
              href="/projects/new"
              className="btn-brutal inline-flex items-center justify-center gap-2.5 bg-accent-500 text-white px-6 py-3.5 rounded-2xl font-display font-medium"
            >
              <FileStack className="w-5 h-5" /> New Project
            </Link>
          </div>
        </div>
      </div>

      <AiKeyBanner />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Worksheets Created', value: worksheets.length, icon: BookOpen, color: 'text-primary-600 bg-primary-100 dark:bg-primary-900/40' },
          { label: 'Questions Generated', value: totalQuestions, icon: Zap, color: 'text-amber-500 bg-amber-100 dark:bg-amber-900/40' },
          { label: 'Favorites Saved', value: totalFavorites, icon: Heart, color: 'text-rose-500 bg-rose-100 dark:bg-rose-900/40' },
          { label: 'Study Streak', value: worksheets.length > 0 ? '3 Days 🔥' : '1 Day 🌟', icon: Clock, color: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/40' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-5 rounded-2xl flex items-center gap-4 hover:-translate-y-1 hover:shadow-[8px_8px_0_var(--color-ink)] transition-transform">
            <div className={`p-3 rounded-xl border-2 border-slate-900 dark:border-slate-700 ${stat.color} shrink-0`}><stat.icon className="w-6 h-6" /></div>
            <div>
              <p className="font-display text-2xl font-semibold text-slate-900 dark:text-white tabular-nums">{stat.value}</p>
              <p className="text-xs font-semibold text-slate-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Worksheets */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Worksheets</h2>
            <p className="text-xs text-slate-400">Your AI-generated practice sheets</p>
          </div>
          <Link href="/worksheets" className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 text-sm font-semibold">
            View all ({worksheets.length}) <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading && !hasLoaded ? (
          <div className="glass-card p-12 rounded-3xl text-center flex items-center justify-center gap-2 text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading your worksheets...
          </div>
        ) : worksheets.length === 0 ? (
          <div className="glass-card p-12 rounded-3xl text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-2xl flex items-center justify-center mx-auto">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="font-display text-lg font-semibold">No Worksheets Generated Yet</h3>
            <p className="text-sm text-slate-500">Create your first custom CBSE practice paper tailored to your class and subject.</p>
            <Link href="/generate" className="btn-brutal inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-display font-medium rounded-xl text-sm">
              <Sparkles className="w-4 h-4" /> Create First Worksheet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {worksheets.slice(0, 3).map((ws) => (
              <div key={ws.id} className="glass-card rounded-2xl p-5 hover:-translate-y-1 hover:shadow-[8px_8px_0_var(--color-ink)] transition-transform flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2.5 py-1 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-lg text-xs font-bold">
                      {ws.subject}
                    </span>
                    <button
                      onClick={() => toggleFavorite(ws.id)}
                      className={`p-1.5 rounded-lg transition-colors ${ws.isFavorite ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                    >
                      <Heart className={`w-4 h-4 ${ws.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  <h3 className="font-bold text-base mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                    {ws.title || `${ws.chapter} Practice`}
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    {ws.class} • {ws.questionCount} Questions • {ws.difficulty}
                  </p>
                </div>

                <div className="flex gap-2 pt-2 border-t-2 border-slate-100 dark:border-slate-800">
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
      </div>

      {/* Modal Viewer */}
      {selectedWorksheet && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card bg-surface-light dark:bg-surface-dark rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 relative space-y-6">
            <button
              onClick={() => setSelectedWorksheet(null)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 rounded-full border-2 border-transparent hover:border-slate-900 dark:hover:border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex justify-between items-center pr-8 border-b-2 border-slate-900 dark:border-slate-700 pb-4">
              <div>
                <span className="px-2.5 py-1 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 border-2 border-slate-900 dark:border-primary-800 rounded-lg text-xs font-bold uppercase">
                  {selectedWorksheet.subject} • {selectedWorksheet.class}
                </span>
                <h2 className="font-display text-xl font-semibold mt-2">{selectedWorksheet.chapter}</h2>
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
                  className="btn-brutal px-4 py-2 bg-white text-slate-700 rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50"
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
