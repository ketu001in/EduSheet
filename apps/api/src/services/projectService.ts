import { createAIProvider, ProjectPromptConfig, GeneratedProject } from '@edusheets/ai';
import { generateProjectPDF } from './pdfService';
import { uploadProjectPDF } from './storageService';

export interface GenerateProjectInput {
  title?: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  chapterId?: string;
  chapterName?: string;
  topicIds?: string[];
  topics: string[];
  length: 'short' | 'medium' | 'long';
  language?: string;
}

// Same inference rule as worksheetService: language subjects (Hindi, Sanskrit)
// must produce reports written IN that language, not English reports that
// merely mention it as a subject name.
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

export const generateProject = async (
  input: GenerateProjectInput,
  userId: string,
  supabase: any,
  aiOverride: AIProviderOverride
) => {
  if (!input.classId || !input.subjectId || !input.topics?.length) {
    throw new Error('Invalid project configuration');
  }

  // 1. Build the prompt config and call the AI provider.
  const language = inferLanguage(input.subjectName, input.language);
  const promptConfig: ProjectPromptConfig = {
    classLevel: input.className,
    subject: input.subjectName,
    chapter: input.chapterName,
    topics: input.topics,
    length: input.length,
    language,
  };

  const provider = createAIProvider({ provider: aiOverride.provider, apiKey: aiOverride.apiKey });
  const generated: GeneratedProject = await provider.generateProject(promptConfig);

  // 2. Save the project record.
  const { data: project, error: pError } = await supabase
    .from('projects')
    .insert({
      creator_id: userId,
      title: input.title || generated.title || `${input.subjectName} Project`,
      class_id: input.classId,
      subject_id: input.subjectId,
      chapter_id: input.chapterId || null,
      length: input.length,
      settings: {
        topics: input.topics,
        topicIds: input.topicIds || [],
        language,
      },
      sections: generated.sections,
      bibliography: generated.bibliography,
    })
    .select()
    .single();

  if (pError) throw new Error(`Failed to save project: ${pError.message}`);

  // 3. Generate + upload the PDF (best-effort, never fails the request).
  let pdfStoragePath: string | null = null;
  try {
    const pdfBuffer = await generateProjectPDF(
      { title: project.title, class: input.className, subject: input.subjectName, language },
      generated.sections,
      generated.bibliography
    );
    pdfStoragePath = await uploadProjectPDF(userId, project.id, pdfBuffer);

    await supabase
      .from('projects')
      .update({ pdf_storage_path: pdfStoragePath })
      .eq('id', project.id);
  } catch (pdfErr) {
    console.error('Failed to pre-generate project PDF:', pdfErr);
  }

  return {
    project: {
      ...project,
      pdfStoragePath,
    },
    sections: generated.sections,
    bibliography: generated.bibliography,
  };
};
