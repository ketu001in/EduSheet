import { createAIProvider, WorksheetPromptConfig, Question as AIQuestion } from '@edusheets/ai';
import { trackActivity } from './behaviorService';
import { generateWorksheetPDF, generateAnswerKeyPDF } from './pdfService';
import { uploadPDF } from './storageService';

export interface GenerateWorksheetInput {
  title?: string;
  board: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  chapterId?: string;
  chapterName?: string;
  topicIds?: string[];
  topics: string[];
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  questionCount: number;
  questionTypes: string[];
  language?: string;
}

// Maps the AI package's prompt-facing type keys to the DB's question_type enum values.
const AI_TYPE_TO_DB_TYPE: Record<string, string> = {
  mcq: 'mcq',
  fill_in_the_blank: 'fill_in_blank',
  true_false: 'true_false',
  match: 'match_following',
  short_answer: 'short_answer',
  long_answer: 'long_answer',
  word_problem: 'word_problem',
  diagram: 'diagram_based',
  logical_reasoning: 'logical_reasoning',
};

function distributeQuestionCounts(totalCount: number, types: string[]): Record<string, number> {
  if (types.length === 0) return { mcq: totalCount };
  const base = Math.floor(totalCount / types.length);
  let remainder = totalCount - base * types.length;
  const result: Record<string, number> = {};
  for (const type of types) {
    result[type] = base + (remainder > 0 ? 1 : 0);
    if (remainder > 0) remainder -= 1;
  }
  return result;
}

function sectionTitleForType(type: string): string {
  const labels: Record<string, string> = {
    mcq: 'Multiple Choice Questions',
    fill_in_the_blank: 'Fill in the Blanks',
    true_false: 'True or False',
    match: 'Match the Following',
    short_answer: 'Short Answer Questions',
    long_answer: 'Long Answer Questions',
    word_problem: 'Word Problems',
    diagram: 'Diagram Based Questions',
    logical_reasoning: 'Logical Reasoning',
  };
  return labels[type] || 'Questions';
}

// Language subjects (Hindi, Sanskrit) must produce worksheets written IN that
// language, not English worksheets that merely mention it as a subject name.
// The wizard doesn't collect a language explicitly, so infer it from the
// subject unless the caller passed one.
function inferLanguage(subjectName: string, explicit?: string): string {
  if (explicit) return explicit;
  const name = subjectName.toLowerCase();
  if (name.includes('hindi')) return 'Hindi';
  if (name.includes('sanskrit')) return 'Sanskrit';
  return 'English';
}

export interface AIProviderOverride {
  provider: 'groq' | 'openai' | 'gemini' | 'anthropic';
  apiKey: string;
}

export const generateWorksheet = async (
  input: GenerateWorksheetInput,
  userId: string,
  supabase: any,
  aiOverride: AIProviderOverride
) => {
  if (!input.classId || !input.subjectId || !input.questionCount || !input.questionTypes?.length) {
    throw new Error('Invalid worksheet configuration');
  }

  // 1. Build the prompt config and call the AI provider.
  const questionTypeCounts = distributeQuestionCounts(input.questionCount, input.questionTypes);
  const language = inferLanguage(input.subjectName, input.language);
  const promptConfig: WorksheetPromptConfig = {
    classLevel: input.className,
    subject: input.subjectName,
    chapter: input.chapterName,
    topics: input.topics.length > 0 ? input.topics : ['General chapter concepts'],
    questionTypes: questionTypeCounts,
    difficulty: input.difficulty,
    language,
  };

  const provider = createAIProvider({ provider: aiOverride.provider, apiKey: aiOverride.apiKey });
  const generated = await provider.generateWorksheet(promptConfig);

  const totalMarks = generated.questions.reduce((sum, q) => sum + (q.marks || 1), 0);

  // 2. Save the worksheet record.
  const { data: worksheet, error: wsError } = await supabase
    .from('worksheets')
    .insert({
      creator_id: userId,
      title: input.title || generated.title || `${input.subjectName} Worksheet`,
      description: generated.description || null,
      class_id: input.classId,
      subject_id: input.subjectId,
      chapter_id: input.chapterId || null,
      difficulty: input.difficulty,
      total_marks: totalMarks,
      question_count: generated.questions.length,
      question_types: input.questionTypes,
      settings: {
        board: input.board,
        topics: input.topics,
        topicIds: input.topicIds || [],
        language,
      },
    })
    .select()
    .single();

  if (wsError) throw new Error(`Failed to save worksheet: ${wsError.message}`);

  // 3. Save the questions.
  const questionsToInsert = generated.questions.map((q: AIQuestion, idx: number) => ({
    worksheet_id: worksheet.id,
    question_text: q.text,
    question_type: AI_TYPE_TO_DB_TYPE[q.type] || 'short_answer',
    options: q.options && q.options.length > 0 ? q.options : null,
    correct_answer: Array.isArray(q.answer) ? q.answer.join(', ') : String(q.answer),
    explanation: q.explanation || null,
    marks: q.marks || 1,
    order_index: idx + 1,
  }));

  const { data: savedQuestions, error: qError } = await supabase
    .from('worksheet_questions')
    .insert(questionsToInsert)
    .select();

  if (qError) throw new Error(`Failed to save questions: ${qError.message}`);

  // 4. Track topic engagement (best-effort, never fails the request).
  for (const topicId of input.topicIds || []) {
    try {
      await trackActivity(userId, topicId, {});
    } catch (err) {
      console.error('Failed to track topic activity:', err);
    }
  }

  // 5. Generate + upload PDFs (best-effort, never fails the request).
  const pdfQuestions = generated.questions.map((q, idx) => ({
    id: String(idx + 1),
    type: q.type,
    text: q.text,
    options: q.options,
    answer: Array.isArray(q.answer) ? q.answer.join(', ') : String(q.answer),
    marks: q.marks,
  }));
  const pdfMeta = {
    title: worksheet.title,
    class: input.className,
    subject: input.subjectName,
    language,
  };

  let pdfStoragePath: string | null = null;
  let answerKeyPdfPath: string | null = null;
  try {
    const [worksheetPdf, answerKeyPdf] = await Promise.all([
      generateWorksheetPDF(pdfMeta, pdfQuestions as any),
      generateAnswerKeyPDF(pdfMeta, pdfQuestions as any),
    ]);
    pdfStoragePath = await uploadPDF(userId, worksheet.id, worksheetPdf);
    answerKeyPdfPath = await uploadPDF(userId, `${worksheet.id}-answers`, answerKeyPdf);

    await supabase
      .from('worksheets')
      .update({ pdf_storage_path: pdfStoragePath, answer_key_pdf_path: answerKeyPdfPath })
      .eq('id', worksheet.id);
  } catch (pdfErr) {
    console.error('Failed to pre-generate PDF:', pdfErr);
  }

  // 6. Group questions into print-friendly sections by type for the client.
  const sectionOrder = input.questionTypes;
  const sections = sectionOrder
    .map((type) => ({
      sectionTitle: sectionTitleForType(type),
      questions: savedQuestions
        .filter((q: any) => q.question_type === AI_TYPE_TO_DB_TYPE[type])
        .map((q: any, idx: number) => ({
          number: q.order_index,
          question: q.question_text,
          type: q.question_type,
          options: q.options || undefined,
          answer: q.correct_answer,
          explanation: q.explanation || undefined,
        })),
    }))
    .filter((section) => section.questions.length > 0);

  return {
    worksheet: {
      ...worksheet,
      pdfStoragePath,
      answerKeyPdfPath,
    },
    sections,
  };
};
