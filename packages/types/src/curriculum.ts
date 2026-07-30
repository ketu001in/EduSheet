export interface Board {
  id: string;
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
}

export interface Class {
  id: string;
  grade_number: number;
  name: string;
}

export interface Subject {
  id: string;
  class_id: string;
  board_id: string;
  name: string;
  code: string;
  icon_url?: string;
}

export interface Chapter {
  id: string;
  subject_id: string;
  chapter_number: number;
  title: string;
  description?: string;
}

export interface Topic {
  id: string;
  chapter_id: string;
  topic_number: number;
  title: string;
  summary?: string;
}
