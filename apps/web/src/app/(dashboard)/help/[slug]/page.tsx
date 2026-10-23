'use client';
import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { HELP_REGISTRY, HELP_CATEGORIES, getHelpEntryById } from '@edusheets/content';

export default function HelpArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const entry = getHelpEntryById(slug);
  if (!entry) notFound();

  const category = HELP_CATEGORIES.find((c) => c.id === entry.category);
  const related = HELP_REGISTRY.filter((e) => e.category === entry.category && e.id !== entry.id).slice(0, 6);

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <Link href="/help" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Help &amp; Documentation
      </Link>

      <div>
        {category && (
          <span className="px-2.5 py-1 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-lg text-xs font-bold uppercase">
            {category.label}
          </span>
        )}
        <h1 className="text-3xl font-bold mt-3 mb-2">{entry.title}</h1>
        <p className="text-slate-600 dark:text-slate-400">{entry.summary}</p>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">What you can do here</h2>
        <ul className="space-y-2">
          {entry.keyActions.map((action, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
              <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </div>

      {entry.tips && entry.tips.length > 0 && (
        <div className="rounded-2xl bg-secondary-50 dark:bg-slate-800/60 border-2 border-slate-900 dark:border-[#FDF3D9]/40 p-6">
          <h2 className="text-xs font-bold uppercase tracking-wide text-secondary-600 dark:text-secondary-400 mb-3">Tips</h2>
          <ul className="space-y-2">
            {entry.tips.map((tip, i) => (
              <li key={i} className="text-sm text-slate-700 dark:text-slate-300">{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {entry.longDescription && entry.longDescription.length > 0 && (
        <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {entry.longDescription.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      )}

      {related.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">Related articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/help/${r.id}`}
                className="glass-card rounded-xl p-4 hover:border-primary-500/50 transition-all flex items-center justify-between gap-2 group"
              >
                <span className="text-sm font-semibold group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {r.title}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
