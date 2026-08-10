'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles, Leaf, Trash2, Printer, Eye, X, Loader2, RefreshCw, Check, Waves, Microscope,
} from 'lucide-react';
import {
  fetchBiologyAttempts, fetchBiologyAttempt, deleteBiologyAttempt, downloadBiologyAttemptPdf,
  regenerateBiologyAttemptPdf, BiologyAttemptSummary, BiologyAttemptDetail,
} from '@/lib/biologyLab';
import { BIOLOGY_EXPERIMENTS } from '@edusheets/content';

const QUICK_LINKS = [
  { href: '/biology-lab/new', label: 'New Experiment', icon: Sparkles, accent: 'bg-primary-600 text-white' },
  { href: '/biology-lab/anatomy', label: 'Anatomy Explorer', icon: Microscope, accent: 'bg-white dark:bg-slate-800' },
  { href: '/biology-lab/playground', label: 'Free Play Sandbox', icon: Waves, accent: 'bg-white dark:bg-slate-800' },
];

export default function BiologyLabPage() {
  const [attempts, setAttempts] = useState<BiologyAttemptSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<BiologyAttemptDetail | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [regeneratingPdf, setRegeneratingPdf] = useState(false);

  useEffect(() => {
    fetchBiologyAttempts()
      .then((res) => setAttempts(res.data))
      .catch((err) => console.error('Failed to load Biology Lab attempts:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const openAttempt = async (a: BiologyAttemptSummary) => {
    setLoadingId(a.id);
    try {
      const res = await fetchBiologyAttempt(a.id);
      setSelected(res.data);
    } catch (err) {
      console.error('Failed to load attempt:', err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this lab report?')) return;
    setDeletingId(id);
    try {
      await deleteBiologyAttempt(id);
      setAttempts((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error('Failed to delete attempt:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownloadPdf = async (id: string) => {
    setPdfError(null);
    setDownloadingPdf(true);
    try {
      await downloadBiologyAttemptPdf(id);
    } catch {
      setPdfError('The PDF isn\'t ready yet -- try regenerating it below.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleRegeneratePdf = async (id: string) => {
    setPdfError(null);
    setRegeneratingPdf(true);
    try {
      await regenerateBiologyAttemptPdf(id);
    } catch {
      setPdfError('Regeneration failed. Please try again in a moment.');
    } finally {
      setRegeneratingPdf(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2"><Leaf className="w-7 h-7 text-primary-600" /> Biology Lab</h1>
        <p className="text-slate-500 text-sm">Real, hands-on biology -- microscope focusing, food tests, osmosis, genetics, and labeled diagrams -- {BIOLOGY_EXPERIMENTS.length} curated experiments and counting.</p>
      </div>

      <div className="grid grid-cols-3 gap-3 max-w-lg">
        {QUICK_LINKS.map((l) => {
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`btn-brutal rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-center font-bold text-xs hover:scale-105 transition-transform ${l.accent}`}
            >
              <Icon className="w-6 h-6" />
              {l.label}
            </Link>
          );
        })}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Your Lab Reports</h2>
        {isLoading ? (
          <div className="glass-card p-12 rounded-3xl text-center flex items-center justify-center gap-2 text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading your lab reports...
          </div>
        ) : attempts.length === 0 ? (
          <div className="glass-card p-12 rounded-3xl text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-2xl flex items-center justify-center mx-auto">
              <Leaf className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold">No Experiments Yet</h3>
            <p className="text-sm text-slate-500">Run your first experiment to get a saved lab report here.</p>
            <Link href="/biology-lab/new" className="inline-flex items-center gap-2 btn-brutal px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl text-sm">
              <Sparkles className="w-4 h-4" /> Start an Experiment
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attempts.map((a) => (
              <div key={a.id} className="glass-card rounded-2xl overflow-hidden group flex flex-col justify-between hover:border-primary-500/50 transition-all">
                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${a.predict_correct ? 'bg-accent-100 dark:bg-accent-900/40 text-accent-700 dark:text-accent-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                      {a.predict_correct && <Check className="w-3 h-3" />} {a.predict_correct ? 'Predicted correctly' : 'Completed'}
                    </span>
                    <button
                      onClick={() => handleDelete(a.id)}
                      disabled={deletingId === a.id}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {deletingId === a.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                  <h3 className="font-bold text-lg leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                    {a.experiment_title}
                  </h3>
                  <p className="text-xs text-slate-400">{a.boards?.name || ''} {a.classes?.name ? `• ${a.classes.name}` : ''}</p>
                </div>
                <div className="p-4 pt-0">
                  <button
                    onClick={() => openAttempt(a)}
                    disabled={loadingId === a.id}
                    className="w-full py-2.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors disabled:opacity-50"
                  >
                    {loadingId === a.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />} View Lab Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative space-y-6">
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
            <div className="pr-8 border-b pb-4 border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold">{selected.experiment_title}</h2>
              <p className="text-sm text-slate-500 mt-1">{selected.boards?.name} {selected.classes?.name ? `• ${selected.classes.name}` : ''}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleDownloadPdf(selected.id)}
                disabled={downloadingPdf}
                className="btn-brutal px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50"
              >
                {downloadingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />} PDF Lab Report
              </button>
            </div>
            {pdfError && (
              <div className="flex items-center justify-between gap-3 bg-red-50 dark:bg-red-950/30 rounded-xl px-4 py-2.5">
                <p className="text-xs text-red-600 font-medium">{pdfError}</p>
                <button
                  onClick={() => handleRegeneratePdf(selected.id)}
                  disabled={regeneratingPdf}
                  className="shrink-0 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
                >
                  {regeneratingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />} Regenerate PDF
                </button>
              </div>
            )}
            <div className="space-y-4 text-sm">
              {Object.entries(selected.observations || {}).map(([k, v]) => (
                <div key={k} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
                  <p className="text-slate-600 dark:text-slate-300">{v}</p>
                </div>
              ))}
              {(!selected.observations || Object.keys(selected.observations).length === 0) && (
                <p className="text-slate-400 text-center py-4">No written observations were saved for this attempt.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
