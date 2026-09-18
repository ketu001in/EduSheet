import { api } from './api';

export interface Board {
  id: string;
  code: string;
  name: string;
  is_active: boolean;
}

export interface ClassLevel {
  id: string;
  grade_number: number;
  name: string;
  board_id?: string | null;
}

export interface Subject {
  id: string;
  class_id: string;
  board_id: string;
  name: string;
  code: string | null;
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

export const fetchBoards = () => api.get<{ success: boolean; data: Board[] }>('/api/curriculum/boards');

// Alternative-pedagogy boards (Montessori/Reggio Emilia/Steiner-Waldorf) have
// their own age-stage classes scoped to them -- pass boardId once a board is
// selected so the picker shows those stages instead of Class 1-12/LKG/UKG,
// which don't apply to those pedagogies at all.
export const fetchClasses = (boardId?: string) =>
  api.get<{ success: boolean; data: ClassLevel[] }>(
    boardId ? `/api/curriculum/classes?boardId=${boardId}` : '/api/curriculum/classes'
  );

export const fetchSubjects = (classId: string, boardId: string) =>
  api.get<{ success: boolean; data: Subject[] }>(`/api/curriculum/subjects?classId=${classId}&boardId=${boardId}`);

export const fetchChapters = (subjectId: string) =>
  api.get<{ success: boolean; data: Chapter[] }>(`/api/curriculum/chapters?subjectId=${subjectId}`);

export const fetchTopics = (chapterId: string) =>
  api.get<{ success: boolean; data: Topic[] }>(`/api/curriculum/topics?chapterId=${chapterId}`);
