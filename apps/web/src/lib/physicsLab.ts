import { api } from './api';

export interface PhysicsAttemptSummary {
  id: string;
  experiment_id: string;
  experiment_title: string;
  predict_correct: boolean | null;
  completed_at: string | null;
  created_at: string;
  classes?: { name: string } | null;
  boards?: { name: string } | null;
}

export interface PhysicsAttemptDetail extends PhysicsAttemptSummary {
  predict_answer_index: number | null;
  observations: Record<string, string> | null;
  final_params: Record<string, number> | null;
  pdf_storage_path: string | null;
}

export interface SubmitPhysicsAttemptInput {
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

export const submitPhysicsAttempt = (input: SubmitPhysicsAttemptInput) =>
  api.post<{ success: boolean; data: { attempt: PhysicsAttemptDetail } }>('/api/physics-lab/attempts', input);

export const fetchPhysicsAttempts = () => api.get<{ success: boolean; data: PhysicsAttemptSummary[] }>('/api/physics-lab/attempts');

export const fetchPhysicsAttempt = (id: string) => api.get<{ success: boolean; data: PhysicsAttemptDetail }>(`/api/physics-lab/attempts/${id}`);

export const deletePhysicsAttempt = (id: string) => api.del<{ success: boolean }>(`/api/physics-lab/attempts/${id}`);

// Same "open tab synchronously" popup-blocker workaround as lib/chemLab.ts's
// downloadChemAttemptPdf.
export async function downloadPhysicsAttemptPdf(id: string) {
  const tab = window.open('', '_blank', 'noopener,noreferrer');
  try {
    const res = await api.get<{ success: boolean; url: string }>(`/api/physics-lab/attempts/${id}/pdf`);
    if (tab) tab.location.href = res.url;
    else window.open(res.url, '_blank', 'noopener,noreferrer');
  } catch (err) {
    tab?.close();
    throw err;
  }
}

export const regeneratePhysicsAttemptPdf = (id: string) =>
  api.post<{ success: boolean; data: { pdfStoragePath: string } }>(`/api/physics-lab/attempts/${id}/regenerate-pdf`);
