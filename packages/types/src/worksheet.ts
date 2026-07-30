export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'mixed';

export type QuestionType =
  | 'mcq'
  | 'fill_in_blank'
  | 'true_false'
  | 'match_following'
  | 'short_answer'
  | 'long_answer'
  | 'word_problem'
  | 'diagram_based'
  | 'logical_reasoning';

export interface WorksheetSettings {
  question_count: number;
  difficulty: DifficultyLevel;
  question_types: QuestionType[];
  include_answer_key: boolean;
  include_hints: boolean;
  include_explanations: boolean;
  time_duration?: number;
  marks_distribution?: Record<string, any>;
}

export interface Worksheet {
  id: string;
  creator_id: string;
  title: string;
  description?: string;
  class_id: string;
  subject_id: string;
  chapter_id?: string;
  difficulty: DifficultyLevel;
  total_marks?: number;
  time_limit_minutes?: number;
  pdf_storage_path?: string;
  answer_key_pdf_path?: string;
  is_public: boolean;
  settings: WorksheetSettings;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface WorksheetQuestion {
  id: string;
  worksheet_id: string;
  question_text: string;
  question_type: QuestionType;
  options?: Record<string, any>;
  correct_answer?: string | any;
  explanation?: string;
  hints?: string[];
  marks?: number;
  order_index: number;
}

export interface WorksheetHistory {
  id: string;
  user_id: string;
  worksheet_id: string;
  action_type: string;
  score_achieved?: number;
  metadata?: Record<string, any>;
  created_at: Date | string;
}

export interface GenerateWorksheetRequest {
  class_id: string;
  subject_id: string;
  chapter_id?: string;
  topic_ids?: string[];
  difficulty: DifficultyLevel;
  question_count: number;
  question_types: QuestionType[];
  settings?: Partial<WorksheetSettings>;
}

export interface GenerateWorksheetResponse {
  worksheet: Worksheet;
  questions: WorksheetQuestion[];
}
