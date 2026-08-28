import { Groq, APIError } from 'groq-sdk';
import { AIProvider, AIConfig, WorksheetPromptConfig, GeneratedWorksheet, ProjectPromptConfig, GeneratedProject, StudyMaterialPromptConfig, GeneratedStudyMaterial, ActivitySheetPromptConfig, GeneratedActivitySheet, TechProjectPromptConfig, GeneratedTechProject } from './base';
import { buildSystemPrompt, buildProjectSystemPrompt, buildStudyMaterialSystemPrompt, buildActivitySheetSystemPrompt, buildTechProjectSystemPrompt } from '../prompts/systemPrompt';
import { buildWorksheetPrompt } from '../prompts/worksheetPrompt';
import { buildProjectPrompt } from '../prompts/projectPrompt';
import { buildStudyMaterialPrompt } from '../prompts/studyMaterialPrompt';
import { buildActivitySheetPrompt } from '../prompts/activitySheetPrompt';
import { buildTechProjectPrompt } from '../prompts/techProjectPrompt';
import { parseAIResponse, parseProjectAIResponse, parseStudyMaterialAIResponse, parseActivitySheetAIResponse, parseTechProjectAIResponse } from '../utils/parser';

interface CompletionParams {
  model: string;
  messages: { role: 'system' | 'user'; content: string }[];
  temperature: number;
  max_tokens: number;
  response_format: { type: 'json_object' };
}

export class GroqProvider extends AIProvider {
  name = 'groq';
  private client: Groq;
  private model: string;

  constructor(config: AIConfig) {
    super();
    this.client = new Groq({ apiKey: config.apiKey });
    // llama-3.3-70b-versatile was retired from Groq's production lineup;
    // openai/gpt-oss-120b is the current flagship (see providers/index.ts
    // for the fuller writeup).
    this.model = config.model || 'openai/gpt-oss-120b';
  }

  // Groq's tokens-per-minute limiter reserves the FULL `max_tokens` you
  // request toward the account's per-minute cap before generation even
  // starts -- not the tokens actually used -- so a request can get a real
  // 413 "rate_limit_exceeded" purely because prompt + max_tokens together
  // exceed the cap, even when the prompt itself is small and the actual
  // completion would have fit easily. Permanently shrinking max_tokens for
  // every request would risk truncated JSON on genuinely large worksheets
  // that WOULD have fit -- so instead, only fall back to a smaller
  // max_tokens on the one specific request that actually hit the ceiling.
  private async createCompletion(params: CompletionParams, fallbackMaxTokens: number) {
    try {
      return await this.client.chat.completions.create(params);
    } catch (error) {
      const isTokenLimitError = error instanceof APIError
        && (error.status === 413 || String(error.message || '').includes('rate_limit_exceeded'));
      if (!isTokenLimitError || params.max_tokens <= fallbackMaxTokens) {
        throw error;
      }
      console.warn(`GroqProvider: request exceeded the account's tokens-per-minute limit at max_tokens=${params.max_tokens}; retrying once with max_tokens=${fallbackMaxTokens}.`);
      return await this.client.chat.completions.create({ ...params, max_tokens: fallbackMaxTokens });
    }
  }

  async generateWorksheet(config: WorksheetPromptConfig): Promise<GeneratedWorksheet> {
    const systemPrompt = buildSystemPrompt(config.board);
    const userPrompt = buildWorksheetPrompt(config);

    try {
      const response = await this.createCompletion({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 8500,
        response_format: { type: 'json_object' }
      }, 4500);

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
      const response = await this.createCompletion({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 8500,
        response_format: { type: 'json_object' }
      }, 4500);

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
      const response = await this.createCompletion({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 8500,
        response_format: { type: 'json_object' }
      }, 4500);

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
      const response = await this.createCompletion({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: 'json_object' }
      }, 2500);

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

  async generateTechProject(config: TechProjectPromptConfig): Promise<GeneratedTechProject> {
    const systemPrompt = buildTechProjectSystemPrompt(config.category, config.board);
    const userPrompt = buildTechProjectPrompt(config);

    try {
      const response = await this.createCompletion({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 8500,
        response_format: { type: 'json_object' }
      }, 4500);

      const choice = response.choices[0];
      const content = choice?.message?.content;
      if (!content) {
        throw new Error('No content returned from Groq API');
      }

      return parseTechProjectAIResponse(content, choice.finish_reason);
    } catch (error) {
      console.error('GroqProvider Error:', error);
      throw new Error(`Failed to generate tech project: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
