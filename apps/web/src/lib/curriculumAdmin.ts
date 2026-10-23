import { api } from './api';

// Admin-facing client for the real curriculum backbone (boards/classes/
// subjects/chapters/topics) that drives worksheet and project generation
// throughout the app. Read endpoints (/api/curriculum/*) are open to any
// authenticated user; every write here goes through /api/admin/curriculum/*,
// which is role-gated server-side (requireRole('admin')) same as every
// other admin route.
export interface Board {
  id: string;
  code: string;
  name: string;
  description: string | null;
  is_active: boolean;
}

export interface ClassRow {
  id: string;
  grade_number: number;
  name: string;
  board_id: string | null;
}

export interface Subject {
  id: string;
  class_id: string;
  board_id: string;
  name: string;
  code: string | null;
  icon_url: string | null;
  syllabus_source_url: string | null;
  syllabus_last_verified_at: string | null;
  syllabus_verified_by: string | null;
}

export interface Chapter {
  id: string;
  subject_id: string;
  chapter_number: number;
  title: string;
  description: string | null;
}

export interface Topic {
  id: string;
  chapter_id: string;
  topic_number: number;
  title: string;
  summary: string | null;
}

// -- Reads (shared with the rest of the app, not admin-only) ----------------
export const fetchBoards = () => api.get<{ success: boolean; data: Board[] }>('/api/curriculum/boards');
export const fetchClasses = (boardId?: string) =>
  api.get<{ success: boolean; data: ClassRow[] }>(`/api/curriculum/classes${boardId ? `?boardId=${boardId}` : ''}`);
export const fetchSubjects = (classId: string, boardId?: string) =>
  api.get<{ success: boolean; data: Subject[] }>(`/api/curriculum/subjects?classId=${classId}${boardId ? `&boardId=${boardId}` : ''}`);
export const fetchChapters = (subjectId: string) =>
  api.get<{ success: boolean; data: Chapter[] }>(`/api/curriculum/chapters?subjectId=${subjectId}`);
export const fetchTopics = (chapterId: string) =>
  api.get<{ success: boolean; data: Topic[] }>(`/api/curriculum/topics?chapterId=${chapterId}`);

// -- Writes (admin-only) -----------------------------------------------------
export const updateSubject = (id: string, changes: Partial<Pick<Subject, 'name' | 'code' | 'syllabus_source_url'>>) =>
  api.put<{ success: boolean; data: Subject }>(`/api/admin/curriculum/subjects/${id}`, changes);
export const verifySubject = (id: string) =>
  api.patch<{ success: boolean; data: Subject }>(`/api/admin/curriculum/subjects/${id}/verify`);

export const createChapter = (data: { subjectId: string; chapterNumber: number; title: string; description?: string }) =>
  api.post<{ success: boolean; data: Chapter }>('/api/admin/curriculum/chapters', {
    subject_id: data.subjectId, chapter_number: data.chapterNumber, title: data.title, description: data.description,
  });
export const updateChapter = (id: string, changes: Partial<Pick<Chapter, 'title' | 'description' | 'chapter_number'>>) =>
  api.put<{ success: boolean; data: Chapter }>(`/api/admin/curriculum/chapters/${id}`, changes);
export const deleteChapter = (id: string) => api.del<{ success: boolean }>(`/api/admin/curriculum/chapters/${id}`);

export const createTopic = (data: { chapterId: string; topicNumber: number; title: string; summary?: string }) =>
  api.post<{ success: boolean; data: Topic }>('/api/admin/curriculum/topics', {
    chapter_id: data.chapterId, topic_number: data.topicNumber, title: data.title, summary: data.summary,
  });
export const updateTopic = (id: string, changes: Partial<Pick<Topic, 'title' | 'summary' | 'topic_number'>>) =>
  api.put<{ success: boolean; data: Topic }>(`/api/admin/curriculum/topics/${id}`, changes);
export const deleteTopic = (id: string) => api.del<{ success: boolean }>(`/api/admin/curriculum/topics/${id}`);

export interface CurriculumHealth {
  totalSubjects: number;
  staleCount: number;
  neverVerifiedCount: number;
  stale: { id: string; name: string; className: string | null; boardName: string | null; syllabus_last_verified_at: string | null }[];
}
export const fetchCurriculumHealth = () => api.get<{ success: boolean; data: CurriculumHealth }>('/api/admin/curriculum/health');

// A subject counts as "stale" if it's never been verified, or hasn't been
// checked in over a year -- CBSE/ICSE typically republish syllabi annually
// around March-April, so a year is a reasonable, honest default threshold
// (not a guarantee anything actually changed, just a prompt to go check).
export const STALE_THRESHOLD_DAYS = 365;
export function isSubjectStale(subject: Pick<Subject, 'syllabus_last_verified_at'>): boolean {
  if (!subject.syllabus_last_verified_at) return true;
  const ageMs = Date.now() - new Date(subject.syllabus_last_verified_at).getTime();
  return ageMs > STALE_THRESHOLD_DAYS * 24 * 60 * 60 * 1000;
}
