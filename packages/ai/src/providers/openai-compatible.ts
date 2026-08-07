import OpenAI from 'openai';
import { AIProvider, AIConfig, WorksheetPromptConfig, GeneratedWorksheet, ProjectPromptConfig, GeneratedProject, StudyMaterialPromptConfig, GeneratedStudyMaterial, ActivitySheetPromptConfig, GeneratedActivitySheet, DiagramLabelPoint } from './base';
import { buildSystemPrompt, buildProjectSystemPrompt, buildStudyMaterialSystemPrompt, buildActivitySheetSystemPrompt } from '../prompts/systemPrompt';
import { buildWorksheetPrompt } from '../prompts/worksheetPrompt';
import { buildProjectPrompt } from '../prompts/projectPrompt';
import { buildStudyMaterialPrompt } from '../prompts/studyMaterialPrompt';
import { buildActivitySheetPrompt } from '../prompts/activitySheetPrompt';
import { parseAIResponse, parseProjectAIResponse, parseStudyMaterialAIResponse, parseActivitySheetAIResponse, parseLabelPointsResponse } from '../utils/parser';

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
        throw new Error('No content returned from OpenAI Compatible API');
      }

      return parseAIResponse(content, choice.finish_reason);
    } catch (error) {
      console.error('OpenAICompatibleProvider Error:', error);
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
        throw new Error('No content returned from OpenAI Compatible API');
      }

      return parseProjectAIResponse(content, choice.finish_reason);
    } catch (error) {
      console.error('OpenAICompatibleProvider Error:', error);
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
        throw new Error('No content returned from OpenAI Compatible API');
      }

      return parseStudyMaterialAIResponse(content, choice.finish_reason);
    } catch (error) {
      console.error('OpenAICompatibleProvider Error:', error);
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
        throw new Error('No content returned from OpenAI Compatible API');
      }

      return parseActivitySheetAIResponse(content, choice.finish_reason);
    } catch (error) {
      console.error('OpenAICompatibleProvider Error:', error);
      throw new Error(`Failed to generate activity sheet: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // gpt-4o-mini (openai) and gemini-2.0-flash (gemini) -- this class's two
  // real default models -- both accept image input on the same chat-
  // completions endpoint already used for text, so no separate vision model
  // or extra config is needed. (The 'anthropic' baseURL this class is also
  // instantiated with is already flagged elsewhere as unverified/likely to
  // fail -- if so, this just returns null like any other failure, which is
  // the correct "can't verify" behavior.)
  async verifyImageLabels(imageUrl: string, labels: string[]): Promise<DiagramLabelPoint[] | null> {
    if (labels.length === 0) return null;
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a precise visual labeling assistant. You look at an image and report exactly where things are, as x/y percentage coordinates. You never guess based on general knowledge -- only on what is actually visible in the given image.',
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Look at this image. For EACH of the following parts, in this exact order, give its approximate position in the image as x/y percentages (0-100, where 0,0 is the top-left corner and 100,100 is the bottom-right corner). If a part isn't clearly visible, give your best estimate of where it would be based on the rest of the image.\n\nParts (in order): ${labels.join(', ')}\n\nRespond with ONLY this JSON shape, one entry per part in the same order: {"labelPoints": [{"x": <number>, "y": <number>}, ...]}`,
              },
              { type: 'image_url', image_url: { url: imageUrl } },
            ] as any,
          },
        ],
        temperature: 0.2,
        max_tokens: 500,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) return null;
      return parseLabelPointsResponse(content, labels);
    } catch (error) {
      console.error('OpenAICompatibleProvider vision verification failed:', error);
      return null;
    }
  }
}
