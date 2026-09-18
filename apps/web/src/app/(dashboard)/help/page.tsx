'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, ChevronRight, Download, Loader2, HelpCircle } from 'lucide-react';
import { HELP_REGISTRY, HELP_CATEGORIES } from '@edusheets/content';
import { downloadUserGuidePdf } from '@/lib/help';

export default function HelpCenterPage() {
  const [query, setQuery] = useState('');
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadUserGuidePdf();
    } catch (err) {
      console.error('Failed to download user guide PDF:', err);
    } finally {
      setDownloading(false);
    }
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return HELP_REGISTRY.filter(
      (e) => e.title.toLowerCase().includes(q) || e.summary.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="mb-2">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <HelpCircle className="w-7 h-7 text-primary-600" /> Help &amp; Documentation
        </h1>
        <p className="text-slate-500 text-sm">
          The full, searchable version of the same help you get from pressing ? on any page.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface-light dark:bg-surface-dark rounded-full border-2 border-slate-900 dark:border-[#FDF3D9]/80 focus:border-primary-600 outline-none text-sm transition-colors"
          />
        </div>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="btn-brutal px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60 shrink-0"
        >
          {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {downloading ? 'Preparing PDF...' : 'Download full guide (PDF)'}
        </button>
      </div>

      {results ? (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">
            {results.length} result{results.length === 1 ? '' : 's'} for &ldquo;{query}&rdquo;
          </h2>
          {results.length === 0 ? (
            <div className="glass-card p-12 rounded-3xl text-center text-sm text-slate-500">
              No articles matched your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((entry) => (
                <ArticleCard key={entry.id} id={entry.id} title={entry.title} summary={entry.summary} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-10">
          {HELP_CATEGORIES.map((cat) => {
            const entries = HELP_REGISTRY.filter((e) => e.category === cat.id);
            if (entries.length === 0) return null;
            return (
              <div key={cat.id}>
                <div className="mb-3">
                  <h2 className="text-lg font-bold">{cat.label}</h2>
                  <p className="text-sm text-slate-500">{cat.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {entries.map((entry) => (
                    <ArticleCard key={entry.id} id={entry.id} title={entry.title} summary={entry.summary} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ArticleCard({ id, title, summary }: { id: string; title: string; summary: string }) {
  return (
    <Link
      href={`/help/${id}`}
      className="glass-card rounded-2xl p-5 hover:border-primary-500/50 transition-all flex items-start justify-between gap-3 group"
    >
      <div className="min-w-0">
        <h3 className="font-bold text-sm mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2">{summary}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform" />
    </Link>
  );
}
