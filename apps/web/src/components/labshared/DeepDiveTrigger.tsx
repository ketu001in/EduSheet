'use client';
import { useEffect, useState } from 'react';
import { Telescope, X } from 'lucide-react';
import { useDeepDive } from '@/lib/useDeepDives';
import TopicDeepDive from './TopicDeepDive';

// The single, reusable "doorway" affordance -- drop <DeepDiveTrigger id="..."/>
// into ANY existing card/list-item anywhere in the app, and if a matching
// deepDive.ts entry exists, it renders an "Explore" button that opens a
// full-screen deep-dive sheet for that exact item. Renders NOTHING if no
// entry exists yet for that id -- deliberately graceful, so wiring this
// into a list of 28 equipment items when only 8 have deep-dive content
// authored so far doesn't produce 20 dead buttons.
export default function DeepDiveTrigger({ id, label = 'Explore', className = '' }: { id: string; label?: string; className?: string }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const entry = useDeepDive(openId || id);
  const triggerEntry = useDeepDive(id);

  useEffect(() => {
    if (openId) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [openId]);

  if (!triggerEntry) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpenId(id)}
        className={`inline-flex items-center gap-1.5 text-xs font-bold rounded-full px-3 py-1.5 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all ${className}`}
      >
        <Telescope className="w-3.5 h-3.5" /> {label}
      </button>

      {openId && entry && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setOpenId(null)} />
          <div className="relative w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[85vh] overflow-y-auto bg-surface-light dark:bg-surface-dark rounded-t-3xl sm:rounded-3xl border-2 border-slate-900 dark:border-slate-700 shadow-2xl p-5 md:p-7">
            <button
              onClick={() => setOpenId(null)}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
            <TopicDeepDive entry={entry} onNavigate={setOpenId} />
          </div>
        </div>
      )}
    </>
  );
}
