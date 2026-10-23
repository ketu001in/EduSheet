'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, Eye, Printer, X, Sparkles, ClipboardList, Loader2, RefreshCw, FileDown } from 'lucide-react';
import {
  fetchActivitySheets, fetchActivitySheet, deleteActivitySheet, downloadActivitySheetPdf, regenerateActivitySheetPdf,
  activitySheetToMarkdown, ActivitySheetSummary, ActivitySheetDetail,
} from '@/lib/activitySheet';
import { downloadMarkdownFile } from '@/lib/studyMaterial';
import { Logo } from '@/components/Logo';
import RoleGate from '@/components/RoleGate';

export default function ActivitySheetPage() {
  return (
    <RoleGate allow={['teacher', 'parent']}>
      <ActivitySheetPageContent />
    </RoleGate>
  );
}

function ActivitySheetPageContent() {
  const [sheets, setSheets] = useState<ActivitySheetSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSheet, setSelectedSheet] = useState<ActivitySheetDetail | null>(null);
  const [loadingSheetId, setLoadingSheetId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [regeneratingPdf, setRegeneratingPdf] = useState(false);

  useEffect(() => {
    fetchActivitySheets()
      .then((res) => setSheets(res.data))
      .catch((err) => console.error('Failed to load activity sheets:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const openSheet = async (s: ActivitySheetSummary) => {
    setLoadingSheetId(s.id);
    try {
      const res = await fetchActivitySheet(s.id);
      setSelectedSheet(res.data);
    } catch (err) {
      console.error('Failed to load activity sheet:', err);
    } finally {
      setLoadingSheetId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this activity sheet?')) return;
    setDeletingId(id);
    try {
      await deleteActivitySheet(id);
      setSheets((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Failed to delete activity sheet:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownloadPdf = async (id: string) => {
    setPdfError(null);
    setDownloadingPdf(true);
    try {
      await downloadActivitySheetPdf(id);
    } catch (err) {
      console.error('Failed to open PDF:', err);
      setPdfError('The PDF isn\'t ready yet — it may have failed to generate. Try regenerating it below.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleRegeneratePdf = async (id: string) => {
    setPdfError(null);
    setRegeneratingPdf(true);
    try {
      await regenerateActivitySheetPdf(id);
      setPdfError(null);
    } catch (err) {
      console.error('Failed to regenerate PDF:', err);
      setPdfError('Regeneration failed. Please try again in a moment.');
    } finally {
      setRegeneratingPdf(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Activity Sheets</h1>
          <p className="text-slate-500 text-sm">Hands-on activities you&apos;ve generated for your student.</p>
        </div>
        <Link
          href="/activity-sheet/new"
          className="btn-brutal px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-sm shadow-primary-500/20 flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <Sparkles className="w-4 h-4" /> Create Activity Sheet
        </Link>
      </div>

      {isLoading ? (
        <div className="glass-card p-12 rounded-3xl text-center flex items-center justify-center gap-2 text-slate-400 my-8">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading your activity sheets...
        </div>
      ) : sheets.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center max-w-md mx-auto space-y-4 my-8">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-2xl flex items-center justify-center mx-auto">
            <ClipboardList className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold">No Activity Sheets Yet</h3>
          <p className="text-sm text-slate-500">You have not generated any activity sheets yet.</p>
          <Link href="/activity-sheet/new" className="inline-flex items-center gap-2 btn-brutal px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl text-sm">
            <Sparkles className="w-4 h-4" /> Generate Activity Sheet
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sheets.map((s) => (
            <div key={s.id} className="glass-card rounded-2xl overflow-hidden group flex flex-col justify-between hover:border-primary-500/50 transition-all">
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="px-2.5 py-1 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-lg text-xs font-bold">
                    {s.subjects?.name || 'Activity'}
                  </span>
                  <button
                    onClick={() => handleDelete(s.id)}
                    disabled={deletingId === s.id}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete Activity Sheet"
                  >
                    {deletingId === s.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>

                <h3 className="font-bold text-lg leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-400">{s.classes?.name || ''}</p>
                <p className="text-xs font-medium text-slate-500 line-clamp-1">
                  Chapter: {s.chapters?.title || 'General'}
                </p>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => openSheet(s)}
                  disabled={loadingSheetId === s.id}
                  className="w-full py-2.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors disabled:opacity-50"
                >
                  {loadingSheetId === s.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />} View & Print
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedSheet && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative space-y-6">
            <button
              onClick={() => setSelectedSheet(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex justify-between items-center pr-8 border-b pb-4 border-slate-200 dark:border-slate-800">
              <div>
                <span className="px-2.5 py-1 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-lg text-xs font-bold uppercase">
                  {selectedSheet.subjects?.name} • {selectedSheet.classes?.name}
                </span>
                <h2 className="text-xl font-bold mt-2">{selectedSheet.title}</h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => downloadMarkdownFile(
                    `${selectedSheet.title.replace(/[^a-z0-9]+/gi, '-')}.md`,
                    activitySheetToMarkdown(selectedSheet.title, selectedSheet.materials, selectedSheet.steps, selectedSheet.reflection_questions, selectedSheet.facilitation_notes)
                  )}
                  className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold flex items-center gap-2 hover:border-primary-300"
                >
                  <FileDown className="w-4 h-4" /> .md
                </button>
                <button
                  onClick={() => handleDownloadPdf(selectedSheet.id)}
                  disabled={downloadingPdf}
                  className="btn-brutal px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50"
                >
                  {downloadingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />} PDF
                </button>
              </div>
            </div>
            {pdfError && (
              <div className="flex items-center justify-between gap-3 bg-red-50 dark:bg-red-950/30 rounded-xl px-4 py-2.5">
                <p className="text-xs text-red-600 font-medium">{pdfError}</p>
                <button
                  onClick={() => handleRegeneratePdf(selectedSheet.id)}
                  disabled={regeneratingPdf}
                  className="shrink-0 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
                >
                  {regeneratingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />} Regenerate PDF
                </button>
              </div>
            )}

            <div className="bg-white text-slate-900 p-6 rounded-2xl border border-slate-200 space-y-6 text-left">
              <div className="flex justify-end items-center gap-1.5">
                <Logo size={16} />
                <span className="text-[10px] font-bold text-slate-400 tracking-wide">BOSKET&apos;S EDUSHEET</span>
              </div>
              <div className="text-center border-b pb-4 border-slate-900 -mt-2">
                <h1 className="text-2xl font-bold uppercase">{selectedSheet.title}</h1>
                <p className="text-sm font-semibold text-slate-600">Chapter: {selectedSheet.chapters?.title || 'General'} • Grade: {selectedSheet.classes?.name}</p>
              </div>

              <div className="space-y-6 text-sm">
                <div>
                  <h4 className="font-bold text-base mb-2">What You&apos;ll Need</h4>
                  <ul className="space-y-1.5">
                    {selectedSheet.materials.map((m, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border border-slate-400 rounded-sm shrink-0" /> {m}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-base mb-2">What To Do</h4>
                  <ol className="space-y-2">
                    {selectedSheet.steps.map((s, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                        <span className="pt-0.5">{s}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                {selectedSheet.reflection_questions?.length > 0 && (
                  <div>
                    <h4 className="font-bold text-base mb-2">Think About It</h4>
                    <ul className="space-y-1.5 list-disc list-inside">
                      {selectedSheet.reflection_questions.map((q, i) => <li key={i}>{q}</li>)}
                    </ul>
                  </div>
                )}
                {selectedSheet.facilitation_notes && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wide mb-1.5">For the Grown-Up Running This Activity</p>
                    <p className="text-justify leading-relaxed">{selectedSheet.facilitation_notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
