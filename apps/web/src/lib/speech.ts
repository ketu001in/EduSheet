// Thin wrapper around the browser's built-in Web Speech API -- free, no API
// key, works offline, and needs no server round-trip. Originally scoped to
// the Periodic Table only, now reused everywhere in Physics/Chem/Biology Lab
// that wants spoken explanations -- any interactive lab can use this
// directly rather than each rolling its own wrapper.
// Quality depends entirely on the voices the user's OS/browser ships with;
// this picks the most natural-sounding one available, cleans up the text so
// it doesn't trip over the app's own copy conventions, and paces delivery
// sentence-by-sentence with a touch of prosody variation so a long
// explanation doesn't read as one flat, robotic drone. It will still never
// sound as good as a paid neural TTS service (ElevenLabs etc.) -- that
// would be a deliberate future upgrade requiring the user's own API key,
// matching how the rest of the app already handles AI provider keys, not
// something to silently wire in here.

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

// Heuristic preference order, most human-sounding first. "online"/"natural"/
// "neural" catch Edge's newer cloud voices (e.g. "Microsoft Aria Online
// (Natural)"), which are dramatically more human than the offline default.
// Named voices after that are well-known pleasant ones across Windows/Mac/
// Chrome OS. Falls back to any English voice, then whatever the browser
// gives us by default.
const PREFERRED_NAME_HINTS = [
  'online (natural)', 'online', 'natural', 'neural', 'premium', 'enhanced',
  'aria', 'jenny', 'ava', 'emma', 'sara', 'nova', 'samantha', 'karen', 'moira', 'tessa', 'daniel', 'guy',
  'google us english', 'google uk english female',
];

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

// The app's written copy uses "--" as a stylistic em dash throughout (every
// experiment, hotspot, and deep-dive paragraph). Most TTS voices either read
// it aloud as "dash dash" or drop it awkwardly -- swapping in a real em dash
// gives the same voices a natural breath-pause instead, which alone makes a
// huge difference in how human the narration sounds. Also collapses stray
// whitespace left over from template-literal concatenation.
function humanizeText(text: string): string {
  return text
    .replace(/\s*--\s*/g, ' — ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Split into sentence-ish chunks (on ., !, ?, and em dashes) so the browser
// speaks them as separate utterances with a small natural gap between each,
// rather than one unbroken block -- long single utterances are exactly what
// makes web-speech voices sound flattest and most robotic.
function splitIntoChunks(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\s+—\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export interface SpeakOptions {
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
}

// Bumped every time speak()/stopSpeaking() runs, so an in-progress chain of
// chunked utterances can tell it's been superseded and stop scheduling more
// -- window.speechSynthesis.cancel() alone only kills the CURRENT utterance,
// not the rest of a chain we're queueing ourselves via onend.
let generation = 0;

export async function speak(text: string, opts: SpeakOptions = {}): Promise<void> {
  if (!isSpeechSupported() || !text.trim()) return;
  window.speechSynthesis.cancel(); // never overlap a previous narration
  const myGeneration = ++generation;

  const voice = await pickVoice();
  if (myGeneration !== generation) return; // superseded while awaiting voice list

  const chunks = splitIntoChunks(humanizeText(text));
  if (chunks.length === 0) return;

  const baseRate = opts.rate ?? 0.96;
  const basePitch = opts.pitch ?? 1.0;
  let announcedStart = false;

  const speakChunk = (i: number) => {
    if (myGeneration !== generation) return; // cancelled or replaced
    if (i >= chunks.length) {
      opts.onEnd?.();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(chunks[i]);
    // A little per-sentence jitter so a long narration doesn't sound like a
    // metronome repeating the exact same rate/pitch -- real speech varies.
    utterance.rate = baseRate + (Math.random() * 0.06 - 0.03);
    utterance.pitch = basePitch + (Math.random() * 0.06 - 0.03);
    if (voice) utterance.voice = voice;
    utterance.onstart = () => {
      if (!announcedStart) { announcedStart = true; opts.onStart?.(); }
    };
    utterance.onend = () => speakChunk(i + 1);
    utterance.onerror = () => { if (myGeneration === generation) opts.onEnd?.(); };
    window.speechSynthesis.speak(utterance);
  };
  speakChunk(0);
}

export function stopSpeaking(): void {
  generation++; // invalidates any in-flight chunk chain
  if (isSpeechSupported()) window.speechSynthesis.cancel();
}
