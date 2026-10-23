import { createClient } from './supabase/client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Must match STREAM_ERROR_MARKER in apps/api/src/routes/askRoutes.ts.
const STREAM_ERROR_MARKER = '\u0000ERROR:';

export interface AskPage {
  path: string;
  title: string;
  summary?: string;
  details?: string;
}

export interface AskTurn {
  role: 'user' | 'assistant';
  content: string;
}

export class AskError extends Error {
  constructor(public code: 'AI_KEY_REQUIRED' | 'RATE_LIMITED' | 'FORBIDDEN' | 'FAILED', message: string) {
    super(message);
  }
}

export interface AskAgentSelection {
  boardId: string; board: string;
  classId: string; className: string;
  subjectId: string; subjectName: string;
  chapterId?: string; chapterName?: string;
}

export interface AskAgentSettings {
  questionCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  questionTypes: string[];
  title?: string;
}

export interface AskAgentAction {
  type: 'action';
  action: 'generate_worksheet';
  selection: AskAgentSelection;
  settings: AskAgentSettings;
  label: string;
}

export interface AskAgentText {
  type: 'text';
  content: string;
}

export type AskAgentResult = AskAgentAction | AskAgentText;

// POSTs the question and calls onText with each streamed chunk as it
// arrives. Resolves with the full answer once the stream ends.
export async function streamAsk(
  body: { question: string; page: AskPage; history: AskTurn[] },
  onText: (chunk: string) => void,
  signal?: AbortSignal
): Promise<string> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  const res = await fetch(`${API_URL}/api/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok || !res.body) {
    let message = `Request failed (${res.status})`;
    try {
      const parsed = await res.json();
      message = parsed?.error || message;
    } catch {
      // not JSON
    }
    if (message === 'AI_KEY_REQUIRED') throw new AskError('AI_KEY_REQUIRED', 'Add your AI provider key in Profile settings to use Ask AI.');
    if (res.status === 429) throw new AskError('RATE_LIMITED', 'Too many questions in a short time -- please wait a minute and try again.');
    if (res.status === 403) throw new AskError('FORBIDDEN', 'Ask AI is available to teacher and parent accounts only.');
    throw new AskError('FAILED', message);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let full = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    const text = decoder.decode(value, { stream: true });
    const markerAt = text.indexOf(STREAM_ERROR_MARKER);
    if (markerAt >= 0) {
      if (markerAt > 0) { full += text.slice(0, markerAt); onText(text.slice(0, markerAt)); }
      throw new AskError('FAILED', `The answer was cut short: ${text.slice(markerAt + STREAM_ERROR_MARKER.length)}`);
    }
    full += text;
    onText(text);
  }
  return full;
}

// Pilot "agentic" call: one plain JSON request (not streamed, since
// tool-calling requires a non-streaming response -- see packages/ai's
// decideWorksheetAction). Either answers in text or returns a resolved
// generate_worksheet action for the caller to route into the wizard.
export async function askAgent(
  body: { question: string; page: AskPage; history: AskTurn[] },
  signal?: AbortSignal
): Promise<AskAgentResult> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  const res = await fetch(`${API_URL}/api/ask/agent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
    },
    body: JSON.stringify(body),
    signal,
  });

  const parsed = await res.json().catch(() => null);

  if (!res.ok || !parsed?.success) {
    const message = parsed?.error || `Request failed (${res.status})`;
    if (message === 'AI_KEY_REQUIRED') throw new AskError('AI_KEY_REQUIRED', 'Add your AI provider key in Profile settings to use Ask AI.');
    if (res.status === 429) throw new AskError('RATE_LIMITED', 'Too many questions in a short time -- please wait a minute and try again.');
    if (res.status === 403) throw new AskError('FORBIDDEN', 'Ask AI is available to teacher and parent accounts only.');
    throw new AskError('FAILED', message);
  }

  return parsed as AskAgentResult;
}
