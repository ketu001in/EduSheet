import { createAIProvider, StudyMaterialPromptConfig, GeneratedStudyMaterial } from '@edusheets/ai';
import { generateStudyMaterialPDF } from './pdfService';
import { uploadStudyMaterialPDF } from './storageService';

export interface GenerateStudyMaterialInput {
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

// Curriculum-linked only (no freeform "custom" variant) -- per the teacher/
// parent user's explicit choice to match the existing curriculum-linked
// worksheet/project wizards rather than the freeform pattern.
export const generateStudyMaterial = async (
  input: GenerateStudyMaterialInput,
  userId: string,
  supabase: any,
  aiOverride: AIProviderOverride
) => {
  if (!input.classId || !input.subjectId || !input.topics?.length) {
    throw new Error('Invalid study material configuration');
  }

  const language = inferLanguage(input.subjectName, input.language);
  const promptConfig: StudyMaterialPromptConfig = {
    classLevel: input.className,
    subject: input.subjectName,
    chapter: input.chapterName,
    topics: input.topics,
    language,
    board: input.board,
  };

  const provider = createAIProvider({ provider: aiOverride.provider, apiKey: aiOverride.apiKey });
  const generated: GeneratedStudyMaterial = await provider.generateStudyMaterial(promptConfig);

  const { data: material, error: mError } = await supabase
    .from('study_materials')
    .insert({
      creator_id: userId,
      title: input.title || generated.title || `${input.subjectName} Study Material`,
      class_id: input.classId,
      subject_id: input.subjectId,
      chapter_id: input.chapterId || null,
      settings: {
        topics: input.topics,
        topicIds: input.topicIds || [],
        language,
      },
      sections: generated.sections,
    })
    .select()
    .single();

  if (mError) throw new Error(`Failed to save study material: ${mError.message}`);

  let pdfStoragePath: string | null = null;
  try {
    const pdfBuffer = await generateStudyMaterialPDF(
      { title: material.title, class: input.className, subject: input.subjectName, language },
      generated.sections
    );
    pdfStoragePath = await uploadStudyMaterialPDF(userId, material.id, pdfBuffer);

    await supabase
      .from('study_materials')
      .update({ pdf_storage_path: pdfStoragePath })
      .eq('id', material.id);
  } catch (pdfErr) {
    console.error('Failed to pre-generate study material PDF:', pdfErr);
  }

  return {
    material: {
      ...material,
      pdfStoragePath,
    },
    sections: generated.sections,
  };
};

// Same rationale as regenerateProjectPdf: a user-initiated retry for when the
// best-effort PDF render failed silently at creation time.
export const regenerateStudyMaterialPdf = async (materialId: string, userId: string, supabase: any) => {
  const { data: material, error: mError } = await supabase
    .from('study_materials')
    .select('*, classes(name), subjects(name)')
    .eq('id', materialId)
    .eq('creator_id', userId)
    .single();

  if (mError || !material) throw new Error('Study material not found');
  if (!material.sections?.length) throw new Error('This study material has no saved sections to render');

  const pdfBuffer = await generateStudyMaterialPDF(
    {
      title: material.title,
      class: material.classes?.name,
      subject: material.subjects?.name,
      language: material.settings?.language,
    },
    material.sections
  );
  const pdfStoragePath = await uploadStudyMaterialPDF(userId, material.id, pdfBuffer);

  await supabase
    .from('study_materials')
    .update({ pdf_storage_path: pdfStoragePath })
    .eq('id', material.id);

  return { pdfStoragePath };
};
