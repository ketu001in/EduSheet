import { createAIProvider, TechProjectPromptConfig, GeneratedTechProject, TechProjectStep } from '@edusheets/ai';
import { generateTechProjectPDF } from './pdfService';
import { uploadTechProjectPDF } from './storageService';
import { generateAndStoreDiagramImage } from './diagramImageService';

export interface GenerateTechProjectInput {
  title?: string;
  boardId?: string;
  board?: string; // board name, e.g. "CBSE"
  classId: string;
  className: string;
  category: 'robotics' | 'ai' | 'coding';
  ideaPrompt: string;
  language?: string;
}

export interface AIProviderOverride {
  provider: 'groq' | 'openai' | 'gemini' | 'anthropic' | 'sarvam';
  apiKey: string;
}

// Same rationale/budget as worksheetService.ts's attachGeneratedImages -- the
// free Pollinations tier only reliably allows about one image per ~17s, so
// this runs strictly serially with a hard overall time budget rather than
// firing all of a project's step images at once (which reliably 429s the
// whole batch). Best-effort: a missing image just means that step has no
// picture, never a failed generation.
const IMAGE_GENERATION_BUDGET_MS = 30_000;

async function attachStepImages(steps: TechProjectStep[], projectId: string): Promise<TechProjectStep[]> {
  const deadline = Date.now() + IMAGE_GENERATION_BUDGET_MS;
  const results: TechProjectStep[] = [];
  for (const step of steps) {
    if (step.imagePrompt && Date.now() < deadline) {
      const imageUrl = await generateAndStoreDiagramImage(projectId, step.number, step.imagePrompt);
      results.push({ ...step, imageUrl: imageUrl || undefined });
    } else {
      results.push(step);
    }
  }
  return results;
}

// Deliberately NOT curriculum-linked (no subject/chapter/topic) -- see
// tech_projects table comment in schema.sql. Open to ALL roles -- routes.ts
// only requires auth, no requireRole gate.
export const generateTechProject = async (
  input: GenerateTechProjectInput,
  userId: string,
  supabase: any,
  aiOverride: AIProviderOverride
) => {
  if (!input.classId || !input.category || !input.ideaPrompt?.trim()) {
    throw new Error('Invalid tech project configuration');
  }

  const language = input.language || 'English';
  const promptConfig: TechProjectPromptConfig = {
    classLevel: input.className,
    board: input.board,
    category: input.category,
    ideaPrompt: input.ideaPrompt,
    language,
  };

  const provider = createAIProvider({ provider: aiOverride.provider, apiKey: aiOverride.apiKey });
  const generated: GeneratedTechProject = await provider.generateTechProject(promptConfig);

  const { data: project, error: pError } = await supabase
    .from('tech_projects')
    .insert({
      creator_id: userId,
      title: input.title || generated.title || `${input.category} Project`,
      board_id: input.boardId || null,
      class_id: input.classId,
      category: input.category,
      idea_prompt: input.ideaPrompt,
      settings: { language },
      purpose: generated.purpose,
      materials: generated.materials,
      hardware_upgrade: generated.hardwareUpgrade || null,
      steps: generated.steps,
      simulation_guide: generated.simulationGuide || null,
      code_snippet: generated.codeSnippet || null,
      code_language: generated.codeLanguage || null,
      troubleshooting: generated.troubleshooting,
      safety_notes: generated.safetyNotes,
      extensions: generated.extensions,
    })
    .select()
    .single();

  if (pError) throw new Error(`Failed to save tech project: ${pError.message}`);

  // Best-effort: attach step images, then re-save the enriched steps and
  // render the PDF. A failure anywhere here never fails the overall request
  // -- the text-only version is already saved and usable.
  let pdfStoragePath: string | null = null;
  let stepsWithImages = generated.steps;
  try {
    stepsWithImages = await attachStepImages(generated.steps, project.id);
    await supabase.from('tech_projects').update({ steps: stepsWithImages }).eq('id', project.id);

    const pdfBuffer = await generateTechProjectPDF(
      { title: project.title, class: input.className, category: input.category, language },
      { ...generated, steps: stepsWithImages }
    );
    pdfStoragePath = await uploadTechProjectPDF(userId, project.id, pdfBuffer);

    await supabase.from('tech_projects').update({ pdf_storage_path: pdfStoragePath }).eq('id', project.id);
  } catch (err) {
    console.error('Failed to attach images / pre-generate tech project PDF:', err);
  }

  return {
    project: { ...project, steps: stepsWithImages, pdfStoragePath },
    generated: { ...generated, steps: stepsWithImages },
  };
};

// Same rationale as regenerateActivitySheetPdf: a user-initiated retry for
// when the best-effort PDF render failed silently at creation time.
export const regenerateTechProjectPdf = async (projectId: string, userId: string, supabase: any) => {
  const { data: project, error: pError } = await supabase
    .from('tech_projects')
    .select('*')
    .eq('id', projectId)
    .eq('creator_id', userId)
    .single();

  if (pError || !project) throw new Error('Tech project not found');
  if (!project.steps?.length) throw new Error('This project has no saved steps to render');

  const pdfBuffer = await generateTechProjectPDF(
    { title: project.title, class: undefined, category: project.category, language: project.settings?.language },
    {
      title: project.title,
      purpose: project.purpose,
      materials: project.materials || [],
      hardwareUpgrade: project.hardware_upgrade || undefined,
      steps: project.steps || [],
      simulationGuide: project.simulation_guide || undefined,
      codeSnippet: project.code_snippet || undefined,
      codeLanguage: project.code_language || undefined,
      troubleshooting: project.troubleshooting || [],
      safetyNotes: project.safety_notes || [],
      extensions: project.extensions || [],
    }
  );
  const pdfStoragePath = await uploadTechProjectPDF(userId, project.id, pdfBuffer);

  await supabase.from('tech_projects').update({ pdf_storage_path: pdfStoragePath }).eq('id', project.id);

  return { pdfStoragePath };
};
