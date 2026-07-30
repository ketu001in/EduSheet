export interface WorksheetPromptConfig {
  classLevel: string;
  subject: string;
  chapter?: string;
  topics: string[];
  questionTypes: Record<string, number>;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  language?: string;
}

export interface Question {
  id: string;
  type: string;
  text: string;
  options?: string[];
  answer: string | string[] | boolean;
  explanation?: string;
  marks: number;
}

export interface GeneratedWorksheet {
  title: string;
  description: string;
  questions: Question[];
  totalMarks: number;
}

export interface ProjectPromptConfig {
  classLevel: string;
  subject: string;
  chapter?: string;
  topics: string[];
  length: 'short' | 'medium' | 'long';
  language?: string;
}

export interface ProjectSection {
  heading: string;
  content: string;
}

export interface GeneratedProject {
  title: string;
  sections: ProjectSection[];
  bibliography: string[];
}

export interface AIConfig {
  provider: 'groq' | 'openai' | 'gemini' | 'anthropic';
  apiKey: string;
  model?: string;
}

export abstract class AIProvider {
  abstract name: string;

  /**
   * Generates a worksheet based on the provided configuration.
   * @param config - The configuration for the worksheet prompt.
   * @returns A promise that resolves to the generated worksheet.
   */
  abstract generateWorksheet(config: WorksheetPromptConfig): Promise<GeneratedWorksheet>;

  /**
   * Generates a text-based project/assignment report based on the provided configuration.
   * @param config - The configuration for the project prompt.
   * @returns A promise that resolves to the generated project.
   */
  abstract generateProject(config: ProjectPromptConfig): Promise<GeneratedProject>;
}
