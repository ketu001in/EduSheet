import { api } from './api';

export interface ProjectSection {
  heading: string;
  content: string;
}

export interface ProjectSummary {
  id: string;
  title: string;
  length: string;
  created_at: string;
  classes?: { name: string } | null;
  subjects?: { name: string } | null;
  chapters?: { title: string } | null;
  settings?: { topics?: string[]; isCustom?: boolean; className?: string; subjectName?: string } | null;
}

export interface ProjectDetail extends ProjectSummary {
  sections: ProjectSection[];
  bibliography: string[];
}

export const fetchProjects = () => api.get<{ success: boolean; data: ProjectSummary[] }>('/api/projects');

export const fetchProject = (id: string) => api.get<{ success: boolean; data: ProjectDetail }>(`/api/projects/${id}`);

export const deleteProject = (id: string) => api.del<{ success: boolean }>(`/api/projects/${id}`);

// Opens the tab synchronously, in the same tick as the click, so the
// browser's popup blocker treats it as user-initiated -- see the identical
// pattern in lib/worksheet.ts's openSignedPdf.
export async function downloadProjectPdf(id: string) {
  const tab = window.open('', '_blank', 'noopener,noreferrer');
  try {
    const res = await api.get<{ success: boolean; url: string }>(`/api/projects/${id}/pdf`);
    if (tab) tab.location.href = res.url;
    else window.open(res.url, '_blank', 'noopener,noreferrer');
  } catch (err) {
    tab?.close();
    throw err;
  }
}

// Re-renders the project PDF from already-saved sections -- a user-initiated
// retry for projects whose PDF generation failed silently at creation time
// (pdf_storage_path left null). See the identical pattern in
// lib/worksheet.ts's regenerateWorksheetPdf.
export const regenerateProjectPdf = (id: string) =>
  api.post<{ success: boolean; data: { pdfStoragePath: string } }>(`/api/projects/${id}/regenerate-pdf`);
