import { createAIProvider, ProjectPromptConfig, GeneratedProject } from '@edusheets/ai';
import { generateProjectPDF } from './pdfService';
import { uploadProjectPDF } from './storageService';

export interface GenerateProjectInput {
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
  provider: 'groq' | 'openai' | 'gemini' | 'anthropic' | 'sarvam';
  apiKey: string;
}

// Ad-hoc project generation -- not tied to the curriculum tables (no board/
// class_id/subject_id/chapter_id), so it works for any board or class level,
// keyed instead on plain-text class/subject/topic plus a free-text prompt.
export interface GenerateCustomProjectInput {
  title?: string;
  className: string;
  subjectName: string;
  topic: string;
  description?: string;
  length: 'short' | 'medium' | 'long';
  language?: string;
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
    board: input.board,
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

export const generateCustomProject = async (
  input: GenerateCustomProjectInput,
  userId: string,
  supabase: any,
  aiOverride: AIProviderOverride
) => {
  if (!input.className?.trim() || !input.subjectName?.trim() || !input.topic?.trim()) {
    throw new Error('Class, subject, and topic are required');
  }

  const language = inferLanguage(input.subjectName, input.language);
  const promptConfig: ProjectPromptConfig = {
    classLevel: input.className,
    subject: input.subjectName,
    topics: [input.topic],
    length: input.length,
    language,
    customInstructions: input.description,
  };

  const provider = createAIProvider({ provider: aiOverride.provider, apiKey: aiOverride.apiKey });
  const generated: GeneratedProject = await provider.generateProject(promptConfig);

  // class_id/subject_id/chapter_id are nullable -- this project isn't linked
  // to the curriculum tables, so the plain-text labels are kept in `settings`
  // for display (see apps/web's fallback in project.ts/projects list page).
  const { data: project, error: pError } = await supabase
    .from('projects')
    .insert({
      creator_id: userId,
      title: input.title || generated.title || `${input.subjectName} Project`,
      class_id: null,
      subject_id: null,
      chapter_id: null,
      length: input.length,
      settings: {
        isCustom: true,
        className: input.className,
        subjectName: input.subjectName,
        topics: [input.topic],
        topicIds: [],
        description: input.description || null,
        language,
      },
      sections: generated.sections,
      bibliography: generated.bibliography,
    })
    .select()
    .single();

  if (pError) throw new Error(`Failed to save project: ${pError.message}`);

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
    console.error('Failed to pre-generate custom project PDF:', pdfErr);
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

// Re-renders and re-uploads a project's PDF from its already-saved sections --
// no AI call. Same rationale as worksheetService's regenerateWorksheetPdf: a
// user-initiated retry for when the best-effort PDF render failed silently
// at creation time.
export const regenerateProjectPdf = async (projectId: string, userId: string, supabase: any) => {
  const { data: project, error: pError } = await supabase
    .from('projects')
    .select('*, classes(name), subjects(name)')
    .eq('id', projectId)
    .eq('creator_id', userId)
    .single();

  if (pError || !project) throw new Error('Project not found');
  if (!project.sections?.length) throw new Error('This project has no saved sections to render');

  const pdfBuffer = await generateProjectPDF(
    {
      title: project.title,
      class: project.classes?.name,
      subject: project.subjects?.name,
      language: project.settings?.language,
    },
    project.sections,
    project.bibliography || []
  );
  const pdfStoragePath = await uploadProjectPDF(userId, project.id, pdfBuffer);

  await supabase
    .from('projects')
    .update({ pdf_storage_path: pdfStoragePath })
    .eq('id', project.id);

  return { pdfStoragePath };
};
