import { BIOLOGY_EXPERIMENTS } from '@edusheets/content';
import { generateBiologyLabReportPDF } from './pdfService';
import { uploadBiologyLabReportPDF } from './storageService';

// Same model as physicsLabService.ts/chemistryLabService.ts: the experiment
// script (steps, food-test colors, genetics ratios, safety notes) is
// curated, static data from @edusheets/content (see biologyTypes.ts's
// header comment for the "never AI-generated" rationale). This service only
// records the student's own predict-answer, typed observations, and the
// simulation parameters they ended up testing, then renders a lab report
// PDF from the combination. No requireRole gate on the routes -- open to
// all roles, same as every other lab.
export interface SubmitBiologyAttemptInput {
  experimentId: string;
  experimentTitle?: string;
  boardId?: string;
  classId?: string;
  className?: string;
  predictAnswerIndex: number;
  predictCorrect: boolean;
  observations: Record<string, string>;
  finalParams?: Record<string, number>;
  language?: string;
}

export const submitBiologyAttempt = async (input: SubmitBiologyAttemptInput, userId: string, supabase: any) => {
  const experiment = BIOLOGY_EXPERIMENTS.find((e) => e.id === input.experimentId);
  if (!experiment) throw new Error('Unknown Biology Lab experiment');

  if (input.predictAnswerIndex == null || typeof input.predictCorrect !== 'boolean') {
    throw new Error('Invalid attempt data');
  }

  const { data: attempt, error } = await supabase
    .from('biology_experiment_attempts')
    .insert({
      user_id: userId,
      experiment_id: input.experimentId,
      experiment_title: input.experimentTitle || experiment.title,
      board_id: input.boardId || null,
      class_id: input.classId || null,
      predict_answer_index: input.predictAnswerIndex,
      predict_correct: input.predictCorrect,
      observations: input.observations || {},
      final_params: input.finalParams || experiment.defaultParams,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to save Biology Lab attempt: ${error.message}`);

  let pdfStoragePath: string | null = null;
  try {
    const pdfBuffer = await generateBiologyLabReportPDF(
      { class: input.className, language: input.language },
      experiment,
      input.observations || {},
      input.predictAnswerIndex,
      input.predictCorrect,
      input.finalParams || experiment.defaultParams
    );
    pdfStoragePath = await uploadBiologyLabReportPDF(userId, attempt.id, pdfBuffer);
    await supabase.from('biology_experiment_attempts').update({ pdf_storage_path: pdfStoragePath }).eq('id', attempt.id);
  } catch (err) {
    console.error('Failed to pre-generate Biology Lab report PDF:', err);
  }

  return { attempt: { ...attempt, pdf_storage_path: pdfStoragePath } };
};

export const regenerateBiologyAttemptPdf = async (attemptId: string, userId: string, supabase: any) => {
  const { data: attempt, error } = await supabase
    .from('biology_experiment_attempts')
    .select('*')
    .eq('id', attemptId)
    .eq('user_id', userId)
    .single();

  if (error || !attempt) throw new Error('Biology Lab attempt not found');

  const experiment = BIOLOGY_EXPERIMENTS.find((e) => e.id === attempt.experiment_id);
  if (!experiment) throw new Error('This experiment is no longer available in Biology Lab');

  const pdfBuffer = await generateBiologyLabReportPDF(
    { class: undefined },
    experiment,
    attempt.observations || {},
    attempt.predict_answer_index,
    attempt.predict_correct,
    attempt.final_params || experiment.defaultParams
  );
  const pdfStoragePath = await uploadBiologyLabReportPDF(userId, attempt.id, pdfBuffer);

  await supabase.from('biology_experiment_attempts').update({ pdf_storage_path: pdfStoragePath }).eq('id', attempt.id);

  return { pdfStoragePath };
};
