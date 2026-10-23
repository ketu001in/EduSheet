import { api } from './api';

export interface ActivitySheetSummary {
  id: string;
  title: string;
  created_at: string;
  classes?: { name: string } | null;
  subjects?: { name: string } | null;
  chapters?: { title: string } | null;
  settings?: { topics?: string[] } | null;
}

export interface ActivitySheetDetail extends ActivitySheetSummary {
  materials: string[];
  steps: string[];
  reflection_questions: string[];
  facilitation_notes: string;
}

export const fetchActivitySheets = () => api.get<{ success: boolean; data: ActivitySheetSummary[] }>('/api/activity-sheets');

export const fetchActivitySheet = (id: string) => api.get<{ success: boolean; data: ActivitySheetDetail }>(`/api/activity-sheets/${id}`);

export const deleteActivitySheet = (id: string) => api.del<{ success: boolean }>(`/api/activity-sheets/${id}`);

// Same "open tab synchronously" popup-blocker workaround as lib/project.ts's downloadProjectPdf.
export async function downloadActivitySheetPdf(id: string) {
  const tab = window.open('', '_blank', 'noopener,noreferrer');
  try {
    const res = await api.get<{ success: boolean; url: string }>(`/api/activity-sheets/${id}/pdf`);
    if (tab) tab.location.href = res.url;
    else window.open(res.url, '_blank', 'noopener,noreferrer');
  } catch (err) {
    tab?.close();
    throw err;
  }
}

export const regenerateActivitySheetPdf = (id: string) =>
  api.post<{ success: boolean; data: { pdfStoragePath: string } }>(`/api/activity-sheets/${id}/regenerate-pdf`);

export function activitySheetToMarkdown(
  title: string,
  materials: string[],
  steps: string[],
  reflectionQuestions: string[],
  facilitationNotes: string
): string {
  const lines = [`# ${title}`, '', '## What You\'ll Need', ''];
  materials.forEach((m) => lines.push(`- [ ] ${m}`));
  lines.push('', '## What To Do', '');
  steps.forEach((s, i) => lines.push(`${i + 1}. ${s}`));
  if (reflectionQuestions.length > 0) {
    lines.push('', '## Think About It', '');
    reflectionQuestions.forEach((q) => lines.push(`- ${q}`));
  }
  if (facilitationNotes) {
    lines.push('', '## For the Grown-Up Running This Activity', '', facilitationNotes);
  }
  return lines.join('\n');
}
