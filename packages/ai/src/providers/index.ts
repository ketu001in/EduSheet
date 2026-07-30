import { AIProvider, AIConfig } from './base';
import { GroqProvider } from './groq';
import { OpenAICompatibleProvider } from './openai-compatible';

export function createAIProvider(config: AIConfig): AIProvider {
  switch (config.provider) {
    case 'groq':
      return new GroqProvider({ ...config, model: config.model || 'llama-3.3-70b-versatile' });
    case 'openai':
      return new OpenAICompatibleProvider({ ...config, model: config.model || 'gpt-4o-mini', baseURL: 'https://api.openai.com/v1' });
    case 'gemini':
      return new OpenAICompatibleProvider({ ...config, model: config.model || 'gemini-2.0-flash', baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai' });
    case 'anthropic':
      // Note: Anthropic's native Messages API is not OpenAI-chat-completions
      // compatible at this base URL -- this path is unverified/likely to
      // fail. Kept for completeness; not exposed in the UI provider picker.
      return new OpenAICompatibleProvider({ ...config, model: config.model || 'claude-opus-5', baseURL: 'https://api.anthropic.com/v1' });
    default:
      return new GroqProvider(config);
  }
}
