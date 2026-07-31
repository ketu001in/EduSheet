import { createAIProvider, WorksheetPromptConfig, Question as AIQuestion } from '@edusheets/ai';
import { trackActivity } from './behaviorService';
import { generateWorksheetPDF, generateAnswerKeyPDF } from './pdfService';
import { uploadPDF } from './storageService';
import { generateAndStoreDiagramImage } from './diagramImageService';

// For every question with image-generation prompts (diagram/coloring's
// `diagram.imagePrompt`, or match's `matchImages` array), generates and
// persists real reference images, then attaches the resulting URLs. Entirely
// best-effort -- a failed/slow image generation just leaves that one image
// missing (pdfService/DiagramPreview both handle that gracefully with a text
// fallback), it must never fail worksheet generation.
//
// Runs strictly SERIALLY, not in parallel: Pollinations' free anonymous tier
// allows roughly one request per ~15s per IP. A worksheet with several
// diagram/coloring/match-image questions firing all their image requests at
// once reliably triggers 429s across the whole batch (confirmed: a single
// 8-question test worksheet lost 100% of its images this way) -- one at a
// time is slower but actually succeeds instead of racing itself into failure.
async function attachGeneratedImages(questions: AIQuestion[], worksheetId: string): Promise<AIQuestion[]> {
  const results: AIQuestion[] = [];
  for (let idx = 0; idx < questions.length; idx++) {
    let next = questions[idx];

    if (next.diagram?.imagePrompt) {
      const imageUrl = await generateAndStoreDiagramImage(worksheetId, idx, next.diagram.imagePrompt);
      if (imageUrl) next = { ...next, diagram: { ...next.diagram, imageUrl } };
    }

    if (Array.isArray(next.matchImages) && next.matchImages.length > 0) {
      const matchImageUrls: (string | null)[] = [];
      for (let imgIdx = 0; imgIdx < next.matchImages.length; imgIdx++) {
        const prompt = next.matchImages[imgIdx];
        matchImageUrls.push(prompt ? await generateAndStoreDiagramImage(worksheetId, `${idx}-match-${imgIdx}`, prompt) : null);
      }
      next = { ...next, matchImageUrls };
    }

    results.push(next);
  }
  return results;
}

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
  coloring: 'coloring_sheet',
  tracing: 'tracing',
};

// worksheet_questions.diagram is a general-purpose JSONB "extras" column, not
// strictly limited to diagram data -- reused here for tracing/match-image
// data too, rather than adding a dedicated column per new question type.
function buildQuestionExtras(q: AIQuestion): Record<string, any> | null {
  if (q.diagram) return q.diagram;
  if (q.traceContent) return { traceContent: q.traceContent };
  if (q.matchImages?.length) return { matchImages: q.matchImages, matchImageUrls: q.matchImageUrls };
  return null;
}

// Inverse of the above -- pdfService's Question.type expects the AI-key
// vocabulary (e.g. "fill_in_the_blank"), not the DB enum ("fill_in_blank").
const DB_TYPE_TO_AI_TYPE: Record<string, string> = Object.fromEntries(
  Object.entries(AI_TYPE_TO_DB_TYPE).map(([aiType, dbType]) => [dbType, aiType])
);

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
    coloring: 'Coloring Sheets',
    tracing: 'Tracing Practice',
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

// Ad-hoc worksheet generation -- not tied to the curriculum tables (no board/
// class_id/subject_id/chapter_id), so it works for any board or class level,
// keyed instead on plain-text class/subject/topic plus a free-text "requirement"
// prompt describing what the worksheet should contain.
export interface GenerateCustomWorksheetInput {
  title?: string;
  className: string;
  subjectName: string;
  topic: string;
  requirement?: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  questionCount: number;
  questionTypes: string[];
  language?: string;
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

  // 3. Generate real reference images for any diagram questions, then save questions.
  generated.questions = await attachGeneratedImages(generated.questions, worksheet.id);
  const questionsToInsert = generated.questions.map((q: AIQuestion, idx: number) => ({
    worksheet_id: worksheet.id,
    question_text: q.text,
    question_type: AI_TYPE_TO_DB_TYPE[q.type] || 'short_answer',
    options: q.options && q.options.length > 0 ? q.options : null,
    correct_answer: Array.isArray(q.answer) ? q.answer.join(', ') : String(q.answer),
    explanation: q.explanation || null,
    diagram: buildQuestionExtras(q),
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
    diagram: buildQuestionExtras(q),
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
          diagram: q.diagram || undefined,
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

export const generateCustomWorksheet = async (
  input: GenerateCustomWorksheetInput,
  userId: string,
  supabase: any,
  aiOverride: AIProviderOverride
) => {
  if (!input.className?.trim() || !input.subjectName?.trim() || !input.topic?.trim()) {
    throw new Error('Class, subject, and topic are required');
  }
  if (!input.questionCount || !input.questionTypes?.length) {
    throw new Error('Invalid worksheet configuration');
  }

  const questionTypeCounts = distributeQuestionCounts(input.questionCount, input.questionTypes);
  const language = inferLanguage(input.subjectName, input.language);
  const promptConfig: WorksheetPromptConfig = {
    classLevel: input.className,
    subject: input.subjectName,
    topics: [input.topic],
    questionTypes: questionTypeCounts,
    difficulty: input.difficulty,
    language,
    customInstructions: input.requirement,
  };

  const provider = createAIProvider({ provider: aiOverride.provider, apiKey: aiOverride.apiKey });
  const generated = await provider.generateWorksheet(promptConfig);

  const totalMarks = generated.questions.reduce((sum, q) => sum + (q.marks || 1), 0);

  // class_id/subject_id/chapter_id are nullable -- this worksheet isn't
  // linked to the curriculum tables, so the plain-text labels are kept in
  // `settings` for display (see apps/web's fallback in useWorksheetStore).
  const { data: worksheet, error: wsError } = await supabase
    .from('worksheets')
    .insert({
      creator_id: userId,
      title: input.title || generated.title || `${input.subjectName} Worksheet`,
      description: generated.description || null,
      class_id: null,
      subject_id: null,
      chapter_id: null,
      difficulty: input.difficulty,
      total_marks: totalMarks,
      question_count: generated.questions.length,
      question_types: input.questionTypes,
      settings: {
        isCustom: true,
        board: 'General',
        className: input.className,
        subjectName: input.subjectName,
        topics: [input.topic],
        topic: input.topic,
        topicIds: [],
        requirement: input.requirement || null,
        language,
      },
    })
    .select()
    .single();

  if (wsError) throw new Error(`Failed to save worksheet: ${wsError.message}`);

  generated.questions = await attachGeneratedImages(generated.questions, worksheet.id);
  const questionsToInsert = generated.questions.map((q: AIQuestion, idx: number) => ({
    worksheet_id: worksheet.id,
    question_text: q.text,
    question_type: AI_TYPE_TO_DB_TYPE[q.type] || 'short_answer',
    options: q.options && q.options.length > 0 ? q.options : null,
    correct_answer: Array.isArray(q.answer) ? q.answer.join(', ') : String(q.answer),
    explanation: q.explanation || null,
    diagram: buildQuestionExtras(q),
    marks: q.marks || 1,
    order_index: idx + 1,
  }));

  const { data: savedQuestions, error: qError } = await supabase
    .from('worksheet_questions')
    .insert(questionsToInsert)
    .select();

  if (qError) throw new Error(`Failed to save questions: ${qError.message}`);

  const pdfQuestions = generated.questions.map((q, idx) => ({
    id: String(idx + 1),
    type: q.type,
    text: q.text,
    options: q.options,
    answer: Array.isArray(q.answer) ? q.answer.join(', ') : String(q.answer),
    marks: q.marks,
    diagram: buildQuestionExtras(q),
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
    console.error('Failed to pre-generate custom worksheet PDF:', pdfErr);
  }

  const sectionOrder = input.questionTypes;
  const sections = sectionOrder
    .map((type) => ({
      sectionTitle: sectionTitleForType(type),
      questions: savedQuestions
        .filter((q: any) => q.question_type === AI_TYPE_TO_DB_TYPE[type])
        .map((q: any) => ({
          number: q.order_index,
          question: q.question_text,
          type: q.question_type,
          options: q.options || undefined,
          answer: q.correct_answer,
          explanation: q.explanation || undefined,
          diagram: q.diagram || undefined,
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

// Re-renders and re-uploads the PDF + answer key for an EXISTING worksheet
// from its already-saved questions -- no AI call, no new content. This is a
// user-initiated retry for cases where PDF generation failed silently at
// creation time (it's normally best-effort so the worksheet itself still
// saves even if the PDF render throws), which otherwise left the worksheet
// permanently without a downloadable PDF.
export const regenerateWorksheetPdf = async (worksheetId: string, userId: string, supabase: any) => {
  const { data: worksheet, error: wsError } = await supabase
    .from('worksheets')
    .select('*, classes(name), subjects(name), worksheet_questions(*)')
    .eq('id', worksheetId)
    .eq('creator_id', userId)
    .single();

  if (wsError || !worksheet) throw new Error('Worksheet not found');
  if (!worksheet.worksheet_questions?.length) throw new Error('This worksheet has no saved questions to render');

  const orderedQuestions = [...worksheet.worksheet_questions].sort((a: any, b: any) => a.order_index - b.order_index);
  const pdfQuestions = orderedQuestions.map((q: any) => ({
    id: String(q.order_index),
    type: DB_TYPE_TO_AI_TYPE[q.question_type] || q.question_type,
    text: q.question_text,
    options: q.options,
    answer: q.correct_answer,
    marks: q.marks,
    diagram: q.diagram,
  }));

  const pdfMeta = {
    title: worksheet.title,
    class: worksheet.classes?.name,
    subject: worksheet.subjects?.name,
    language: worksheet.settings?.language,
  };

  const [worksheetPdf, answerKeyPdf] = await Promise.all([
    generateWorksheetPDF(pdfMeta, pdfQuestions as any),
    generateAnswerKeyPDF(pdfMeta, pdfQuestions as any),
  ]);
  const pdfStoragePath = await uploadPDF(userId, worksheet.id, worksheetPdf);
  const answerKeyPdfPath = await uploadPDF(userId, `${worksheet.id}-answers`, answerKeyPdf);

  await supabase
    .from('worksheets')
    .update({ pdf_storage_path: pdfStoragePath, answer_key_pdf_path: answerKeyPdfPath })
    .eq('id', worksheet.id);

  return { pdfStoragePath, answerKeyPdfPath };
};
