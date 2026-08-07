import { Groq } from 'groq-sdk';
import { AIProvider, AIConfig, WorksheetPromptConfig, GeneratedWorksheet, ProjectPromptConfig, GeneratedProject, StudyMaterialPromptConfig, GeneratedStudyMaterial, ActivitySheetPromptConfig, GeneratedActivitySheet } from './base';
import { buildSystemPrompt, buildProjectSystemPrompt, buildStudyMaterialSystemPrompt, buildActivitySheetSystemPrompt } from '../prompts/systemPrompt';
import { buildWorksheetPrompt } from '../prompts/worksheetPrompt';
import { buildProjectPrompt } from '../prompts/projectPrompt';
import { buildStudyMaterialPrompt } from '../prompts/studyMaterialPrompt';
import { buildActivitySheetPrompt } from '../prompts/activitySheetPrompt';
import { parseAIResponse, parseProjectAIResponse, parseStudyMaterialAIResponse, parseActivitySheetAIResponse } from '../utils/parser';

export class GroqProvider extends AIProvider {
  name = 'groq';
  private client: Groq;
  private model: string;

  constructor(config: AIConfig) {
    super();
    this.client = new Groq({ apiKey: config.apiKey });
    this.model = config.model || 'llama-3.3-70b-versatile';
  }

  async generateWorksheet(config: WorksheetPromptConfig): Promise<GeneratedWorksheet> {
    const systemPrompt = buildSystemPrompt(config.board);
    const userPrompt = buildWorksheetPrompt(config);

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 8500,
        response_format: { type: 'json_object' }
      });

      const choice = response.choices[0];
      const content = choice?.message?.content;
      if (!content) {
        throw new Error('No content returned from Groq API');
      }

      return parseAIResponse(content, choice.finish_reason);
    } catch (error) {
      console.error('GroqProvider Error:', error);
      throw new Error(`Failed to generate worksheet: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async generateProject(config: ProjectPromptConfig): Promise<GeneratedProject> {
    const systemPrompt = buildProjectSystemPrompt(config.board);
    const userPrompt = buildProjectPrompt(config);

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 8500,
        response_format: { type: 'json_object' }
      });

      const choice = response.choices[0];
      const content = choice?.message?.content;
      if (!content) {
        throw new Error('No content returned from Groq API');
      }

      return parseProjectAIResponse(content, choice.finish_reason);
    } catch (error) {
      console.error('GroqProvider Error:', error);
      throw new Error(`Failed to generate project: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async generateStudyMaterial(config: StudyMaterialPromptConfig): Promise<GeneratedStudyMaterial> {
    const systemPrompt = buildStudyMaterialSystemPrompt(config.board);
    const userPrompt = buildStudyMaterialPrompt(config);

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 8500,
        response_format: { type: 'json_object' }
      });

      const choice = response.choices[0];
      const content = choice?.message?.content;
      if (!content) {
        throw new Error('No content returned from Groq API');
      }

      return parseStudyMaterialAIResponse(content, choice.finish_reason);
    } catch (error) {
      console.error('GroqProvider Error:', error);
      throw new Error(`Failed to generate study material: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async generateActivitySheet(config: ActivitySheetPromptConfig): Promise<GeneratedActivitySheet> {
    const systemPrompt = buildActivitySheetSystemPrompt(config.board);
    const userPrompt = buildActivitySheetPrompt(config);

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: 'json_object' }
      });

      const choice = response.choices[0];
      const content = choice?.message?.content;
      if (!content) {
        throw new Error('No content returned from Groq API');
      }

      return parseActivitySheetAIResponse(content, choice.finish_reason);
    } catch (error) {
      console.error('GroqProvider Error:', error);
      throw new Error(`Failed to generate activity sheet: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
