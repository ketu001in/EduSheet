import { api } from './api';

export interface BiologyAttemptSummary {
  id: string;
  experiment_id: string;
  experiment_title: string;
  predict_correct: boolean | null;
  completed_at: string | null;
  created_at: string;
  classes?: { name: string } | null;
  boards?: { name: string } | null;
}

export interface BiologyAttemptDetail extends BiologyAttemptSummary {
  predict_answer_index: number | null;
  observations: Record<string, string> | null;
  final_params: Record<string, number> | null;
  pdf_storage_path: string | null;
}

export interface SubmitBiologyAttemptInput {
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

export const submitBiologyAttempt = (input: SubmitBiologyAttemptInput) =>
  api.post<{ success: boolean; data: { attempt: BiologyAttemptDetail } }>('/api/biology-lab/attempts', input);

export const fetchBiologyAttempts = () => api.get<{ success: boolean; data: BiologyAttemptSummary[] }>('/api/biology-lab/attempts');

export const fetchBiologyAttempt = (id: string) => api.get<{ success: boolean; data: BiologyAttemptDetail }>(`/api/biology-lab/attempts/${id}`);

export const deleteBiologyAttempt = (id: string) => api.del<{ success: boolean }>(`/api/biology-lab/attempts/${id}`);

// Same "open tab synchronously" popup-blocker workaround as lib/physicsLab.ts's
// downloadPhysicsAttemptPdf.
export async function downloadBiologyAttemptPdf(id: string) {
  const tab = window.open('', '_blank', 'noopener,noreferrer');
  try {
    const res = await api.get<{ success: boolean; url: string }>(`/api/biology-lab/attempts/${id}/pdf`);
    if (tab) tab.location.href = res.url;
    else window.open(res.url, '_blank', 'noopener,noreferrer');
  } catch (err) {
    tab?.close();
    throw err;
  }
}

export const regenerateBiologyAttemptPdf = (id: string) =>
  api.post<{ success: boolean; data: { pdfStoragePath: string } }>(`/api/biology-lab/attempts/${id}/regenerate-pdf`);
