'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { X, HelpCircle, FileText, Search, Download, Loader2 } from 'lucide-react';
import { getHelpEntryForPath } from '@edusheets/content';
import { downloadUserGuidePdf } from '@/lib/help';
import { useHelp } from './HelpProvider';

// The F1 contextual help drawer, mounted once in (dashboard)/layout.tsx so
// it's reachable from anywhere. Slides in from the right, mirroring
// MobileMenu's left-side nav drawer (same backdrop + <aside> + body-scroll
// lock pattern, see globals.css's help-drawer-slide-in keyframe).
export default function HelpPanel() {
  const { isOpen, close } = useHelp();
  const pathname = usePathname();
  const entry = getHelpEntryForPath(pathname || '/');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-[mobile-drawer-fade_0.2s_ease-out]" onClick={close} />
      <aside className="absolute right-0 top-0 bottom-0 w-full sm:w-[420px] bg-surface-light dark:bg-surface-dark border-l-[3px] border-slate-900 dark:border-[#FDF3D9] flex flex-col animate-[help-drawer-slide-in_0.22s_ease-out]">
        <div className="p-5 flex items-center justify-between border-b-[3px] border-slate-900 dark:border-[#FDF3D9] shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <HelpCircle className="w-5 h-5 text-primary-600 shrink-0" />
            <span className="font-display text-sm font-semibold tracking-tight text-slate-900 dark:text-white truncate">Help</span>
          </div>
          <button
            onClick={close}
            aria-label="Close help"
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">{entry.title}</h2>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{entry.summary}</p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">What you can do here</h3>
            <ul className="space-y-1.5">
              {entry.keyActions.map((action, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {entry.tips && entry.tips.length > 0 && (
            <div className="rounded-xl bg-secondary-50 dark:bg-slate-800/60 border-2 border-slate-900 dark:border-[#FDF3D9]/40 p-3.5">
              <h3 className="text-xs font-bold uppercase tracking-wide text-secondary-600 dark:text-secondary-400 mb-1.5">Tips</h3>
              <ul className="space-y-1.5">
                {entry.tips.map((tip, i) => (
                  <li key={i} className="text-sm text-slate-700 dark:text-slate-300">{tip}</li>
                ))}
              </ul>
            </div>
          )}

          <Link
            href={`/help/${entry.id}`}
            onClick={close}
            className="flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
          >
            <FileText className="w-4 h-4" /> View full article
          </Link>
        </div>

        <div className="p-4 border-t-[3px] border-slate-900 dark:border-[#FDF3D9] space-y-2 shrink-0">
          <Link
            href="/help"
            onClick={close}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border-2 border-slate-900 dark:border-[#FDF3D9]/80 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Search className="w-4 h-4" /> Search all docs
          </Link>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors disabled:opacity-60"
          >
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {downloading ? 'Preparing PDF...' : 'Download full guide (PDF)'}
          </button>
        </div>
      </aside>
    </div>
  );
}
