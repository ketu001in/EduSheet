import { api } from './api';

export interface ChemAttemptSummary {
  id: string;
  experiment_id: string;
  experiment_title: string;
  predict_correct: boolean | null;
  completed_at: string | null;
  created_at: string;
  classes?: { name: string } | null;
  boards?: { name: string } | null;
}

export interface ChemAttemptDetail extends ChemAttemptSummary {
  predict_answer_index: number | null;
  observations: Record<string, string> | null;
  pdf_storage_path: string | null;
}

export interface SubmitChemAttemptInput {
  experimentId: string;
  experimentTitle: string;
  boardId?: string;
  classId?: string;
  className?: string;
  predictAnswerIndex: number;
  predictCorrect: boolean;
  observations: Record<string, string>;
}

export const submitChemAttempt = (input: SubmitChemAttemptInput) =>
  api.post<{ success: boolean; data: { attempt: ChemAttemptDetail } }>('/api/chem-lab/attempts', input);

export const fetchChemAttempts = () => api.get<{ success: boolean; data: ChemAttemptSummary[] }>('/api/chem-lab/attempts');

export const fetchChemAttempt = (id: string) => api.get<{ success: boolean; data: ChemAttemptDetail }>(`/api/chem-lab/attempts/${id}`);

export const deleteChemAttempt = (id: string) => api.del<{ success: boolean }>(`/api/chem-lab/attempts/${id}`);

// Same "open tab synchronously" popup-blocker workaround as lib/techProject.ts's downloadTechProjectPdf.
export async function downloadChemAttemptPdf(id: string) {
  const tab = window.open('', '_blank', 'noopener,noreferrer');
  try {
    const res = await api.get<{ success: boolean; url: string }>(`/api/chem-lab/attempts/${id}/pdf`);
    if (tab) tab.location.href = res.url;
    else window.open(res.url, '_blank', 'noopener,noreferrer');
  } catch (err) {
    tab?.close();
    throw err;
  }
}

export const regenerateChemAttemptPdf = (id: string) =>
  api.post<{ success: boolean; data: { pdfStoragePath: string } }>(`/api/chem-lab/attempts/${id}/regenerate-pdf`);
