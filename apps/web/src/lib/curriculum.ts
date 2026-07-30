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

export const fetchClasses = () => api.get<{ success: boolean; data: ClassLevel[] }>('/api/curriculum/classes');

export const fetchSubjects = (classId: string, boardId: string) =>
  api.get<{ success: boolean; data: Subject[] }>(`/api/curriculum/subjects?classId=${classId}&boardId=${boardId}`);

export const fetchChapters = (subjectId: string) =>
  api.get<{ success: boolean; data: Chapter[] }>(`/api/curriculum/chapters?subjectId=${subjectId}`);

export const fetchTopics = (chapterId: string) =>
  api.get<{ success: boolean; data: Topic[] }>(`/api/curriculum/topics?chapterId=${chapterId}`);
