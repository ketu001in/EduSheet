import { CHEMISTRY_EXPERIMENTS } from '@edusheets/content';
import { generateLabReportPDF } from './pdfService';
import { uploadChemLabReportPDF } from './storageService';

// Chem Lab attempts never call an AI provider -- the experiment script
// (steps, equation, safety notes) is curated, static data from
// @edusheets/content (see that package's header comment for the safety
// rationale). This service only records the student's own predict-answer
// and typed observations, then renders a lab report PDF from the two
// combined. No requireRole gate on the routes -- open to all roles, same as
// Tech Lab.
export interface SubmitChemAttemptInput {
  experimentId: string;
  experimentTitle?: string;
  boardId?: string;
  classId?: string;
  className?: string;
  predictAnswerIndex: number;
  predictCorrect: boolean;
  observations: Record<string, string>;
  language?: string;
}

export const submitChemAttempt = async (input: SubmitChemAttemptInput, userId: string, supabase: any) => {
  const experiment = CHEMISTRY_EXPERIMENTS.find((e) => e.id === input.experimentId);
  if (!experiment) throw new Error('Unknown Chem Lab experiment');

  if (input.predictAnswerIndex == null || typeof input.predictCorrect !== 'boolean') {
    throw new Error('Invalid attempt data');
  }

  const { data: attempt, error } = await supabase
    .from('chemistry_experiment_attempts')
    .insert({
      user_id: userId,
      experiment_id: input.experimentId,
      experiment_title: input.experimentTitle || experiment.title,
      board_id: input.boardId || null,
      class_id: input.classId || null,
      predict_answer_index: input.predictAnswerIndex,
      predict_correct: input.predictCorrect,
      observations: input.observations || {},
      completed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to save Chem Lab attempt: ${error.message}`);

  let pdfStoragePath: string | null = null;
  try {
    const pdfBuffer = await generateLabReportPDF(
      { class: input.className, language: input.language },
      experiment,
      input.observations || {},
      input.predictAnswerIndex,
      input.predictCorrect
    );
    pdfStoragePath = await uploadChemLabReportPDF(userId, attempt.id, pdfBuffer);
    await supabase.from('chemistry_experiment_attempts').update({ pdf_storage_path: pdfStoragePath }).eq('id', attempt.id);
  } catch (err) {
    console.error('Failed to pre-generate Chem Lab report PDF:', err);
  }

  return { attempt: { ...attempt, pdf_storage_path: pdfStoragePath } };
};

export const regenerateChemAttemptPdf = async (attemptId: string, userId: string, supabase: any) => {
  const { data: attempt, error } = await supabase
    .from('chemistry_experiment_attempts')
    .select('*')
    .eq('id', attemptId)
    .eq('user_id', userId)
    .single();

  if (error || !attempt) throw new Error('Chem Lab attempt not found');

  const experiment = CHEMISTRY_EXPERIMENTS.find((e) => e.id === attempt.experiment_id);
  if (!experiment) throw new Error('This experiment is no longer available in Chem Lab');

  const pdfBuffer = await generateLabReportPDF(
    { class: undefined },
    experiment,
    attempt.observations || {},
    attempt.predict_answer_index,
    attempt.predict_correct
  );
  const pdfStoragePath = await uploadChemLabReportPDF(userId, attempt.id, pdfBuffer);

  await supabase.from('chemistry_experiment_attempts').update({ pdf_storage_path: pdfStoragePath }).eq('id', attempt.id);

  return { pdfStoragePath };
};
