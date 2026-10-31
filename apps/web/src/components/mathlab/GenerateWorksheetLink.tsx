'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Loader2 } from 'lucide-react';
import { useWizardStore } from '@/store/useWizardStore';
import { resolveMathTopic } from '@/lib/mathLab';

// One reusable "Generate a worksheet on this" button, dropped into every
// Math Lab surface that has real chapterTags -- experiments, theorems,
// formulas, Geometry Explorer's categories, games, and Vedic Math sutras.
// Does exactly what AskPanel.tsx's "Open in Generate" already does on a
// successful generate_worksheet action: resolve a real curriculum
// selection, hydrate the wizard, and route into it -- the only difference
// is the selection comes from this content's own chapterTags/gradeBand/
// board instead of an LLM's free-text guess (see
// apps/api/src/routes/mathLabRoutes.ts's /resolve-topic).
export default function GenerateWorksheetLink({
  chapterTags,
  gradeBand,
  board,
  label = 'Generate a worksheet on this',
  className = '',
}: {
  chapterTags: string[];
  gradeBand: string;
  board: 'CBSE' | 'ICSE' | 'both';
  label?: string;
  className?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const go = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await resolveMathTopic({ chapterTags, gradeBand, board });
      useWizardStore.getState().hydrateFromSelection(res.selection);
      router.push('/generate');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not find a matching worksheet topic.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <button
        onClick={go}
        disabled={loading}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700 disabled:opacity-60"
      >
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
        {label}
      </button>
      {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
    </div>
  );
}
