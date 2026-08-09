// Thin wrapper around the browser's built-in Web Speech API -- free, no API
// key, works offline, and needs no server round-trip. Originally scoped to
// the Periodic Table only, now reused by Physics Lab too for equipment
// narration -- any interactive lab that wants spoken explanations can use
// this directly rather than each rolling its own wrapper.
// Quality depends entirely on the voices the user's OS/browser ships with;
// this picks the most natural-sounding one available and tunes rate/pitch
// for a gentler, "read to a kid" feel, but it will never sound as good as a
// paid neural TTS service (ElevenLabs etc.) -- that would be a deliberate
// future upgrade requiring the user's own API key, matching how the rest of
// the app already handles AI provider keys, not something to silently wire
// in here.

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

let cachedVoices: SpeechSynthesisVoice[] = [];

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!isSpeechSupported()) return resolve([]);
    const existing = window.speechSynthesis.getVoices();
    if (existing.length > 0) {
      cachedVoices = existing;
      return resolve(existing);
    }
    // Chrome loads voices asynchronously -- the list is empty on first call.
    const handle = () => {
      cachedVoices = window.speechSynthesis.getVoices();
      window.speechSynthesis.removeEventListener('voiceschanged', handle);
      resolve(cachedVoices);
    };
    window.speechSynthesis.addEventListener('voiceschanged', handle);
    // Fallback in case the event never fires on this browser.
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 500);
  });
}

// Heuristic preference order: named "Natural"/"Neural"/"Premium" voices are
// the newer, more human-sounding OS voices (Windows/Edge, recent Chrome);
// otherwise fall back to any well-known pleasant English voice, then any
// English voice at all, then whatever the browser gives us by default.
const PREFERRED_NAME_HINTS = ['natural', 'neural', 'premium', 'enhanced', 'aria', 'jenny', 'samantha', 'google us english', 'google uk english female'];

async function pickVoice(): Promise<SpeechSynthesisVoice | null> {
  const voices = cachedVoices.length > 0 ? cachedVoices : await loadVoices();
  if (voices.length === 0) return null;
  const englishVoices = voices.filter((v) => v.lang?.toLowerCase().startsWith('en'));
  const pool = englishVoices.length > 0 ? englishVoices : voices;
  for (const hint of PREFERRED_NAME_HINTS) {
    const match = pool.find((v) => v.name.toLowerCase().includes(hint));
    if (match) return match;
  }
  return pool[0] || voices[0];
}

export interface SpeakOptions {
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
}

export async function speak(text: string, opts: SpeakOptions = {}): Promise<void> {
  if (!isSpeechSupported() || !text.trim()) return;
  window.speechSynthesis.cancel(); // never overlap two utterances
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = opts.rate ?? 0.92;
  utterance.pitch = opts.pitch ?? 1.05;
  const voice = await pickVoice();
  if (voice) utterance.voice = voice;
  if (opts.onStart) utterance.onstart = opts.onStart;
  if (opts.onEnd) utterance.onend = opts.onEnd;
  utterance.onerror = () => opts.onEnd?.();
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (isSpeechSupported()) window.speechSynthesis.cancel();
}
