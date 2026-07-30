'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { KeyRound, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';

// Shown after login when the user hasn't configured their own AI provider
// key yet -- there is no app-wide shared key, so generation is disabled
// until they add one. Renders nothing once a key is confirmed present.
export function AiKeyBanner() {
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    api.get<{ success: boolean; data: { provider: string | null; hasKey: boolean } }>('/api/users/ai-settings')
      .then((res) => setHasKey(res.data.hasKey))
      .catch(() => setHasKey(null));
  }, []);

  if (hasKey !== false) return null;

  return (
    <div className="glass-card p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-amber-200 dark:border-amber-900 bg-amber-50/60 dark:bg-amber-950/20">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
          <KeyRound className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-amber-900 dark:text-amber-200 text-sm">Add your AI key to start generating</h3>
          <p className="text-xs text-amber-700 dark:text-amber-400">Bosket&apos;s EduSheet uses your own key from Groq, OpenAI, or Gemini &mdash; free options are available.</p>
        </div>
      </div>
      <Link
        href="/profile#ai-provider"
        className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 shrink-0 transition-colors"
      >
        Set up your key <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
