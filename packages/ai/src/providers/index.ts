import { AIProvider, AIConfig } from './base';
import { GroqProvider } from './groq';
import { OpenAICompatibleProvider } from './openai-compatible';

export function createAIProvider(config: AIConfig): AIProvider {
  switch (config.provider) {
    case 'groq':
      // llama-3.3-70b-versatile was retired from Groq's production model
      // lineup (confirmed live: requests started failing with a real
      // "model_not_found" 404). openai/gpt-oss-120b is Groq's current
      // flagship production text model -- verified against Groq's docs to
      // support response_format: json_object, which every prompt in this
      // codebase relies on.
      return new GroqProvider({ ...config, model: config.model || 'openai/gpt-oss-120b' });
    case 'openai':
      return new OpenAICompatibleProvider({ ...config, model: config.model || 'gpt-4o-mini', baseURL: 'https://api.openai.com/v1' });
    case 'gemini':
      return new OpenAICompatibleProvider({ ...config, model: config.model || 'gemini-2.0-flash', baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai' });
    case 'sarvam':
      // Sarvam AI (sarvam.ai) -- Indian sovereign-AI provider, OpenAI-compatible
      // chat completions endpoint. sarvam-105b is the only chat model it
      // currently exposes; it does support response_format: json_object,
      // which every prompt in this codebase relies on.
      return new OpenAICompatibleProvider({ ...config, model: config.model || 'sarvam-105b', baseURL: 'https://api.sarvam.ai/v1' });
    case 'anthropic':
      // Note: Anthropic's native Messages API is not OpenAI-chat-completions
      // compatible at this base URL -- this path is unverified/likely to
      // fail. Kept for completeness; not exposed in the UI provider picker.
      return new OpenAICompatibleProvider({ ...config, model: config.model || 'claude-opus-5', baseURL: 'https://api.anthropic.com/v1' });
    default:
      return new GroqProvider(config);
  }
}
