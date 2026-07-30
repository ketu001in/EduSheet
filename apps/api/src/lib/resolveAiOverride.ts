import { decryptSecret } from './encryption';

// Thrown when a user tries to generate without having configured their own
// AI provider key -- there is no app-wide shared key to fall back to. Routes
// catch this specifically to return a stable error code the frontend can
// match on and show a "set up your key" prompt instead of a generic error.
export class AiKeyRequiredError extends Error {
  constructor(message = 'Add your own AI provider API key in Profile settings before generating.') {
    super(message);
    this.name = 'AiKeyRequiredError';
  }
}

export interface ResolvedAiOverride {
  provider: 'groq' | 'openai' | 'gemini' | 'anthropic';
  apiKey: string;
}

export async function resolveAiOverride(supabase: any, userId: string): Promise<ResolvedAiOverride> {
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('ai_provider, ai_api_key_encrypted')
    .eq('user_id', userId)
    .single();

  if (!profile?.ai_provider || !profile?.ai_api_key_encrypted) {
    throw new AiKeyRequiredError();
  }

  try {
    return { provider: profile.ai_provider, apiKey: decryptSecret(profile.ai_api_key_encrypted) };
  } catch (err) {
    console.error('Failed to decrypt user AI key:', err);
    throw new AiKeyRequiredError('Your saved AI API key could not be read. Please re-enter it in Profile settings.');
  }
}
