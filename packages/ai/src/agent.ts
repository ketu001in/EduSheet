import OpenAI from 'openai';
import { AIConfig } from './providers/base';
import { CHAT_ENDPOINTS, TutorPageContext, TutorTurn, buildTutorSystemPrompt } from './tutor';

// Pilot "agentic" layer: a single non-streaming call that either answers in
// plain text (same tutor behaviour as streamTutorAnswer) or decides to call
// the one tool below -- never both, and never a multi-step loop. Kept to one
// LLM call per turn on purpose: the actual worksheet generation this routes
// towards already burns its own aiLimiter budget when the user clicks
// Generate, so this must not add a second AI call on top of that for the
// decision step alone.
export interface GenerateWorksheetToolArgs {
  boardCode: string;
  className: string;
  subjectName: string;
  chapterName?: string;
  questionCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  questionTypes: string[];
  title?: string;
}

export type AgentDecision =
  | { type: 'tool'; name: 'generate_worksheet'; args: GenerateWorksheetToolArgs }
  | { type: 'text'; content: string };

// Enum values match QUESTION_TYPE_OPTIONS in apps/web/src/lib/worksheet.ts --
// keep these in sync if that list changes.
const GENERATE_WORKSHEET_TOOL = {
  type: 'function' as const,
  function: {
    name: 'generate_worksheet',
    description: 'Set up a new worksheet for the user in the Generate wizard, from a curriculum board/class/subject/chapter and question settings. Call this whenever the user is asking to create, make, or generate a worksheet -- not just discussing worksheets in the abstract.',
    parameters: {
      type: 'object',
      properties: {
        boardCode: { type: 'string', description: 'Education board, e.g. "CBSE" or "ICSE". Default "CBSE" if not stated.' },
        className: { type: 'string', description: 'Class/grade, e.g. "Class 8".' },
        subjectName: { type: 'string', description: 'Subject, e.g. "Science", "Mathematics".' },
        chapterName: { type: 'string', description: 'Chapter name if mentioned, e.g. "Photosynthesis". Omit if not mentioned.' },
        questionCount: { type: 'number', description: 'Number of questions, 1-50. Default 10 if not stated.' },
        difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'], description: 'Default "medium" if not stated.' },
        questionTypes: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['mcq', 'fill_in_the_blank', 'true_false', 'match', 'short_answer', 'long_answer', 'word_problem', 'diagram', 'logical_reasoning', 'coloring', 'tracing'],
          },
          description: 'Question types to include. Default ["mcq"] if not stated.',
        },
        title: { type: 'string', description: 'Optional custom worksheet title, only if explicitly asked for.' },
      },
      required: ['boardCode', 'className', 'subjectName', 'questionCount', 'difficulty', 'questionTypes'],
    },
  },
};

export async function decideWorksheetAction(
  config: AIConfig & { baseURL?: string },
  page: TutorPageContext,
  audience: 'teacher' | 'parent',
  history: TutorTurn[],
  question: string
): Promise<AgentDecision> {
  const endpoint = CHAT_ENDPOINTS[config.provider] ?? CHAT_ENDPOINTS.groq;
  const client = new OpenAI({ apiKey: config.apiKey, baseURL: config.baseURL || endpoint.baseURL });
  const model = config.model || endpoint.model;

  const messages = [
    {
      role: 'system' as const,
      content: `${buildTutorSystemPrompt(page, audience)}\n\nIf the user is asking you to create, make, or generate a worksheet, call the generate_worksheet tool with your best understanding of their request. Otherwise, answer normally in plain text as described above.`,
    },
    ...history.map((t) => ({ role: t.role, content: t.content })),
    { role: 'user' as const, content: question },
  ];

  let response;
  try {
    response = await client.chat.completions.create({
      model,
      messages,
      temperature: 0.3,
      max_tokens: 900,
      tools: [GENERATE_WORKSHEET_TOOL],
      tool_choice: 'auto',
    });
  } catch (err) {
    // Some providers (Sarvam, the unverified Anthropic-via-OpenAI-shim path)
    // may reject the `tools` param outright -- degrade to a plain prose call
    // rather than breaking the panel for those users.
    console.warn('Tool-enabled ask call failed, falling back to plain text:', err instanceof Error ? err.message : err);
    const plain = await client.chat.completions.create({ model, messages, temperature: 0.4, max_tokens: 900 });
    return { type: 'text', content: plain.choices[0]?.message?.content || '' };
  }

  const toolCall = response.choices[0]?.message?.tool_calls?.[0];
  if (toolCall?.function?.name === 'generate_worksheet') {
    try {
      const args = JSON.parse(toolCall.function.arguments) as GenerateWorksheetToolArgs;
      return { type: 'tool', name: 'generate_worksheet', args };
    } catch (err) {
      console.warn('Malformed generate_worksheet tool arguments, falling back to text:', err);
    }
  }
  return { type: 'text', content: response.choices[0]?.message?.content || '' };
}
