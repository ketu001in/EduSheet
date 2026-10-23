// Shared metadata for the "bring your own AI key" flow, used by both the
// Profile settings page and the no-key setup prompt shown elsewhere in the app.
export interface AiProviderInfo {
  id: 'groq' | 'openai' | 'gemini' | 'sarvam';
  label: string;
  hint: string;
  keyPageUrl: string;
  steps: string[];
}

export const AI_PROVIDERS: AiProviderInfo[] = [
  {
    id: 'groq',
    label: 'Groq',
    hint: 'Free tier available, very fast (Llama 3.3 70B)',
    keyPageUrl: 'https://console.groq.com/keys',
    steps: [
      'Go to console.groq.com and sign up (free).',
      'Open "API Keys" from the left sidebar.',
      'Click "Create API Key", give it a name, and copy the key shown.',
      'Paste it below.',
    ],
  },
  {
    id: 'openai',
    label: 'OpenAI',
    hint: 'Paid, from platform.openai.com',
    keyPageUrl: 'https://platform.openai.com/api-keys',
    steps: [
      'Go to platform.openai.com and sign up or log in.',
      'Add a payment method under Billing (required before the API works).',
      'Go to API Keys and click "Create new secret key".',
      'Copy it immediately (it is only shown once) and paste it below.',
    ],
  },
  {
    id: 'gemini',
    label: 'Google Gemini',
    hint: 'Free tier available at aistudio.google.com',
    keyPageUrl: 'https://aistudio.google.com/apikey',
    steps: [
      'Go to aistudio.google.com and sign in with your Google account.',
      'Click "Get API key" in the left sidebar.',
      'Click "Create API key" (choose or create a Google Cloud project if prompted).',
      'Copy the key and paste it below.',
    ],
  },
  {
    id: 'sarvam',
    label: 'Sarvam AI',
    hint: 'Indian AI provider, free signup credits at dashboard.sarvam.ai',
    keyPageUrl: 'https://dashboard.sarvam.ai',
    steps: [
      'Go to dashboard.sarvam.ai and sign up (free signup credits included).',
      'Open "API Keys" from the dashboard.',
      'Click "Create API Key", give it a name, and copy the key shown.',
      'Paste it below.',
    ],
  },
];
