import { PHYSICS_EXPERIMENTS } from '@edusheets/content';
import { generatePhysicsLabReportPDF } from './pdfService';
import { uploadPhysicsLabReportPDF } from './storageService';

// Same model as chemistryLabService.ts: the experiment script (steps,
// formula, safety notes) is curated, static data from @edusheets/content
// (see physicsTypes.ts's header comment for the "never AI-generated"
// rationale, extended here to physics formulas instead of reaction
// chemistry). This service only records the student's own predict-answer,
// typed observations, and the simulation parameters they ended up testing,
// then renders a lab report PDF from the combination. No requireRole gate
// on the routes -- open to all roles, same as Chem Lab and Tech Lab.
export interface SubmitPhysicsAttemptInput {
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

export const submitPhysicsAttempt = async (input: SubmitPhysicsAttemptInput, userId: string, supabase: any) => {
  const experiment = PHYSICS_EXPERIMENTS.find((e) => e.id === input.experimentId);
  if (!experiment) throw new Error('Unknown Physics Lab experiment');

  if (input.predictAnswerIndex == null || typeof input.predictCorrect !== 'boolean') {
    throw new Error('Invalid attempt data');
  }

  const { data: attempt, error } = await supabase
    .from('physics_experiment_attempts')
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

  if (error) throw new Error(`Failed to save Physics Lab attempt: ${error.message}`);

  let pdfStoragePath: string | null = null;
  try {
    const pdfBuffer = await generatePhysicsLabReportPDF(
      { class: input.className, language: input.language },
      experiment,
      input.observations || {},
      input.predictAnswerIndex,
      input.predictCorrect,
      input.finalParams || experiment.defaultParams
    );
    pdfStoragePath = await uploadPhysicsLabReportPDF(userId, attempt.id, pdfBuffer);
    await supabase.from('physics_experiment_attempts').update({ pdf_storage_path: pdfStoragePath }).eq('id', attempt.id);
  } catch (err) {
    console.error('Failed to pre-generate Physics Lab report PDF:', err);
  }

  return { attempt: { ...attempt, pdf_storage_path: pdfStoragePath } };
};

export const regeneratePhysicsAttemptPdf = async (attemptId: string, userId: string, supabase: any) => {
  const { data: attempt, error } = await supabase
    .from('physics_experiment_attempts')
    .select('*')
    .eq('id', attemptId)
    .eq('user_id', userId)
    .single();

  if (error || !attempt) throw new Error('Physics Lab attempt not found');

  const experiment = PHYSICS_EXPERIMENTS.find((e) => e.id === attempt.experiment_id);
  if (!experiment) throw new Error('This experiment is no longer available in Physics Lab');

  const pdfBuffer = await generatePhysicsLabReportPDF(
    { class: undefined },
    experiment,
    attempt.observations || {},
    attempt.predict_answer_index,
    attempt.predict_correct,
    attempt.final_params || experiment.defaultParams
  );
  const pdfStoragePath = await uploadPhysicsLabReportPDF(userId, attempt.id, pdfBuffer);

  await supabase.from('physics_experiment_attempts').update({ pdf_storage_path: pdfStoragePath }).eq('id', attempt.id);

  return { pdfStoragePath };
};
