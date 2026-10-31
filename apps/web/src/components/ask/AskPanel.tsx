'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Sparkles, X, Mic, MicOff, Send, Volume2, VolumeX, Loader2, Trash2, Square, ArrowRight, HelpCircle } from 'lucide-react';
import { getHelpEntryForPath } from '@edusheets/content';
import { useWorksheetStore } from '@/store/useWorksheetStore';
import { useWizardStore } from '@/store/useWizardStore';
import { askAgent, AskError, AskTurn, AskAgentAction } from '@/lib/ask';
import { speak, stopSpeaking, isSpeechSupported } from '@/lib/speech';
import SpeakButton from '@/components/labshared/SpeakButton';
import { useAskDetails } from './AskContext';

// A chat bubble that resolved to a routable action (currently just
// generate_worksheet) carries the action payload alongside its display text --
// everything else about rendering/history stays exactly AskTurn-shaped.
type ChatTurn = AskTurn & { action?: AskAgentAction };

const VISIBLE_TEXT_LIMIT = 5000;
const SPEAK_PREF_KEY = 'ask-ai-read-aloud';

// "Ask AI about this page" -- a floating assistant mounted once in
// (dashboard)/layout.tsx. Teacher/parent accounts only for now (it spends the
// account's own AI key; /api/ask enforces the same rule server-side).
// Questions can be typed or spoken (browser speech recognition), and answers
// stream in as text and can be read aloud with the app's existing speech
// helper. Context sent with each question: the page's help-registry entry,
// any details the page registered via usePageAskDetails, and the page's
// visible text.
export default function AskPanel() {
  const role = useWorksheetStore((s) => s.userProfile.role);
  const hasLoadedProfile = useWorksheetStore((s) => s.hasLoadedProfile);
  const pathname = usePathname() || '/';
  const router = useRouter();
  const pageDetails = useAskDetails();

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<AskError | null>(null);
  const [readAloud, setReadAloud] = useState(false);
  const [listening, setListening] = useState(false);
  const [micSupported, setMicSupported] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMicSupported(typeof window !== 'undefined' && !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition));
    try { setReadAloud(localStorage.getItem(SPEAK_PREF_KEY) === '1'); } catch { /* storage unavailable */ }
  }, []);

  // A new page is a new topic -- start a fresh conversation.
  useEffect(() => {
    abortRef.current?.abort();
    stopSpeaking();
    setTurns([]);
    setError(null);
  }, [pathname]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [turns]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  if (!hasLoadedProfile || (role !== 'teacher' && role !== 'parent')) return null;

  const help = getHelpEntryForPath(pathname);

  const buildPage = () => {
    const main = document.querySelector('main');
    const visible = (main?.innerText || '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim().slice(0, VISIBLE_TEXT_LIMIT);
    const parts = [pageDetails ? `Currently selected / in focus:\n${pageDetails}` : '', visible ? `Visible page text:\n${visible}` : ''];
    return { path: pathname, title: help.title, summary: help.summary, details: parts.filter(Boolean).join('\n\n') || undefined };
  };

  const ask = async (raw: string) => {
    const question = raw.trim();
    if (!question || streaming) return;
    stopSpeaking();
    setError(null);
    setInput('');
    const history = turns.slice(-10).map(({ role, content }) => ({ role, content }));
    setTurns([...turns, { role: 'user', content: question }, { role: 'assistant', content: '' }]);
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const result = await askAgent({ question, page: buildPage(), history }, controller.signal);
      if (controller.signal.aborted) return;
      if (result.type === 'action') {
        setTurns((cur) => {
          const next = [...cur];
          next[next.length - 1] = { role: 'assistant', content: result.label, action: result };
          return next;
        });
      } else {
        setTurns((cur) => {
          const next = [...cur];
          next[next.length - 1] = { role: 'assistant', content: result.content };
          return next;
        });
        if (readAloud) speak(result.content);
      }
    } catch (err) {
      if (controller.signal.aborted) return;
      setError(err instanceof AskError ? err : new AskError('FAILED', err instanceof Error ? err.message : String(err)));
      // Drop the empty assistant bubble if nothing arrived.
      setTurns((cur) => (cur[cur.length - 1]?.content ? cur : cur.slice(0, -1)));
    } finally {
      setStreaming(false);
    }
  };

  // Routes into the pre-filled wizard rather than generating anything itself
  // -- the user's own click on Generate still triggers the actual,
  // budget-consuming, persisted generation.
  const openInGenerate = (action: AskAgentAction) => {
    useWizardStore.getState().hydrateFromSelection(action.selection, {
      questionCount: action.settings.questionCount,
      difficulty: action.settings.difficulty,
      questionTypes: action.settings.questionTypes,
    });
    setOpen(false);
    router.push('/generate');
  };

  const stop = () => {
    abortRef.current?.abort();
    stopSpeaking();
    setStreaming(false);
  };

  const toggleMic = () => {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const Recognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!Recognition) return;
    stopSpeaking();
    const rec = new Recognition();
    rec.lang = navigator.language || 'en-IN';
    rec.interimResults = true;
    rec.continuous = false;
    let finalText = '';
    rec.onresult = (e: any) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += t; else interim += t;
      }
      setInput((finalText + interim).trim());
    };
    rec.onerror = (e: any) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        setError(new AskError('FAILED', 'Microphone access was blocked. Allow it in your browser\'s site settings to ask by voice.'));
      }
    };
    rec.onend = () => {
      setListening(false);
      recognitionRef.current = null;
      // Spoken questions send themselves once you stop talking.
      if (finalText.trim()) ask(finalText);
    };
    recognitionRef.current = rec;
    setListening(true);
    rec.start();
  };

  const toggleReadAloud = () => {
    const next = !readAloud;
    setReadAloud(next);
    if (!next) stopSpeaking();
    try { localStorage.setItem(SPEAK_PREF_KEY, next ? '1' : '0'); } catch { /* storage unavailable */ }
  };

  const suggestions = [`Explain this page simply`, `How can I teach this to a child?`, `Give me 3 quick quiz questions on this`];

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="print:hidden fixed z-40 right-4 bottom-20 lg:bottom-6 lg:right-6 flex items-center gap-2 pl-3.5 pr-4 py-3 rounded-full bg-primary-600 text-white font-bold text-sm border-2 border-slate-900 shadow-[3px_3px_0_var(--color-ink)] hover:-translate-y-0.5 transition-transform"
        aria-label="Ask AI about this page"
      >
        <Sparkles className="w-4 h-4" /> Ask AI
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-label="Ask AI about this page"
      className="print:hidden fixed z-40 right-2 left-2 bottom-20 sm:left-auto sm:right-4 lg:bottom-6 lg:right-6 sm:w-[420px] max-h-[min(640px,calc(100vh-7rem))] flex flex-col rounded-2xl border-2 border-slate-900 dark:border-slate-700 bg-surface-light dark:bg-surface-dark shadow-[4px_4px_0_var(--color-ink)]"
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
        <Sparkles className="w-4 h-4 text-primary-600 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-bold text-sm leading-tight">Ask AI</p>
          <p className="text-[11px] text-slate-500 truncate">About: {help.title}</p>
        </div>
        <Link href="/help/ask-ai" title="How Ask AI works" className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 shrink-0">
          <HelpCircle className="w-4 h-4" />
        </Link>
        {isSpeechSupported() && (
          <button onClick={toggleReadAloud} title={readAloud ? 'Read answers aloud: on' : 'Read answers aloud: off'} aria-pressed={readAloud} className={`p-1.5 rounded-lg ${readAloud ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'text-slate-400 hover:text-slate-600'}`}>
            {readAloud ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        )}
        {turns.length > 0 && (
          <button onClick={() => { stop(); setTurns([]); setError(null); }} title="Clear conversation" className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
        <button onClick={() => { stop(); recognitionRef.current?.abort?.(); setOpen(false); }} title="Close" className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[160px]">
        {turns.length === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-slate-500 leading-relaxed">Ask anything about what's on this page -- type, or tap the mic and speak.</p>
            <div className="flex flex-col gap-2">
              {suggestions.map((s) => (
                <button key={s} onClick={() => ask(s)} className="text-left text-xs font-semibold px-3 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-800 hover:border-primary-400 hover:text-primary-600 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {turns.map((t, i) => (
          t.role === 'user' ? (
            <div key={i} className="ml-8 rounded-2xl rounded-br-sm bg-primary-600 text-white text-sm px-3 py-2 whitespace-pre-wrap">{t.content}</div>
          ) : t.action ? (
            <div key={i} className="mr-4 space-y-2">
              <div className="rounded-2xl rounded-bl-sm bg-slate-100 dark:bg-slate-800/60 text-sm px-3 py-2 leading-relaxed text-slate-700 dark:text-slate-200">
                {t.content}
              </div>
              <button
                onClick={() => openInGenerate(t.action!)}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white transition-colors"
              >
                Open in Generate <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div key={i} className="mr-4 space-y-1.5">
              <div className="rounded-2xl rounded-bl-sm bg-slate-100 dark:bg-slate-800/60 text-sm px-3 py-2 leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-200">
                {t.content || <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
              </div>
              {t.content && !(streaming && i === turns.length - 1) && <SpeakButton text={t.content} />}
            </div>
          )
        ))}
        {error && (
          <div className="text-xs rounded-xl px-3 py-2 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900 space-y-2">
            <p>{error.message}</p>
            {error.code === 'AI_KEY_REQUIRED' && (
              <Link href="/profile#ai-provider" className="inline-block px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold">Set up your key</Link>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800 p-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(input); }
            }}
            rows={1}
            maxLength={1000}
            placeholder={listening ? 'Listening...' : 'Ask about this page...'}
            className="flex-1 resize-none max-h-28 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
          />
          {micSupported && (
            <button onClick={toggleMic} disabled={streaming} title={listening ? 'Stop listening' : 'Ask by voice'} className={`p-2.5 rounded-xl border-2 transition-colors disabled:opacity-40 ${listening ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-600 animate-pulse' : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary-600'}`}>
              {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}
          {streaming ? (
            <button onClick={stop} title="Stop" className="p-2.5 rounded-xl border-2 border-slate-900 bg-slate-900 text-white dark:border-slate-600">
              <Square className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={() => ask(input)} disabled={!input.trim()} title="Send" className="p-2.5 rounded-xl border-2 border-slate-900 bg-primary-600 text-white disabled:opacity-40">
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-[10px] text-slate-400 mt-1.5">Uses your own AI key. AI can make mistakes -- check important facts.</p>
      </div>
    </div>
  );
}
