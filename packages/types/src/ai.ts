import { DifficultyLevel, QuestionType } from './worksheet';

export type AIProvider = 'groq' | 'gemini' | 'openai' | 'anthropic';

export interface AIModel {
  provider: AIProvider;
  modelName: string;
}

export interface AIConfig {
  provider: AIProvider;
  model: string;
  apiKey?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface GeneratedQuestion {
  question_text: string;
  question_type: QuestionType;
  options?: Record<string, any>;
  correct_answer?: string | any;
  explanation?: string;
  hints?: string[];
  marks?: number;
}

export interface GeneratedWorksheet {
  questions: GeneratedQuestion[];
  metadata?: Record<string, any>;
}

export interface WorksheetPromptConfig {
  class_name: string;
  subject: string;
  chapter?: string;
  topics?: string[];
  difficulty: DifficultyLevel;
  question_count: number;
  question_types: QuestionType[];
  language?: string;
}
