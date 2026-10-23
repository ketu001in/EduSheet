// Procedural sound effects for interactive labs (Physics Lab today, reusable
// by future labs) -- synthesized with the Web Audio API's oscillators and
// gain envelopes rather than audio files. Keeps the bundle small, needs no
// asset licensing, and every sound is honestly a short synthesized EFFECT
// (a click, a tick, a twang) rather than a fake "recording". All sound is
// muted by default until a student explicitly enables it via the lab's
// sound toggle -- never autoplays on page load.

const MUTE_KEY = 'edstudio-lab-sound-muted';
let audioCtx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioCtx) audioCtx = new AudioContextClass();
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Defaults to muted (opt-in) the first time a student visits.
export function isSoundMuted(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = window.localStorage.getItem(MUTE_KEY);
  return stored === null ? true : stored === '1';
}

export function setSoundMuted(muted: boolean): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
}

interface ToneOptions {
  type?: OscillatorType;
  peakGain?: number;
  freqSlideTo?: number;
  delaySec?: number;
}

function tone(freq: number, durationSec: number, opts: ToneOptions = {}) {
  if (isSoundMuted()) return;
  const ctx = getContext();
  if (!ctx) return;
  const { type = 'sine', peakGain = 0.15, freqSlideTo, delaySec = 0 } = opts;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  const startAt = ctx.currentTime + delaySec;
  osc.frequency.setValueAtTime(freq, startAt);
  if (freqSlideTo !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqSlideTo), startAt + durationSec);
  }
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(peakGain, startAt + Math.min(0.02, durationSec / 4));
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + durationSec);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startAt);
  osc.stop(startAt + durationSec + 0.02);
}

// A crisp UI click -- picking up/dropping equipment, pressing a button.
export function playClick(): void {
  tone(1200, 0.04, { type: 'square', peakGain: 0.08 });
}

// A clock-like tick -- one pendulum swing passing center, a stopwatch beat.
export function playTick(): void {
  tone(2000, 0.03, { type: 'square', peakGain: 0.06 });
}

// A spring's twang -- release/stretch of the spring experiment.
export function playTwang(): void {
  tone(220, 0.4, { type: 'triangle', peakGain: 0.12, freqSlideTo: 440 });
}

// A dull impact -- a ball landing, a weight dropping onto the hanger.
export function playThud(): void {
  tone(90, 0.18, { type: 'sine', peakGain: 0.2, freqSlideTo: 40 });
}

// A short buzz -- circuit complete/short, or an incorrect prediction.
export function playBuzz(): void {
  tone(150, 0.3, { type: 'sawtooth', peakGain: 0.1 });
}

// A pleasant two-note chime -- correct prediction, experiment complete.
export function playChime(): void {
  tone(660, 0.25, { type: 'sine', peakGain: 0.12 });
  tone(880, 0.3, { type: 'sine', peakGain: 0.1, delaySec: 0.08 });
}
