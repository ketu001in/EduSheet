// Real, synthesized UI sound effects (Web Audio, no audio files to
// download) for Chem Lab's new 3D interactives -- a short hover tick, a
// confirming select chime, a bubbling/fizz cue for reactions, and a low
// buzz for hazard warnings. One lazily-created AudioContext, reused
// across the whole session (browsers require a real user gesture before
// audio can start, so it's created on first call, never at module load).
let ctx: AudioContext | null = null;
function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    ctx = new AudioCtx();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq: number, startOffset: number, duration: number, gainPeak: number, type: OscillatorType = 'sine') {
  const audio = getContext();
  if (!audio) return;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const start = audio.currentTime + startOffset;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(gainPeak, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

// A very short, quiet high tick -- for hover, fired often, must never be
// fatiguing or overlap awkwardly with itself.
export function playHoverTick() {
  tone(1400, 0, 0.05, 0.03, 'sine');
}

// A pleasant two-note rising chime -- for a confirmed selection/click.
export function playSelectChime() {
  tone(880, 0, 0.09, 0.07, 'triangle');
  tone(1320, 0.06, 0.12, 0.06, 'triangle');
}

// A low, short buzz -- for a hazard/incorrect result.
export function playWarnBuzz() {
  tone(160, 0, 0.18, 0.08, 'sawtooth');
  tone(120, 0.05, 0.18, 0.06, 'sawtooth');
}

// A bright confirming "success" arpeggio -- correct predictions, matches.
export function playSuccessChime() {
  tone(660, 0, 0.09, 0.06, 'triangle');
  tone(880, 0.08, 0.09, 0.06, 'triangle');
  tone(1320, 0.16, 0.15, 0.06, 'triangle');
}

// A short randomized "fizz" burst -- layered short noise-like blips
// (cheap approximation of a bubble/fizz using several quick high tones
// with random micro-timing) for reactions with gas bubbles.
export function playFizz() {
  const audio = getContext();
  if (!audio) return;
  for (let i = 0; i < 6; i++) {
    const freq = 2000 + Math.random() * 2000;
    tone(freq, i * 0.04 + Math.random() * 0.02, 0.04, 0.02, 'sine');
  }
}

// A single deep "clunk" -- for a solid precipitate forming / heavy object.
export function playThud() {
  tone(90, 0, 0.2, 0.09, 'sine');
}
