import { createAIProvider, ActivitySheetPromptConfig, GeneratedActivitySheet } from '@edusheets/ai';
import { generateActivitySheetPDF } from './pdfService';
import { uploadActivitySheetPDF } from './storageService';

export interface GenerateActivitySheetInput {
  title?: string;
  board?: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  chapterId?: string;
  chapterName?: string;
  topicIds?: string[];
  topics: string[];
  language?: string;
}

function inferLanguage(subjectName: string, explicit?: string): string {
  if (explicit) return explicit;
  const name = subjectName.toLowerCase();
  if (name.includes('hindi')) return 'Hindi';
  if (name.includes('sanskrit')) return 'Sanskrit';
  return 'English';
}

export interface AIProviderOverride {
  provider: 'groq' | 'openai' | 'gemini' | 'anthropic' | 'sarvam';
  apiKey: string;
}

// Curriculum-linked only, same as studyMaterialService -- matches the
// teacher/parent user's explicit choice for a fully standalone feature that
// still follows the existing curriculum-linked wizard pattern.
export const generateActivitySheet = async (
  input: GenerateActivitySheetInput,
  userId: string,
  supabase: any,
  aiOverride: AIProviderOverride
) => {
  if (!input.classId || !input.subjectId || !input.topics?.length) {
    throw new Error('Invalid activity sheet configuration');
  }

  const language = inferLanguage(input.subjectName, input.language);
  const promptConfig: ActivitySheetPromptConfig = {
    classLevel: input.className,
    subject: input.subjectName,
    chapter: input.chapterName,
    topics: input.topics,
    language,
    board: input.board,
  };

  const provider = createAIProvider({ provider: aiOverride.provider, apiKey: aiOverride.apiKey });
  const generated: GeneratedActivitySheet = await provider.generateActivitySheet(promptConfig);

  const { data: activitySheet, error: aError } = await supabase
    .from('activity_sheets')
    .insert({
      creator_id: userId,
      title: input.title || generated.title || `${input.subjectName} Activity`,
      class_id: input.classId,
      subject_id: input.subjectId,
      chapter_id: input.chapterId || null,
      settings: {
        topics: input.topics,
        topicIds: input.topicIds || [],
        language,
      },
      materials: generated.materials,
      steps: generated.steps,
      reflection_questions: generated.reflectionQuestions,
      facilitation_notes: generated.facilitationNotes,
    })
    .select()
    .single();

  if (aError) throw new Error(`Failed to save activity sheet: ${aError.message}`);

  let pdfStoragePath: string | null = null;
  try {
    const pdfBuffer = await generateActivitySheetPDF(
      { title: activitySheet.title, class: input.className, subject: input.subjectName, language },
      {
        title: activitySheet.title,
        materials: generated.materials,
        steps: generated.steps,
        reflectionQuestions: generated.reflectionQuestions,
        facilitationNotes: generated.facilitationNotes,
      }
    );
    pdfStoragePath = await uploadActivitySheetPDF(userId, activitySheet.id, pdfBuffer);

    await supabase
      .from('activity_sheets')
      .update({ pdf_storage_path: pdfStoragePath })
      .eq('id', activitySheet.id);
  } catch (pdfErr) {
    console.error('Failed to pre-generate activity sheet PDF:', pdfErr);
  }

  return {
    activitySheet: {
      ...activitySheet,
      pdfStoragePath,
    },
    materials: generated.materials,
    steps: generated.steps,
    reflectionQuestions: generated.reflectionQuestions,
    facilitationNotes: generated.facilitationNotes,
  };
};

// Same rationale as regenerateProjectPdf/regenerateStudyMaterialPdf: a
// user-initiated retry for when the best-effort PDF render failed silently
// at creation time.
export const regenerateActivitySheetPdf = async (activitySheetId: string, userId: string, supabase: any) => {
  const { data: activitySheet, error: aError } = await supabase
    .from('activity_sheets')
    .select('*, classes(name), subjects(name)')
    .eq('id', activitySheetId)
    .eq('creator_id', userId)
    .single();

  if (aError || !activitySheet) throw new Error('Activity sheet not found');
  if (!activitySheet.steps?.length) throw new Error('This activity sheet has no saved steps to render');

  const pdfBuffer = await generateActivitySheetPDF(
    {
      title: activitySheet.title,
      class: activitySheet.classes?.name,
      subject: activitySheet.subjects?.name,
      language: activitySheet.settings?.language,
    },
    {
      title: activitySheet.title,
      materials: activitySheet.materials || [],
      steps: activitySheet.steps || [],
      reflectionQuestions: activitySheet.reflection_questions || [],
      facilitationNotes: activitySheet.facilitation_notes || '',
    }
  );
  const pdfStoragePath = await uploadActivitySheetPDF(userId, activitySheet.id, pdfBuffer);

  await supabase
    .from('activity_sheets')
    .update({ pdf_storage_path: pdfStoragePath })
    .eq('id', activitySheet.id);

  return { pdfStoragePath };
};
