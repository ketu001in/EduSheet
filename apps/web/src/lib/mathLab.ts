import { api } from './api';

export interface MathAttemptSummary {
  id: string;
  experiment_id: string;
  experiment_title: string;
  predict_correct: boolean | null;
  completed_at: string | null;
  created_at: string;
  classes?: { name: string } | null;
  boards?: { name: string } | null;
}

export interface MathAttemptDetail extends MathAttemptSummary {
  predict_answer_index: number | null;
  observations: Record<string, string> | null;
  final_params: Record<string, number> | null;
  pdf_storage_path: string | null;
}

export interface SubmitMathAttemptInput {
  experimentId: string;
  experimentTitle: string;
  boardId?: string;
  classId?: string;
  className?: string;
  predictAnswerIndex: number;
  predictCorrect: boolean;
  observations: Record<string, string>;
  finalParams?: Record<string, number>;
}

export const submitMathAttempt = (input: SubmitMathAttemptInput) =>
  api.post<{ success: boolean; data: { attempt: MathAttemptDetail } }>('/api/math-lab/attempts', input);

export const fetchMathAttempts = () => api.get<{ success: boolean; data: MathAttemptSummary[] }>('/api/math-lab/attempts');

export const fetchMathAttempt = (id: string) => api.get<{ success: boolean; data: MathAttemptDetail }>(`/api/math-lab/attempts/${id}`);

export const deleteMathAttempt = (id: string) => api.del<{ success: boolean }>(`/api/math-lab/attempts/${id}`);

// Same "open tab synchronously" popup-blocker workaround as lib/biologyLab.ts's
// downloadBiologyAttemptPdf.
export async function downloadMathAttemptPdf(id: string) {
  const tab = window.open('', '_blank', 'noopener,noreferrer');
  try {
    const res = await api.get<{ success: boolean; url: string }>(`/api/math-lab/attempts/${id}/pdf`);
    if (tab) tab.location.href = res.url;
    else window.open(res.url, '_blank', 'noopener,noreferrer');
  } catch (err) {
    tab?.close();
    throw err;
  }
}

export const regenerateMathAttemptPdf = (id: string) =>
  api.post<{ success: boolean; data: { pdfStoragePath: string } }>(`/api/math-lab/attempts/${id}/regenerate-pdf`);
