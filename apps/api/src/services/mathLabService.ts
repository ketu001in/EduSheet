import { MATH_EXPERIMENTS } from '@edusheets/content';
import { generateMathLabReportPDF } from './pdfService';
import { uploadMathLabReportPDF } from './storageService';

// Same model as biologyLabService.ts: the experiment script (steps, theorem
// statements, worked examples) is curated, static data from
// @edusheets/content (see mathTypes.ts's header comment for the "never
// AI-generated" rationale). This service only records the student's own
// predict-answer, typed observations, and the simulation parameters they
// ended up testing, then renders a lab report PDF from the combination. No
// requireRole gate on the routes -- open to all roles, same as every other
// lab.
export interface SubmitMathAttemptInput {
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

export const submitMathAttempt = async (input: SubmitMathAttemptInput, userId: string, supabase: any) => {
  const experiment = MATH_EXPERIMENTS.find((e) => e.id === input.experimentId);
  if (!experiment) throw new Error('Unknown Math Lab experiment');

  if (input.predictAnswerIndex == null || typeof input.predictCorrect !== 'boolean') {
    throw new Error('Invalid attempt data');
  }

  const { data: attempt, error } = await supabase
    .from('math_experiment_attempts')
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

  if (error) throw new Error(`Failed to save Math Lab attempt: ${error.message}`);

  let pdfStoragePath: string | null = null;
  try {
    const pdfBuffer = await generateMathLabReportPDF(
      { class: input.className, language: input.language },
      experiment,
      input.observations || {},
      input.predictAnswerIndex,
      input.predictCorrect,
      input.finalParams || experiment.defaultParams
    );
    pdfStoragePath = await uploadMathLabReportPDF(userId, attempt.id, pdfBuffer);
    await supabase.from('math_experiment_attempts').update({ pdf_storage_path: pdfStoragePath }).eq('id', attempt.id);
  } catch (err) {
    console.error('Failed to pre-generate Math Lab report PDF:', err);
  }

  return { attempt: { ...attempt, pdf_storage_path: pdfStoragePath } };
};

export const regenerateMathAttemptPdf = async (attemptId: string, userId: string, supabase: any) => {
  const { data: attempt, error } = await supabase
    .from('math_experiment_attempts')
    .select('*')
    .eq('id', attemptId)
    .eq('user_id', userId)
    .single();

  if (error || !attempt) throw new Error('Math Lab attempt not found');

  const experiment = MATH_EXPERIMENTS.find((e) => e.id === attempt.experiment_id);
  if (!experiment) throw new Error('This experiment is no longer available in Math Lab');

  const pdfBuffer = await generateMathLabReportPDF(
    { class: undefined },
    experiment,
    attempt.observations || {},
    attempt.predict_answer_index,
    attempt.predict_correct,
    attempt.final_params || experiment.defaultParams
  );
  const pdfStoragePath = await uploadMathLabReportPDF(userId, attempt.id, pdfBuffer);

  await supabase.from('math_experiment_attempts').update({ pdf_storage_path: pdfStoragePath }).eq('id', attempt.id);

  return { pdfStoragePath };
};
