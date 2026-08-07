import { api } from './api';

export interface StudyMaterialSection {
  heading: string;
  content: string;
  audience: 'teacher' | 'student';
}

export interface StudyMaterialSummary {
  id: string;
  title: string;
  created_at: string;
  class_id: string | null;
  subject_id: string | null;
  chapter_id: string | null;
  classes?: { name: string } | null;
  // subjects (unlike classes) always carry an explicit board_id -- there is
  // no "shared/global" subject the way global classes work, every subject
  // row belongs to exactly one board (e.g. CBSE Class 5 has "EVS", ICSE
  // Class 5 has "Science" instead, as two entirely different subject rows).
  // This is needed to resolve the correct board for the Activity Sheet
  // prefill shortcut -- see activitySheetHref in study-material/page.tsx.
  subjects?: { name: string; board_id?: string | null } | null;
  chapters?: { title: string } | null;
  settings?: { topics?: string[]; topicIds?: string[] } | null;
}

export interface StudyMaterialDetail extends StudyMaterialSummary {
  sections: StudyMaterialSection[];
}

export const fetchStudyMaterials = () => api.get<{ success: boolean; data: StudyMaterialSummary[] }>('/api/study-materials');

export const fetchStudyMaterial = (id: string) => api.get<{ success: boolean; data: StudyMaterialDetail }>(`/api/study-materials/${id}`);

export const deleteStudyMaterial = (id: string) => api.del<{ success: boolean }>(`/api/study-materials/${id}`);

// Same "open tab synchronously" popup-blocker workaround as lib/project.ts's downloadProjectPdf.
export async function downloadStudyMaterialPdf(id: string) {
  const tab = window.open('', '_blank', 'noopener,noreferrer');
  try {
    const res = await api.get<{ success: boolean; url: string }>(`/api/study-materials/${id}/pdf`);
    if (tab) tab.location.href = res.url;
    else window.open(res.url, '_blank', 'noopener,noreferrer');
  } catch (err) {
    tab?.close();
    throw err;
  }
}

export const regenerateStudyMaterialPdf = (id: string) =>
  api.post<{ success: boolean; data: { pdfStoragePath: string } }>(`/api/study-materials/${id}/regenerate-pdf`);

// Client-side .md formatting -- no markdown parser needed since this app
// controls the exact section shape end-to-end.
export function studyMaterialToMarkdown(title: string, sections: StudyMaterialSection[]): string {
  const lines = [`# ${title}`, ''];
  for (const s of sections) {
    lines.push(`## ${s.heading} _(${s.audience === 'teacher' ? 'For Teachers/Parents' : 'For Students'})_`, '', s.content, '');
  }
  return lines.join('\n');
}

export function downloadMarkdownFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
