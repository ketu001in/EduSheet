import OpenAI from 'openai';
import { AIProvider, AIConfig, WorksheetPromptConfig, GeneratedWorksheet, ProjectPromptConfig, GeneratedProject } from './base';
import { buildSystemPrompt, buildProjectSystemPrompt } from '../prompts/systemPrompt';
import { buildWorksheetPrompt } from '../prompts/worksheetPrompt';
import { buildProjectPrompt } from '../prompts/projectPrompt';
import { parseAIResponse, parseProjectAIResponse } from '../utils/parser';

export interface OpenAICompatibleConfig extends AIConfig {
  baseURL: string;
}

export class OpenAICompatibleProvider extends AIProvider {
  name = 'openai-compatible';
  private client: OpenAI;
  private model: string;

  constructor(config: OpenAICompatibleConfig) {
    super();
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL
    });
    this.model = config.model || 'gpt-4o-mini';
  }

  async generateWorksheet(config: WorksheetPromptConfig): Promise<GeneratedWorksheet> {
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildWorksheetPrompt(config);

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 10000,
        response_format: { type: 'json_object' }
      });

      const choice = response.choices[0];
      const content = choice?.message?.content;
      if (!content) {
        throw new Error('No content returned from OpenAI Compatible API');
      }

      return parseAIResponse(content, choice.finish_reason);
    } catch (error) {
      console.error('OpenAICompatibleProvider Error:', error);
      throw new Error(`Failed to generate worksheet: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async generateProject(config: ProjectPromptConfig): Promise<GeneratedProject> {
    const systemPrompt = buildProjectSystemPrompt();
    const userPrompt = buildProjectPrompt(config);

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 10000,
        response_format: { type: 'json_object' }
      });

      const choice = response.choices[0];
      const content = choice?.message?.content;
      if (!content) {
        throw new Error('No content returned from OpenAI Compatible API');
      }

      return parseProjectAIResponse(content, choice.finish_reason);
    } catch (error) {
      console.error('OpenAICompatibleProvider Error:', error);
      throw new Error(`Failed to generate project: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
