import OpenAI from 'openai';
import { AIConfig } from './providers/base';

// "Ask about this page" -- a short conversational answer about whatever the
// user currently has open, streamed token by token. Separate from the
// AIProvider classes because those all produce one large JSON document in a
// single non-streamed call; this is plain prose, streamed.
//
// Every supported provider exposes an OpenAI-compatible chat completions
// endpoint (Groq included, at /openai/v1), so one streaming code path covers
// them all. Default models match createAIProvider() in providers/index.ts.
const CHAT_ENDPOINTS: Record<AIConfig['provider'], { baseURL: string; model: string }> = {
  groq: { baseURL: 'https://api.groq.com/openai/v1', model: 'openai/gpt-oss-120b' },
  openai: { baseURL: 'https://api.openai.com/v1', model: 'gpt-4o-mini' },
  gemini: { baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai', model: 'gemini-2.0-flash' },
  sarvam: { baseURL: 'https://api.sarvam.ai/v1', model: 'sarvam-105b' },
  anthropic: { baseURL: 'https://api.anthropic.com/v1', model: 'claude-opus-5' },
};

export interface TutorPageContext {
  path: string;
  title: string;
  // What the help registry says this page is for.
  summary?: string;
  // Page-supplied specifics (e.g. "Anatomy Explorer: The Ear, selected part:
  // Cochlea -- ...") plus the page's visible text, already trimmed by the
  // client.
  details?: string;
}

export interface TutorTurn {
  role: 'user' | 'assistant';
  content: string;
}

export function buildTutorSystemPrompt(page: TutorPageContext, audience: 'teacher' | 'parent'): string {
  const who = audience === 'teacher'
    ? 'a school teacher preparing or running a lesson'
    : 'a parent helping their child learn at home';
  return [
    `You are the built-in learning assistant of Bosket's EDStudio, an Indian K-12 learning platform (CBSE and ICSE). You are talking to ${who}.`,
    '',
    'The user is currently looking at this page:',
    `- Page: ${page.title} (${page.path})`,
    page.summary ? `- What this page is for: ${page.summary}` : '',
    page.details ? `\nWhat is on the page right now:\n"""\n${page.details}\n"""` : '',
    '',
    'How to answer:',
    '- Answer questions about this page\'s subject matter and about how to use this page. Base your answer on the page content above first; add accurate general knowledge where it helps.',
    '- Be accurate and age-appropriate for school students. If you are not sure, say so rather than guessing.',
    '- When useful, suggest how the adult could explain the idea to a child, or a quick activity or question to check understanding.',
    '- Keep answers short: usually 2-5 short paragraphs or a brief list, under about 200 words, unless the user asks for more detail.',
    '- Write plain text that also sounds natural when read aloud: no tables, no code blocks, no headings. Simple "- " bullet lists are fine.',
    '- If the question is unrelated to learning or to this platform, or is inappropriate for an educational setting, politely decline and steer back to the page.',
    '- Reply in the same language the user writes in.',
  ].filter((line) => line !== '').join('\n');
}

export async function* streamTutorAnswer(
  // baseURL overrides the provider's endpoint -- only used by tests.
  config: AIConfig & { baseURL?: string },
  page: TutorPageContext,
  audience: 'teacher' | 'parent',
  history: TutorTurn[],
  question: string
): AsyncGenerator<string> {
  const endpoint = CHAT_ENDPOINTS[config.provider] ?? CHAT_ENDPOINTS.groq;
  const client = new OpenAI({ apiKey: config.apiKey, baseURL: config.baseURL || endpoint.baseURL });

  const stream = await client.chat.completions.create({
    model: config.model || endpoint.model,
    messages: [
      { role: 'system', content: buildTutorSystemPrompt(page, audience) },
      ...history.map((t) => ({ role: t.role, content: t.content })),
      { role: 'user', content: question },
    ],
    temperature: 0.4,
    max_tokens: 900,
    stream: true,
  });

  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content;
    if (text) yield text;
  }
}
